use crate::{
    constraints::is_mint_for_stake_vault, errors::TriadProtocolError, state::{Stake, StakeTokenArgs, StakeVault}
};
use anchor_lang::prelude::*;
use anchor_spl::token_2022::Token2022;
use anchor_spl::{
    associated_token::AssociatedToken,
    token_interface::{transfer_checked, Mint, TokenAccount, TransferChecked},
};

#[derive(Accounts)]
#[instruction(args: StakeTokenArgs)]
pub struct StakeToken<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut, seeds = [StakeVault::PREFIX_SEED, args.stake_vault.as_bytes()], bump)]
    pub stake_vault: Box<Account<'info, StakeVault>>,

    #[account(init_if_needed, payer = signer, space = Stake::SPACE, seeds = [Stake::PREFIX_SEED, signer.to_account_info().key().as_ref(), mint.to_account_info().key().as_ref()], bump)]
    pub stake: Box<Account<'info, Stake>>,

    #[account(mut, constraint = is_mint_for_stake_vault(&stake_vault, &mint.key())?)]
    pub mint: Box<InterfaceAccount<'info, Mint>>,

    #[account(
        mut, 
        constraint = from_ata.amount >= args.amount && signer.key() == from_ata.owner && from_ata.mint == mint.key(),
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

pub fn stake_token(ctx: Context<StakeToken>, args: StakeTokenArgs) -> Result<()> {
    let mint = &ctx.accounts.mint.to_account_info();
    let stake = &mut ctx.accounts.stake;
    let stake_vault = &mut ctx.accounts.stake_vault;

    if stake_vault.is_locked {
        return Err(TriadProtocolError::StakeVaultLocked.into());
    }

    if stake.authority == Pubkey::default() {
        stake.authority = *ctx.accounts.signer.key;
        stake.init_ts = Clock::get()?.unix_timestamp;
        stake.bump = ctx.bumps.stake;
        stake.mint = *mint.key;
        stake.name = "tTRIAD".to_string();
        stake.stake_vault = stake_vault.key();
    }

    stake.withdraw_ts = 0;
    stake.is_locked = true;
    stake.amount += args.amount;

    stake_vault.token_staked += args.amount;

    let cpi_accounts = TransferChecked {
        from: ctx.accounts.from_ata.to_account_info(),
        mint: ctx.accounts.mint.to_account_info(),
        to: ctx.accounts.to_ata.to_account_info(),
        authority: ctx.accounts.signer.to_account_info(),
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_context = CpiContext::new(cpi_program, cpi_accounts);

    transfer_checked(cpi_context, args.amount, ctx.accounts.mint.decimals)?;

    Ok(())
}
