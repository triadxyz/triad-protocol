use anchor_lang::prelude::*;

declare_id!("8naBpcEohvxphPTAcuNHVCZEBDNn5aX41HfqxdcjNQ2W");

#[program]
pub mod triad_markets {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
