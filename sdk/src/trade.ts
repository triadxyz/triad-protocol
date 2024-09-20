import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { TriadProtocol } from './types/triad_protocol'
import { Market } from './types/trade'
import { PublicKey } from '@solana/web3.js'

export default class Trade {
  program: Program<TriadProtocol>
  provider: AnchorProvider

  constructor(program: Program<TriadProtocol>, provider: AnchorProvider) {
    this.provider = provider
    this.program = program
  }

  /**
   * Get all Markets
   */
  async getMarkets(): Promise<Market[]> {
    return this.program.account.market.all().then((markets) =>
      markets.map(({ account }) => ({
        bump: account.bump,
        authority: account.authority.toString(),
        marketId: account.marketId.toNumber(),
        name: account.name,
        hypePrice: account.hypePrice.toNumber(),
        flopPrice: account.flopPrice.toNumber(),
        hypeLiquidity: account.hypeLiquidity.toNumber(),
        flopLiquidity: account.flopLiquidity.toNumber(),
        totalHypeShares: account.totalHypeShares.toNumber(),
        totalFlopShares: account.totalFlopShares.toNumber(),
        totalVolume: account.totalVolume.toNumber(),
        vaultTokenAccount: account.vaultTokenAccount.toString(),
        mint: account.mint.toString(),
        lastUpdateTs: account.lastUpdateTs.toNumber(),
        openOrdersCount: account.openOrdersCount.toNumber(),
        nextOrderId: account.nextOrderId.toNumber(),
        feeBps: account.feeBps,
        feeVault: account.feeVault.toBase58(),
        isActive: account.isActive,
        isOfficial: account.isOfficial
      }))
    )
  }

  /**
   * Get Market By Address
   */
  async getMarketByAddress(address: PublicKey): Promise<Market> {
    const account = await this.program.account.market.fetch(address)

    return {
      bump: account.bump,
      authority: account.authority.toString(),
      marketId: account.marketId.toNumber(),
      name: account.name,
      hypePrice: account.hypePrice.toNumber(),
      flopPrice: account.flopPrice.toNumber(),
      hypeLiquidity: account.hypeLiquidity.toNumber(),
      flopLiquidity: account.flopLiquidity.toNumber(),
      totalHypeShares: account.totalHypeShares.toNumber(),
      totalFlopShares: account.totalFlopShares.toNumber(),
      totalVolume: account.totalVolume.toNumber(),
      vaultTokenAccount: account.vaultTokenAccount.toString(),
      mint: account.mint.toString(),
      lastUpdateTs: account.lastUpdateTs.toNumber(),
      openOrdersCount: account.openOrdersCount.toNumber(),
      nextOrderId: account.nextOrderId.toNumber(),
      feeBps: account.feeBps,
      feeVault: account.feeVault.toBase58(),
      isActive: account.isActive,
      isOfficial: account.isOfficial
    }
  }
}
