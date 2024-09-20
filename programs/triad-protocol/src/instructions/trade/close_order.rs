use anchor_lang::prelude::*;
use anchor_spl::token_2022::{ Token2022, transfer_checked, TransferChecked };
use anchor_spl::token_interface::{ Mint, TokenAccount };

use crate::{
    state::{ Market, UserTrade, OrderStatus, OrderDirection },
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

    pub token_program: Program<'info, Token2022>,
    pub system_program: Program<'info, System>,
}

pub fn close_order(ctx: Context<CloseOrder>, order_id: u64) -> Result<()> {
    let market = &mut ctx.accounts.market;

    // Find the order
    let order_index = ctx.accounts.user_trade.orders
        .iter()
        .position(|order| order.order_id == order_id && order.status == OrderStatus::Open)
        .ok_or(TriadProtocolError::OrderNotFound)?;

    // Extract necessary information from the order
    let (total_amount, filled_amount, direction, order_type, price, total_shares, filled_shares) = {
        let order = &ctx.accounts.user_trade.orders[order_index];
        (
            order.total_amount,
            order.filled_amount,
            order.direction,
            order.order_type,
            order.price,
            order.total_shares,
            order.filled_shares,
        )
    };

    // Calculate the amount to refund
    let refund_amount = total_amount.saturating_sub(filled_amount);

    // Update market state
    // Update market state
    market.open_orders_count = market.open_orders_count.saturating_sub(1);
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

    if refund_amount > 0 {
        transfer_checked(
            CpiContext::new(ctx.accounts.token_program.to_account_info(), TransferChecked {
                from: ctx.accounts.market_vault.to_account_info(),
                mint: ctx.accounts.mint.to_account_info(),
                to: ctx.accounts.user_ata.to_account_info(),
                authority: market.to_account_info(),
            }),
            refund_amount,
            ctx.accounts.mint.decimals
        )?;
    }

    let user_trade = &mut ctx.accounts.user_trade;
    user_trade.orders[order_index].status = OrderStatus::Closed;
    user_trade.open_orders = user_trade.open_orders.saturating_sub(1);
    if user_trade.open_orders == 0 {
        user_trade.has_open_order = false;
    }

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
