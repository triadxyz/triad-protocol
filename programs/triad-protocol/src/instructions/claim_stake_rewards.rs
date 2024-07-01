use crate::{
    constants::TTRIAD_MINT,
    errors::TriadProtocolError,
    state::{ClaimStakeRewardsArgs, StakeVault},
};
use crate::{NFTRewards, Stake};
use anchor_lang::prelude::*;
use anchor_spl::token_2022::Token2022;
use anchor_spl::{
    associated_token::AssociatedToken,
    token_interface::{transfer_checked, Mint, TokenAccount, TransferChecked},
};

#[derive(Accounts)]
#[instruction(args: ClaimStakeRewardsArgs)]
pub struct ClaimStakeRewards<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut)]
    pub stake_vault: Box<Account<'info, StakeVault>>,

    #[account(mut)]
    pub stake: Box<Account<'info, Stake>>,

    #[account(mut)]
    pub nft_rewards: Box<Account<'info, NFTRewards>>,

    #[account(mut)]
    pub mint: Box<InterfaceAccount<'info, Mint>>,

    #[account(mut)]
    pub from_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(
        init_if_needed,
        payer = signer,
        associated_token::mint = mint,
        associated_token::authority = signer,
    )]
    pub to_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    pub token_program: Program<'info, Token2022>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

pub fn claim_stake_rewards(
    ctx: Context<ClaimStakeRewards>,
    args: ClaimStakeRewardsArgs,
) -> Result<()> {
    if ctx.accounts.signer.key() != ctx.accounts.to_ata.owner.key() {
        return Err(TriadProtocolError::InvalidOwnerAuthority.into());
    }

    if ctx.accounts.mint.key().to_string() != TTRIAD_MINT {
        return Err(TriadProtocolError::InvalidMint.into());
    }

    let stake_vault = &mut ctx.accounts.stake_vault;
    let stake = &mut ctx.accounts.stake;
    let nft_rewards = &mut ctx.accounts.nft_rewards;

    if nft_rewards.weekly_rewards_paid[args.week as usize] {
        return Err(TriadProtocolError::InvalidStakeVaultWeek.into());
    }

    if stake.authority != *ctx.accounts.signer.key
        || stake.to_account_info().key() != nft_rewards.stake
    {
        return Err(TriadProtocolError::InvalidOwnerAuthority.into());
    }

    if args.week > stake_vault.week || args.week > 5 {
        return Err(TriadProtocolError::InvalidStakeVaultWeek.into());
    }

    let week = args.week as usize;

    let start = week * 7;
    let end = if week == 4 { 30 } else { start + 7 };

    let rewards: u64 = nft_rewards.daily_rewards[start..end].iter().sum();

    nft_rewards.weekly_rewards_paid[week] = true;

    let signer: &[&[&[u8]]] = &[&[
        b"stake_vault",
        ctx.accounts.stake_vault.name.as_bytes(),
        &[ctx.accounts.stake_vault.bump],
    ]];

    let cpi_accounts = TransferChecked {
        from: ctx.accounts.from_ata.to_account_info(),
        mint: ctx.accounts.mint.to_account_info(),
        to: ctx.accounts.to_ata.to_account_info(),
        authority: ctx.accounts.stake_vault.to_account_info(),
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_context = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);

    transfer_checked(cpi_context, rewards, ctx.accounts.mint.decimals)?;

    Ok(())
}
