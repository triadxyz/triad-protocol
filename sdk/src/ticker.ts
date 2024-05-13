import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { PublicKey } from '@solana/web3.js'
import { TriadProtocol } from './types/triad_protocol'
import { getTickerAddressSync, getVaultAddressSync } from './utils/helpers'

export default class Ticker {
  program: Program<TriadProtocol>
  provider: AnchorProvider

  constructor(program: Program<TriadProtocol>, provider: AnchorProvider) {
    this.provider = provider
    this.program = program
  }

  /**
   * Create a new ticker
   *  @param name - The ticker's name
   *  @param protocolProgramId - The program ID of the protocol
   *
   */
  public async createTicker({
    name,
    protocolProgramId
  }: {
    name: string
    protocolProgramId: PublicKey
  }) {
    const TickerPDA = getTickerAddressSync(
      this.program.programId,
      protocolProgramId
    )
    const VaultPDA = getVaultAddressSync(this.program.programId, TickerPDA)

    return this.program.methods
      .createTicker({ name, protocolProgramId })
      .accounts({
        ticker: TickerPDA,
        vault: VaultPDA
      })
      .rpc()
  }
}
