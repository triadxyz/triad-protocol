use anchor_lang::prelude::*;
use anchor_spl::token_2022::{ Token2022, transfer_checked, TransferChecked };
use anchor_spl::{ associated_token::AssociatedToken, token_interface::{ Mint, TokenAccount } };

use crate::{
    state::{ Market, UserTrade, OrderStatus, OrderDirection, Order },
    errors::TriadProtocolError,
    events::OrderUpdate,
    constraints::is_authority_for_user_trade,
};

// Need check the current status of the Market and of the question to pay the PNL or just close position for the user liquideted

#[derive(Accounts)]
pub struct CloseOrder<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        mut,
        constraint = is_authority_for_user_trade(&user_trade, &signer)?
    )]
    pub user_trade: Box<Account<'info, UserTrade>>,

    #[account(mut)]
    pub market: Box<Account<'info, Market>>,

    #[account(mut, constraint = mint.key() == market.mint)]
    pub mint: Box<InterfaceAccount<'info, Mint>>,

    #[account(
        init_if_needed,
        payer = signer,
        associated_token::mint = mint,
        associated_token::authority = signer,
        associated_token::token_program = token_program
    )]
    pub user_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = market,
        associated_token::token_program = token_program
    )]
    pub market_vault: Box<InterfaceAccount<'info, TokenAccount>>,

    pub token_program: Program<'info, Token2022>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

pub fn close_order(ctx: Context<CloseOrder>, order_id: u64) -> Result<()> {
    let market = &mut ctx.accounts.market;
    let user_trade = &mut ctx.accounts.user_trade;

    // Find the order
    let order_index = user_trade.orders
        .iter()
        .position(|order| order.order_id == order_id)
        .ok_or(TriadProtocolError::OrderNotFound)?;

    let order = user_trade.orders[order_index];

    // Calculate the amount to refund
    // Based in the shares and the current price of the order
    let refund_amount = order.total_amount.checked_sub(order.total_amount).unwrap();

    if refund_amount > 0 {
        // Transfer net refund to user
        let signer: &[&[&[u8]]] = &[&[b"market", &market.market_id.to_le_bytes(), &[market.bump]]];

        transfer_checked(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                TransferChecked {
                    from: ctx.accounts.market_vault.to_account_info(),
                    mint: ctx.accounts.mint.to_account_info(),
                    to: ctx.accounts.user_ata.to_account_info(),
                    authority: market.to_account_info(),
                },
                signer
            ),
            refund_amount,
            ctx.accounts.mint.decimals
        )?;

        // Update market state
        match order.direction {
            OrderDirection::Hype => {
                market.hype_liquidity = market.hype_liquidity.checked_sub(refund_amount).unwrap();
                market.total_hype_shares = market.total_hype_shares
                    .checked_sub(order.total_shares)
                    .unwrap();
            }
            OrderDirection::Flop => {
                market.flop_liquidity = market.flop_liquidity.checked_sub(refund_amount).unwrap();
                market.total_flop_shares = market.total_flop_shares
                    .checked_sub(order.total_shares)
                    .unwrap();
            }
        }

        user_trade.total_withdraws = user_trade.total_withdraws.checked_add(refund_amount).unwrap();
    }

    // Update market state
    market.open_orders_count = market.open_orders_count.saturating_sub(1);

    user_trade.orders[order_index] = Order::default();

    emit!(OrderUpdate {
        user: *ctx.accounts.signer.key,
        market_id: market.market_id,
        order_id,
        direction: order.direction,
        order_type: order.order_type,
        question_id: order.question_id,
        order_status: OrderStatus::Closed,
        price: order.price,
        total_shares: order.total_shares,
        total_amount: order.total_amount,
        comment: None,
        refund_amount: Some(refund_amount),
        timestamp: Clock::get()?.unix_timestamp,
        is_question_winner: None,
        pnl: order.pnl,
    });

    Ok(())
}
