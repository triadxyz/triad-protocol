use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct UserTrade {
    pub bump: u8,
    pub user: Pubkey,
    pub market: Pubkey,
}

impl UserTrade {
    pub const PREFIX_SEED: &'static [u8] = b"user_trade";

    pub const SPACE: usize = 8 + std::mem::size_of::<Self>();
}
