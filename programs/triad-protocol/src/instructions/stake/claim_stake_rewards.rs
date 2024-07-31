use crate::constants::TTRIAD_MINT;
use crate::constraints::is_admin;
use crate::errors::TriadProtocolError;
use crate::{
    StakeV2,
    // StakeVaultMetadata
};
use crate::{ constraints::{ is_authority_for_stake, is_ttriad_mint }, state::StakeVault };
use anchor_lang::prelude::*;
use anchor_spl::token_2022::{
    // transfer_checked,
    Token2022,
    // TransferChecked,
};
use anchor_spl::{ associated_token::AssociatedToken, token_interface::{ Mint, TokenAccount } };

#[derive(Accounts)]
pub struct ClaimStakeRewards<'info> {
    #[account(mut, constraint = is_admin(&signer)?)]
    pub signer: Signer<'info>,

    #[account(mut)]
    pub stake_vault: Box<Account<'info, StakeVault>>,

    #[account(mut, constraint = is_authority_for_stake(&stake, &signer)?)]
    pub stake: Box<Account<'info, StakeV2>>,

    #[account(mut, constraint = is_ttriad_mint(&mint.key())?)]
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

pub fn claim_stake_rewards(ctx: Context<ClaimStakeRewards>) -> Result<u64> {
    let stake_vault: &mut Box<Account<StakeVault>> = &mut ctx.accounts.stake_vault;
    let stake: &mut Box<Account<StakeV2>> = &mut ctx.accounts.stake;

    let rank = 1839;
    let collections = 0;

    let boost_rewards = if stake.boost { 3.69 * 1000.0 } else { 1.0 * 1000.0 };
    let collections_multiplier = (collections as f64) * 1500.0;

    let user_staked_amount = if stake.mint.to_string() == TTRIAD_MINT {
        stake.amount
    } else {
        stake.amount * 10000 * (10u64).pow(ctx.accounts.mint.decimals as u32)
    };

    let formated_amount = user_staked_amount / (10u64).pow(ctx.accounts.mint.decimals as u32);

    let max_rank = 1839 as f64;
    let rank = rank as f64;
    let rank_weight = (max_rank - rank + 1.0) / max_rank;

    let base_reward =
        ((formated_amount as f64) * boost_rewards + collections_multiplier) * rank_weight;

    let current_time = Clock::get()?.unix_timestamp;
    let days_staked = (current_time - stake.init_ts) / 86400;

    let adjusted_reward = base_reward * ((days_staked as f64) / 365.0);

    let rewards = (adjusted_reward as u64) * (10u64).pow(ctx.accounts.mint.decimals as u32);

    if stake_vault.amount < rewards {
        return Err(TriadProtocolError::InsufficientFunds.into());
    }

    // let signer: &[&[&[u8]]] = &[
    //     &[b"stake_vault", stake_vault.name.as_bytes(), &[stake_vault.bump]],
    // ];

    // transfer_checked(
    //     CpiContext::new_with_signer(
    //         ctx.accounts.token_program.to_account_info(),
    //         TransferChecked {
    //             from: ctx.accounts.from_ata.to_account_info(),
    //             mint: ctx.accounts.mint.to_account_info(),
    //             to: ctx.accounts.to_ata.to_account_info(),
    //             authority: stake_vault.to_account_info(),
    //         },
    //         signer
    //     ),
    //     rewards,
    //     ctx.accounts.mint.decimals
    // )?;

    // stake_vault.amount -= rewards;
    // stake_vault.amount_paid += rewards;

    // stake.claimed += rewards;
    // stake.available = 0;

    Ok(rewards)
}
