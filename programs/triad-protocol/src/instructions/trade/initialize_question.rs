use anchor_lang::prelude::*;
use anchor_spl::token_2022::Token2022;
use anchor_spl::{ associated_token::AssociatedToken, token_interface::{ Mint, TokenAccount } };

use crate::{
    state::{ Market, InitializeQuestionArgs },
    errors::TriadProtocolError,
    events::QuestionUpdate,
    constraints::is_admin,
};

#[derive(Accounts)]
#[instruction(args: InitializeQuestionArgs)]
pub struct InitializeQuestion<'info> {
    #[account(mut, constraint = is_admin(&signer)?)]
    pub signer: Signer<'info>,

    #[account(mut)]
    pub market: Box<Account<'info, Market>>,

    #[account(mut, constraint = mint.key() == market.mint)]
    pub mint: Box<InterfaceAccount<'info, Mint>>,

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

pub fn initialize_question(
    ctx: Context<InitializeQuestion>,
    args: InitializeQuestionArgs
) -> Result<()> {
    let market = &mut ctx.accounts.market;
    let current_timestamp = Clock::get()?.unix_timestamp;

    require!(
        current_timestamp >= market.current_question_end,
        TriadProtocolError::QuestionPeriodNotEnded
    );

    require!(args.start_time > current_timestamp, TriadProtocolError::InvalidStartTime);

    require!(args.end_time > args.start_time, TriadProtocolError::InvalidEndTime);

    market.current_question_id = market.current_question_id.checked_add(1).unwrap();
    market.current_question_start = args.start_time;
    market.current_question_end = args.end_time;
    market.current_question = args.question;
    market.is_active = true;

    market.hype_price = 500_000; // Reset to 0.5 TRD
    market.flop_price = 500_000; // Reset to 0.5 TRD
    market.market_price = 500_000;
    market.hype_liquidity = 0;
    market.flop_liquidity = 0;
    market.total_hype_shares = 0;
    market.total_flop_shares = 0;

    emit!(QuestionUpdate {
        market_id: market.market_id,
        question_id: market.current_question_id,
        question: String::from_utf8_lossy(&market.current_question).to_string(),
        start_time: market.current_question_start,
        end_time: market.current_question_end,
        hype_liquidity: market.hype_liquidity,
        flop_liquidity: market.flop_liquidity,
        winning_direction: crate::state::WinningDirection::None,
        market_price: market.market_price,
        final_hype_price: market.hype_price,
        final_flop_price: market.flop_price,
        timestamp: current_timestamp,
        total_hype_shares: market.total_hype_shares,
        total_flop_shares: market.total_flop_shares,
        status: crate::state::QuestionStatus::Unresolved,
    });

    Ok(())
}
