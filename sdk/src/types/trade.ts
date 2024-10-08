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
  previousResolvedQuestion: ResolvedQuestion
  currentQuestionId: string
  currentQuestionStart: string
  currentQuestionEnd: string
  currentQuestion: string
}

export type ResolvedQuestion = {
  question: string
  startTime: string
  endTime: string
  hypeLiquidity: string
  flopLiquidity: string
  winningDirection: WinningDirection
  marketPrice: string
  finalHypePrice: string
  finalFlopPrice: string
}

export enum WinningDirection {
  Hype = 'Hype',
  Flop = 'Flop',
  None = 'None'
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

export type InitializeQuestionArgs = {
  marketId: number
  question: string
  startTime: number
  endTime: number
}

export type OpenOrderArgs = {
  marketId: number
  amount: number
  direction: OrderDirection
  comment?: string
}
