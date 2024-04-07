use anchor_lang::prelude::*;

use instructions::*;
use state::*;

mod errors;
mod instructions;
mod state;

declare_id!("8naBpcEohvxphPTAcuNHVCZEBDNn5aX41HfqxdcjNQ2W");

#[program]
pub mod triad_protocol {
    use super::*;

    pub fn create_ticker(ctx: Context<CreateTicker>, arg: CreateTickerArgs) -> Result<()> {
        instructions::create_ticker(ctx, arg)
    }
}
