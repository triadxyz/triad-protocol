use std::str::FromStr;

use crate::{ constants::{ ADMIN, VERIFIER }, User, StakeV2, StakeVault };

use anchor_lang::prelude::*;

pub fn is_admin(signer: &Signer) -> anchor_lang::Result<bool> {
    Ok(Pubkey::from_str(ADMIN).unwrap().eq(signer.key))
}

pub fn is_verifier(signer: &Signer) -> anchor_lang::Result<bool> {
    Ok(Pubkey::from_str(VERIFIER).unwrap().eq(signer.key))
}

pub fn is_authority_for_user(user: &Account<User>, signer: &Signer) -> anchor_lang::Result<bool> {
    Ok(user.authority.eq(signer.key))
}

pub fn is_authority_for_stake(
    stake: &Account<StakeV2>,
    signer: &Signer
) -> anchor_lang::Result<bool> {
    Ok(stake.authority.eq(signer.key))
}

pub fn is_mint_for_stake(stake: &Account<StakeV2>, mint: &Pubkey) -> anchor_lang::Result<bool> {
    Ok(stake.mint.eq(mint))
}

pub fn is_mint_for_stake_vault(
    stake_vault: &Account<StakeVault>,
    mint: &Pubkey
) -> anchor_lang::Result<bool> {
    Ok(stake_vault.token_mint.eq(mint))
}

pub fn is_authority_for_stake_vault(
    stake_vault: &Account<StakeVault>,
    signer: &Signer
) -> anchor_lang::Result<bool> {
    Ok(stake_vault.authority.eq(signer.key))
}
