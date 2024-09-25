export type Market = {
  address: string
  bump: number
  authority: string
  marketId: string
  name: string
  hypePrice: string
  flopPrice: string
  hypeLiquidity: string
  flopLiquidity: string
  totalHypeShares: string
  totalFlopShares: string
  totalVolume: string
  mint: string
  ts: string
  updateTs: string
  openOrdersCount: string
  nextOrderId: string
  feeBps: number
  feeVault: string
  isActive: boolean
  marketPrice: string
  isOfficial: boolean
}

export type OrderDirection =
  | {
      hype: {}
    }
  | {
      flop: {}
    }

export type OrderStatus =
  | {
      init: {}
    }
  | {
      open: {}
    }
  | {
      filled: {}
    }
  | {
      canceled: {}
    }
  | {
      closed: {}
    }

export type OrderType =
  | {
      limit: {}
    }
  | {
      market: {}
    }
