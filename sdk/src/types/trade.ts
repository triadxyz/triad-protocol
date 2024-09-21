export type Market = {
  bump: number
  authority: string
  marketId: number
  name: string
  hypePrice: number
  flopPrice: number
  hypeLiquidity: number
  flopLiquidity: number
  totalHypeShares: number
  totalFlopShares: number
  totalVolume: number
  vaultTokenAccount: string
  mint: string
  ts: number
  updateTs: number
  openOrdersCount: number
  nextOrderId: number
  feeBps: number
  feeVault: string
  isActive: boolean
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
