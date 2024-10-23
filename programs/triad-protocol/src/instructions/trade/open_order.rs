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

    #[account(mut)]
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
    let user_trade = &mut ctx.accounts.user_trade;

    let ts = Clock::get()?.unix_timestamp;

    require!(market.is_active, TriadProtocolError::MarketInactive);

    let (current_price, current_liquidity) = match args.direction {
        OrderDirection::Hype => (market.hype_price, market.hype_liquidity),
        OrderDirection::Flop => (market.flop_price, market.flop_liquidity),
    };

    require!(current_price > 0, TriadProtocolError::InvalidPrice);

    let fee_amount = (((args.amount as u64) * (market.fee_bps as u64)) / 100000) as u64;
    let net_amount = args.amount.saturating_sub(fee_amount);

    require!(net_amount > current_price, TriadProtocolError::InsufficientFunds);

    let price_impact = (((net_amount as f64) / (current_liquidity as f64)) *
        (current_price as f64) *
        0.1) as u64;

    let future_price = match args.direction {
        OrderDirection::Hype => {
            let price = current_price.checked_add(price_impact).unwrap();
            price.clamp(1, 999_999)
        }
        OrderDirection::Flop => {
            let price = current_price.checked_add(price_impact).unwrap();
            price.clamp(1, 999_999)
        }
    };

    let price_diff = if future_price > current_price {
        future_price - current_price
    } else {
        current_price - future_price
    };

    let price_adjustment = price_diff / 100;

    let new_price = current_price.checked_add(price_adjustment).unwrap();

    let total_shares = ((net_amount * 1_000_000) / new_price) as u64;

    if total_shares.eq(&0) {
        return Err(TriadProtocolError::InsufficientFunds.into());
    }

    let order_index = user_trade.orders
        .iter()
        .position(|order| order.status != OrderStatus::Open)
        .ok_or(TriadProtocolError::NoAvailableOrderSlot)?;

    user_trade.orders[order_index] = Order {
        ts,
        order_id: market.next_order_id(),
        question_id: market.current_question_id,
        market_id: market.market_id,
        status: OrderStatus::Open,
        price: new_price,
        total_amount: net_amount,
        total_shares,
        order_type: OrderType::Market,
        direction: args.direction,
        padding: [0; 32],
    };

    user_trade.opened_orders = user_trade.opened_orders.checked_add(1).unwrap();
    user_trade.total_deposits = user_trade.total_deposits.checked_add(net_amount).unwrap();

    market.open_orders_count = market.open_orders_count.checked_add(1).unwrap();
    market.total_volume = market.total_volume.checked_add(net_amount).unwrap();
    market.update_ts = ts;

    // Update market shares
    match args.direction {
        OrderDirection::Hype => {
            market.total_hype_shares = market.total_hype_shares.checked_add(total_shares).unwrap();
        }
        OrderDirection::Flop => {
            market.total_flop_shares = market.total_flop_shares.checked_add(total_shares).unwrap();
        }
    }

    market.update_price(net_amount, new_price, args.direction, args.comment, true)?;

    fee_vault.deposited = fee_vault.deposited.checked_add(fee_amount).unwrap();
    fee_vault.net_balance = fee_vault.net_balance.checked_add(fee_amount).unwrap();

    // Calculate fee distribution
    let project_fee = (fee_amount * 31) / 10000; // 0.031%
    let nft_holders_fee = (fee_amount * 100) / 10000; // 0.1%
    let market_fee = fee_amount - project_fee - nft_holders_fee; // Remaining 0.131% fee

    fee_vault.project_available = fee_vault.project_available.checked_add(project_fee).unwrap();
    fee_vault.nft_holders_available = fee_vault.nft_holders_available
        .checked_add(nft_holders_fee)
        .unwrap();
    fee_vault.market_available = fee_vault.market_available.checked_add(market_fee).unwrap();

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

    let current_order = user_trade.orders[order_index];

    emit!(OrderUpdate {
        timestamp: current_order.ts,
        user: user_trade.authority,
        question_id: current_order.question_id,
        market_id: current_order.market_id,
        order_id: current_order.order_id,
        direction: current_order.direction,
        order_type: current_order.order_type,
        order_status: current_order.status,
        total_shares: current_order.total_shares,
        total_amount: current_order.total_amount,
        pnl: 0,
        price: current_order.price,
        comment: args.comment,
        refund_amount: None,
        is_question_winner: None,
    });

    Ok(())
}
