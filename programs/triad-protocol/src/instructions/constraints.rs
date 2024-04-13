use anchor_lang::prelude::*;

use crate::VaultDepositor;

pub fn is_authority_for_vault_depositor(
    depositor: &Account<VaultDepositor>,
    signer: &Signer,
) -> anchor_lang::Result<bool> {
    Ok(depositor.authority.eq(signer.key))
}

pub fn is_depositor_for_vault(
    depositor: &Account<VaultDepositor>,
    vault: &Pubkey,
) -> anchor_lang::Result<bool> {
    Ok(depositor.vault.eq(vault))
}

pub fn is_token_mint_for_vault(
    vault_token_mint: &Pubkey,
    token_mint: &Pubkey,
) -> anchor_lang::Result<bool> {
    Ok(vault_token_mint.eq(token_mint))
}
