use crate::{
    constants::ADMIN,
    constraints::is_admin,
    errors::TriadProtocolError,
    state::UpdateStakeVaultStatusArgs,
    StakeVault,
};
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(args: UpdateStakeVaultStatusArgs)]
pub struct UpdateStakeVaultStatus<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut, constraint = is_admin(&signer)?)]
    pub stake_vault: Box<Account<'info, StakeVault>>,

    pub system_program: Program<'info, System>,
}

pub fn update_stake_vault_status(
    ctx: Context<UpdateStakeVaultStatus>,
    args: UpdateStakeVaultStatusArgs
) -> Result<()> {
    if ctx.accounts.signer.key.to_string() != ADMIN {
        return Err(TriadProtocolError::Unauthorized.into());
    }

    let stake_vault = &mut ctx.accounts.stake_vault;

    stake_vault.is_locked = args.is_locked;
    stake_vault.init_ts = args.init_ts;

    Ok(())
}
