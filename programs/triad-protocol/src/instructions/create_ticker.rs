use anchor_lang::prelude::*;

use crate::state::{CreateTickerArgs, Ticker};
use pyth_solana_receiver_sdk::price_update::get_feed_id_from_hex;
use pyth_solana_receiver_sdk::price_update::PriceUpdateV2;

#[derive(Accounts)]
#[instruction(args: CreateTickerArgs)]
pub struct CreateTicker<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(init, payer = signer, space = Ticker::SPACE, seeds = [Ticker::PREFIX_SEED.as_ref(), args.name.as_ref()], bump)]
    pub ticker: Account<'info, Ticker>,
    pub price_update: Account<'info, PriceUpdateV2>,
    pub system_program: Program<'info, System>,
}

pub fn create_ticker(ctx: Context<CreateTicker>, args: CreateTickerArgs) -> Result<()> {
    let ticker: &mut Account<Ticker> = &mut ctx.accounts.ticker;
    let price_update: &mut Account<'_, PriceUpdateV2> = &mut ctx.accounts.price_update;
    let maximum_age: u64 = 30;

    ticker.bump = *ctx.bumps.get("ticker").unwrap();
    ticker.authority = *ctx.accounts.signer.key;
    ticker.name = args.name;
    ticker.token_account = Pubkey::default();
    ticker.token_mint = Pubkey::default();

    let feed_id: [u8; 32] = get_feed_id_from_hex(&args.pyth_price_pub_key.to_string())?;
    let pyth_price: pyth_solana_receiver_sdk::price_update::Price =
        price_update.get_price_no_older_than(&Clock::get()?, maximum_age, &feed_id)?;

    let new_price = args.price_onchain + pyth_price.price;
    ticker.price = new_price;
    let clock: Clock = Clock::get().unwrap();

    ticker.init_ts = clock.unix_timestamp;

    msg!(
        "The pyth oracle price is ({} ± {}) * 10^{}",
        pyth_price.price,
        pyth_price.conf,
        pyth_price.exponent
    );

    Ok(())
}
