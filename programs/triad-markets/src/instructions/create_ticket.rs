use anchor_lang::prelude::*;

use crate::state::{CreateTicketArgs, Ticket};

#[derive(Accounts)]
#[instruction(args: CreateTicketArgs)]
pub struct CreateTicket<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(init, payer = signer, space = Ticket::SPACE, seeds = [Ticket::PREFIX_SEED.as_ref(), args.name.as_ref()], bump)]
    pub ticket: Account<'info, Ticket>,

    pub system_program: Program<'info, System>,
}

pub fn create_ticket(_ctx: Context<CreateTicket>, _args: CreateTicketArgs) -> Result<()> {
    Ok(())
}
