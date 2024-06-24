use crate::{errors::TriadProtocolError, state::Stake, StakeVault, WithdrawNFTArgs};
use anchor_lang::prelude::*;
use anchor_spl::token_2022::Token2022;
use anchor_spl::{
    associated_token::AssociatedToken,
    token_interface::{transfer_checked, Mint, TokenAccount, TransferChecked},
};

#[derive(Accounts)]
#[instruction(args: WithdrawNFTArgs)]
pub struct WithdrawNFT<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut, seeds = [StakeVault::PREFIX_SEED, args.stake_vault.as_bytes()], bump)]
    pub stake_vault: Box<Account<'info, StakeVault>>,

    #[account(mut, close = signer, seeds = [Stake::PREFIX_SEED, signer.key.as_ref(), mint.key().as_ref()], bump)]
    pub stake: Box<Account<'info, Stake>>,

    #[account(
        mut,
        seeds = [b"mint", args.nft_name.as_bytes()], bump
    )]
    pub mint: InterfaceAccount<'info, Mint>,

    #[account(mut)]
    pub from_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(mut)]
    pub to_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    pub token_program: Program<'info, Token2022>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

pub fn withdraw_nft(ctx: Context<WithdrawNFT>, _args: WithdrawNFTArgs) -> Result<()> {
    if ctx.accounts.signer.key() != ctx.accounts.to_ata.to_account_info().owner.key() {
        return Err(TriadProtocolError::Unauthorized.into());
    }

    if ctx.accounts.stake_vault.is_locked {
        return Err(TriadProtocolError::StakeVaultLocked.into());
    }

    if ctx.accounts.stake.authority != *ctx.accounts.signer.key {
        return Err(TriadProtocolError::Unauthorized.into());
    }

    let mint = &ctx.accounts.mint.to_account_info();
    let stake = &mut ctx.accounts.stake;
    let stake_vault = &mut ctx.accounts.stake_vault;

    if stake.mint != *mint.key {
        return Err(TriadProtocolError::Unauthorized.into());
    }

    if stake.withdraw_ts > Clock::get()?.unix_timestamp {
        return Err(TriadProtocolError::StakeLocked.into());
    }

    stake_vault.amount_users -= 1;

    let cpi_accounts = TransferChecked {
        from: ctx.accounts.from_ata.to_account_info().clone(),
        mint: ctx.accounts.mint.to_account_info().clone(),
        to: ctx.accounts.to_ata.to_account_info().clone(),
        authority: ctx.accounts.signer.to_account_info(),
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_context = CpiContext::new(cpi_program, cpi_accounts);

    transfer_checked(cpi_context, 1, ctx.accounts.mint.decimals)?;

    Ok(())
}
