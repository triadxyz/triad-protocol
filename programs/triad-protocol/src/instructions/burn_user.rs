use crate::{state::User, CreateUserArgs};
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(args: CreateUserArgs)]

pub struct BurnUser<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(init, payer = signer, space = User::SPACE, seeds = [User::PREFIX_SEED, args.name.as_bytes()], bump)]
    pub user: Account<'info, User>,

    pub system_program: Program<'info, System>,
}

pub fn burn_user(ctx: Context<CreateUser>, args: CreateUserArgs) -> Result<()> {
    let user: &mut Account<User> = &mut ctx.accounts.user;

    user.ts = Clock::get()?.unix_timestamp;
    user.bump = ctx.bumps.user;
    user.name = args.name;
    user.authority = *ctx.accounts.signer.key;
    user.referral = args.referral.key();

    Ok(())
}
