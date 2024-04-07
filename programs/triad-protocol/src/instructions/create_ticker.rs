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

pub fn create_ticker(_ctx: Context<CreateTicker>, _args: CreateTickerArgs) -> Result<()> {
    Ok(())
}
