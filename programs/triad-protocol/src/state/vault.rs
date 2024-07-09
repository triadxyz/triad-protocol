use anchor_lang::prelude::*;

#[account]
pub struct Vault {
    pub bump: u8,
    pub authority: Pubkey,
    pub name: String,
    pub token_account: Pubkey,
    pub ticker_address: Pubkey,
    pub total_deposited: u64,
    pub total_withdrawn: u64,
    pub init_ts: i64,
    pub net_deposits: u128,
    pub net_withdraws: u128,
    pub long_balance: u64,
    pub short_balance: u64,
    pub long_positions_opened: u64,
    pub short_positions_opened: u64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct OpenPositionArgs {
    pub amount: u64,
    pub is_long: bool,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct ClosePositionArgs {
    pub position_index: u8,
}

impl Vault {
    pub const PREFIX_SEED: &'static [u8] = b"vault";

    pub const SPACE: usize = 8 + std::mem::size_of::<Self>();

    pub const PREFIX_SEED_VAULT_TOKEN_ACCOUNT: &'static [u8] = b"vault_token_account";
}
