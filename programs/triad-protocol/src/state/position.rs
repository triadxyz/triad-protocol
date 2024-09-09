use anchor_lang::prelude::*;

#[account]
pub struct UserPosition {
    pub ts: i64,
    pub bump: u8,
    pub total_deposited: u64,
    pub total_withdrawn: u64,
    pub lp_share: u64,
    pub total_positions: u16,
    pub ticker: Pubkey,
    pub authority: Pubkey,
    pub positions: [Position; 3],
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, Default)]
pub struct Position {
    pub amount: u64,
    pub entry_price: u64,
    pub ts: i64,
    pub is_long: bool,
    pub is_open: bool,
    pub pnl: i64,
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

impl UserPosition {
    pub const PREFIX_SEED: &'static [u8] = b"user_position";

    pub const SPACE: usize = 8 + std::mem::size_of::<Self>();
}
