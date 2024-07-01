use crate::{constants::ADMIN, errors::TriadProtocolError, state::UpdateStakeRewardsArgs};
use crate::{NFTRewards, Stake};
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(args: UpdateStakeRewardsArgs)]
pub struct UpdateStakeRewards<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut)]
    pub stake: Box<Account<'info, Stake>>,

    #[account(init_if_needed, payer = signer, space = NFTRewards::SPACE, seeds = [NFTRewards::PREFIX_SEED, stake.key().as_ref()], bump)]
    pub nft_rewards: Box<Account<'info, NFTRewards>>,

    pub system_program: Program<'info, System>,
}

pub fn update_stake_rewards(
    ctx: Context<UpdateStakeRewards>,
    args: UpdateStakeRewardsArgs,
) -> Result<()> {
    if ctx.accounts.signer.key.to_string() != ADMIN {
        return Err(TriadProtocolError::Unauthorized.into());
    }

    let nft_rewards = &mut ctx.accounts.nft_rewards;
    let stake = &mut ctx.accounts.stake;

    stake.stake_rewards = nft_rewards.key();
    nft_rewards.stake = stake.key();

    if nft_rewards.stake != stake.key() {
        return Err(TriadProtocolError::InvalidAccount.into());
    }

    nft_rewards.daily_rewards[args.day as usize] = args.rewards;
    nft_rewards.apr = args.apr;

    Ok(())
}
