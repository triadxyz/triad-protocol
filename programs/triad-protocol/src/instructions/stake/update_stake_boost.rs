use anchor_lang::prelude::*;

use crate::{ constraints::is_admin, state::StakeV2 };

#[derive(Accounts)]
pub struct UpdateStakeBoost<'info> {
    #[account(mut, constraint = is_admin(&signer)?)]
    pub signer: Signer<'info>,

    #[account(mut)]
    pub stake: Box<Account<'info, StakeV2>>,

    pub system_program: Program<'info, System>,
}

pub fn update_stake_boost(ctx: Context<UpdateStakeBoost>) -> Result<()> {
    let stake = &mut ctx.accounts.stake;

    stake.boost = true;

    Ok(())
}
