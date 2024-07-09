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

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct CreateTickerArgs {
    pub name: String,
    pub protocol_program_id: Pubkey,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct UpdateTickerPriceArgs {
    pub price: u64,
}

impl Ticker {
    pub const PREFIX_SEED: &'static [u8] = b"ticker";

    pub const SPACE: usize = 8 + std::mem::size_of::<Self>();
}
