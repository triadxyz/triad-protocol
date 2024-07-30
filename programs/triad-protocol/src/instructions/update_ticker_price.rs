use crate::{
    constraints::is_authority_for_ticker,
    events::TickerPriceUpdateRecord,
    state::{ Ticker, UpdateTickerPriceArgs },
};

use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(args: UpdateTickerPriceArgs)]
pub struct UpdateTickerPrice<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut, constraint = is_authority_for_ticker(&ticker, &signer)?)]
    pub ticker: Account<'info, Ticker>,

    pub system_program: Program<'info, System>,
}

pub fn update_ticker_price(
    ctx: Context<UpdateTickerPrice>,
    args: UpdateTickerPriceArgs
) -> Result<()> {
    let ticker = &mut ctx.accounts.ticker;

    ticker.updated_ts = Clock::get()?.unix_timestamp;
    ticker.price = args.price;

    emit!(TickerPriceUpdateRecord {
        price: ticker.price,
        ticker: ticker.key(),
        ts: ticker.updated_ts,
    });

    Ok(())
}
