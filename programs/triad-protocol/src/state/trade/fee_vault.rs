use anchor_lang::prelude::*;

#[account]
pub struct FeeVault {
    pub bump: u8,
    pub authority: Pubkey,
    pub market: Pubkey,
    pub deposited: u64,
    pub withdrawn: u64,
    pub net_balance: u64,
    pub project_available: u64,
    pub project_claimed: u64,
    pub nft_holders_available: u64,
    pub nft_holders_claimed: u64,
    pub market_available: u64,
    pub market_claimed: u64,
    pub padding: [u8; 60],
}

impl FeeVault {
    pub const PREFIX_SEED: &'static [u8] = b"fee_vault";

    pub const SPACE: usize = 8 + std::mem::size_of::<Self>();
}
