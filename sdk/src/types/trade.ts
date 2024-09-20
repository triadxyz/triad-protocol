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
  lastUpdateTs: number
  openOrdersCount: number
  nextOrderId: number
  feeBps: number
  feeVault: string
  isActive: boolean
  isOfficial: boolean
}
