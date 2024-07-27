use crate::constraints::is_authority_for_stake;
use crate::StakeV2;
use crate::{errors::TriadProtocolError, StakeVault};
use anchor_lang::prelude::*;
use anchor_spl::token_2022::Token2022;
use anchor_spl::token_interface::Mint;

#[derive(Accounts)]
pub struct RequestWithdrawStake<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut)]
    pub stake_vault: Box<Account<'info, StakeVault>>,

    #[account(mut, constraint = is_authority_for_stake(&stake, &signer)?)]
    pub stake: Box<Account<'info, StakeV2>>,

    #[account(mut)]
    pub mint: Box<InterfaceAccount<'info, Mint>>,

    pub token_program: Program<'info, Token2022>,
    pub system_program: Program<'info, System>,
}

pub fn request_withdraw_stake(ctx: Context<RequestWithdrawStake>) -> Result<()> {
    let mint = &ctx.accounts.mint.to_account_info();
    let stake = &mut ctx.accounts.stake;

    if stake.withdraw_ts != 0 || stake.mint != *mint.key {
        return Err(TriadProtocolError::Unauthorized.into());
    }

    stake.withdraw_ts = Clock::get()?.unix_timestamp + 3 * 24 * 60 * 60;

    Ok(())
}
