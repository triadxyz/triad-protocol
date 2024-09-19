use anchor_lang::prelude::*;
use anchor_spl::token_2022::Token2022;
use anchor_spl::token_interface::Mint;

use crate::{
    errors::TriadProtocolError,
    state::{ StakeV2, User, StakeVault },
    constraints::{ is_authority_for_stake, is_mint_for_stake },
};

#[derive(Accounts)]
pub struct RequestWithdrawStake<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut)]
    pub stake_vault: Box<Account<'info, StakeVault>>,

    #[account(mut, constraint = user.authority == stake.authority)]
    pub user: Box<Account<'info, User>>,

    #[account(mut, constraint = is_authority_for_stake(&stake, &signer)?)]
    pub stake: Box<Account<'info, StakeV2>>,

    #[account(mut, constraint = is_mint_for_stake(&stake, &mint.key())?)]
    pub mint: Box<InterfaceAccount<'info, Mint>>,

    pub token_program: Program<'info, Token2022>,
    pub system_program: Program<'info, System>,
}

pub fn request_withdraw_stake(ctx: Context<RequestWithdrawStake>) -> Result<()> {
    let stake: &mut Box<Account<StakeV2>> = &mut ctx.accounts.stake;
    let user: &mut Box<Account<User>> = &mut ctx.accounts.user;
    let stake_vault: &mut Box<Account<StakeVault>> = &mut ctx.accounts.stake_vault;

    if stake.withdraw_ts != 0 {
        return Err(TriadProtocolError::Unauthorized.into());
    }

    let mut days = 3;

    if stake.mint.eq(&stake_vault.token_mint) {
        days = 7;

        user.staked = user.staked.checked_sub(stake.amount).unwrap();
    }

    stake.withdraw_ts = Clock::get()?.unix_timestamp + days * 24 * 60 * 60;

    Ok(())
}
