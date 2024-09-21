use anchor_lang::prelude::*;
use instructions::*;
use state::*;

mod constants;
mod constraints;
mod errors;
mod events;
pub mod instructions;
pub mod state;

declare_id!("3ZmkveqMGGwf4coSRmJuYHCxaQjX1YXjbvM87v71J2P9");

#[program]
pub mod triad_protocol {
    use super::*;

    pub fn initialize_market(
        ctx: Context<InitializeMarket>,
        args: InitializeMarketArgs
    ) -> Result<()> {
        instructions::initialize_market(ctx, args)
    }

    pub fn create_user(ctx: Context<CreateUser>, args: CreateUserArgs) -> Result<()> {
        instructions::create_user(ctx, args)
    }

    pub fn open_order(ctx: Context<OpenOrder>, args: OpenOrderArgs) -> Result<()> {
        instructions::open_order(ctx, args)
    }

    pub fn stake_nft(ctx: Context<StakeNFT>, args: StakeNFTArgs) -> Result<()> {
        instructions::stake_nft(ctx, args)
    }

    pub fn stake_token(ctx: Context<StakeToken>, args: StakeTokenArgs) -> Result<()> {
        instructions::stake_token(ctx, args)
    }

    pub fn request_withdraw_stake(ctx: Context<RequestWithdrawStake>) -> Result<()> {
        instructions::request_withdraw_stake(ctx)
    }

    pub fn withdraw_stake(ctx: Context<WithdrawStake>) -> Result<()> {
        instructions::withdraw_stake(ctx)
    }

    pub fn update_stake_vault(
        ctx: Context<UpdateStakeVault>,
        args: UpdateStakeVaultArgs
    ) -> Result<()> {
        instructions::update_stake_vault(ctx, args)
    }

    pub fn claim_stake_rewards(
        ctx: Context<ClaimStakeRewards>,
        args: ClaimStakeRewardsArgs
    ) -> Result<u64> {
        instructions::claim_stake_rewards(ctx, args)
    }

    pub fn update_stake_boost(ctx: Context<UpdateStakeBoost>) -> Result<()> {
        instructions::update_stake_boost(ctx)
    }
}
