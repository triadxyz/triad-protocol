use crate::constraints::{is_authority_for_user_position, is_token_mint_for_vault};
use crate::cpi::TokenTransferCPI;
use crate::errors::TriadProtocolError;
use crate::state::Vault;
use crate::{ClosePositionArgs, ClosePositionRecord, Position, Ticker, UserPosition};

use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

#[derive(Accounts)]
#[instruction(args: ClosePositionArgs)]
pub struct ClosePosition<'info> {
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

    #[account(mut)]
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

pub fn close_position<'info>(
    ctx: Context<'_, '_, '_, 'info, ClosePosition<'info>>,
    args: ClosePositionArgs,
) -> Result<()> {
    if ctx.accounts.user_position.authority != *ctx.accounts.signer.key {
        return Err(TriadProtocolError::InvalidAccount.into());
    }

    let user_position_cloned = ctx.accounts.user_position.clone();

    let current_pubkey_position = user_position_cloned.positions[args.position_index as usize];

    if current_pubkey_position.amount == 0 {
        return Err(TriadProtocolError::InvalidPosition.into());
    }

    let pnl = (ctx.accounts.ticker.price - current_pubkey_position.entry_price)
        * current_pubkey_position.amount;

    let new_amount = current_pubkey_position.amount + pnl;

    let amount_sub_fee = new_amount - (new_amount * 5 / 100);

    msg!("new_amount: {}", new_amount);
    msg!("Amount sub fee: {}", amount_sub_fee);

    let transfer = ctx.token_transfer(amount_sub_fee);

    if transfer.is_err() {
        msg!("Close Position failed");

        return Err(TriadProtocolError::InvalidWithdrawAmount.into());
    }

    let vault: &mut Account<'info, Vault> = &mut ctx.accounts.vault;

    if current_pubkey_position.is_long {
        vault.long_balance = vault
            .long_balance
            .saturating_sub(current_pubkey_position.amount);
        vault.long_positions_opened = vault.long_positions_opened.saturating_sub(1);
    } else {
        vault.short_balance = vault
            .short_balance
            .saturating_sub(current_pubkey_position.amount);
        vault.short_positions_opened = vault.short_positions_opened.saturating_sub(1);
    }

    let user_position = &mut ctx.accounts.user_position;

    user_position.total_withdrawn = user_position
        .total_withdrawn
        .saturating_add(current_pubkey_position.amount);
    user_position.lp_share = user_position
        .lp_share
        .saturating_sub(current_pubkey_position.amount);

    user_position.positions[args.position_index as usize] = Position {
        amount: 0,
        entry_price: 0,
        ts: 0,
        is_long: false,
        is_open: false,
        pnl: 0,
    };

    emit!(ClosePositionRecord {
        ticker: ctx.accounts.vault.ticker_address,
        close_price: ctx.accounts.ticker.price,
        ts: Clock::get()?.unix_timestamp,
        pnl: ctx.accounts.ticker.price as i64 - current_pubkey_position.entry_price as i64,
        user: *ctx.accounts.user_position.to_account_info().key,
        amount: current_pubkey_position.amount,
        is_long: current_pubkey_position.is_long,
    });

    Ok(())
}

impl<'info> TokenTransferCPI for Context<'_, '_, '_, 'info, ClosePosition<'info>> {
    fn token_transfer(&self, amount: u64) -> Result<()> {
        let ticker_key = self.accounts.vault.ticker_address.as_ref();
        let bump_bytes = &[self.accounts.vault.bump];

        let seeds: &[&[&[u8]]] = &[&[b"vault", ticker_key, bump_bytes]];

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
