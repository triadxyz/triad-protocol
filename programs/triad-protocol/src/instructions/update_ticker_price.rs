use crate::{constants::ADMIN, errors::TriadProtocolError, state::{Ticker, UpdateTickerPriceArgs}};

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
    args: UpdateTickerPriceArgs,
) -> Result<()> {
    if ctx.accounts.signer.key.to_string() != ADMIN {
        return Err(TriadProtocolError::Unauthorized.into());
    }

    let ticker = &mut ctx.accounts.ticker;

    let clock: Clock = Clock::get().unwrap();

    ticker.updated_ts = clock.unix_timestamp;
    ticker.price = args.price;

    msg!("Ticker {:?} Created", ticker.name);

    Ok(())
}