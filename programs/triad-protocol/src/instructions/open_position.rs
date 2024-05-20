use crate::constraints::{is_authority_for_user_position, is_token_mint_for_vault};
use crate::cpi::TokenTransferCPI;
use crate::emit;
use crate::errors::TriadProtocolError;
use crate::state::Vault;
use crate::{OpenPositionArgs, OpenPositionRecord, UserPosition};
use crate::{Position, Ticker};

use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

#[derive(Accounts)]
#[instruction(args: OpenPositionArgs)]
pub struct OpenPosition<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut)]
    pub ticker: Account<'info, Ticker>,

    #[account(mut)]
    pub vault: Account<'info, Vault>,

    #[account(
        mut,
        constraint = is_authority_for_user_position(&user_position, &signer)?,
    )]
    pub user_position: Account<'info, UserPosition>,

    #[account(
        mut,
        seeds = [Vault::PREFIX_SEED_VAULT_TOKEN_ACCOUNT.as_ref(), vault.key().as_ref()],
        bump,
    )]
    pub vault_token_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        token::authority = user_position.authority,
        token::mint = vault_token_account.mint,
        constraint = is_token_mint_for_vault(&vault_token_account.mint, &user_token_account.mint)?,
    )]
    pub user_token_account: Account<'info, TokenAccount>,

    pub system_program: Program<'info, System>,

    pub token_program: Program<'info, Token>,
}

pub fn open_position<'info>(
    ctx: Context<'_, '_, '_, 'info, OpenPosition<'info>>,
    args: OpenPositionArgs,
) -> Result<()> {
    let mut user_position = ctx.accounts.user_position.clone();
    let mut vault = ctx.accounts.vault.clone();

    let transfer = ctx.token_transfer(args.amount, 0);

    if transfer.is_err() {
        msg!("Open position failed");

        return Err(TriadProtocolError::DepositFailed.into());
    }

    let position = Position {
        amount: args.amount,
        entry_price: ctx.accounts.ticker.price,
        ts: Clock::get()?.unix_timestamp,
        is_long: args.is_long,
        ticker: *ctx.accounts.ticker.to_account_info().key,
        is_open: true,
        pnl: 0,
    };

    for i in 0..user_position.positions.len() {
        if !user_position.positions[i].is_open {
            user_position.positions[i] = position;
            break;
        }
    }

    user_position.total_deposited = user_position.total_deposited.saturating_add(args.amount);
    user_position.total_positions = user_position.total_positions.saturating_add(1);
    user_position.lp_share = user_position.lp_share.saturating_add(args.amount);

    if args.is_long {
        vault.long_positions_opened = vault.long_positions_opened.saturating_add(1);
        vault.long_balance = vault.long_balance.saturating_add(args.amount);
    }

    if !args.is_long {
        vault.short_positions_opened = vault.short_positions_opened.saturating_add(1);
        vault.short_balance = vault.short_balance.saturating_add(args.amount);
    }

    vault.total_deposited = vault.total_deposited.saturating_add(args.amount);
    vault.net_deposits = vault.net_deposits.saturating_add(1);

    emit!(OpenPositionRecord {
        ticker: position.ticker,
        entry_price: position.entry_price,
        ts: position.ts,
        user: *ctx.accounts.user_position.to_account_info().key,
        amount: args.amount,
        is_long: args.is_long,
    });

    msg!("Deposit successful");

    Ok(())
}

impl<'info> TokenTransferCPI for Context<'_, '_, '_, 'info, OpenPosition<'info>> {
    fn token_transfer(&self, amount: u64, _pnl: i64) -> Result<()> {
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
