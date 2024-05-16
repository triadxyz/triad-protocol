use crate::state::{CreateUserArgs, User};

use anchor_lang::prelude::*;

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
    user.total_deposits = 0;
    user.total_withdraws = 0;
    user.net_deposits = 0;
    user.net_withdraws = 0;
    user.lp_shares = 0;
    // user.long_positions = Vec::new();
    // user.short_positions = Vec::new();

    let clock: Clock = Clock::get().unwrap();
    user.ts = clock.unix_timestamp;

    Ok(())
}
