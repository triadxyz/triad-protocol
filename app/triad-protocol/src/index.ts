import { AnchorProvider, Program, Wallet } from '@coral-xyz/anchor'
import { Connection } from '@solana/web3.js'
import { IDL, TriadProtocol } from './types/triad_protocol'
import { TRIAD_PROTOCOL_PROGRAM_ID } from './utils/constants'
import { convertSecretKeyToKeypair } from './utils/convertSecretKeyToKeypair'

export default class TriadProtocolClient {
  program: Program<TriadProtocol>
  provider: AnchorProvider
  connection: Connection
  wallet: Wallet

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
  }
}

const connection = new Connection(
  'https://renaissancebr-pit.rpcpool.com/24aa1f64-6e92-4c7b-9599-91956a4220e4'
)

const keypair = convertSecretKeyToKeypair(
  'DG4SC7Hjk6szDCQWv4kpcmwzUC2A5kkA4t4rPhDMVLhGm1mR9yrVkCseyQZknvfaaTis5Q1dHVtNRmMPVZreRfL'
)

const wallet = new Wallet(keypair)

const triad = new TriadProtocolClient(connection, wallet)
const main = () => {}

main()
