use anchor_lang::prelude::*;

#[account]
pub struct Ticker {
    pub init_ts: i64,
    pub updated_ts: i64,
    pub bump: u8,
    pub authority: Pubkey,
    pub name: String,
    pub protocol_program_id: Pubkey,
    pub price: u64,
    pub vault: Pubkey,
}
