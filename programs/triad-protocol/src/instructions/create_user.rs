use anchor_lang::prelude::*;

use crate::state::{CreateUserArgs, User};

#[derive(Accounts)]
#[instruction(args: CreateUserArgs)]
pub struct CreateUser<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(init, payer = signer, space = User::SPACE, seeds = [User::PREFIX_SEED.as_ref(), signer.key().as_ref()], bump)]
    pub user: Account<'info, User>,

    pub system_program: Program<'info, System>,
}

pub fn create_user(ctx: Context<CreateUser>, args: CreateUserArgs) -> Result<()> {
    let user: &mut Account<User> = &mut ctx.accounts.user;

    user.name = args.name;
    user.referrer = args.referrer;
    user.community = args.community;
    user.bump = *ctx.bumps.get("user").unwrap();
    user.authority = *ctx.accounts.signer.key;

    let clock: Clock = Clock::get().unwrap();
    user.ts = clock.unix_timestamp;

    Ok(())
}
