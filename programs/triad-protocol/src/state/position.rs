use anchor_lang::prelude::*;

#[account]
pub struct UserPosition {
    /// timestamp
    pub ts: i64,
    /// bump seed
    pub bump: u8,
    /// total deposited
    pub total_deposited: u64,
    /// total withdrawn
    pub total_withdrawn: u64,
    /// total liquidity provided
    pub lp_share: u64,
    /// total positions
    pub total_positions: u16,
    /// ticker account
    pub ticker: Pubkey,
    /// user's authority
    pub authority: Pubkey,
    /// user's position
    pub positions: [Position; 6],
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, Default)]
pub struct Position {
    pub amount: u64,
    pub ticker: Pubkey,
    pub entry_price: u64,
    pub ts: i64,
    pub is_long: bool,
    pub is_open: bool,
    pub pnl: i64,
}

impl UserPosition {
    /// static prefix seed string used to derive the PDAs
    pub const PREFIX_SEED: &'static [u8] = b"user_position";

    /// total on-chain space needed to allocate the account
    pub const SPACE: usize =
        // anchor descriminator + all static variables
        8 + std::mem::size_of::<Self>();
}
