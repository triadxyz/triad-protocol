use anchor_lang::prelude::*;
use anchor_spl::token_2022::{ Token2022, transfer_checked, TransferChecked };
use anchor_spl::token_interface::{ Mint, TokenAccount };

use crate::{
    state::{ Market, UserTrade, OrderStatus, OrderDirection, FeeVault },
    errors::TriadProtocolError,
    events::OrderUpdate,
};

#[derive(Accounts)]
pub struct CloseOrder<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        mut,
        seeds = [UserTrade::PREFIX_SEED, signer.key().as_ref()],
        bump = user_trade.bump,
    )]
    pub user_trade: Box<Account<'info, UserTrade>>,

    #[account(mut)]
    pub market: Box<Account<'info, Market>>,

    #[account(mut, constraint = mint.key() == market.mint)]
    pub mint: Box<InterfaceAccount<'info, Mint>>,

    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = signer
    )]
    pub user_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = market
    )]
    pub market_vault: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(
        mut,
        seeds = [FeeVault::PREFIX_SEED, market.key().as_ref()],
        bump = fee_vault.bump,
    )]
    pub fee_vault: Box<Account<'info, FeeVault>>,

    pub token_program: Program<'info, Token2022>,
    pub system_program: Program<'info, System>,
}

pub fn close_order(ctx: Context<CloseOrder>, order_id: u64) -> Result<()> {
    let market = &mut ctx.accounts.market;
    let user_trade = &mut ctx.accounts.user_trade;
    let fee_vault = &mut ctx.accounts.fee_vault;

    // Find the order
    let order_index = user_trade.orders
        .iter()
        .position(|order| order.order_id == order_id && order.status == OrderStatus::Open)
        .ok_or(TriadProtocolError::OrderNotFound)?;

    let order = &mut user_trade.orders[order_index];

    // Extract necessary information from the order
    let total_amount = order.total_amount;
    let filled_amount = order.filled_amount;
    let direction = order.direction;
    let order_type = order.order_type;
    let price = order.price;
    let total_shares = order.total_shares;
    let filled_shares = order.filled_shares;

    // Calculate the amount to refund
    let refund_amount = total_amount.saturating_sub(filled_amount);

    if refund_amount > 0 {
        // Calculate refund fee (3% of the refund amount)
        let refund_fee = (((refund_amount as u128) * (market.fee_bps as u128)) / 10000) as u64;
        let net_refund = refund_amount.saturating_sub(refund_fee);

        // Transfer net refund to user
        transfer_checked(
            CpiContext::new(ctx.accounts.token_program.to_account_info(), TransferChecked {
                from: ctx.accounts.market_vault.to_account_info(),
                mint: ctx.accounts.mint.to_account_info(),
                to: ctx.accounts.user_ata.to_account_info(),
                authority: market.to_account_info(),
            }),
            net_refund,
            ctx.accounts.mint.decimals
        )?;

        // Update FeeVault state
        fee_vault.deposited = fee_vault.deposited.checked_add(refund_fee as u128).unwrap();
        fee_vault.net_balance = fee_vault.net_balance.checked_add(refund_fee).unwrap();

        // Calculate fee distribution (3% total fee)
        let project_fee = (refund_fee * 2869) / 3000; // 2.869% of the 3% fee
        let nft_holders_fee = (refund_fee * 100) / 3000; // 0.1% of the 3% fee
        let market_fee = refund_fee - project_fee - nft_holders_fee; // Remaining 0.031% of the 3% fee

        fee_vault.project_available = fee_vault.project_available.checked_add(project_fee).unwrap();
        fee_vault.nft_holders_available = fee_vault.nft_holders_available
            .checked_add(nft_holders_fee)
            .unwrap();
        fee_vault.market_available = fee_vault.market_available.checked_add(market_fee).unwrap();

        // Update market state
        match direction {
            OrderDirection::Hype => {
                market.hype_liquidity = market.hype_liquidity.saturating_sub(refund_amount);
                market.total_hype_shares = market.total_hype_shares.saturating_sub(
                    total_shares.saturating_sub(filled_shares)
                );
            }
            OrderDirection::Flop => {
                market.flop_liquidity = market.flop_liquidity.saturating_sub(refund_amount);
                market.total_flop_shares = market.total_flop_shares.saturating_sub(
                    total_shares.saturating_sub(filled_shares)
                );
            }
        }
    }

    // Update market state
    market.open_orders_count = market.open_orders_count.saturating_sub(1);

    // Update user trade state
    order.status = OrderStatus::Closed;
    user_trade.open_orders = user_trade.open_orders.saturating_sub(1);
    if user_trade.open_orders == 0 {
        user_trade.has_open_order = false;
    }

    // Update user's position
    let position_change = total_shares.saturating_sub(filled_shares) as i64;
    user_trade.position = match direction {
        OrderDirection::Hype => user_trade.position.saturating_sub(position_change),
        OrderDirection::Flop => user_trade.position.saturating_add(position_change),
    };

    emit!(OrderUpdate {
        user: *ctx.accounts.signer.key,
        market_id: market.market_id,
        order_id,
        direction,
        order_type,
        order_status: OrderStatus::Closed,
        price,
        total_shares,
        filled_shares,
        total_amount,
        filled_amount,
        comment: None,
        refund_amount: Some(refund_amount),
        timestamp: Clock::get()?.unix_timestamp,
    });

    Ok(())
}
