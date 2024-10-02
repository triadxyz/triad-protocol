use anchor_lang::prelude::*;

use crate::state::{ OrderDirection, OrderStatus, OrderType, WinningDirection, QuestionStatus };

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
    pub question_id: u64,
    pub order_id: u64,
    pub direction: OrderDirection,
    pub order_type: OrderType,
    pub order_status: OrderStatus,
    pub price: u64,
    pub total_shares: u64,
    pub total_amount: u64,
    pub comment: Option<[u8; 64]>,
    pub refund_amount: Option<u64>,
    pub pnl: i64,
    pub timestamp: i64,
    pub is_question_winner: Option<bool>,
}

#[event]
pub struct QuestionUpdate {
    pub market_id: u64,
    pub question_id: u64,
    pub question: String,
    pub start_time: i64,
    pub end_time: i64,
    pub hype_liquidity: u64,
    pub flop_liquidity: u64,
    pub winning_direction: WinningDirection,
    pub market_price: u64,
    pub final_hype_price: u64,
    pub final_flop_price: u64,
    pub timestamp: i64,
    pub total_hype_shares: u64,
    pub total_flop_shares: u64,
    pub status: QuestionStatus,
}

#[event]
pub struct StakeRewards {
    pub user: Pubkey,
    pub mint: Pubkey,
    pub amount: u64,
    pub timestamp: i64,
    pub rank: u16,
}
