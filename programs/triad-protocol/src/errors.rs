use anchor_lang::prelude::*;

#[error_code]
pub enum TriadProtocolError {
    #[msg("Invalid account")]
    InvalidAccount,

    #[msg("Unauthorized access")]
    Unauthorized,

    #[msg("Failed to deposit")]
    DepositFailed,

    #[msg("Invalid owner authority")]
    InvalidOwnerAuthority,

    #[msg("Invalid position")]
    InvalidPosition,

    #[msg("Invalid ticker position")]
    InvalidTickerPosition,

    #[msg("No free position slot")]
    NoFreePositionSlot,

    #[msg("Invalid mint address")]
    InvalidMintAddress,

    #[msg("Invalid profit share")]
    InvalidProfitShare,

    #[msg("Invalid deposit amount")]
    InvalidDepositAmount,

    #[msg("Invalid withdraw amount")]
    InvalidWithdrawAmount,

    #[msg("Invalid stake vault")]
    InvalidStakeVault,

    #[msg("Invalid stake vault authority")]
    InvalidStakeVaultAuthority,

    #[msg("Invalid stake vault amount")]
    InvalidStakeVaultAmount,

    #[msg("Stake vault locked")]
    StakeVaultLocked,

    #[msg("Stake is locked")]
    StakeLocked,

    #[msg("Stake vault full")]
    StakeVaultFull,

    #[msg("Invalid mint")]
    InvalidMint,

    #[msg("Invalid stake vault week")]
    InvalidStakeVaultWeek,

    #[msg("Rewards already claimed")]
    RewardsAlreadyClaimed,

    #[msg("Stake overflow")]
    StakeOverflow,

    #[msg("Swaps reached limit")]
    SwapsReachedLimit,

    #[msg("Insufficient funds")]
    InsufficientFunds,
}
