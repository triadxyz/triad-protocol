use crate::errors::TriadProtocolError;
use crate::state::Vault;
use crate::{ Position, Ticker, UserPosition };
use anchor_lang::prelude::*;
use anchor_spl::token::{ self, Token, TokenAccount, Transfer };

#[derive(Accounts)]
#[instruction(position_index: u8)]
pub struct WithdrawV1<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut)]
    pub ticker: Account<'info, Ticker>,

    #[account(mut)]
    pub vault: Account<'info, Vault>,

    #[account(
        mut,
        constraint = user_position.authority == signer.key(),
    )]
    pub user_position: Account<'info, UserPosition>,

    #[account(mut)]
    pub vault_token_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        token::authority = user_position.authority,
        token::mint = vault_token_account.mint,
    )]
    pub user_token_account: Account<'info, TokenAccount>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

pub fn withdraw_v1(ctx: Context<WithdrawV1>, position_index: u8) -> Result<()> {
    let user_position_cloned = ctx.accounts.user_position.clone();

    let current_pubkey_position = user_position_cloned.positions[position_index as usize];

    if current_pubkey_position.amount == 0 {
        return Err(TriadProtocolError::InvalidPosition.into());
    }

    let pnl =
        (ctx.accounts.ticker.price - current_pubkey_position.entry_price) *
        current_pubkey_position.amount;

    let new_amount = current_pubkey_position.amount + pnl;

    let seeds: &[&[&[u8]]] = &[
        &[b"vault", ctx.accounts.vault.ticker_address.as_ref(), &[ctx.accounts.vault.bump]],
    ];

    let transfer = token::transfer(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.vault_token_account.to_account_info(),
                to: ctx.accounts.user_token_account.to_account_info(),
                authority: ctx.accounts.vault.to_account_info(),
            },
            seeds
        ),
        new_amount - (new_amount * 10) / 1000
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

    user_position.positions[position_index as usize] = Position {
        amount: 0,
        entry_price: 0,
        ts: 0,
        is_long: false,
        is_open: false,
        pnl: 0,
    };

    Ok(())
}
