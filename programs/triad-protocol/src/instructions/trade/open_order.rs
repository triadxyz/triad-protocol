use anchor_lang::prelude::*;
use anchor_spl::token_2022::{ Token2022, transfer_checked, TransferChecked };
use anchor_spl::{ associated_token::AssociatedToken, token_interface::{ Mint, TokenAccount } };

use crate::{
    state::{
        Market,
        UserTrade,
        Order,
        OrderDirection,
        OrderStatus,
        OrderType,
        OpenOrderArgs,
        FeeVault,
    },
    errors::TriadProtocolError,
    events::OrderUpdate,
    constraints::{ is_authority_for_user_trade, is_fee_vault_for_market },
};

#[derive(Accounts)]
#[instruction(args: OpenOrderArgs)]
pub struct OpenOrder<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        mut,
        constraint = is_authority_for_user_trade(&user_trade, &signer)?
    )]
    pub user_trade: Box<Account<'info, UserTrade>>,

    #[account(mut)]
    pub market: Box<Account<'info, Market>>,

    #[account(
        mut,
        constraint = is_fee_vault_for_market(&fee_vault, &market)?
    )]
    pub fee_vault: Box<Account<'info, FeeVault>>,

    #[account(mut, constraint = mint.key() == market.mint)]
    pub mint: Box<InterfaceAccount<'info, Mint>>,

    #[account(
        mut, 
        constraint = user_from_ata.amount >= args.amount,
        associated_token::mint = mint,
        associated_token::authority = signer,
        associated_token::token_program = token_program
    )]
    pub user_from_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(
        init_if_needed,
        payer = signer,
        associated_token::mint = mint,
        associated_token::authority = market,
        associated_token::token_program = token_program
    )]
    pub market_to_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = fee_vault,
        associated_token::token_program = token_program
    )]
    pub fee_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    pub token_program: Program<'info, Token2022>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

pub fn open_order(ctx: Context<OpenOrder>, args: OpenOrderArgs) -> Result<()> {
    let market = &mut ctx.accounts.market;
    let fee_vault = &mut ctx.accounts.fee_vault;

    let price = match args.direction {
        OrderDirection::Hype => market.hype_price,
        OrderDirection::Flop => market.flop_price,
    };

    // Check if order size is less than or equal to 1 share
    let total_shares = market.calculate_shares(args.amount, args.direction);

    msg!("total_shares: {}", total_shares);
    msg!("amount: {}", args.amount);

    if total_shares == 0 {
        return Err(TriadProtocolError::InsufficientFunds.into());
    }

    let total_amount = args.amount;

    let order_index = ctx.accounts.user_trade.orders
        .iter()
        .position(
            |order| (order.status == OrderStatus::Init || order.status == OrderStatus::Closed)
        )
        .ok_or(TriadProtocolError::NoAvailableOrderSlot)?;

    let new_order = Order {
        ts: Clock::get()?.unix_timestamp,
        order_id: market.next_order_id(),
        week_id: market.current_week_id,
        market_id: market.market_id,
        status: OrderStatus::Filled,
        price,
        total_amount,
        total_shares,
        order_type: OrderType::Market,
        direction: args.direction,
        settled_pnl: 0,
        padding: [0; 32],
    };

    let user_trade = &mut ctx.accounts.user_trade;
    user_trade.orders[order_index] = new_order;
    user_trade.opened_orders = user_trade.opened_orders.checked_add(1).unwrap();
    user_trade.total_deposits = user_trade.total_deposits.checked_add(total_amount).unwrap();

    market.open_orders_count += 1;
    market.total_volume = market.total_volume.checked_add(total_amount).unwrap();

    market.update_price(price, args.direction, args.comment)?;
    match args.direction {
        OrderDirection::Hype => {
            market.hype_liquidity = market.hype_liquidity.checked_add(total_amount).unwrap();
            market.total_hype_shares = market.total_hype_shares.checked_add(total_shares).unwrap();
        }
        OrderDirection::Flop => {
            market.flop_liquidity = market.flop_liquidity.checked_add(total_amount).unwrap();
            market.total_flop_shares = market.total_flop_shares.checked_add(total_shares).unwrap();
        }
    }

    let fee_amount = (((total_amount as u64) * (market.fee_bps as u64)) / 10000) as u64;
    let net_amount = total_amount.saturating_sub(fee_amount);

    // Transfer fee to fee account
    transfer_checked(
        CpiContext::new(ctx.accounts.token_program.to_account_info(), TransferChecked {
            from: ctx.accounts.user_from_ata.to_account_info(),
            mint: ctx.accounts.mint.to_account_info(),
            to: ctx.accounts.fee_ata.to_account_info(),
            authority: ctx.accounts.signer.to_account_info(),
        }),
        fee_amount,
        ctx.accounts.mint.decimals
    )?;

    // Update FeeVault state
    fee_vault.deposited = fee_vault.deposited.checked_add(fee_amount).unwrap();
    fee_vault.net_balance = fee_vault.net_balance.checked_add(fee_amount).unwrap();

    // Calculate fee distribution (1.131% total fee)
    let project_fee = (fee_amount * 100) / 10000; // 1% of the fee 1.131%
    let nft_holders_fee = (fee_amount * 10) / 10000; // 0.1% of the fee 1.131%
    let market_fee = fee_amount - project_fee - nft_holders_fee; // Remaining 0.031% of the 1.131% fee

    fee_vault.project_available = fee_vault.project_available.checked_add(project_fee).unwrap();
    fee_vault.nft_holders_available = fee_vault.nft_holders_available
        .checked_add(nft_holders_fee)
        .unwrap();
    fee_vault.market_available = fee_vault.market_available.checked_add(market_fee).unwrap();

    // Transfer net amount to market vault
    transfer_checked(
        CpiContext::new(ctx.accounts.token_program.to_account_info(), TransferChecked {
            from: ctx.accounts.user_from_ata.to_account_info(),
            mint: ctx.accounts.mint.to_account_info(),
            to: ctx.accounts.market_to_ata.to_account_info(),
            authority: ctx.accounts.signer.to_account_info(),
        }),
        net_amount,
        ctx.accounts.mint.decimals
    )?;

    match args.direction {
        OrderDirection::Hype => {
            market.hype_liquidity = market.hype_liquidity.checked_add(net_amount).unwrap();
        }
        OrderDirection::Flop => {
            market.flop_liquidity = market.flop_liquidity.checked_add(net_amount).unwrap();
        }
    }

    market.update_ts = Clock::get()?.unix_timestamp;

    let filled_amount = 0;
    let filled_shares = 0;

    match args.direction {
        OrderDirection::Hype => {
            market.hype_liquidity = market.hype_liquidity.checked_add(filled_amount).unwrap();
            market.total_hype_shares = market.total_hype_shares.checked_add(filled_shares).unwrap();
        }
        OrderDirection::Flop => {
            market.flop_liquidity = market.flop_liquidity.checked_add(filled_amount).unwrap();
            market.total_flop_shares = market.total_flop_shares.checked_add(filled_shares).unwrap();
        }
    }

    emit!(OrderUpdate {
        timestamp: new_order.ts,
        user: *ctx.accounts.signer.key,
        market_id: new_order.market_id,
        order_id: new_order.order_id,
        direction: new_order.direction,
        order_type: new_order.order_type,
        order_status: new_order.status,
        total_shares: new_order.total_shares,
        total_amount: new_order.total_amount,
        price,
        comment: args.comment,
        refund_amount: None,
    });

    Ok(())
}
