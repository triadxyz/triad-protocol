use crate::{
    constants::ADMIN, errors::TriadProtocolError, state::InitializeStakeVaultArgs, StakeVault,
};

use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};

#[derive(Accounts)]
#[instruction(args: InitializeStakeVaultArgs)]
pub struct InitializeStakeVault<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(init, payer = signer, space = StakeVault::SPACE, seeds = [StakeVault::PREFIX_SEED, args.name.as_bytes()], bump)]
    pub stake_vault: Box<Account<'info, StakeVault>>,

    pub mint: Box<Account<'info, Mint>>,

    #[account(
        init,
        seeds = [StakeVault::PREFIX_SEED_VAULT_TOKEN_ACCOUNT, stake_vault.key().as_ref()],
        bump,
        payer = signer,
        token::mint = mint,
        token::authority = stake_vault,
    )]
    pub token_account: Box<Account<'info, TokenAccount>>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

pub fn initialize_stake_vault(
    ctx: Context<InitializeStakeVault>,
    args: InitializeStakeVaultArgs,
) -> Result<()> {
    if ctx.accounts.signer.key.to_string() != ADMIN {
        return Err(TriadProtocolError::Unauthorized.into());
    }

    let stake_vault = &mut ctx.accounts.stake_vault;

    stake_vault.bump = ctx.bumps.stake_vault;
    stake_vault.authority = *ctx.accounts.signer.key;
    stake_vault.init_ts = Clock::get()?.unix_timestamp;
    stake_vault.end_ts = Clock::get()?.unix_timestamp + 30 * 24 * 60 * 60;
    stake_vault.amount = 0;
    stake_vault.name = args.name;

    Ok(())
}
