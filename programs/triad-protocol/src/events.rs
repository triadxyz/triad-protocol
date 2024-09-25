use anchor_lang::prelude::*;

use crate::state::{ OrderDirection, OrderStatus, OrderType };

#[event]
pub struct PriceUpdate {
    pub market_id: u64,
    pub hype_price: u64,
    pub flop_price: u64,
    pub market_price: u64,
    pub direction: OrderDirection,
    pub timestamp: i64,
    pub comment: Option<[u8; 64]>,
}

#[event]
pub struct OrderUpdate {
    pub user: Pubkey,
    pub market_id: u64,
    pub order_id: u64,
    pub direction: OrderDirection,
    pub order_type: OrderType,
    pub order_status: OrderStatus,
    pub price: u64,
    pub total_shares: u64,
    pub total_amount: u64,
    pub comment: Option<[u8; 64]>,
    pub refund_amount: Option<u64>,
    pub timestamp: i64,
}
