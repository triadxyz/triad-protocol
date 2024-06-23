use anchor_lang::prelude::*;
use instructions::*;
use state::*;

mod constants;
mod cpi;
mod errors;
mod instructions;
mod macros;
mod state;

declare_id!("TRDwq3BN4mP3m9KsuNUWSN6QDff93VKGSwE95Jbr9Ss");

#[program]
pub mod triad_protocol {
    use super::*;

    pub fn create_user_position(ctx: Context<CreateUserPosition>) -> Result<()> {
        instructions::create_user_position(ctx)
    }

    pub fn create_ticker(ctx: Context<CreateTicker>, args: CreateTickerArgs) -> Result<()> {
        instructions::create_ticker(ctx, args)
    }

    pub fn update_ticker_price<'info>(
        ctx: Context<UpdateTickerPrice>,
        args: UpdateTickerPriceArgs,
    ) -> Result<()> {
        instructions::update_ticker_price(ctx, args)
    }

    pub fn open_position<'info>(
        ctx: Context<'_, '_, '_, 'info, OpenPosition<'info>>,
        args: OpenPositionArgs,
    ) -> Result<()> {
        instructions::open_position(ctx, args)
    }

    pub fn close_position<'info>(
        ctx: Context<'_, '_, '_, 'info, ClosePosition<'info>>,
        args: ClosePositionArgs,
    ) -> Result<()> {
        instructions::close_position(ctx, args)
    }

    pub fn stake<'info>(ctx: Context<StakeNFT>, args: StakeNFTArgs) -> Result<()> {
        instructions::stake_nft(ctx, args)
    }

    pub fn initialize_stake_vault<'info>(
        ctx: Context<InitializeStakeVault<'info>>,
        args: InitializeStakeVaultArgs,
    ) -> Result<()> {
        instructions::initialize_stake_vault(ctx, args)
    }
}
