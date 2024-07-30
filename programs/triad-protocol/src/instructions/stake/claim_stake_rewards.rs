use crate::constants::TTRIAD_MINT;
use crate::constraints::is_admin;
use crate::{ StakeV2, StakeVaultMetrics };
use crate::{ constraints::{ is_authority_for_stake, is_ttriad_mint }, state::StakeVault };
use anchor_lang::prelude::*;
use anchor_spl::token_2022::{ transfer_checked, Token2022, TransferChecked };
use anchor_spl::{ associated_token::AssociatedToken, token_interface::{ Mint, TokenAccount } };

#[derive(Accounts)]
pub struct ClaimStakeRewards<'info> {
    #[account(mut, constraint = is_admin(&signer)?)]
    pub signer: Signer<'info>,

    #[account(mut)]
    pub stake_vault: Box<Account<'info, StakeVault>>,

    #[account(mut)]
    pub stake_vault_metrics: Box<Account<'info, StakeVaultMetrics>>,

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

pub fn claim_stake_rewards(ctx: Context<ClaimStakeRewards>) -> Result<()> {
    let stake_vault: &mut Box<Account<StakeVault>> = &mut ctx.accounts.stake_vault;
    let stake: &mut Box<Account<StakeV2>> = &mut ctx.accounts.stake;
    let stake_vault_metrics: &mut Box<Account<StakeVaultMetrics>> = &mut ctx.accounts.stake_vault_metrics;

    let mut boost_rewards = 1.0;

    if stake.boost {
        boost_rewards = 3.69;
    }

    let max_rank = stake_vault.slots;
    let mut rank = 1;
    let mut collections = 1;

    if stake.mint.to_string() != TTRIAD_MINT {
        rank = 1;
        collections = 1;
    }

    let rank_weigth = ((max_rank - rank + 1) as f64) / (max_rank as f64);
    let multiplier = (collections as f64) * 1.5;
    let auw = rank_weigth * multiplier * boost_rewards;

    let days_staked = stake_vault.init_ts - stake.init_ts;

    let rewards = 0;

    let signer: &[&[&[u8]]] = &[
        &[b"stake_vault", stake_vault.name.as_bytes(), &[stake_vault.bump]],
    ];

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
        rewards,
        ctx.accounts.mint.decimals
    )?;

    stake_vault.amount -= rewards;
    stake_vault.amount_paid += rewards;

    stake.claimed += rewards;
    stake.available = 0;

    Ok(())
}
