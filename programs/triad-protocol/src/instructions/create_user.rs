use anchor_lang::prelude::*;

use crate::{ state::{ User, UserTrade, Order }, CreateUserArgs };

#[derive(Accounts)]
#[instruction(args: CreateUserArgs)]
pub struct CreateUser<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut)]
    pub referral: Box<Account<'info, User>>,

    #[account(
        init,
        payer = signer,
        space = User::SPACE,
        seeds = [User::PREFIX_SEED, signer.key().as_ref()],
        bump
    )]
    pub user: Box<Account<'info, User>>,

    #[account(
        init,
        payer = signer,
        space = UserTrade::SPACE,
        seeds = [UserTrade::PREFIX_SEED, signer.key().as_ref()],
        bump
    )]
    pub user_trade: Box<Account<'info, UserTrade>>,

    pub system_program: Program<'info, System>,
}

pub fn create_user(ctx: Context<CreateUser>, args: CreateUserArgs) -> Result<()> {
    let user: &mut Account<User> = &mut ctx.accounts.user;
    let referral: &mut Account<User> = &mut ctx.accounts.referral;
    let user_trade = &mut ctx.accounts.user_trade;

    user_trade.set_inner(UserTrade {
        bump: ctx.bumps.user_trade,
        authority: ctx.accounts.signer.key(),
        total_deposits: 0,
        total_withdraws: 0,
        opened_orders: 0,
        orders: [Order::default(); 10],
        padding: [0; 32],
    });

    user.set_inner(User {
        ts: Clock::get()?.unix_timestamp,
        bump: ctx.bumps.user,
        authority: *ctx.accounts.signer.key,
        referral: referral.key(),
        referred: 0,
        name: args.name,
        swaps: 0,
        staked: 0,
        swaps_made: 0,
        first_swap: 0,
        user_trade: user_trade.key(),
    });

    referral.referred += 1;

    Ok(())
}
