use anchor_lang::prelude::*;

use crate::{ state::OrderDirection, events::PriceUpdate };

#[account]
pub struct Market {
    pub bump: u8,
    pub authority: Pubkey,
    /// Unique identifier for the market
    pub market_id: u64,
    /// The event being predicted (e.g., "tJUP/TRD")
    pub name: String,
    /// Current price for Hype outcome (0-1000000, representing 0 to 1 TRD)
    /// 1000000 = 1 TRD, 500000 = 0.5 TRD, etc.
    pub hype_price: u64,
    /// Current price for Flop outcome (0-1000000, representing 0 to 1 TRD)
    pub flop_price: u64,
    /// Total liquidity for Hype (in TRD)
    pub hype_liquidity: u64,
    /// Total liquidity for Flop (in TRD)
    pub flop_liquidity: u64,
    /// Total number of Hype shares issued
    pub total_hype_shares: u64,
    /// Total number of Flop shares issued
    pub total_flop_shares: u64,
    /// Total trading volume (in TRD)
    pub total_volume: u64,
    /// Mint $TRD token
    pub mint: Pubkey,
    /// Timestamp of the init
    pub ts: i64,
    pub update_ts: i64,
    /// Total number of open orders in this market
    pub open_orders_count: u64,
    /// Next available order ID
    pub next_order_id: u64,
    /// Fees applied to trades (in basis points, e.g., 1.131% fee)
    pub fee_bps: u16,
    /// Vault to Receive fees
    pub fee_vault: Pubkey,
    /// Whether the market is currently active for trading
    pub is_active: bool,
    pub is_official: bool,
    pub market_price: u64,
    pub weekly_results: [WeeklyResult; 4],
    /// Index of the current week in the weekly_results array initialized with default values
    pub current_week_index: u8,
    /// Start timestamp of the current week if 7 days have passed since the start of the week
    pub current_week_start: i64,
    /// The question or prediction topic for the current week
    pub current_question: [u8; 120],
    pub padding: [u8; 224],
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy)]
pub struct WeeklyResult {
    /// The question or prediction topic for this week
    pub question: [u8; 120],
    /// Start timestamp of the week
    pub start_time: i64,
    /// End timestamp of the week
    pub end_time: i64,
    /// The winning direction (Hype or Flop)
    pub winning_direction: OrderDirection,
    /// Final price for Hype outcome at the end of the week
    pub final_hype_price: u64,
    /// Final price for Flop outcome at the end of the week
    pub final_flop_price: u64,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct InitializeMarketArgs {
    pub name: String,
    pub market_id: u64,
}

impl Default for WeeklyResult {
    fn default() -> Self {
        Self {
            question: [0; 120],
            start_time: 0,
            end_time: 0,
            winning_direction: OrderDirection::Hype,
            final_hype_price: 500_000,
            final_flop_price: 500_000,
        }
    }
}

impl Default for Market {
    fn default() -> Self {
        Self {
            bump: 0,
            authority: Pubkey::default(),
            market_id: 0,
            name: String::new(),
            hype_price: 500_000, // Initial price set to 0.5 TRD
            flop_price: 500_000, // Initial price set to 0.5 TRD
            hype_liquidity: 0,
            flop_liquidity: 0,
            total_hype_shares: 0,
            total_flop_shares: 0,
            total_volume: 0,
            mint: Pubkey::default(),
            ts: 0,
            update_ts: 0,
            open_orders_count: 0,
            next_order_id: 0,
            fee_bps: 1131, // 1.131% fee
            fee_vault: Pubkey::default(),
            is_active: true,
            is_official: true,
            market_price: 0,
            weekly_results: [WeeklyResult::default(); 4],
            current_week_index: 0,
            current_week_start: 0,
            current_question: [0; 120],
            padding: [0; 224],
        }
    }
}

impl Market {
    pub const PREFIX_SEED: &'static [u8] = b"market";

    pub const SPACE: usize = 8 + std::mem::size_of::<Self>();

    pub fn next_order_id(&mut self) -> u64 {
        let id = self.next_order_id;
        self.next_order_id = self.next_order_id.wrapping_add(1);
        id
    }

    pub fn calculate_shares(&self, amount: u64, direction: OrderDirection) -> u64 {
        let price = match direction {
            OrderDirection::Hype => self.hype_price,
            OrderDirection::Flop => self.flop_price,
        };

        ((amount * 1_000_000) / price) as u64
    }

    pub fn update_shares(&mut self, shares: u64, direction: OrderDirection) {
        match direction {
            OrderDirection::Hype => {
                self.total_hype_shares = self.total_hype_shares.saturating_add(shares);
            }
            OrderDirection::Flop => {
                self.total_flop_shares = self.total_flop_shares.saturating_add(shares);
            }
        }
    }

    pub fn update_price(
        &mut self,
        amount: u64,
        direction: OrderDirection,
        comment: Option<[u8; 64]>
    ) -> Result<()> {
        let price_impact = ((amount as f64) / 1_000_000.0).min(0.01); // Max 1% impact

        match direction {
            OrderDirection::Hype => {
                let new_hype_price = ((self.hype_price as f64) * (1.0 + price_impact)) as u64;
                self.hype_price = new_hype_price.min(1_000_000);
                self.flop_price = 1_000_000 - self.hype_price;
            }
            OrderDirection::Flop => {
                let new_flop_price = ((self.flop_price as f64) * (1.0 + price_impact)) as u64;
                self.flop_price = new_flop_price.min(1_000_000);
                self.hype_price = 1_000_000 - self.flop_price;
            }
        }

        self.hype_price = self.hype_price.max(1);
        self.flop_price = self.flop_price.max(1);

        self.update_ts = Clock::get()?.unix_timestamp;

        let market_price = self.hype_price.max(self.flop_price);
        self.market_price = market_price;

        emit!(PriceUpdate {
            market_id: self.market_id,
            hype_price: self.hype_price,
            flop_price: self.flop_price,
            direction: direction,
            market_price: market_price,
            timestamp: Clock::get()?.unix_timestamp,
            comment: comment,
        });

        Ok(())
    }

    pub fn get_winning_direction(&self) -> Option<OrderDirection> {
        if self.hype_price > self.flop_price {
            Some(OrderDirection::Hype)
        } else if self.flop_price > self.hype_price {
            Some(OrderDirection::Flop)
        } else {
            None // Prices are equal, no clear winner
        }
    }
}
