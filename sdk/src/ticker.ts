import { AnchorProvider, Program } from '@coral-xyz/anchor'
import {
  ComputeBudgetProgram,
  PublicKey,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction
} from '@solana/web3.js'
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
    return this.program.methods
      .createTicker({ name, protocolProgramId })
      .accounts({
        signer: this.provider.wallet.publicKey,
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

    const instructions: TransactionInstruction[] = [
      ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: 12000
      })
    ]

    instructions.push(
      await this.program.methods
        .updateTickerPrice({ price: new BN(price) })
        .accounts({
          signer: this.provider.wallet.publicKey,
          ticker: TickerPDA
        })
        .instruction()
    )

    const { blockhash } = await this.provider.connection.getLatestBlockhash()

    const message = new TransactionMessage({
      payerKey: this.provider.wallet.publicKey,
      recentBlockhash: blockhash,
      instructions
    }).compileToV0Message()

    return this.provider.sendAndConfirm(new VersionedTransaction(message))
  }
}
