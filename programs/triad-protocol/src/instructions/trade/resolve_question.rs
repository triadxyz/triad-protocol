use anchor_lang::prelude::*;

use crate::{
    state::{ Market, ResolvedQuestion, QuestionStatus },
    errors::TriadProtocolError,
    events::QuestionUpdate,
    constraints::is_admin,
};

#[derive(Accounts)]
pub struct ResolveQuestion<'info> {
    #[account(mut, constraint = is_admin(&signer)?)]
    pub signer: Signer<'info>,

    #[account(mut)]
    pub market: Box<Account<'info, Market>>,

    pub system_program: Program<'info, System>,
}

pub fn resolve_question(ctx: Context<ResolveQuestion>) -> Result<()> {
    let market = &mut ctx.accounts.market;
    let current_timestamp = Clock::get()?.unix_timestamp;

    require!(
        current_timestamp >= market.current_question_end,
        TriadProtocolError::QuestionPeriodNotEnded
    );

    let winning_direction = market.get_winning_direction().unwrap();

    market.is_active = false;

    market.previous_resolved_question = ResolvedQuestion {
        question_id: market.current_question_id,
        question: market.current_question,
        start_time: market.current_question_start,
        end_time: market.current_question_end,
        hype_liquidity: market.hype_liquidity,
        flop_liquidity: market.flop_liquidity,
        winning_direction,
        market_price: market.market_price,
        final_hype_price: market.hype_price,
        final_flop_price: market.flop_price,
        total_hype_shares: market.total_hype_shares,
        total_flop_shares: market.total_flop_shares,
        padding: [0; 40],
    };

    emit!(QuestionUpdate {
        market_id: market.market_id,
        question_id: market.previous_resolved_question.question_id,
        question: String::from_utf8_lossy(&market.previous_resolved_question.question).to_string(),
        start_time: market.previous_resolved_question.start_time,
        end_time: market.previous_resolved_question.end_time,
        hype_liquidity: market.previous_resolved_question.hype_liquidity,
        flop_liquidity: market.previous_resolved_question.flop_liquidity,
        winning_direction: market.previous_resolved_question.winning_direction,
        market_price: market.previous_resolved_question.market_price,
        final_hype_price: market.previous_resolved_question.final_hype_price,
        final_flop_price: market.previous_resolved_question.final_flop_price,
        timestamp: current_timestamp,
        total_hype_shares: market.total_hype_shares,
        total_flop_shares: market.total_flop_shares,
        status: QuestionStatus::Resolved,
    });

    Ok(())
}
