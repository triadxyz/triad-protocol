use anchor_lang::prelude::*;

#[event]
pub struct OpenPositionRecord {
    pub amount: u64,
    pub ticker: Pubkey,
    pub entry_price: u64,
    pub ts: i64,
    pub is_long: bool,
    pub user: Pubkey,
}

#[event]
pub struct ClosePositionRecord {
    pub amount: u64,
    pub ticker: Pubkey,
    pub close_price: u64,
    pub ts: i64,
    pub is_long: bool,
    pub pnl: i64,
    pub user: Pubkey,
}

#[event]
pub struct TickerPriceUpdateRecord {
    pub price: u64,
    pub ts: i64,
    pub ticker: Pubkey,
}