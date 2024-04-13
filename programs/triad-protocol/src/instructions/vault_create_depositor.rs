use anchor_lang::prelude::*;

use crate::{state::Vault, VaultDepositor};

#[derive(Accounts)]
pub struct CreateVaultDepositor<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    pub vault: Account<'info, Vault>,

    #[account(init, payer = signer, space = Vault::SPACE_VAULT_DEPOSITOR, seeds = [Vault::PREFIX_SEED_VAULT_DEPOSITOR.as_ref(), vault.key().as_ref(), signer.key().as_ref()], bump)]
    pub vault_depositor: Account<'info, VaultDepositor>,

    pub system_program: Program<'info, System>,
}

pub fn create_vault_depositor(ctx: Context<CreateVaultDepositor>) -> Result<()> {
    let vault_depositor = &mut ctx.accounts.vault_depositor;

    vault_depositor.bump = *ctx.bumps.get("vault_depositor").unwrap();
    vault_depositor.authority = ctx.accounts.signer.key();
    vault_depositor.vault = ctx.accounts.vault.key();
    vault_depositor.total_deposits = 0;
    vault_depositor.total_withdraws = 0;
    vault_depositor.net_deposits = 0;
    vault_depositor.lp_shares = 0;

    Ok(())
}
