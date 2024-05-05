use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct Position {
    order_id: String,
    value: f64,
    target_ticker_price: f64,
}
