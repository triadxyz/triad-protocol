use anchor_lang::prelude::*;

#[account]
pub struct Stake {
    pub bump: u8,
    pub authority: Pubkey,
    pub init_ts: i64,
    pub is_locked: bool,
    pub withdraw_ts: i64,
    pub name: String,
    pub collections: Vec<Collection>,
    pub rarity: Rarity,
    pub from_ata: Pubkey,
    pub to_ata: Pubkey,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub enum Rarity {
    COMMON,
    UNCOMMON,
    RARE,
    EPIC,
    LEGENDARY,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub enum Collection {
    COLETA,
    UNDEAD,
    ALLIGATORS,
    PYTH,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct StakeNFTArgs {
    pub name: String,
    pub rarity: Rarity,
    pub collections: Vec<Collection>,
}

impl Stake {
    pub const PREFIX_SEED: &'static [u8] = b"stake";

    pub const SPACE: usize = 8 + std::mem::size_of::<Self>();
}
