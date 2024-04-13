use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

use crate::constraints::{
    is_authority_for_vault_depositor, is_depositor_for_vault, is_token_mint_for_vault,
};
use crate::cpi::TokenTransferCPI;
use crate::declare_vault_seeds;
use crate::errors::TriadProtocolError;

use crate::{state::Vault, VaultDepositor};

#[derive(Accounts)]
#[instruction(amount: u64)]
pub struct Withdraw<'info> {
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

pub fn withdraw<'info>(
    ctx: Context<'_, '_, '_, 'info, Withdraw<'info>>,
    amount: u64,
) -> Result<()> {
    let vault_depositor = &mut ctx.accounts.vault_depositor;
    let vault = &mut ctx.accounts.vault;

    if vault_depositor.authority != *ctx.accounts.signer.key {
        return Err(TriadProtocolError::InvalidAccount.into());
    }

    if amount > vault_depositor.lp_shares {
        return Err(TriadProtocolError::InvalidWithdrawAmount.into());
    }

    vault_depositor.total_withdraws = vault_depositor.total_withdraws.saturating_add(amount);
    vault_depositor.net_withdraws = vault_depositor.net_withdraws.saturating_add(1);
    vault_depositor.lp_shares = vault_depositor.lp_shares.saturating_sub(amount);

    vault.total_withdraws = vault.total_withdraws.saturating_add(amount);
    vault.net_withdraws = vault.net_withdraws.saturating_add(1);

    ctx.token_transfer(amount)?;

    Ok(())
}

impl<'info> TokenTransferCPI for Context<'_, '_, '_, 'info, Withdraw<'info>> {
    fn token_transfer(&self, amount: u64) -> Result<()> {
        declare_vault_seeds!(&self.accounts.vault, seeds);

        let cpi_accounts = Transfer {
            from: self.accounts.vault_token_account.to_account_info().clone(),
            to: self.accounts.user_token_account.to_account_info().clone(),
            authority: self.accounts.vault.to_account_info().clone(),
        };
        let token_program = self.accounts.token_program.to_account_info().clone();
        let cpi_context = CpiContext::new_with_signer(token_program, cpi_accounts, seeds);

        token::transfer(cpi_context, amount)?;

        Ok(())
    }
}
