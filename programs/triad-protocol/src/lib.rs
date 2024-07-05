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

    pub fn withdraw_nft<'info>(
        ctx: Context<WithdrawNFT<'info>>,
        args: WithdrawNFTArgs,
    ) -> Result<()> {
        instructions::withdraw_nft(ctx, args)
    }

    pub fn request_withdraw_nft<'info>(
        ctx: Context<RequestWithdrawNFT<'info>>,
        args: RequestWithdrawNFTArgs,
    ) -> Result<()> {
        instructions::request_withdraw_nft(ctx, args)
    }

    pub fn deposit_stake_rewards<'info>(
        ctx: Context<DepositStakeRewards<'info>>,
        args: DepositStakeRewardsArgs,
    ) -> Result<()> {
        instructions::deposit_stake_rewards(ctx, args)
    }

    pub fn update_stake_vault_status<'info>(
        ctx: Context<UpdateStakeVaultStatus<'info>>,
        args: UpdateStakeVaultStatusArgs,
    ) -> Result<()> {
        instructions::update_stake_vault_status(ctx, args)
    }

    pub fn claim_stake_rewards<'info>(
        ctx: Context<ClaimStakeRewards<'info>>,
        args: ClaimStakeRewardsArgs,
    ) -> Result<()> {
        instructions::claim_stake_rewards(ctx, args)
    }

    pub fn update_stake_rewards<'info>(
        ctx: Context<UpdateStakeRewards<'info>>,
        args: UpdateStakeRewardsArgs,
    ) -> Result<()> {
        instructions::update_stake_rewards(ctx, args)
    }

    pub fn jupiter_swap<'info>(ctx: Context<JupiterSwap<'info>>, data: Vec<u8>) -> Result<()> {
        instructions::jupiter_swap(ctx, data)
    }
}
