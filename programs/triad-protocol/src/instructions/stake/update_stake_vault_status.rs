use crate::{ constraints::is_admin, StakeVault };
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(is_locked: bool)]
pub struct UpdateStakeVaultStatus<'info> {
    #[account(mut, constraint = is_admin(&signer)?)]
    pub signer: Signer<'info>,

    #[account(mut, constraint = is_admin(&signer)?)]
    pub stake_vault: Box<Account<'info, StakeVault>>,

    pub system_program: Program<'info, System>,
}

pub fn update_stake_vault_status(
    ctx: Context<UpdateStakeVaultStatus>,
    is_locked: bool
) -> Result<()> {
    let stake_vault = &mut ctx.accounts.stake_vault;

    stake_vault.is_locked = is_locked;

    Ok(())
}
