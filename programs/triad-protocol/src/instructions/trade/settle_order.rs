use anchor_lang::prelude::*;
use anchor_spl::token_2022::{ Token2022, transfer_checked, TransferChecked };
use anchor_spl::{ associated_token::AssociatedToken, token_interface::{ Mint, TokenAccount } };

use crate::{
    state::{ Market, UserTrade, OrderStatus, OrderDirection, WinningDirection },
    errors::TriadProtocolError,
    events::OrderUpdate,
    constraints::is_authority_for_user_trade,
};

#[derive(Accounts)]
pub struct SettleOrder<'info> {
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

pub fn settle_order(ctx: Context<SettleOrder>, order_id: u64) -> Result<()> {
    let market = &mut ctx.accounts.market;
    let user_trade = &mut ctx.accounts.user_trade;

    require!(!market.is_active, TriadProtocolError::MarketStillActive);

    let order_index = user_trade.orders
        .iter()
        .position(|order| order.order_id == order_id && order.status == OrderStatus::Open)
        .ok_or(TriadProtocolError::OrderNotFound)?;

    let order = user_trade.orders[order_index];

    require!(market.current_question_id > order.question_id, TriadProtocolError::MarketStillActive);

    let winning_direction = market.previous_resolved_question.winning_direction;

    let (payout, is_winner) = match (order.direction, winning_direction) {
        | (OrderDirection::Hype, WinningDirection::Hype)
        | (OrderDirection::Flop, WinningDirection::Flop) => {
            let winning_payout = order.total_shares;
            (winning_payout, true)
        }
        (_, WinningDirection::Draw) => { (order.total_amount, false) }
        _ => { (0, false) }
    };

    if payout > 0 {
        // Transfer the payout to the user
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
            payout,
            ctx.accounts.mint.decimals
        )?;

        // Update user's total withdrawals
        user_trade.total_withdraws = user_trade.total_withdraws.checked_add(payout).unwrap();
    }

    // Calculate PNL
    let pnl = (payout as i64) - (order.total_amount as i64);

    // Close the order
    user_trade.orders[order_index].status = OrderStatus::Closed;

    user_trade.opened_orders = user_trade.opened_orders.saturating_sub(1);

    // Update market state
    market.open_orders_count = market.open_orders_count.saturating_sub(1);

    // Emit OrderUpdate event
    emit!(OrderUpdate {
        user: *ctx.accounts.signer.key,
        market_id: market.market_id,
        order_id: order.order_id,
        direction: order.direction,
        order_type: order.order_type,
        question_id: order.question_id,
        order_status: OrderStatus::Closed,
        price: order.price,
        total_shares: order.total_shares,
        total_amount: order.total_amount,
        comment: None,
        refund_amount: Some(payout),
        timestamp: Clock::get()?.unix_timestamp,
        is_question_winner: Some(is_winner),
        pnl,
    });

    Ok(())
}
