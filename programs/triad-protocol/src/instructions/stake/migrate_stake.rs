use std::str::FromStr;
use crate::{
    constants::MYSTERY_BOX_PROGRAM, constraints::is_admin, errors::TriadProtocolError, state::{MigrateStakeArgs, Stake, StakeVault}, NFTRewards, StakeV2
};
use anchor_lang::prelude::*;
use anchor_spl::token_2022::{close_account, CloseAccount, Token2022};
use anchor_spl::{
    associated_token::AssociatedToken,
    token_interface::{transfer_checked, Mint, TokenAccount, TransferChecked},
};

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

    #[account(
        mut,
        extensions::metadata_pointer::metadata_address = mint
    )]
    pub mint: Box<InterfaceAccount<'info, Mint>>,

    #[account(mut, close = signer)]
    pub nft_rewards: Account<'info, NFTRewards>,

    #[account(
        mut, 
        constraint = from_ata.amount >= 1 && from_ata.mint == mint.key(),
    )]
    pub from_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(
        init_if_needed,
        payer = signer,
        associated_token::mint = mint,
        associated_token::authority = stake_vault,
    )]
    pub to_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    pub token_program: Program<'info, Token2022>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

pub fn migrate_stake(ctx: Context<MigrateStake>, args: MigrateStakeArgs) -> Result<()> {
   if !is_admin(&ctx.accounts.signer)? {
      return Err(TriadProtocolError::Unauthorized.into());
   }

    let mint = &ctx.accounts.mint.to_account_info();

    let (mint_seed, _bump) = Pubkey::find_program_address(
        &[b"mint", args.name.as_bytes()],
        &Pubkey::from_str(MYSTERY_BOX_PROGRAM).unwrap(),
    );

    if mint_seed != *mint.key {
        return Err(TriadProtocolError::Unauthorized.into());
    }

    let stake_v2 = &mut ctx.accounts.stake_v2;
    let stake_v1 = &mut ctx.accounts.stake_v1;
    let stake_vault = &mut ctx.accounts.stake_vault;
    let nft_rewards = &mut ctx.accounts.nft_rewards;
    
    stake_v2.bump = ctx.bumps.stake_v2;
    stake_v2.authority = stake_v1.authority;
    stake_v2.init_ts = Clock::get()?.unix_timestamp;
    stake_v2.withdraw_ts = 0;
    stake_v2.claimed_ts = 0;
    stake_v2.name = stake_v1.name.clone();
    stake_v2.boost = true;
    stake_v2.stake_vault = stake_v1.stake_vault;
    stake_v2.amount = 1;
    stake_v2.claimed = 0;

    let mut week = 0;
    let mut available = 0;

    for i in 0..5 {
        if nft_rewards.weekly_rewards_paid[i] {
            week = i;
            continue;
        }

        let start = week * 7;
        let end = if week == 4 { 30 } else { start + 7 };

        let rewards: u64 = nft_rewards.daily_rewards[start..end].iter().sum();

        available += rewards;
    }
    
    stake_v2.available = available;

    let signer: &[&[&[u8]]] = &[&[
        b"stake_vault",
        stake_vault.name.as_bytes(),
        &[stake_vault.bump],
    ]];

    transfer_checked( CpiContext::new_with_signer(
        ctx.accounts.token_program.to_account_info(), 
        TransferChecked {
        from: ctx.accounts.from_ata.to_account_info(),
        mint: ctx.accounts.mint.to_account_info(),
        to: ctx.accounts.to_ata.to_account_info(),
        authority: stake_vault.to_account_info(),
    }, signer), 1, ctx.accounts.mint.decimals)?;

    close_account(CpiContext::new_with_signer(
        ctx.accounts.token_program.to_account_info(),
        CloseAccount {
            account: ctx.accounts.from_ata.to_account_info(),
            destination: ctx.accounts.signer.to_account_info(),
            authority: stake_vault.to_account_info(),
        },
        signer,
    ))?;

    Ok(())
}
