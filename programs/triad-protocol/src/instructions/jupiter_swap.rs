use anchor_lang::{
    prelude::*,
    solana_program::{instruction::Instruction, program::invoke_signed},
};
use std::str::FromStr;

#[derive(Clone)]
pub struct Jupiter;

impl anchor_lang::Id for Jupiter {
    fn id() -> Pubkey {
        return Pubkey::from_str("JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4").unwrap();
    }
}

#[derive(Accounts)]
#[instruction(data: Vec<u8>)]
pub struct JupiterSwap<'info> {
    #[account(mut)]
    pub user_account: Signer<'info>,

    pub jupiter_program: Program<'info, Jupiter>,
    pub system_program: Program<'info, System>,
}

pub fn jupiter_swap(ctx: Context<JupiterSwap>, data: Vec<u8>) -> Result<()> {
    let accounts: Vec<AccountMeta> = ctx
        .remaining_accounts
        .iter()
        .map(|acc| AccountMeta {
            pubkey: *acc.key,
            is_signer: acc.is_signer,
            is_writable: acc.is_writable,
        })
        .collect();

    let accounts_infos: Vec<AccountInfo> = ctx
        .remaining_accounts
        .iter()
        .map(|acc| acc.clone())
        .collect();

    invoke_signed(
        &Instruction {
            program_id: ctx.accounts.jupiter_program.key(),
            accounts,
            data,
        },
        &accounts_infos,
        &[],
    )?;

    Ok(())
}
