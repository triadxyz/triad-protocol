import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { PublicKey } from '@solana/web3.js'
import { TriadProtocol } from './types/triad_protocol'
import {
  getTickerAddressSync,
  getTokenVaultAddressSync,
  getVaultAddressSync
} from './utils/helpers'
import { BN } from 'bn.js'

export default class Ticker {
  program: Program<TriadProtocol>
  provider: AnchorProvider

  constructor(program: Program<TriadProtocol>, provider: AnchorProvider) {
    this.provider = provider
    this.program = program
  }

  /**
   * Get all tickers
   */
  async getTickers() {
    return this.program.account.ticker.all()
  }

  /**
   * Create a new ticker
   *  @param name - The ticker's name
   *  @param protocolProgramId - The program ID of the protocol
   *  @param token mint - Token mint for the ticker (e.g. USDC)
   *
   */
  public async createTicker({
    name,
    protocolProgramId,
    tokenMint
  }: {
    name: string
    protocolProgramId: PublicKey
    tokenMint: PublicKey
  }) {
    const TickerPDA = getTickerAddressSync(this.program.programId, name)
    const VaultPDA = getVaultAddressSync(this.program.programId, TickerPDA)
    const TokenAccountPDA = getTokenVaultAddressSync(
      this.program.programId,
      VaultPDA
    )

    return this.program.methods
      .createTicker({ name, protocolProgramId })
      .accounts({
        signer: this.provider.wallet.publicKey,
        ticker: TickerPDA,
        vault: VaultPDA,
        tokenAccount: TokenAccountPDA,
        payerTokenMint: tokenMint
      })
      .rpc()
  }

  /**
   * Update a ticker's price
   *  @param name - The ticker's name
   *  @param price - The ticker's price
   *
   */
  public async updateTickerPrice({
    name,
    price
  }: {
    name: string
    price: string
  }) {
    const TickerPDA = getTickerAddressSync(this.program.programId, name)

    return this.program.methods
      .updateTickerPrice({ price: new BN(price) })
      .accounts({
        signer: this.provider.wallet.publicKey,
        ticker: TickerPDA
      })
      .rpc()
  }
}
