use crate::StakeV2;
use crate::{ constraints::{ is_authority_for_stake, is_ttriad_mint }, state::StakeVault };
use anchor_lang::prelude::*;
use anchor_spl::token_2022::{ transfer_checked, Token2022, TransferChecked };
use anchor_spl::{ associated_token::AssociatedToken, token_interface::{ Mint, TokenAccount } };

#[derive(Accounts)]
pub struct ClaimStake<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut)]
    pub stake_vault: Box<Account<'info, StakeVault>>,

    #[account(mut, constraint = is_authority_for_stake(&stake, &signer)?)]
    pub stake: Box<Account<'info, StakeV2>>,

    #[account(mut, constraint = is_ttriad_mint(&mint.key())?)]
    pub mint: Box<InterfaceAccount<'info, Mint>>,

    #[account(mut)]
    pub from_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(
        init_if_needed,
        payer = signer,
        constraint = to_ata.owner == *signer.key && to_ata.mint == mint.key(),
        associated_token::mint = mint,
        associated_token::authority = signer
    )]
    pub to_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    pub token_program: Program<'info, Token2022>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

pub fn claim_stake(ctx: Context<ClaimStake>) -> Result<()> {
    let stake_vault = &mut ctx.accounts.stake_vault;
    let stake = &mut ctx.accounts.stake;

    let signer: &[&[&[u8]]] = &[
        &[b"stake_vault", stake_vault.name.as_bytes(), &[stake_vault.bump]],
    ];

    let cpi_context = CpiContext::new_with_signer(
        ctx.accounts.token_program.to_account_info(),
        TransferChecked {
            from: ctx.accounts.from_ata.to_account_info(),
            mint: ctx.accounts.mint.to_account_info(),
            to: ctx.accounts.to_ata.to_account_info(),
            authority: stake_vault.to_account_info(),
        },
        signer
    );

    let rewards = stake.available;

    transfer_checked(cpi_context, rewards, ctx.accounts.mint.decimals)?;

    stake_vault.amount -= rewards;
    stake_vault.amount_paid += rewards;

    stake.claimed += rewards;
    stake.available = 0;

    Ok(())
}
