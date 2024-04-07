use anchor_lang::prelude::*;

use instructions::*;
use state::*;

mod errors;
mod instructions;
mod state;

declare_id!("8naBpcEohvxphPTAcuNHVCZEBDNn5aX41HfqxdcjNQ2W");

#[program]
pub mod triad_markets {
    use self::state::CreateTicketArgs;

    use super::*;

    pub fn create_ticket(ctx: Context<CreateTicket>, arg: CreateTicketArgs) -> Result<()> {
        instructions::create_ticket(ctx, arg)
    }

    // pub fn update_ticket(ctx: Context<Initialize>) -> Result<()> {
    //     instructions::ticket::update(ctx)
    // }

    // pub fn create_raise(ctx: Context<Initialize>) -> Result<()> {
    //     instructions::raise::create(ctx)
    // }

    // pub fn update_raiset(ctx: Context<Initialize>) -> Result<()> {
    //     instructions::raise::create(ctx)
    // }
}
