use crate::{ errors::TriadProtocolError, User };

use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct Swap404<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut, seeds = [User::PREFIX_SEED, signer.key().as_ref()], bump)]
    pub user: Account<'info, User>,

    pub system_program: Program<'info, System>,
}

pub fn swap_404(ctx: Context<Swap404>) -> Result<()> {
    let user: &mut Account<User> = &mut ctx.accounts.user;

    if user.swaps == 0 {
        return Err(TriadProtocolError::SwapsReachedLimit.into());
    }

    let ts = Clock::get()?.unix_timestamp;
    let is_new_day = ts - user.first_swap >= 86400;

    let mut reached_limit = user.swaps_made >= user.swaps;

    if is_new_day {
        user.swaps_made = 0;
        user.first_swap = ts;

        reached_limit = false;
    }

    if reached_limit {
        return Err(TriadProtocolError::SwapsReachedLimit.into());
    }

    user.swaps_made += 1;

    Ok(())
}
