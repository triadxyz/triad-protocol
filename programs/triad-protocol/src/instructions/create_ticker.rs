use crate::{
    constants::ADMIN,
    errors::TriadProtocolError,
    state::{CreateTickerArgs, Ticker},
    Vault,
};

use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};

#[derive(Accounts)]
#[instruction(args: CreateTickerArgs)]
pub struct CreateTicker<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(init, payer = signer, space = Ticker::SPACE, seeds = [Ticker::PREFIX_SEED.as_ref(), args.name.as_ref()], bump)]
    pub ticker: Account<'info, Ticker>,

    #[account(init, payer = signer, space = Vault::SPACE, seeds = [Vault::PREFIX_SEED.as_ref(), ticker.to_account_info().key.as_ref()], bump)]
    pub vault: Account<'info, Vault>,

    pub payer_token_mint: Account<'info, Mint>,

    #[account(
        init,
        seeds = [Vault::PREFIX_SEED_VAULT_TOKEN_ACCOUNT.as_ref(), vault.key().as_ref()],
        bump,
        payer = signer,
        token::mint = payer_token_mint,
        token::authority = vault,
    )]
    pub token_account: Account<'info, TokenAccount>,

    pub system_program: Program<'info, System>,

    pub token_program: Program<'info, Token>,
}

pub fn create_ticker(ctx: Context<CreateTicker>, args: CreateTickerArgs) -> Result<()> {
    if ctx.accounts.signer.key.to_string() != ADMIN {
        return Err(TriadProtocolError::Unauthorized.into());
    }

    let ticker_key = *ctx.accounts.ticker.to_account_info().key;
    let token_account_key = *ctx.accounts.token_account.to_account_info().key;
    let signer_key = *ctx.accounts.signer.key;
    let current_timestamp = Clock::get()?.unix_timestamp;

    let ticker: &mut Account<Ticker> = &mut ctx.accounts.ticker;
    let vault: &mut Account<Vault> = &mut ctx.accounts.vault;

    vault.bump = *ctx.bumps.get("vault").unwrap();
    vault.authority = signer_key;
    vault.name = args.name.clone();
    vault.ticker_address = ticker_key;
    vault.token_account = token_account_key;
    vault.total_deposited = 0;
    vault.total_withdrawn = 0;
    vault.init_ts = current_timestamp;
    vault.net_deposits = 0;

    msg!(
        "Vault {:?} Created",
        vault.to_account_info().key.to_string()
    );

    ticker.bump = *ctx.bumps.get("ticker").unwrap();
    ticker.authority = signer_key;
    ticker.name = args.name;
    ticker.vault = *ctx.accounts.vault.to_account_info().key;
    ticker.price = 0;
    ticker.protocol_program_id = args.protocol_program_id;
    ticker.init_ts = current_timestamp;
    ticker.updated_ts = current_timestamp;

    msg!("Ticker {:?} Created", ticker.name);

    Ok(())
}
