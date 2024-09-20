use anchor_lang::prelude::*;
use anchor_spl::token_2022::{ Token2022, transfer_checked, TransferChecked };
use anchor_spl::{ associated_token::AssociatedToken, token_interface::{ Mint, TokenAccount } };

use crate::{
    state::{ Market, UserTrade, Order, OrderDirection, OrderStatus, OrderType, OpenOrderArgs },
    errors::TriadProtocolError,
    events::{ OrderUpdate, PriceUpdate },
};

#[derive(Accounts)]
#[instruction(args: OpenOrderArgs)]
pub struct OpenOrder<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        mut,
        seeds = [UserTrade::PREFIX_SEED, signer.key().as_ref()],
        bump = user_trade.bump,
    )]
    pub user_trade: Box<Account<'info, UserTrade>>,

    #[account(mut)]
    pub market: Box<Account<'info, Market>>,

    #[account(mut, constraint = mint.key() == market.mint)]
    pub mint: InterfaceAccount<'info, Mint>,

    #[account(
     mut, 
     constraint = from_ata.amount >= args.amount,
     associated_token::mint = mint,
     associated_token::authority = signer
    )]
    pub from_ata: InterfaceAccount<'info, TokenAccount>,

    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = market
    )]
    pub to_ata: InterfaceAccount<'info, TokenAccount>,

    #[account(mut,
      associated_token::mint = mint,
      associated_token::authority = market.fee_authority
    )]
    pub fee_ata: InterfaceAccount<'info, TokenAccount>,

    pub token_program: Program<'info, Token2022>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

pub fn open_order(ctx: Context<OpenOrder>, args: OpenOrderArgs) -> Result<()> {
    let user_trade = &mut ctx.accounts.user_trade;
    let market = &mut ctx.accounts.market;

    // Save old prices
    let old_hype_price = market.hype_price;
    let old_flop_price = market.flop_price;

    let current_price = match args.direction {
        OrderDirection::Hype => market.hype_price,
        OrderDirection::Flop => market.flop_price,
    };

    let price = match args.order_type {
        OrderType::Market => current_price,
        OrderType::Limit => args.price.ok_or(TriadProtocolError::InvalidPrice)?,
    };

    if price > 1_000_000 || args.amount < current_price {
        return Err(TriadProtocolError::InvalidPrice.into());
    }

    if user_trade.open_orders >= 20 {
        return Err(TriadProtocolError::MaxOpenOrdersReached.into());
    }

    let shares = market.calculate_shares(args.amount, args.direction);
    if shares == 0 {
        return Err(TriadProtocolError::InsufficientFunds.into());
    }

    let actual_amount = args.amount;

    let order_index = ctx.accounts.user_trade.orders
        .iter()
        .position(|order| order.status == OrderStatus::Init)
        .ok_or(TriadProtocolError::NoAvailableOrderSlot)?;

    let new_order = Order {
        ts: Clock::get()?.unix_timestamp,
        order_id: market.next_order_id(),
        market_id: market.market_id,
        status: OrderStatus::Open,
        price,
        total_amount: actual_amount,
        filled_amount: 0,
        total_shares: shares,
        filled_shares: 0,
        order_type: args.order_type,
        direction: args.direction,
        settled_pnl: 0,
        padding: [0; 16],
    };

    let user_trade = &mut ctx.accounts.user_trade;
    user_trade.orders[order_index] = new_order;
    user_trade.open_orders = user_trade.open_orders.checked_add(1).unwrap();
    user_trade.has_open_order = true;
    user_trade.total_deposits = user_trade.total_deposits.checked_add(actual_amount).unwrap();

    market.open_orders_count += 1;
    market.total_volume = market.total_volume.checked_add(actual_amount as u128).unwrap();

    market.update_price(price, args.direction)?;
    match args.direction {
        OrderDirection::Hype => {
            market.hype_liquidity = market.hype_liquidity.checked_add(actual_amount).unwrap();
            market.total_hype_shares = market.total_hype_shares.checked_add(shares).unwrap();
        }
        OrderDirection::Flop => {
            market.flop_liquidity = market.flop_liquidity.checked_add(actual_amount).unwrap();
            market.total_flop_shares = market.total_flop_shares.checked_add(shares).unwrap();
        }
    }

    let fee_amount = (((actual_amount as u128) * (market.fee_bps as u128)) / 10000) as u64;
    let net_amount = actual_amount.saturating_sub(fee_amount);

    // Transfer fee to fee account
    transfer_checked(
        CpiContext::new(ctx.accounts.token_program.to_account_info(), TransferChecked {
            from: ctx.accounts.from_ata.to_account_info(),
            mint: ctx.accounts.mint.to_account_info(),
            to: ctx.accounts.fee_ata.to_account_info(),
            authority: ctx.accounts.signer.to_account_info(),
        }),
        fee_amount,
        ctx.accounts.mint.decimals
    )?;

    // Transfer net amount to market vault
    transfer_checked(
        CpiContext::new(ctx.accounts.token_program.to_account_info(), TransferChecked {
            from: ctx.accounts.from_ata.to_account_info(),
            mint: ctx.accounts.mint.to_account_info(),
            to: ctx.accounts.to_ata.to_account_info(),
            authority: ctx.accounts.signer.to_account_info(),
        }),
        net_amount,
        ctx.accounts.mint.decimals
    )?;

    match args.direction {
        OrderDirection::Hype => {
            market.hype_liquidity = market.hype_liquidity.checked_add(net_amount).unwrap();
        }
        OrderDirection::Flop => {
            market.flop_liquidity = market.flop_liquidity.checked_add(net_amount).unwrap();
        }
    }

    market.last_update_ts = Clock::get()?.unix_timestamp;

    let (filled_amount, filled_shares) = fill_order_internal(
        market,
        &mut user_trade.orders[order_index],
        args.amount,
        &ctx.accounts.token_program,
        &ctx.accounts.from_ata.to_account_info(),
        &ctx.accounts.to_ata.to_account_info(),
        &ctx.accounts.mint,
        &ctx.accounts.signer
    )?;

    match args.direction {
        OrderDirection::Hype => {
            market.hype_liquidity = market.hype_liquidity.checked_add(filled_amount).unwrap();
            market.total_hype_shares = market.total_hype_shares.checked_add(filled_shares).unwrap();
        }
        OrderDirection::Flop => {
            market.flop_liquidity = market.flop_liquidity.checked_add(filled_amount).unwrap();
            market.total_flop_shares = market.total_flop_shares.checked_add(filled_shares).unwrap();
        }
    }

    if market.hype_price != old_hype_price || market.flop_price != old_flop_price {
        emit!(PriceUpdate {
            market_id: market.market_id,
            hype_price: market.hype_price,
            flop_price: market.flop_price,
            market_price: market.hype_price.max(market.flop_price),
            timestamp: Clock::get()?.unix_timestamp,
            comment: if args.order_type == OrderType::Market {
                args.comment
            } else {
                None
            },
        });
    }

    emit!(OrderUpdate {
        user: *ctx.accounts.signer.key,
        market_id: market.market_id,
        order_id: new_order.order_id,
        direction: args.direction,
        order_type: args.order_type,
        order_status: OrderStatus::Open,
        price,
        total_shares: shares,
        filled_shares: 0,
        total_amount: actual_amount,
        filled_amount: 0,
        comment: args.comment,
        refund_amount: None,
        timestamp: Clock::get()?.unix_timestamp,
    });

    Ok(())
}

pub fn fill_order_internal<'info>(
    market: &mut Market,
    order: &mut Order,
    amount: u64,
    token_program: &Program<'info, Token2022>,
    from_ata: &AccountInfo<'info>,
    to_ata: &AccountInfo<'info>,
    mint: &InterfaceAccount<'info, Mint>,
    user: &Signer<'info>
) -> Result<(u64, u64)> {
    let current_price = match order.direction {
        OrderDirection::Hype => market.hype_price,
        OrderDirection::Flop => market.flop_price,
    };

    let available_liquidity = match order.direction {
        OrderDirection::Hype => market.flop_liquidity,
        OrderDirection::Flop => market.hype_liquidity,
    };

    let fill_amount = amount.min(available_liquidity);
    let fill_shares = (((fill_amount as u128) * 1_000_000) / (current_price as u128)) as u64;

    if fill_amount > 0 {
        transfer_checked(
            CpiContext::new(token_program.to_account_info(), TransferChecked {
                from: from_ata.to_account_info(),
                mint: mint.to_account_info(),
                to: to_ata.to_account_info(),
                authority: user.to_account_info(),
            }),
            fill_amount,
            mint.decimals
        )?;

        order.filled_amount = order.filled_amount.checked_add(fill_amount).unwrap();
        order.filled_shares = order.filled_shares.checked_add(fill_shares).unwrap();

        if order.filled_amount == order.total_amount {
            order.status = OrderStatus::Filled;
        }

        market.update_price(current_price, order.direction)?;
    }

    Ok((fill_amount, fill_shares))
}
