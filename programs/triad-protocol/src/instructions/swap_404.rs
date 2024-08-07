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

    user.swaps_made += 1;

    Ok(())
}
