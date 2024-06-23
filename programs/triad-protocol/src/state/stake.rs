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
    pub stake_vault: Pubkey,
}

#[account]
pub struct StakeVault {
    pub bump: u8,
    pub authority: Pubkey,
    pub init_ts: i64,
    pub end_ts: i64,
    pub amount: u64,
    pub amount_paid: u64,
    pub apr: u8,
    pub amount_users: u64,
    pub available: u64,
    pub name: String,
    pub users_paid: Pubkey,
    pub padding: [u8; 64],
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

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct InitializeStakeVaultArgs {
    pub name: String,
    pub amount: u64,
    pub available: u64,
}

impl Stake {
    pub const PREFIX_SEED: &'static [u8] = b"stake";

    pub const SPACE: usize = 8 + std::mem::size_of::<Self>();
}

impl StakeVault {
    pub const PREFIX_SEED: &'static [u8] = b"stake_vault";

    pub const PREFIX_SEED_VAULT_TOKEN_ACCOUNT: &'static [u8] = b"stake_vault_token_account";

    pub const SPACE: usize = 8 + std::mem::size_of::<Self>();
}
