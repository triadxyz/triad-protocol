use anchor_lang::prelude::*;

use crate::state::{CreateTickerArgs, Ticker};

#[derive(Accounts)]
#[instruction(args: CreateTickerArgs)]
pub struct CreateTicker<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(init, payer = signer, space = Ticker::SPACE, seeds = [Ticker::PREFIX_SEED.as_ref(), args.name.as_ref()], bump)]
    pub ticker: Account<'info, Ticker>,

    pub system_program: Program<'info, System>,
}

pub fn create_ticker(ctx: Context<CreateTicker>, args: CreateTickerArgs) -> Result<()> {
    let ticker: &mut Account<Ticker> = &mut ctx.accounts.ticker;

    ticker.bump = *ctx.bumps.get("ticker").unwrap();
    ticker.authority = *ctx.accounts.signer.key;
    ticker.name = args.name;
    ticker.token_account = Pubkey::default();
    ticker.token_mint = Pubkey::default();

    let clock: Clock = Clock::get().unwrap();

    ticker.init_ts = clock.unix_timestamp;

    Ok(())
}
