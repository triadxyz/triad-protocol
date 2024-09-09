use anchor_lang::prelude::*;

#[account]
pub struct Market {
    pub init_ts: i64,
    pub updated_ts: i64,
    pub bump: u8,
    pub authority: Pubkey,
    pub name: String,
    pub vault: Pubkey,
    pub is_official: bool,
    pub padding: [u8; 240],
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct CreateMarketArgs {
    pub name: String,
}

impl Market {
    pub const PREFIX_SEED: &'static [u8] = b"market";

    pub const SPACE: usize = 8 + std::mem::size_of::<Self>();
}
