use anchor_lang::prelude::*;

use instructions::*;
use state::*;

mod cpi;
mod errors;
mod instructions;
mod macros;
mod state;
mod constants;

declare_id!("TRDwq3BN4mP3m9KsuNUWSN6QDff93VKGSwE95Jbr9Ss");

#[program]
pub mod triad_protocol {
    use super::*;

    pub fn create_user(ctx: Context<CreateUser>, arg: CreateUserArgs) -> Result<()> {
        instructions::create_user(ctx, arg)
    }

    pub fn create_ticker(ctx: Context<CreateTicker>, arg: CreateTickerArgs) -> Result<()> {
        instructions::create_ticker(ctx, arg)
    }

    pub fn update_ticker_price<'info>(
        ctx: Context<UpdateTickerPrice>,
        args: UpdateTickerPriceArgs,
    ) -> Result<()> {
        instructions::update_ticker_price(ctx, args)
    }

    pub fn create_vault(ctx: Context<CreateVault>) -> Result<()> {
        instructions::create_vault(ctx)
    }

    pub fn deposit<'info>(
        ctx: Context<'_, '_, '_, 'info, Deposit<'info>>,
        args: DepositVaultArgs,
    ) -> Result<()> {
        instructions::deposit(ctx, args)
    }

    pub fn withdraw<'info>(
        ctx: Context<'_, '_, '_, 'info, Withdraw<'info>>,
        amount: u64,
    ) -> Result<()> {
        instructions::withdraw(ctx, amount)
    }
}
