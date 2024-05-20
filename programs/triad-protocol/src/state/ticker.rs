use anchor_lang::prelude::*;

#[account]
pub struct Ticker {
    /// timestamp of the creation of the ticker
    pub init_ts: i64,
    /// timestamp of the last update of the ticker
    pub updated_ts: i64,
    /// The bump for the ticker pda
    pub bump: u8,
    /// authority for the ticker
    pub authority: Pubkey,
    /// name of the ticekt
    pub name: String,
    /// protocol program id like dRiftyHA39MWEi3m9aunc5MzRF1JYuBsbn6VPcn33UH to get data info
    pub protocol_program_id: Pubkey,
    /// ticker price
    pub price: u64,
    /// Vault PDA
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
    /// static prefix seed string used to derive the PDAs
    pub const PREFIX_SEED: &'static [u8] = b"ticker";

    /// total on-chain space needed to allocate the account
    pub const SPACE: usize =
        // anchor descriminator + all static variables
        8 + std::mem::size_of::<Self>();
}
