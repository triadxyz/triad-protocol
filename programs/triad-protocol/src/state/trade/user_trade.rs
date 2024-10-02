use anchor_lang::prelude::*;

#[account]
pub struct UserTrade {
    pub bump: u8,
    pub authority: Pubkey,
    /// The total value of deposits the user has made (in TRD)
    /// precision: QUOTE_PRECISION
    pub total_deposits: u64,
    /// The total value of withdrawals the user has made (in TRD)
    /// precision: QUOTE_PRECISION
    pub total_withdraws: u64,
    /// The number of orders the user has opened
    pub opened_orders: u64,
    pub orders: [Order; 10],
    pub padding: [u8; 32],
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, Default)]
pub struct Order {
    pub ts: i64,
    pub order_id: u64,
    pub question_id: u64,
    pub market_id: u64,
    pub status: OrderStatus,
    /// The price of the order (in TRD)
    pub price: u64,
    /// The total amount of TRD committed to this order
    pub total_amount: u64,
    /// The total number of shares to be purchased
    pub total_shares: u64,
    pub order_type: OrderType,
    pub direction: OrderDirection,
    pub padding: [u8; 32],
}

#[derive(Clone, Copy, AnchorSerialize, AnchorDeserialize, PartialEq, Eq, Debug, Default)]
pub enum OrderDirection {
    /// Long
    #[default]
    Hype,
    /// Short
    Flop,
}

#[derive(Clone, Copy, AnchorSerialize, AnchorDeserialize, PartialEq, Eq, Debug, Default)]
pub enum OrderStatus {
    /// The order is not in use
    #[default]
    Init,
    /// Order is open
    Open,
    /// Order has been closed
    Closed,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq, Default)]
pub enum OrderType {
    #[default]
    Market,
    Limit,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct OpenOrderArgs {
    pub amount: u64,
    pub direction: OrderDirection,
    pub comment: Option<[u8; 64]>,
}

impl UserTrade {
    pub const PREFIX_SEED: &'static [u8] = b"user_trade";

    pub const SPACE: usize = 8 + std::mem::size_of::<Self>();
}

impl OrderDirection {
    pub fn opposite(&self) -> Self {
        match self {
            OrderDirection::Hype => OrderDirection::Flop,
            OrderDirection::Flop => OrderDirection::Hype,
        }
    }
}
