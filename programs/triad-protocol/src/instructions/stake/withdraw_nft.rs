use crate::constants::ADMIN;
use crate::constraints::is_authority_for_stake;
use crate::NFTRewards;
use crate::{errors::TriadProtocolError, state::Stake, StakeVault, WithdrawNFTArgs};
use anchor_lang::prelude::*;
use anchor_spl::token_2022::Token2022;
use anchor_spl::{
    associated_token::AssociatedToken,
    token_interface::{transfer_checked, Mint, TokenAccount, TransferChecked},
};

#[derive(Accounts)]
#[instruction(args: WithdrawNFTArgs)]
pub struct WithdrawNFT<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut, seeds = [StakeVault::PREFIX_SEED, args.stake_vault.as_bytes()], bump)]
    pub stake_vault: Box<Account<'info, StakeVault>>,

    #[account(mut, close = signer, constraint = is_authority_for_stake(&stake, &signer)?)]
    pub stake: Box<Account<'info, Stake>>,

    /// CHECK: Just Admin account the recovery the rent
    #[account(mut, constraint = admin.key.to_string() == ADMIN)]
    pub admin: AccountInfo<'info>,

    #[account(mut, close = admin)]
    pub nft_rewards: Account<'info, NFTRewards>,

    #[account(mut)]
    pub mint: Box<InterfaceAccount<'info, Mint>>,

    #[account(mut)]
    pub from_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(
        init_if_needed,
        payer = signer,
        associated_token::mint = mint,
        associated_token::authority = signer,
        constraint = signer.key() == to_ata.owner && to_ata.mint == mint.key()
    )]
    pub to_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    pub token_program: Program<'info, Token2022>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

pub fn withdraw_nft(ctx: Context<WithdrawNFT>, _args: WithdrawNFTArgs) -> Result<()> {
    let mint = &ctx.accounts.mint.to_account_info();
    let stake = &mut ctx.accounts.stake;
    let stake_vault = &mut ctx.accounts.stake_vault;

    if stake.mint != *mint.key {
        return Err(TriadProtocolError::Unauthorized.into());
    }

    if stake.withdraw_ts > Clock::get()?.unix_timestamp {
        return Err(TriadProtocolError::StakeLocked.into());
    }

    stake_vault.nft_staked -= 1;

    let signer: &[&[&[u8]]] = &[&[
        b"stake_vault",
        stake_vault.name.as_bytes(),
        &[stake_vault.bump],
    ]];

    let cpi_accounts = TransferChecked {
        from: ctx.accounts.from_ata.to_account_info().clone(),
        mint: ctx.accounts.mint.to_account_info().clone(),
        to: ctx.accounts.to_ata.to_account_info().clone(),
        authority: stake_vault.to_account_info(),
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_context = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);

    transfer_checked(cpi_context, 1, ctx.accounts.mint.decimals)?;

    Ok(())
}
