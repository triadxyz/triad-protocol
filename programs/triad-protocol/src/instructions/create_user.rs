use crate::{state::User, CreateUserArgs};
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(args: CreateUserArgs)]
pub struct CreateUser<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut)]
    pub referral: Account<'info, User>,

    #[account(init, payer = signer, space = User::SPACE, seeds = [User::PREFIX_SEED, signer.key().as_ref()], bump)]
    pub user: Account<'info, User>,

    pub system_program: Program<'info, System>,
}

pub fn create_user(ctx: Context<CreateUser>, args: CreateUserArgs) -> Result<()> {
    let user: &mut Account<User> = &mut ctx.accounts.user;
    let referral: &mut Account<User> = &mut ctx.accounts.referral;

    user.ts = Clock::get()?.unix_timestamp;
    user.bump = ctx.bumps.user;
    user.name = args.name;
    user.authority = *ctx.accounts.signer.key;
    user.referral = referral.key();
    user.swaps = 0;
    user.swaps_made = 0;

    referral.referred += 1;

    Ok(())
}
