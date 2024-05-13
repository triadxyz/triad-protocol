import { AnchorProvider, Program, Wallet } from '@coral-xyz/anchor'
import { Connection } from '@solana/web3.js'
import { IDL, TriadProtocol } from './types/triad_protocol'
import { TRIAD_PROTOCOL_PROGRAM_ID } from './utils/constants'
import Vault from './vault'
import Ticker from './ticker'

export default class TriadProtocolClient {
  program: Program<TriadProtocol>
  provider: AnchorProvider
  vault: Vault
  ticker: Ticker

  constructor(connection: Connection, wallet: Wallet) {
    this.provider = new AnchorProvider(
      connection,
      wallet,
      AnchorProvider.defaultOptions()
    )

    this.program = new Program<any>(
      IDL,
      TRIAD_PROTOCOL_PROGRAM_ID,
      this.provider
    )
    this.vault = new Vault(this.program, this.provider)
    this.ticker = new Ticker(this.program, this.provider)
  }
}
