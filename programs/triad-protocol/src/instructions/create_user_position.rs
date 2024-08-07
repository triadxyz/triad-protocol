use crate::{ state::UserPosition, Position, Ticker };

use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct CreateUserPosition<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut)]
    pub ticker: Account<'info, Ticker>,

    #[account(
        init,
        payer = signer,
        space = UserPosition::SPACE,
        seeds = [UserPosition::PREFIX_SEED, signer.key().as_ref(), ticker.key().as_ref()],
        bump
    )]
    pub user_position: Account<'info, UserPosition>,

    pub system_program: Program<'info, System>,
}

pub fn create_user_position(ctx: Context<CreateUserPosition>) -> Result<()> {
    let user_position: &mut Account<UserPosition> = &mut ctx.accounts.user_position;

    user_position.ts = Clock::get()?.unix_timestamp;
    user_position.bump = ctx.bumps.user_position;
    user_position.authority = *ctx.accounts.signer.key;
    user_position.ticker = *ctx.accounts.ticker.to_account_info().key;
    user_position.positions = [Position::default(); 3];

    Ok(())
}
