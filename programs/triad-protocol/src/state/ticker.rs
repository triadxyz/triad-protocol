use anchor_lang::prelude::*;

#[account]
pub struct Ticker {
    /// The bump for the ticker pda
    pub bump: u8,
    /// authority for the ticker
    pub authority: Pubkey,
    /// name of the ticekt
    pub name: [u8; 32],
    /// token account for the ticker e.g. $tDRIFT
    pub token_account: Pubkey,
    /// timestamp ticker initialized
    pub init_ts: i64,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct CreateTickerArgs {
    pub name: [u8; 32],
}

impl Ticker {
    /// static prefix seed string used to derive the PDAs
    pub const PREFIX_SEED: &'static[u8] = b"ticker";

    /// total on-chain space needed to allocate the account
    pub const SPACE: usize =
        // anchor descriminator + all static variables
        8 + std::mem::size_of::<Self>();
}
