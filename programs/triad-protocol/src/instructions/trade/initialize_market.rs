use anchor_lang::prelude::*;
use anchor_spl::token_2022::Token2022;
use anchor_spl::{ associated_token::AssociatedToken, token_interface::{ Mint, TokenAccount } };

use crate::{ state::trade::{ Market, CreateMarketArgs }, constants::TRD_MINT };

#[derive(Accounts)]
#[instruction(args: CreateMarketArgs)]
pub struct InitializeMarket<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        init,
        payer = signer,
        space = Market::SPACE,
        seeds = [Market::PREFIX_SEED, args.name.as_bytes()],
        bump
    )]
    pub market: Account<'info, Market>,

    #[account(
        mut,
        constraint = mint.key().to_string().eq(TRD_MINT)
    )]
    pub mint: InterfaceAccount<'info, Mint>,

    #[account(
        init,
        payer = signer,
        associated_token::mint = mint,
        associated_token::authority = market
    )]
    pub vault_token_account: InterfaceAccount<'info, TokenAccount>,

    /// CHECK: Just a Fee authority
    pub fee_authority: AccountInfo<'info>,

    #[account(
        init_if_needed,
        payer = signer,
        associated_token::mint = mint,
        associated_token::authority = fee_authority
    )]
    pub fee_ata: InterfaceAccount<'info, TokenAccount>,

    pub token_program: Program<'info, Token2022>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

pub fn initialize_market(
    ctx: Context<InitializeMarket>,
    args: CreateMarketArgs,
    market_id: u64
) -> Result<()> {
    let market = &mut ctx.accounts.market;

    market.set_inner(Market {
        bump: ctx.bumps.market,
        authority: ctx.accounts.signer.key(),
        market_id,
        name: args.name,
        vault_token_account: ctx.accounts.vault_token_account.key(),
        mint: ctx.accounts.mint.key(),
        last_update_ts: Clock::get()?.unix_timestamp,
        fee_authority: ctx.accounts.fee_authority.key(),
        fee_ata: ctx.accounts.fee_ata.key(),
        ..Default::default()
    });

    Ok(())
}
