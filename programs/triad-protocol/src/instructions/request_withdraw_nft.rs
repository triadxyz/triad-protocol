use crate::{errors::TriadProtocolError, state::Stake, RequestWithdrawNFTArgs, StakeVault};
use anchor_lang::prelude::*;
use anchor_spl::token_2022::Token2022;
use anchor_spl::{associated_token::AssociatedToken, token_interface::Mint};

#[derive(Accounts)]
#[instruction(args: RequestWithdrawNFTArgs)]
pub struct RequestWithdrawNFT<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut, seeds = [StakeVault::PREFIX_SEED, args.stake_vault.as_bytes()], bump)]
    pub stake_vault: Box<Account<'info, StakeVault>>,

    #[account(mut, seeds = [Stake::PREFIX_SEED, args.nft_name.as_ref()], bump)]
    pub stake: Box<Account<'info, Stake>>,

    #[account(mut)]
    pub mint: Box<InterfaceAccount<'info, Mint>>,

    pub token_program: Program<'info, Token2022>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

pub fn request_withdraw_nft(
    ctx: Context<RequestWithdrawNFT>,
    _args: RequestWithdrawNFTArgs,
) -> Result<()> {
    if ctx.accounts.stake.authority != *ctx.accounts.signer.key {
        return Err(TriadProtocolError::Unauthorized.into());
    }

    if ctx.accounts.stake_vault.is_locked {
        return Err(TriadProtocolError::StakeVaultLocked.into());
    }

    let mint = &ctx.accounts.mint.to_account_info();
    let stake = &mut ctx.accounts.stake;

    if stake.mint != *mint.key {
        return Err(TriadProtocolError::Unauthorized.into());
    }

    if stake.withdraw_ts != 0 {
        return Err(TriadProtocolError::Unauthorized.into());
    }

    stake.withdraw_ts = Clock::get()?.unix_timestamp + 3 * 24 * 60 * 60;

    Ok(())
}
