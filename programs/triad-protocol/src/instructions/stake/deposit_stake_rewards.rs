use crate::{
    errors::TriadProtocolError,
    state::{DepositStakeRewardsArgs, StakeVault},
};
use anchor_lang::prelude::*;
use anchor_spl::token_2022::Token2022;
use anchor_spl::{
    associated_token::AssociatedToken,
    token_interface::{transfer_checked, Mint, TokenAccount, TransferChecked},
};

#[derive(Accounts)]
#[instruction(args: DepositStakeRewardsArgs)]
pub struct DepositStakeRewards<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut, seeds = [StakeVault::PREFIX_SEED, args.stake_vault.as_bytes()], bump)]
    pub stake_vault: Box<Account<'info, StakeVault>>,

    #[account(
        mut
    )]
    pub mint: Box<InterfaceAccount<'info, Mint>>,

    #[account(
        mut, 
        constraint = from_ata.amount >= args.amount,
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

pub fn deposit_stake_rewards(ctx: Context<DepositStakeRewards>, args: DepositStakeRewardsArgs) -> Result<()> {
    if ctx.accounts.signer.key() != ctx.accounts.from_ata.owner.key() {
        return Err(TriadProtocolError::InvalidOwnerAuthority.into());
    }

    let stake_vault = &mut ctx.accounts.stake_vault;

    if stake_vault.authority != *ctx.accounts.signer.key {
        return Err(TriadProtocolError::InvalidOwnerAuthority.into());
    }

    let cpi_accounts = TransferChecked {
        from: ctx.accounts.from_ata.to_account_info(),
        mint: ctx.accounts.mint.to_account_info(),
        to: ctx.accounts.to_ata.to_account_info(),
        authority: ctx.accounts.signer.to_account_info(),
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_context = CpiContext::new(cpi_program, cpi_accounts);

    transfer_checked(cpi_context, args.amount, ctx.accounts.mint.decimals)?;

    stake_vault.amount += args.amount;

    Ok(())
}
