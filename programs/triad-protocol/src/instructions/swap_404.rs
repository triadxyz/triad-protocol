use crate::{ errors::TriadProtocolError, User };

use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct Swap404<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut)]
    pub user: Account<'info, User>,

    pub system_program: Program<'info, System>,
}

pub fn swap_404(ctx: Context<Swap404>) -> Result<()> {
    let user: &mut Account<User> = &mut ctx.accounts.user;

    let ts = Clock::get()?.unix_timestamp;
    let is_24h = ts - user.first_swap < 24 * 60 * 60;

    if user.first_swap == 0 {
        user.first_swap = ts;
    }

    let reached_limit = user.swaps_made >= user.swaps;

    if reached_limit && is_24h {
        user.swaps_made = 0;
        user.first_swap = ts;
    }

    if reached_limit && !is_24h {
        return Err(TriadProtocolError::SwapsReachedLimit.into());
    }

    user.swaps_made += 1;

    Ok(())
}
