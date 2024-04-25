use anchor_lang::prelude::*;

#[account]
pub struct Vault {
    /// The bump for the vault pda
    pub bump: u8,
    /// authority for the vault
    pub authority: Pubkey,
    /// name of the vault
    pub name: [u8; 32],
    /// token account for the vault e.g. USDC
    pub token_account: Pubkey,
    /// ticker address
    pub ticker_address: Pubkey,
    /// delegate account for the vault
    pub delegate: Pubkey,
    /// max number of tokens that can be deposited
    pub max_tokens: u64,
    /// lifetime total deposits
    pub total_deposits: u64,
    /// lifetime total withdraws
    pub total_withdraws: u64,
    /// timestamp vault initialized
    pub init_ts: i64,
    /// the minimum deposit amount
    pub min_deposit_amount: u64,
    /// lifetime net deposits
    pub net_deposits: i64,
    /// lifetime net withdraws
    pub net_withdraws: i64,
    /// the sum of all shares
    pub total_shares: u128,
    /// percentage of gains for vault
    pub profit_share: u32,
    /// Long bet balance
    pub long_balance: u64,
    /// Short bet balance
    pub short_balance: u64,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct CreateVaultArgs {
    pub name: [u8; 32],
    pub max_tokens: u64,
    pub min_deposit_amount: u64,
    pub ticker_address: Pubkey,
    pub profit_share: u32,
}

#[account]
pub struct VaultDepositor {
    pub bump: u8,
    pub authority: Pubkey,
    pub vault: Pubkey,
    /// lifetime net deposits of vault depositor for the vault
    pub net_deposits: i64,
    /// lifetime net withdraws of vault depositor for the vault
    pub net_withdraws: i64,
    /// lifetime total deposits
    pub total_deposits: u64,
    /// lifetime total withdraws
    pub total_withdraws: u64,
    pub lp_shares: u64,
    /// Long bet balance
    pub long_balance: u64,
    /// Short bet balance
    pub short_balance: u64,
    pub long_positions: Vec<(String, f64, f64)>,
    pub short_positions: Vec<(String, f64, f64)>,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct CreateVaultDepositorArgs {
    pub long_positions: Vec<(String, f64, f64)>,
    pub short_positions: Vec<(String, f64, f64)>,
}

impl Vault {
    /// static prefix seed string used to derive the PDAs
    pub const PREFIX_SEED: &'static [u8] = b"vault";

    /// total on-chain space needed to allocate the account
    pub const SPACE: usize =
        // anchor descriminator + all static variables
        8 + std::mem::size_of::<Self>();

    pub fn get_vault_signer_seeds<'a>(name: &'a [u8], bump: &'a u8) -> [&'a [u8]; 3] {
        [b"vault".as_ref(), name, bytemuck::bytes_of(bump)]
    }

    pub const PREFIX_SEED_VAULT_TOKEN_ACCOUNT: &'static [u8] = b"vault_token_account";

    pub const SPACE_VAULT_DEPOSITOR: usize =
        // anchor descriminator + all static variables
        8 + std::mem::size_of::<VaultDepositor>();

    pub const PREFIX_SEED_VAULT_DEPOSITOR: &'static [u8] = b"vault_depositor";
}
