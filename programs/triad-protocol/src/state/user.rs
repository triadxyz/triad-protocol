use anchor_lang::prelude::*;

#[account]
pub struct User {
    /// timestamp
    pub ts: i64,
    /// user's name
    pub name: String,
    /// bump seed
    pub bump: u8,
    /// user's authority
    pub authority: Pubkey,
    /// referrer of the user
    pub referrer: String,
    /// community the user is part of
    pub community: String,
    /// lifetime net deposits of user
    pub net_deposits: i64,
    /// lifetime net withdraws of user
    pub net_withdraws: i64,
    /// lifetime total deposits
    pub total_deposits: u64,
    /// lifetime total withdraws
    pub total_withdraws: u64,
    /// total available balance
    pub lp_shares: u64,
    // /// long positions
    // pub long_positions: Vec<Position>,
    // /// short positions
    // pub short_positions: Vec<Position>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy)]
pub struct Position {
    pub pubkey: Pubkey,
    pub ticker: Pubkey,
    pub amount: u64,
    pub leverage: u64,
    pub entry_price: u64,
    pub ts: i64,
    pub is_long: bool,
    pub is_open: bool,
    pub pnl: i64,
}

#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize, PartialEq, Eq)]
pub struct CreateUserArgs {
    pub name: String,
    pub referrer: String,
    pub community: String,
}

impl User {
    /// static prefix seed string used to derive the PDAs
    pub const PREFIX_SEED: &'static [u8] = b"user";

    /// total on-chain space needed to allocate the account
    pub const SPACE: usize =
        // anchor descriminator + all static variables
        8 + std::mem::size_of::<Self>();
}
