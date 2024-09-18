use crate::constraints::{ is_mint_for_stake_vault, is_verifier };
use crate::errors::TriadProtocolError;
use crate::{ constraints::is_authority_for_stake, state::StakeVault };
use crate::{ ClaimStakeRewardsArgs, StakeV2 };
use anchor_lang::prelude::*;
use anchor_spl::token_2022::{ transfer_checked, Token2022, TransferChecked };
use anchor_spl::{ associated_token::AssociatedToken, token_interface::{ Mint, TokenAccount } };

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
    args: ClaimStakeRewardsArgs
) -> Result<u64> {
    let stake_vault: &mut Box<Account<StakeVault>> = &mut ctx.accounts.stake_vault;
    let stake: &mut Box<Account<StakeV2>> = &mut ctx.accounts.stake;

    if stake.withdraw_ts != 0 {
        return Err(TriadProtocolError::NoRewardsAvailable.into());
    }

    if args.collections > 5 {
        return Err(TriadProtocolError::Unauthorized.into());
    }

    let rank = args.rank;
    let collections = args.collections;

    let boost_rewards = if stake.boost { 3.69 * 369.0 } else { 0.0 };
    let collections_multiplier = (collections as f64) * 150.0;

    let user_staked_amount = if stake.mint.eq(&stake_vault.token_mint) {
        stake.amount
    } else {
        stake.amount * 10000 * (10u64).pow(ctx.accounts.mint.decimals as u32)
    };

    let max_rank = 1823 as f64;
    let rank = rank as f64;
    let rank_weight = (max_rank - rank + 1.0) / max_rank;

    let formated_amount =
        (user_staked_amount as f64) / ((10u64).pow(ctx.accounts.mint.decimals as u32) as f64) +
        boost_rewards +
        collections_multiplier;

    let adjusted_amount = formated_amount * rank_weight;

    let last_claim = if stake.claimed_ts == 0 { stake.init_ts } else { stake.claimed_ts };
    let current_time = Clock::get()?.unix_timestamp;
    let seconds_staked = current_time - last_claim;

    let mut amount_base = 6.0;

    // Wed Sep 18 2024
    // Mon Sep 16 2024
    if stake.claimed_ts < 1726680267 || stake.init_ts > 1726518236 {
        amount_base = 3.0;
    }

    let user_base_rewards =
        ((adjusted_amount / 10000.0) * amount_base * (seconds_staked as f64)) / 86400.0;

    let rewards = user_base_rewards * ((10u64).pow(ctx.accounts.mint.decimals as u32) as f64);

    if rewards > (stake_vault.amount as f64) {
        return Err(TriadProtocolError::InsufficientFunds.into());
    }

    let signer: &[&[&[u8]]] = &[
        &[b"stake_vault", stake_vault.name.as_bytes(), &[stake_vault.bump]],
    ];

    let checked_rewards = (rewards as u64) + stake.available;

    transfer_checked(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            TransferChecked {
                from: ctx.accounts.from_ata.to_account_info(),
                mint: ctx.accounts.mint.to_account_info(),
                to: ctx.accounts.to_ata.to_account_info(),
                authority: stake_vault.to_account_info(),
            },
            signer
        ),
        checked_rewards,
        ctx.accounts.mint.decimals
    )?;

    stake_vault.amount -= checked_rewards;
    stake_vault.amount_paid += checked_rewards;

    stake.claimed += checked_rewards;
    stake.claimed_ts = current_time;
    stake.available = 0;

    if stake_vault.is_locked {
        msg!("Stake vault is locked: Rewards {:12}", checked_rewards);
        return Err(TriadProtocolError::Unauthorized.into());
    }

    Ok(checked_rewards)
}
