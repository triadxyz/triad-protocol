use crate::constraints::{is_authority_for_user, is_token_mint_for_vault};
use crate::cpi::TokenTransferCPI;
use crate::errors::TriadProtocolError;
use crate::state::Vault;
use crate::{DepositVaultArgs, User};

use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

#[derive(Accounts)]
#[instruction(args: DepositVaultArgs)]
pub struct Deposit<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut)]
    pub vault: Account<'info, Vault>,

    #[account(
        mut,
        seeds = [User::PREFIX_SEED.as_ref(), signer.key.as_ref()],
        bump,
        constraint = is_authority_for_user(&user, &signer)?,
    )]
    pub user: Account<'info, User>,

    #[account(
        mut,
        seeds = [Vault::PREFIX_SEED_VAULT_TOKEN_ACCOUNT.as_ref(), vault.key().as_ref()],
        bump,
    )]
    pub vault_token_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        token::authority = user.authority,
        token::mint = vault_token_account.mint,
        constraint = is_token_mint_for_vault(&vault_token_account.mint, &user_token_account.mint)?,
    )]
    pub user_token_account: Account<'info, TokenAccount>,

    pub system_program: Program<'info, System>,

    pub token_program: Program<'info, Token>,
}

pub fn deposit<'info>(
    ctx: Context<'_, '_, '_, 'info, Deposit<'info>>,
    args: DepositVaultArgs,
) -> Result<()> {
    let mut user = ctx.accounts.user.clone();
    let mut vault = ctx.accounts.vault.clone();

    if user.authority != *ctx.accounts.signer.key {
        return Err(TriadProtocolError::InvalidAccount.into());
    }

    // if is_long {
    //     user.long_positions = user.long_balance.saturating_add(amount);
    // } else {
    //     user.short_balance = user.short_balance.saturating_add(amount);
    // }

    let transfer = ctx.token_transfer(args.amount);

    if transfer.is_err() {
        msg!("Deposit failed");

        return Err(TriadProtocolError::DepositFailed.into());
    }

    user.total_deposits = user.total_deposits.saturating_add(args.amount);
    user.net_deposits = user.net_deposits.saturating_add(1);
    user.lp_shares = user.lp_shares.saturating_add(args.amount);

    vault.total_deposits = vault.total_deposits.saturating_add(args.amount);
    vault.net_deposits = vault.net_deposits.saturating_add(1);

    msg!("Deposit successful");

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
