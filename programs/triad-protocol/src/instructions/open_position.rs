use crate::constraints::{ is_authority_for_user_position, is_token_mint_for_vault };
use crate::errors::TriadProtocolError;
use crate::events::OpenPositionRecord;
use crate::state::Vault;
use crate::{ OpenPositionArgs, UserPosition };
use crate::{ Position, Ticker };

use anchor_lang::prelude::*;
use anchor_spl::token::{ self, Token, TokenAccount, Transfer };

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
        seeds = [Vault::PREFIX_SEED_VAULT_TOKEN_ACCOUNT, vault.key().as_ref()],
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

pub fn open_position(ctx: Context<OpenPosition>, args: OpenPositionArgs) -> Result<()> {
    let transfer = token::transfer(
        CpiContext::new(ctx.accounts.token_program.to_account_info(), Transfer {
            from: ctx.accounts.user_token_account.to_account_info(),
            to: ctx.accounts.vault_token_account.to_account_info(),
            authority: ctx.accounts.signer.to_account_info(),
        }),
        args.amount
    );

    if transfer.is_err() {
        return Err(TriadProtocolError::DepositFailed.into());
    }

    let user_position = &mut ctx.accounts.user_position;
    let vault = &mut ctx.accounts.vault;

    let position = Position {
        amount: args.amount,
        entry_price: ctx.accounts.ticker.price,
        ts: Clock::get()?.unix_timestamp,
        is_long: args.is_long,
        is_open: true,
        pnl: 0,
    };

    let added_new_position = &mut false;

    for i in 0..user_position.positions.len() {
        if !user_position.positions[i].is_open {
            *added_new_position = true;
            user_position.positions[i] = position;
            break;
        }
    }

    if !*added_new_position {
        return Err(TriadProtocolError::InvalidTickerPosition.into());
    }

    user_position.total_deposited += args.amount;
    user_position.total_positions += 1;
    user_position.lp_share += args.amount;

    if args.is_long {
        vault.long_positions_opened += 1;
        vault.long_balance += args.amount;
    } else {
        vault.short_positions_opened += 1;
        vault.short_balance += args.amount;
    }

    vault.total_deposited += args.amount;
    vault.net_deposits += 1;

    emit!(OpenPositionRecord {
        ticker: vault.ticker_address,
        entry_price: position.entry_price,
        ts: position.ts,
        user: user_position.authority,
        amount: args.amount,
        is_long: args.is_long,
    });

    Ok(())
}
