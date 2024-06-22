use crate::{
    errors::TriadProtocolError,
    state::{Stake, StakeNFTArgs},
};
use anchor_lang::prelude::*;
use anchor_spl::token_2022::spl_token_2022::extension::BaseStateWithExtensions;
use anchor_spl::token_2022::{
    spl_token_2022::{extension::PodStateWithExtensions, pod::PodMint},
    Token2022,
};
use anchor_spl::{
    associated_token::AssociatedToken,
    token_interface::{Mint, TokenAccount},
};
use spl_token_metadata_interface::state::TokenMetadata;

#[derive(Accounts)]
#[instruction(args: StakeNFTArgs)]
pub struct StakeNFT<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(init, payer = signer, space = Stake::SPACE, seeds = [Stake::PREFIX_SEED, payer_ata.key().as_ref()], bump)]
    pub stake: Box<Account<'info, Stake>>,

    #[account(
        mut,
        extensions::metadata_pointer::metadata_address = mint_account,
    )]
    pub mint_account: InterfaceAccount<'info, Mint>,

    #[account(mut)]
    pub payer_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    pub token_program: Program<'info, Token2022>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

pub fn stake_nft(ctx: Context<StakeNFT>, _args: StakeNFTArgs) -> Result<()> {
    if ctx.accounts.signer.key() != ctx.accounts.payer_ata.to_account_info().owner.key() {
        return Err(TriadProtocolError::Unauthorized.into());
    }

    let mint = &ctx.accounts.mint_account.to_account_info();
    let buffer = mint.try_borrow_data()?;
    let state = PodStateWithExtensions::<PodMint>::unpack(&buffer)?;

    let token_metadata = state.get_variable_len_extension::<TokenMetadata>()?;

    msg!("Token metadata: {:?}", token_metadata);

    Ok(())
}
