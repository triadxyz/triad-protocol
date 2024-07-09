use anchor_lang::prelude::*;
use instructions::*;
use state::*;

mod constants;
mod constraints;
mod errors;
mod instructions;
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

    pub fn update_ticker_price(
        ctx: Context<UpdateTickerPrice>,
        args: UpdateTickerPriceArgs,
    ) -> Result<()> {
        instructions::update_ticker_price(ctx, args)
    }

    pub fn open_position(ctx: Context<OpenPosition>, args: OpenPositionArgs) -> Result<()> {
        instructions::open_position(ctx, args)
    }

    pub fn close_position(ctx: Context<ClosePosition>, args: ClosePositionArgs) -> Result<()> {
        instructions::close_position(ctx, args)
    }

    pub fn stake(ctx: Context<StakeNFT>, args: StakeNFTArgs) -> Result<()> {
        instructions::stake_nft(ctx, args)
    }

    pub fn initialize_stake_vault(
        ctx: Context<InitializeStakeVault>,
        args: InitializeStakeVaultArgs,
    ) -> Result<()> {
        instructions::initialize_stake_vault(ctx, args)
    }

    pub fn withdraw_nft(ctx: Context<WithdrawNFT>, args: WithdrawNFTArgs) -> Result<()> {
        instructions::withdraw_nft(ctx, args)
    }

    pub fn request_withdraw_nft(
        ctx: Context<RequestWithdrawNFT>,
        args: RequestWithdrawNFTArgs,
    ) -> Result<()> {
        instructions::request_withdraw_nft(ctx, args)
    }

    pub fn deposit_stake_rewards(
        ctx: Context<DepositStakeRewards>,
        args: DepositStakeRewardsArgs,
    ) -> Result<()> {
        instructions::deposit_stake_rewards(ctx, args)
    }

    pub fn update_stake_vault_status(
        ctx: Context<UpdateStakeVaultStatus>,
        args: UpdateStakeVaultStatusArgs,
    ) -> Result<()> {
        instructions::update_stake_vault_status(ctx, args)
    }

    pub fn claim_stake_rewards(
        ctx: Context<ClaimStakeRewards>,
        args: ClaimStakeRewardsArgs,
    ) -> Result<()> {
        instructions::claim_stake_rewards(ctx, args)
    }

    pub fn update_stake_rewards(
        ctx: Context<UpdateStakeRewards>,
        args: UpdateStakeRewardsArgs,
    ) -> Result<()> {
        instructions::update_stake_rewards(ctx, args)
    }
}
