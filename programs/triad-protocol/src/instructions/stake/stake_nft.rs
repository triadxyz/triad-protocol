use std::str::FromStr;
use crate::{
    constants::{ MYSTERY_BOX_PROGRAM, TRIAD_MYSTERY_BOX },
    errors::TriadProtocolError,
    state::{ StakeNFTArgs, StakeVault },
    StakeV2,
};
use anchor_lang::prelude::*;
use anchor_spl::token_2022::spl_token_2022::extension::BaseStateWithExtensions;
use anchor_spl::token_2022::{
    spl_token_2022::{ extension::PodStateWithExtensions, pod::PodMint },
    Token2022,
};
use anchor_spl::{
    associated_token::AssociatedToken,
    token_interface::{ transfer_checked, Mint, TokenAccount, TransferChecked },
};
use spl_token_metadata_interface::state::TokenMetadata;

#[derive(Accounts)]
#[instruction(args: StakeNFTArgs)]
pub struct StakeNFT<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut, seeds = [StakeVault::PREFIX_SEED, args.stake_vault.as_bytes()], bump)]
    pub stake_vault: Box<Account<'info, StakeVault>>,

    #[account(
        init_if_needed,
        payer = signer,
        space = StakeV2::SPACE,
        seeds = [
            StakeV2::PREFIX_SEED,
            signer.to_account_info().key().as_ref(),
            args.name.as_bytes(),
        ],
        bump
    )]
    pub stake: Box<Account<'info, StakeV2>>,

    #[account(
        mut,
        extensions::metadata_pointer::metadata_address = mint
    )]
    pub mint: Box<InterfaceAccount<'info, Mint>>,

    #[account(
        mut, 
        constraint = from_ata.amount >= 1 && signer.key() == from_ata.owner && from_ata.mint == mint.key(),
    )]
    pub from_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(
        init_if_needed,
        payer = signer,
        associated_token::mint = mint,
        associated_token::authority = stake_vault
    )]
    pub to_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    pub token_program: Program<'info, Token2022>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

pub fn stake_nft(ctx: Context<StakeNFT>, args: StakeNFTArgs) -> Result<()> {
    let mint = &ctx.accounts.mint.to_account_info();
    let buffer = mint.try_borrow_data()?;
    let state = PodStateWithExtensions::<PodMint>::unpack(&buffer)?;
    let token_metadata = state.get_variable_len_extension::<TokenMetadata>()?;

    if token_metadata.update_authority.0 != Pubkey::from_str(TRIAD_MYSTERY_BOX).unwrap() {
        return Err(TriadProtocolError::Unauthorized.into());
    }

    let (mint_seed, _bump) = Pubkey::find_program_address(
        &[b"mint", args.name.as_bytes()],
        &Pubkey::from_str(MYSTERY_BOX_PROGRAM).unwrap()
    );

    if mint_seed != *mint.key {
        return Err(TriadProtocolError::Unauthorized.into());
    }

    let stake = &mut ctx.accounts.stake;
    let stake_vault = &mut ctx.accounts.stake_vault;

    if stake_vault.is_locked {
        return Err(TriadProtocolError::StakeVaultLocked.into());
    }

    stake.bump = ctx.bumps.stake;
    stake.authority = *ctx.accounts.signer.key;
    stake.init_ts = Clock::get()?.unix_timestamp;
    stake.withdraw_ts = 0;
    stake.claimed_ts = 0;
    stake.name = args.name;
    stake.mint = *mint.key;
    stake.boost = false;
    stake.stake_vault = stake_vault.key();
    stake.claimed = 0;
    stake.available = 0;
    stake.amount = 1;

    stake_vault.nft_staked += 1;

    transfer_checked(
        CpiContext::new(ctx.accounts.token_program.to_account_info(), TransferChecked {
            from: ctx.accounts.from_ata.to_account_info(),
            mint: ctx.accounts.mint.to_account_info(),
            to: ctx.accounts.to_ata.to_account_info(),
            authority: ctx.accounts.signer.to_account_info(),
        }),
        1,
        ctx.accounts.mint.decimals
    )?;

    Ok(())
}
