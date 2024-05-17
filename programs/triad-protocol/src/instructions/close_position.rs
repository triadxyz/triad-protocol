use crate::constraints::{is_authority_for_user, is_token_mint_for_vault};
use crate::cpi::TokenTransferCPI;
use crate::errors::TriadProtocolError;
use crate::state::Vault;
use crate::{declare_vault_seeds, ClosePositionArgs, User};

use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

#[derive(Accounts)]
#[instruction(args: ClosePositionArgs)]
pub struct ClosePosition<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut)]
    pub vault: Account<'info, Vault>,

    #[account(
        mut,
        constraint = is_authority_for_user(&user, &signer)?,
    )]
    pub user: Account<'info, User>,

    #[account(mut)]
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

pub fn close_position<'info>(
    ctx: Context<'_, '_, '_, 'info, ClosePosition<'info>>,
    args: ClosePositionArgs,
) -> Result<()> {
    let mut user = ctx.accounts.user.clone();
    let mut vault = ctx.accounts.vault.clone();

    if user.authority != *ctx.accounts.signer.key {
        return Err(TriadProtocolError::InvalidAccount.into());
    }

    if args.amount > user.lp_shares {
        return Err(TriadProtocolError::InvalidWithdrawAmount.into());
    }

    let transfer = ctx.token_transfer(args.amount);

    if transfer.is_err() {
        msg!("Close Position failed");

        return Err(TriadProtocolError::InvalidWithdrawAmount.into());
    }

    user.total_withdraws = user.total_withdraws.saturating_add(args.amount);
    user.net_withdraws = user.net_withdraws.saturating_add(1);
    user.lp_shares = user.lp_shares.saturating_sub(args.amount);

    vault.total_withdraws = vault.total_withdraws.saturating_add(args.amount);
    vault.net_withdraws = vault.net_withdraws.saturating_add(1);

    if args.is_long {
        vault.long_balance = vault.long_balance.saturating_sub(args.amount);
        vault.long_positions_opened = vault.long_positions_opened.saturating_add(1);

        // let mut new_long_positions = user.long_positions.clone();

        // for position in &mut new_long_positions {
        //     if position.pubkey == args.pubkey {
        //         *position = Position {
        //             is_open: false,
        //             pnl: 1,
        //             ..position.clone()
        //         };
        //     }
        // }

        // user.long_positions = new_long_positions;
    } else {
        vault.short_balance = vault.short_balance.saturating_sub(args.amount);
        vault.short_positions_opened = vault.short_positions_opened.saturating_add(1);

        // let mut new_short_positions = user.short_positions.clone();

        // for position in &mut new_short_positions {
        //     if position.pubkey == args.pubkey {
        //         *position = Position {
        //             is_open: false,
        //             pnl: 1,
        //             ..position.clone()
        //         };
        //     }
        // }

        // user.short_positions = new_short_positions;
    }

    Ok(())
}

impl<'info> TokenTransferCPI for Context<'_, '_, '_, 'info, ClosePosition<'info>> {
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
