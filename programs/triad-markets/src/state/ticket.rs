use anchor_lang::prelude::*;

#[account]
pub struct Ticket {
    /// The bump for the ticket pda
    pub bump: u8,
    /// authority for the ticket
    pub authority: Pubkey,
    /// name of the ticekt
    pub name: [u8; 32],
    /// token account for the ticket e.g. $tDRIFT
    pub token_account: Pubkey,
    /// timestamp ticket initialized
    pub init_ts: i64,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct CreateTicketArgs {
    pub name: String,
}

impl Ticket {
    /// static prefix seed string used to derive the PDAs
    pub const PREFIX_SEED: &[u8] = b"ticket";

    /// total on-chain space needed to allocate the account
    pub const SPACE: usize =
        // anchor descriminator + all static variables
        8 + std::mem::size_of::<Self>();
}
