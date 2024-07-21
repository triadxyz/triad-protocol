use crate::{Stake, Ticker, UserPosition};

use anchor_lang::prelude::*;

pub fn is_authority_for_user_position(
    user_position: &Account<UserPosition>,
    signer: &Signer,
) -> anchor_lang::Result<bool> {
    Ok(user_position.authority.eq(signer.key))
}

pub fn is_authority_for_ticker(
    ticker: &Account<Ticker>,
    signer: &Signer,
) -> anchor_lang::Result<bool> {
    Ok(ticker.authority.eq(signer.key))
}

pub fn is_token_mint_for_vault(
    vault_token_mint: &Pubkey,
    token_mint: &Pubkey,
) -> anchor_lang::Result<bool> {
    Ok(vault_token_mint.eq(token_mint))
}

pub fn is_authority_for_stake(
    stake: &Account<Stake>,
    signer: &Signer,
) -> anchor_lang::Result<bool> {
    Ok(stake.authority.eq(signer.key))
}
