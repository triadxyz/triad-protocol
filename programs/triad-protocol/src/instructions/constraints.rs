use crate::{Ticker, User};

use anchor_lang::prelude::*;

pub fn is_authority_for_user(user: &Account<User>, signer: &Signer) -> anchor_lang::Result<bool> {
    Ok(user.authority.eq(signer.key))
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
