use anchor_lang::prelude::*;

#[account]
pub struct User {
    pub ts: i64, // timestamp
    pub name: String,
    pub bump: u8,
    pub authority: Pubkey,
    pub referrer: String,
    pub community: String,
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
