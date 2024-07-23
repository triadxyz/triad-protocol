use crate::constraints::{is_authority_for_user_position, is_token_mint_for_vault};
use crate::errors::TriadProtocolError;
use crate::events::ClosePositionRecord;
use crate::state::Vault;
use crate::{ClosePositionArgs, Position, Ticker, UserPosition};
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

pub fn close_position(ctx: Context<ClosePosition>, args: ClosePositionArgs) -> Result<()> {
    let user_position_cloned = ctx.accounts.user_position.clone();

    let current_pubkey_position = user_position_cloned.positions[args.position_index as usize];

    if current_pubkey_position.amount == 0 {
        return Err(TriadProtocolError::InvalidPosition.into());
    }

    let pnl = (ctx.accounts.ticker.price - current_pubkey_position.entry_price)
        * current_pubkey_position.amount;

    let new_amount = current_pubkey_position.amount + pnl;

    let seeds: &[&[&[u8]]] = &[&[
        b"vault",
        ctx.accounts.vault.ticker_address.as_ref(),
        &[ctx.accounts.vault.bump],
    ]];

    let transfer = token::transfer(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.vault_token_account.to_account_info(),
                to: ctx.accounts.user_token_account.to_account_info(),
                authority: ctx.accounts.vault.to_account_info(),
            },
            seeds,
        ),
        new_amount - (new_amount * 5 / 1000),
    );

    if transfer.is_err() {
        return Err(TriadProtocolError::InvalidWithdrawAmount.into());
    }

    let vault = &mut ctx.accounts.vault;

    if current_pubkey_position.is_long {
        vault.long_balance -= current_pubkey_position.amount;
        vault.long_positions_opened -= 1;
    } else {
        vault.short_balance -= current_pubkey_position.amount;
        vault.short_positions_opened -= 1;
    }

    let user_position = &mut ctx.accounts.user_position;

    vault.total_withdrawn += current_pubkey_position.amount;
    vault.net_withdraws += 1;

    user_position.total_withdrawn += current_pubkey_position.amount;

    user_position.lp_share -= current_pubkey_position.amount;

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
        user: user_position.authority,
        amount: current_pubkey_position.amount,
        is_long: current_pubkey_position.is_long,
    });

    Ok(())
}
