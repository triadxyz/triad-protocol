use crate::{constants::ADMIN, errors::TriadProtocolError, state::UpdateStakeRewardsArgs};
use crate::{Stake, StakeRewards};
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(args: UpdateStakeRewardsArgs)]
pub struct UpdateStakeRewards<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut)]
    pub stake: Box<Account<'info, Stake>>,

    #[account(init_if_needed, payer = signer, space = StakeRewards::SPACE, seeds = [StakeRewards::PREFIX_SEED, stake.key().as_ref()], bump)]
    pub stake_rewards: Box<Account<'info, StakeRewards>>,

    pub system_program: Program<'info, System>,
}

pub fn update_stake_rewards(
    ctx: Context<UpdateStakeRewards>,
    args: UpdateStakeRewardsArgs,
) -> Result<()> {
    if ctx.accounts.signer.key.to_string() != ADMIN {
        return Err(TriadProtocolError::Unauthorized.into());
    }

    let stake_rewards = &mut ctx.accounts.stake_rewards;
    let stake = &mut ctx.accounts.stake;

    if stake.stake_rewards == Pubkey::default() {
        stake.stake_rewards = stake_rewards.key();
    }

    if stake_rewards.stake != stake.key() {
        return Err(TriadProtocolError::InvalidAccount.into());
    }

    stake_rewards.daily_rewards[args.day as usize] = args.rewards;
    stake_rewards.apr = args.apr;

    Ok(())
}
