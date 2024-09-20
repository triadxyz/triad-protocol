import { AnchorProvider, Program } from '@coral-xyz/anchor'
import {
  ComputeBudgetProgram,
  PublicKey,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction
} from '@solana/web3.js'
import { TriadProtocol } from './types/triad_protocol'
import { getTickerAddressSync } from './utils/helpers'
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
   *  @param token mint - Token mint for the ticker (e.g. USDC)
   *
   */
  public async createTicker({
    name,
    tokenMint
  }: {
    name: string
    protocolProgramId: PublicKey
    tokenMint: PublicKey
  }) {
    return this.program.methods
      .createTicker({ name })
      .accounts({
        signer: this.provider.wallet.publicKey,
        payerTokenMint: tokenMint
      })
      .rpc()
  }
}
