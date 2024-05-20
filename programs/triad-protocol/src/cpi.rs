use anchor_lang::prelude::*;

pub trait TokenTransferCPI {
    fn token_transfer(&self, amount: u64, pnl: i64) -> Result<()>;
}
