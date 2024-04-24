use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

use crate::constraints::{
    is_authority_for_vault_depositor, is_depositor_for_vault, is_token_mint_for_vault,
};
use crate::cpi::TokenTransferCPI;
use crate::errors::TriadProtocolError;

use crate::{state::Vault, VaultDepositor};

#[derive(Accounts)]
#[instruction(amount: u64, is_long: bool)]
pub struct Deposit<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut, constraint = is_depositor_for_vault(&vault_depositor, &vault.key())?)]
    pub vault: Account<'info, Vault>,

    #[account(
        mut,
        seeds = [Vault::PREFIX_SEED_VAULT_DEPOSITOR.as_ref(), vault.key().as_ref(), signer.key.as_ref()],
        bump,
        constraint = is_authority_for_vault_depositor(&vault_depositor, &signer)?,
    )]
    pub vault_depositor: Account<'info, VaultDepositor>,

    #[account(
        mut,
        seeds = [Vault::PREFIX_SEED_VAULT_TOKEN_ACCOUNT.as_ref(), vault.key().as_ref()],
        bump,
    )]
    pub vault_token_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        token::authority = vault_depositor.authority,
        token::mint = vault_token_account.mint,
        constraint = is_token_mint_for_vault(&vault_token_account.mint, &user_token_account.mint)?,
    )]
    pub user_token_account: Account<'info, TokenAccount>,

    pub system_program: Program<'info, System>,

    pub token_program: Program<'info, Token>,
}

pub fn deposit<'info>(
    ctx: Context<'_, '_, '_, 'info, Deposit<'info>>,
    amount: u64,
    is_long: bool,
) -> Result<()> {
    let vault_depositor = &mut ctx.accounts.vault_depositor;
    let vault = &mut ctx.accounts.vault;

    if vault_depositor.authority != *ctx.accounts.signer.key {
        return Err(TriadProtocolError::InvalidAccount.into());
    }

    if amount < vault.min_deposit_amount {
        return Err(TriadProtocolError::InvalidDepositAmount.into());
    }

    if amount > vault.max_tokens.saturating_add(vault.total_deposits) {
        return Err(TriadProtocolError::InvalidDepositAmount.into());
    }

    if is_long {
        vault_depositor.long_balance = vault_depositor.long_balance.saturating_add(amount);
    } else {
        vault_depositor.short_balance = vault_depositor.short_balance.saturating_add(amount);
    }

    vault_depositor.total_deposits = vault_depositor.total_deposits.saturating_add(amount);
    vault_depositor.net_deposits = vault_depositor.net_deposits.saturating_add(1);
    vault_depositor.lp_shares = vault_depositor.lp_shares.saturating_add(amount);

    vault.total_deposits = vault.total_deposits.saturating_add(amount);
    vault.net_deposits = vault.net_deposits.saturating_add(1);

    ctx.token_transfer(amount)?;

    Ok(())
}

impl<'info> TokenTransferCPI for Context<'_, '_, '_, 'info, Deposit<'info>> {
    fn token_transfer(&self, amount: u64) -> Result<()> {
        let cpi_accounts = Transfer {
            from: self.accounts.user_token_account.to_account_info().clone(),
            to: self.accounts.vault_token_account.to_account_info().clone(),
            authority: self.accounts.signer.to_account_info().clone(),
        };
        let token_program = self.accounts.token_program.to_account_info().clone();
        let cpi_context = CpiContext::new(token_program, cpi_accounts);

        token::transfer(cpi_context, amount)?;

        Ok(())
    }
}
