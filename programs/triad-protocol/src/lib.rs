use anchor_lang::prelude::*;

use instructions::*;
use state::*;

mod cpi;
mod errors;
mod instructions;
mod macros;
mod state;
mod position;

declare_id!("8naBpcEohvxphPTAcuNHVCZEBDNn5aX41HfqxdcjNQ2W");

#[program]
pub mod triad_protocol {
    use super::*;

    pub fn create_ticker(ctx: Context<CreateTicker>, arg: CreateTickerArgs) -> Result<()> {
        instructions::create_ticker(ctx, arg)
    }
    
    pub fn create_vault(ctx: Context<CreateVault>, args: CreateVaultArgs) -> Result<()> {
        instructions::create_vault(ctx, args)
    }

    pub fn deposit<'info>(
        ctx: Context<'_, '_, '_, 'info, Deposit<'info>>,
        amount: u64,
        is_long: bool
    ) -> Result<()> {
        instructions::deposit(ctx, amount, is_long)
    }

    pub fn create_vault_depositor(ctx: Context<CreateVaultDepositor>, args: CreateVaultDepositorArgs) -> Result<()> {
        instructions::create_vault_depositor(ctx, args)
    }

    pub fn withdraw<'info>(
        ctx: Context<'_, '_, '_, 'info, Withdraw<'info>>,
        amount: u64,
    ) -> Result<()> {
        instructions::withdraw(ctx, amount)
    }
}
