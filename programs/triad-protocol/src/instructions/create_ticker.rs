use crate::{
    state::{CreateTickerArgs, Ticker},
    Vault,
};

use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(args: CreateTickerArgs)]
pub struct CreateTicker<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut, constraint = vault.authority == *signer.key && vault.ticker_address == *ticker.to_account_info().key)]
    pub vault: Account<'info, Vault>,

    #[account(init, payer = signer, space = Ticker::SPACE, seeds = [Ticker::PREFIX_SEED.as_ref(), args.name.as_ref()], bump)]
    pub ticker: Account<'info, Ticker>,

    pub system_program: Program<'info, System>,
}

pub fn create_ticker(ctx: Context<CreateTicker>, args: CreateTickerArgs) -> Result<()> {
    let ticker: &mut Account<Ticker> = &mut ctx.accounts.ticker;

    ticker.bump = *ctx.bumps.get("ticker").unwrap();
    ticker.authority = *ctx.accounts.signer.key;
    ticker.name = args.name;
    ticker.vault = *ctx.accounts.vault.to_account_info().key;
    ticker.price = 0;
    ticker.protocol_program_id = args.protocol_program_id;

    let clock: Clock = Clock::get().unwrap();

    ticker.init_ts = clock.unix_timestamp;
    ticker.updated_ts = clock.unix_timestamp;

    msg!("Ticker {:?} Created", ticker.name);

    Ok(())
}
