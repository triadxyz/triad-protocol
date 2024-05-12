use crate::state::{Ticker, UpdateTickerPriceArgs};

use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(args: UpdateTickerPriceArgs)]
pub struct UpdateTickerPrice<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut)]
    pub ticker: Account<'info, Ticker>,

    pub system_program: Program<'info, System>,
}

pub fn update_ticker_price(
    ctx: Context<UpdateTickerPrice>,
    _args: UpdateTickerPriceArgs,
) -> Result<()> {
    let ticker = &mut ctx.accounts.ticker;

    let clock: Clock = Clock::get().unwrap();

    ticker.updated_ts = clock.unix_timestamp;
    ticker.price = 1000;

    msg!("Ticker {:?} Created", ticker.name);

    Ok(())
}
