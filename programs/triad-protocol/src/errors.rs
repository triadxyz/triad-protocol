use anchor_lang::prelude::*;

#[error_code]
pub enum TriadProtocolError {
    #[msg("Invalid account")]
    InvalidAccount,

    #[msg("Unauthorized access")]
    Unauthorized,

    #[msg("Invalid owner authority")]
    InvalidOwnerAuthority,

    #[msg("Invalid mint address")]
    InvalidMintAddress,

    #[msg("Invalid Max Tokens")]
    InvalidMaxTokens,

    #[msg("Invalid Profit Share")]
    InvalidProfitShare,

    #[msg("Invalid Deposit Amount")]
    InvalidDepositAmount,

    #[msg("Invalid Withdraw Amount")]
    InvalidWithdrawAmount,
}
