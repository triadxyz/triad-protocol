use crate::constraints::is_admin;
use crate::errors::TriadProtocolError;
use crate::Stake;
use crate::{
    constraints::{is_authority_for_stake, is_ttriad_mint},
    state::{ClaimStakeRewardsArgs, StakeVault},
};
use anchor_lang::prelude::*;
use anchor_spl::token_2022::Token2022;
use anchor_spl::{
    associated_token::AssociatedToken,
    token_interface::{transfer_checked, Mint, TokenAccount, TransferChecked},
};

#[derive(Accounts)]
#[instruction(args: ClaimStakeRewardsArgs)]
pub struct ClaimRewards<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut)]
    pub stake_vault: Box<Account<'info, StakeVault>>,

    #[account(mut, constraint = is_authority_for_stake(&stake, &signer)?)]
    pub stake: Box<Account<'info, Stake>>,

    #[account(mut, constraint = is_ttriad_mint(&mint.key())?)]
    pub mint: Box<InterfaceAccount<'info, Mint>>,

    #[account(mut)]
    pub from_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(
     init_if_needed,
     payer = signer,
     constraint = to_ata.owner == *signer.key && to_ata.mint == mint.key(),
     associated_token::mint = mint,
     associated_token::authority = signer,
 )]
    pub to_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    pub token_program: Program<'info, Token2022>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

pub fn claim_rewards(ctx: Context<ClaimRewards>) -> Result<()> {
    if !is_admin(&ctx.accounts.signer)? {
        return Err(TriadProtocolError::Unauthorized.into());
    }

    let stake_vault = &mut ctx.accounts.stake_vault;
    let stake = &mut ctx.accounts.stake;

    let signer: &[&[&[u8]]] = &[&[
        b"stake_vault",
        stake_vault.name.as_bytes(),
        &[stake_vault.bump],
    ]];

    let cpi_context = CpiContext::new_with_signer(
        ctx.accounts.token_program.to_account_info(),
        TransferChecked {
            from: ctx.accounts.from_ata.to_account_info(),
            mint: ctx.accounts.mint.to_account_info(),
            to: ctx.accounts.to_ata.to_account_info(),
            authority: stake_vault.to_account_info(),
        },
        signer,
    );

    // IF TOKEN 10K tokens

    // let mut og_rewards = 0.0;

    // if stake.stake_rewards != Pubkey::default() {
    //     og_rewards = 3.69;
    // }

    // let max_rank = 1839;
    // let rank_weigth = (max_rank - stake.rank + 1) as f64 / max_rank as f64;
    // let multiplier = stake.collections.len() as f64 * 1.5;
    // let auw = rank_weigth * multiplier * og_rewards;
    // let pdru = auw / stake_vault.sum_all_users;

    // let days_staked = stake_vault.init_ts - stake.init_ts;

    let rewards = 0;

    transfer_checked(cpi_context, rewards, ctx.accounts.mint.decimals)?;

    stake_vault.amount -= rewards;
    stake_vault.amount_paid += rewards;
    stake.claimed += rewards;

    Ok(())
}
