use crate::constants::TTRIAD_MINT;
use crate::constraints::{is_mint_for_stake_vault, is_verifier};
use crate::errors::TriadProtocolError;
use crate::{constraints::is_authority_for_stake, state::StakeVault};
use crate::{ClaimStakeRewardsArgs, StakeV2};
use anchor_lang::prelude::*;
use anchor_spl::token_2022::{transfer_checked, Token2022, TransferChecked};
use anchor_spl::{
    associated_token::AssociatedToken,
    token_interface::{Mint, TokenAccount},
};

#[derive(Accounts)]
#[instruction(args: ClaimStakeRewardsArgs)]
pub struct ClaimStakeRewards<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut, constraint = is_verifier(&verifier)?)]
    pub verifier: Signer<'info>,

    #[account(mut)]
    pub stake_vault: Box<Account<'info, StakeVault>>,

    #[account(mut, constraint = is_authority_for_stake(&stake, &signer)?)]
    pub stake: Box<Account<'info, StakeV2>>,

    #[account(mut, constraint = is_mint_for_stake_vault(&stake_vault, &mint.key())?)]
    pub mint: Box<InterfaceAccount<'info, Mint>>,

    #[account(mut)]
    pub from_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(
        init_if_needed,
        payer = signer,
        constraint = to_ata.owner == *signer.key && to_ata.mint == mint.key(),
        associated_token::mint = mint,
        associated_token::authority = signer
    )]
    pub to_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    pub token_program: Program<'info, Token2022>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

pub fn claim_stake_rewards(
    ctx: Context<ClaimStakeRewards>,
    args: ClaimStakeRewardsArgs,
) -> Result<u64> {
    let stake_vault: &mut Box<Account<StakeVault>> = &mut ctx.accounts.stake_vault;
    let stake: &mut Box<Account<StakeV2>> = &mut ctx.accounts.stake;

    if args.collections > 5 {
        return Err(TriadProtocolError::Unauthorized.into());
    }

    let rank = args.rank;
    let collections = args.collections;

    let boost_rewards = if stake.boost { 3.69 * 1000.0 } else { 10.0 };
    let collections_multiplier = (collections as f64) * 150.0;

    let user_staked_amount = if stake.mint.to_string() == TTRIAD_MINT {
        stake.amount
    } else {
        stake.amount * 10000 * (10u64).pow(ctx.accounts.mint.decimals as u32)
    };

    let formated_amount = user_staked_amount / (10u64).pow(ctx.accounts.mint.decimals as u32);

    let max_rank = 1766 as f64;
    let rank = rank as f64;
    let rank_weight = (max_rank - rank + 1.0) / max_rank;

    let base_reward = (((formated_amount / 10000) as f64) * boost_rewards + collections_multiplier)
        * rank_weight
        + 0.369;

    let last_claim = if stake.claimed_ts == 0 {
        stake.init_ts
    } else {
        stake.claimed_ts
    };
    let current_time = Clock::get()?.unix_timestamp;
    let seconds_staked = current_time - last_claim;

    let adjusted_reward = (base_reward * (seconds_staked as f64)) / (365.0 * 86400.0);

    let scaling_factor = (10u64).pow(ctx.accounts.mint.decimals as u32) as f64;
    let rewards = (adjusted_reward * scaling_factor) as u64;

    if rewards > stake_vault.amount {
        return Err(TriadProtocolError::InsufficientFunds.into());
    }

    let signer: &[&[&[u8]]] = &[&[
        b"stake_vault",
        stake_vault.name.as_bytes(),
        &[stake_vault.bump],
    ]];

    let checked_rewards = rewards + stake.available;

    transfer_checked(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            TransferChecked {
                from: ctx.accounts.from_ata.to_account_info(),
                mint: ctx.accounts.mint.to_account_info(),
                to: ctx.accounts.to_ata.to_account_info(),
                authority: stake_vault.to_account_info(),
            },
            signer,
        ),
        checked_rewards,
        ctx.accounts.mint.decimals,
    )?;

    stake_vault.amount -= checked_rewards;
    stake_vault.amount_paid += checked_rewards;

    stake.claimed += checked_rewards;
    stake.claimed_ts = current_time;
    stake.available = 0;

    Ok(checked_rewards)
}
