use anchor_lang::prelude::*;
use crate::state::{ UserTrade, Order };

#[derive(Accounts)]
pub struct CreateUserTrade<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

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

pub fn create_user_trade(ctx: Context<CreateUserTrade>) -> Result<()> {
    let user_trade = &mut ctx.accounts.user_trade;

    user_trade.set_inner(UserTrade {
        bump: ctx.bumps.user_trade,
        authority: ctx.accounts.signer.key(),
        total_deposits: 0,
        total_withdraws: 0,
        open_orders: 0,
        has_open_order: false,
        orders: [Order::default(); 10],
        position: 0,
        padding: [0; 64],
    });

    Ok(())
}
