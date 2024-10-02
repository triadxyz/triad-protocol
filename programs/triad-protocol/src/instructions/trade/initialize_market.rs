use anchor_lang::prelude::*;
use anchor_spl::token_2022::Token2022;
use anchor_spl::{ associated_token::AssociatedToken, token_interface::{ Mint, TokenAccount } };

use crate::{ state::{ Market, InitializeMarketArgs, FeeVault }, constraints::is_admin };

#[derive(Accounts)]
#[instruction(args: InitializeMarketArgs)]
pub struct InitializeMarket<'info> {
    #[account(mut, constraint = is_admin(&signer)?)]
    pub signer: Signer<'info>,

    #[account(
        init,
        payer = signer,
        space = Market::SPACE,
        seeds = [Market::PREFIX_SEED, &args.market_id.to_le_bytes()],
        bump
    )]
    pub market: Box<Account<'info, Market>>,

    #[account(mut)]
    pub mint: Box<InterfaceAccount<'info, Mint>>,

    #[account(
        init,
        payer = signer,
        space = FeeVault::SPACE,
        seeds = [FeeVault::PREFIX_SEED, &args.market_id.to_le_bytes()],
        bump
    )]
    pub fee_vault: Box<Account<'info, FeeVault>>,

    #[account(
        init,
        payer = signer,
        associated_token::mint = mint,
        associated_token::authority = fee_vault,
        associated_token::token_program = token_program
    )]
    pub fee_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    pub token_program: Program<'info, Token2022>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

pub fn initialize_market(ctx: Context<InitializeMarket>, args: InitializeMarketArgs) -> Result<()> {
    let market = &mut ctx.accounts.market;
    let fee_vault = &mut ctx.accounts.fee_vault;

    fee_vault.set_inner(FeeVault {
        bump: ctx.bumps.fee_vault,
        authority: ctx.accounts.signer.key(),
        market: market.key(),
        deposited: 0,
        withdrawn: 0,
        net_balance: 0,
        project_available: 0,
        project_claimed: 0,
        nft_holders_available: 0,
        nft_holders_claimed: 0,
        market_available: 0,
        market_claimed: 0,
        padding: [0; 60],
    });

    let ts = Clock::get()?.unix_timestamp;

    market.set_inner(Market {
        bump: ctx.bumps.market,
        authority: ctx.accounts.signer.key(),
        market_id: args.market_id,
        name: args.name,
        mint: ctx.accounts.mint.key(),
        ts,
        update_ts: ts,
        fee_vault: fee_vault.key(),
        ..Default::default()
    });

    Ok(())
}
