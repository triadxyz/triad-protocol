import { AnchorProvider, Program, Wallet } from '@coral-xyz/anchor'
import { Connection } from '@solana/web3.js'
import { IDL, TriadProtocol } from './types/triad_protocol'
import { TRIAD_PROTOCOL_PROGRAM_ID } from './utils/constants'
import Vault from './vault'

export default class TriadProtocolClient {
  program: Program<TriadProtocol>
  provider: AnchorProvider
  connection: Connection
  wallet: Wallet
  vault: Vault

  constructor(connection: Connection, wallet: Wallet) {
    this.connection = connection
    this.wallet = wallet
    this.provider = new AnchorProvider(
      this.connection,
      this.wallet,
      AnchorProvider.defaultOptions()
    )
    this.program = new Program<any>(
      IDL,
      TRIAD_PROTOCOL_PROGRAM_ID,
      this.provider
    )
    this.vault = new Vault(this.connection, this.wallet)
  }
}
