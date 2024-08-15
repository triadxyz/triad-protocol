use anchor_lang::prelude::*;

#[account]
pub struct StakeV2 {
    pub bump: u8,
    pub authority: Pubkey,
    pub init_ts: i64,
    pub withdraw_ts: i64,
    pub claimed_ts: i64,
    pub name: String,
    pub mint: Pubkey,
    pub boost: bool,
    pub stake_vault: Pubkey,
    pub claimed: u64,
    pub available: u64,
    pub amount: u64,
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

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct ClaimStakeRewardsArgs {
    pub rank: u16,
    pub collections: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct StakeNFTArgs {
    pub name: String,
    pub stake_vault: String,
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
pub struct DepositStakeRewardsArgs {
    pub amount: u64,
    pub stake_vault: String,
}

impl StakeVault {
    pub const PREFIX_SEED: &'static [u8] = b"stake_vault";

    pub const SPACE: usize = 8 + std::mem::size_of::<Self>();
}

impl StakeV2 {
    pub const PREFIX_SEED: &'static [u8] = b"stake";

    pub const SPACE: usize = 8 + std::mem::size_of::<Self>();
}
