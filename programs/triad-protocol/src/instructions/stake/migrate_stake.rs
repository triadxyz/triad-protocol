use crate::{
    constraints::is_admin,
    errors::TriadProtocolError,
    state::{MigrateStakeArgs, Stake, StakeVault},
    NFTRewards, StakeV2,
};
use anchor_lang::prelude::*;
use anchor_spl::token_2022::Token2022;
use anchor_spl::{associated_token::AssociatedToken, token_interface::Mint};

#[derive(Accounts)]
#[instruction(args: MigrateStakeArgs)]
pub struct MigrateStake<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut, seeds = [StakeVault::PREFIX_SEED, args.stake_vault.as_bytes()], bump)]
    pub stake_vault: Box<Account<'info, StakeVault>>,

    #[account(
      mut,
      close = signer
    )]
    pub stake_v1: Box<Account<'info, Stake>>,

    #[account(init_if_needed, payer = signer, space = StakeV2::SPACE, seeds = [StakeV2::PREFIX_SEED, stake_v1.authority.as_ref(), args.name.as_bytes()], bump)]
    pub stake_v2: Box<Account<'info, StakeV2>>,

    #[account(mut)]
    pub mint: Box<InterfaceAccount<'info, Mint>>,

    #[account(mut, close = signer)]
    pub nft_rewards: Account<'info, NFTRewards>,

    pub token_program: Program<'info, Token2022>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

pub fn migrate_stake(ctx: Context<MigrateStake>, _args: MigrateStakeArgs) -> Result<()> {
    if !is_admin(&ctx.accounts.signer)? {
        return Err(TriadProtocolError::Unauthorized.into());
    }

    let mint = &ctx.accounts.mint.to_account_info();
    let stake_v1 = &mut ctx.accounts.stake_v1;
    let stake_v2 = &mut ctx.accounts.stake_v2;
    let nft_rewards = &mut ctx.accounts.nft_rewards;

    if stake_v1.mint != *mint.key {
        return Err(TriadProtocolError::Unauthorized.into());
    }

    stake_v2.bump = ctx.bumps.stake_v2;
    stake_v2.authority = stake_v1.authority;
    stake_v2.init_ts = Clock::get()?.unix_timestamp;
    stake_v2.withdraw_ts = stake_v1.withdraw_ts;
    stake_v2.claimed_ts = 0;
    stake_v2.name = stake_v1.name.clone();
    stake_v2.boost = true;
    stake_v2.stake_vault = stake_v1.stake_vault;
    stake_v2.mint = stake_v1.mint;
    stake_v2.amount = 1;
    stake_v2.claimed = 0;

    let mut week = 0;

    for i in 0..5 {
        let start = week * 7;
        let end = if week == 4 { 30 } else { start + 7 };

        let rewards: u64 = nft_rewards.daily_rewards[start..end].iter().sum();

        if !nft_rewards.weekly_rewards_paid[i] {
            stake_v2.available += rewards;
        } else {
            stake_v2.claimed += rewards;
        }

        week = i;
    }

    Ok(())
}
