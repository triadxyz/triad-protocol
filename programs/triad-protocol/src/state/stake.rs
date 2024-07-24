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
    pub mint: Pubkey,
    pub stake_vault: Pubkey,
    pub stake_rewards: Pubkey,
    pub amount: u64,
    pub rank: u64,
    pub claimed: u64,
}

#[account]
pub struct NFTRewards {
    pub stake: Pubkey,
    pub daily_rewards: [u64; 30],
    pub weekly_rewards_paid: [bool; 5],
    pub apr: f32,
}

#[account]
pub struct StakeVault {
    pub bump: u8,
    pub authority: Pubkey,
    pub init_ts: i64,
    pub end_ts: i64,
    pub amount: u64,
    pub amount_paid: u64,
    pub token_decimals: u8,
    pub nft_staked: u64,
    pub slots: u64,
    pub is_locked: bool,
    pub name: String,
    pub collection: String,
    pub token_mint: Pubkey,
    pub week: u8,
    pub token_staked: u64,
    pub sum_all_users: f64,
    pub padding: [u8; 32],
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub enum Rarity {
    COMMON,
    UNCOMMON,
    RARE,
    EPIC,
    LEGENDARY,
    MYTHIC,
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
    pub stake_vault: String,
    pub collections: Vec<Collection>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct StakeTokenArgs {
    pub stake_vault: String,
    pub name: String,
    pub amount: u64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct InitializeStakeVaultArgs {
    pub name: String,
    pub slots: u64,
    pub collection: String,
    pub amount: u64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct UpdateStakeVaultStatusArgs {
    pub is_locked: bool,
    pub week: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct WithdrawNFTArgs {
    pub stake_vault: String,
    pub nft_name: String,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct DepositStakeRewardsArgs {
    pub amount: u64,
    pub stake_vault: String,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct ClaimStakeRewardsArgs {
    pub week: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct UpdateStakeRewardsArgs {
    pub day: u8,
    pub rewards: u64,
    pub apr: f32,
}

impl Stake {
    pub const PREFIX_SEED: &'static [u8] = b"stake";

    pub const SPACE: usize = 8 + std::mem::size_of::<Self>();
}

impl StakeVault {
    pub const PREFIX_SEED: &'static [u8] = b"stake_vault";

    pub const SPACE: usize = 8 + std::mem::size_of::<Self>();
}

impl NFTRewards {
    pub const PREFIX_SEED: &'static [u8] = b"nft_rewards";

    pub const SPACE: usize = 8 + std::mem::size_of::<Self>();
}
