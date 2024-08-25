use crate::{ state::User, MineArgs, OreInstruction, MineInnerArgs };
use anchor_lang::{
    prelude::*,
    solana_program::{ instruction::Instruction, program::invoke_signed },
};

#[derive(Accounts)]
#[instruction(args: MineArgs)]
pub struct MineOre<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        mut,
        seeds = [User::PREFIX_SEED, signer.key().as_ref()],
        bump,
        constraint = user.authority == *signer.key 
    )]
    pub user: Account<'info, User>,

    /// CHECK: Miner info
    #[account(mut)]
    pub proof_info: AccountInfo<'info>,

    /// CHECK: Bus info
    #[account(mut)]
    pub bus: AccountInfo<'info>,

    /// CHECK: ORE Program
    pub ore_program: AccountInfo<'info>,

    /// CHECK: Config program
    pub config_program: AccountInfo<'info>,

    /// CHECK: Sysvar hashes info
    sysvar_hashes_info: UncheckedAccount<'info>,

    /// CHECK: Sysvar instructions info
    sysvar_instructions_info: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
}

pub fn mine_ore(ctx: Context<MineOre>, args: MineArgs) -> Result<()> {
    let user: &mut Account<User> = &mut ctx.accounts.user;
    let signer: &Signer = &ctx.accounts.signer;

    let seeds: &[&[&[u8]]] = &[&[b"user", signer.key.as_ref(), &[user.bump]]];

    invoke_signed(
        &(Instruction {
            program_id: ctx.accounts.ore_program.key(),
            accounts: vec![
                AccountMeta::new(user.key(), true),
                AccountMeta::new(ctx.accounts.bus.key(), false),
                AccountMeta::new_readonly(ctx.accounts.config_program.key(), false),
                AccountMeta::new(ctx.accounts.proof_info.key(), false),
                AccountMeta::new_readonly(ctx.accounts.sysvar_instructions_info.key(), false),
                AccountMeta::new_readonly(ctx.accounts.sysvar_hashes_info.key(), false)
            ],
            data: [
                OreInstruction::Mine.to_vec(),
                (MineInnerArgs {
                    digest: args.digest,
                    nonce: args.nonce,
                })
                    .to_bytes()
                    .to_vec(),
            ].concat(),
        }),
        &[
            ctx.accounts.user.to_account_info().clone(),
            ctx.accounts.bus.to_account_info().clone(),
            ctx.accounts.config_program.to_account_info().clone(),
            ctx.accounts.proof_info.to_account_info().clone(),
            ctx.accounts.ore_program.clone(),
            ctx.accounts.sysvar_instructions_info.to_account_info().clone(),
            ctx.accounts.sysvar_hashes_info.to_account_info().clone(),
        ],
        seeds
    )?;

    Ok(())
}
