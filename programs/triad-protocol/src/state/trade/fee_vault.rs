use anchor_lang::prelude::*;

#[account]
pub struct FeeVault {
    pub bump: u8,
    pub authority: Pubkey,
    pub market: Pubkey,
    pub deposited: u128,
    pub withdrawn: u128,
    pub net_balance: u64,
    pub project_available: u64,
    pub project_claimed: u128,
    pub nft_holders_available: u64,
    pub nft_holders_claimed: u128,
    pub market_available: u64,
    pub market_claimed: u128,
    pub padding: [u8; 56],
}

impl FeeVault {
    pub const PREFIX_SEED: &'static [u8] = b"fee_vault";

    pub const SPACE: usize = 8 + std::mem::size_of::<Self>();
}
