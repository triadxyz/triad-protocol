use std::str::FromStr;

use crate::{ constants::{ ADMIN, VERIFIER }, StakeV2, StakeVault, Ticker, UserPosition };

use anchor_lang::prelude::*;

pub fn is_admin(signer: &Signer) -> anchor_lang::Result<bool> {
    Ok(Pubkey::from_str(ADMIN).unwrap().eq(signer.key))
}

pub fn is_verifier(signer: &Signer) -> anchor_lang::Result<bool> {
    Ok(Pubkey::from_str(VERIFIER).unwrap().eq(signer.key))
}

pub fn is_authority_for_user_position(
    user_position: &Account<UserPosition>,
    signer: &Signer
) -> anchor_lang::Result<bool> {
    Ok(user_position.authority.eq(signer.key))
}

pub fn is_authority_for_ticker(
    ticker: &Account<Ticker>,
    signer: &Signer
) -> anchor_lang::Result<bool> {
    Ok(ticker.authority.eq(signer.key))
}

pub fn is_token_mint_for_vault(
    vault_token_mint: &Pubkey,
    token_mint: &Pubkey
) -> anchor_lang::Result<bool> {
    Ok(vault_token_mint.eq(token_mint))
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
