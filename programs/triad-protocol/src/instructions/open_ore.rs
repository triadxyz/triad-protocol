use crate::{ state::User, OpenArgs, OreInstruction, PROOF };
use anchor_lang::{
    prelude::*,
    solana_program::{ instruction::Instruction, program::invoke_signed },
};

#[derive(Accounts)]
pub struct OpenOre<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        mut,
        seeds = [User::PREFIX_SEED, signer.key().as_ref()],
        bump
    )]
    pub user: Account<'info, User>,

    /// CHECK: Miner info
    #[account(mut)]
    pub miner_info: AccountInfo<'info>,

    /// CHECK: Miner info
    #[account(mut)]
    pub proof_info: AccountInfo<'info>,

    /// CHECK: ORE Program
    pub ore_program: AccountInfo<'info>,

    /// CHECK: Sysvar hashes info
    #[account()]
    sysvar_hashes_info: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
}

pub fn open_ore(ctx: Context<OpenOre>) -> Result<()> {
    let user: &mut Account<User> = &mut ctx.accounts.user;
    let signer: &Signer = &ctx.accounts.signer;

    let seeds: &[&[&[u8]]] = &[&[b"user", signer.key.as_ref(), &[user.bump]]];

    let proof_pda = Pubkey::find_program_address(
        &[PROOF, user.key().as_ref()],
        &ctx.accounts.ore_program.key()
    );

    invoke_signed(
        &(Instruction {
            program_id: ctx.accounts.ore_program.key(),
            accounts: vec![
                AccountMeta::new(user.key(), true),
                AccountMeta::new_readonly(ctx.accounts.miner_info.key(), false),
                AccountMeta::new(ctx.accounts.payer.key(), true),
                AccountMeta::new(proof_pda.0, false),
                AccountMeta::new_readonly(ctx.accounts.system_program.key(), false),
                AccountMeta::new_readonly(ctx.accounts.sysvar_hashes_info.key(), false)
            ],
            data: [
                OreInstruction::Open.to_vec(),
                (OpenArgs { bump: proof_pda.1 }).to_bytes().to_vec(),
            ].concat(),
        }),
        &[
            ctx.accounts.user.to_account_info().clone(),
            ctx.accounts.payer.to_account_info().clone(),
            ctx.accounts.proof_info.to_account_info().clone(),
            ctx.accounts.miner_info.to_account_info().clone(),
            ctx.accounts.ore_program.clone(),
            ctx.accounts.system_program.to_account_info().clone(),
            ctx.accounts.sysvar_hashes_info.to_account_info().clone(),
        ],
        seeds
    )?;

    Ok(())
}
