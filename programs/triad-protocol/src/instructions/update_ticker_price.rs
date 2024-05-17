use crate::{
    constants::ADMIN,
    constraints::is_authority_for_ticker,
    errors::TriadProtocolError,
    state::{Ticker, UpdateTickerPriceArgs},
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
    args: UpdateTickerPriceArgs,
) -> Result<()> {
    if ctx.accounts.signer.key.to_string() != ADMIN {
        return Err(TriadProtocolError::Unauthorized.into());
    }

    let ticker = &mut ctx.accounts.ticker;

    ticker.updated_ts = Clock::get()?.unix_timestamp;
    ticker.price = args.price;

    msg!("Ticker {:?} Created", ticker.name);

    Ok(())
}
