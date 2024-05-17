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

    #[account(init, payer = signer, space = Ticker::SPACE, seeds = [Ticker::PREFIX_SEED.as_ref(), args.protocol_program_id.as_ref()], bump)]
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

    let ticker: &mut Account<Ticker> = &mut ctx.accounts.ticker.clone();
    let vault: &mut Account<Vault> = &mut ctx.accounts.vault.clone();

    vault.bump = *ctx.bumps.get("vault").unwrap();
    vault.authority = *ctx.accounts.signer.key;
    vault.name = args.name.clone();
    vault.ticker_address = *ctx.accounts.ticker.to_account_info().key;
    vault.token_account = *ctx.accounts.token_account.to_account_info().key;
    vault.total_deposits = 0;
    vault.total_withdraws = 0;
    vault.init_ts = Clock::get()?.unix_timestamp;
    vault.net_deposits = 0;

    msg!(
        "Vault {:?} Created",
        vault.to_account_info().key.to_string()
    );

    ticker.bump = *ctx.bumps.get("ticker").unwrap();
    ticker.authority = *ctx.accounts.signer.key;
    ticker.name = args.name;
    ticker.vault = *ctx.accounts.vault.to_account_info().key;
    ticker.price = 0;
    ticker.protocol_program_id = args.protocol_program_id;
    ticker.init_ts = Clock::get()?.unix_timestamp;
    ticker.updated_ts = Clock::get()?.unix_timestamp;

    msg!("Ticker {:?} Created", ticker.name);

    Ok(())
}
