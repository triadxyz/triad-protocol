import { AnchorProvider, Program, Wallet } from '@coral-xyz/anchor'
import { IDL, TriadProtocol } from './types/triad_protocol'
import { Connection, PublicKey } from '@solana/web3.js'
import { TRIAD_PROTOCOL_PROGRAM_ID } from './utils/constants'
import { encodeString } from './utils/helpers'

export default class Ticker {
  program: Program<TriadProtocol>
  provider: AnchorProvider
  connection: Connection
  wallet: Wallet

  constructor(connection: Connection, wallet?: Wallet) {
    this.connection = connection
    this.wallet = wallet
    this.provider = new AnchorProvider(
      this.connection,
      this.wallet,
      AnchorProvider.defaultOptions()
    )

    this.program = new Program<TriadProtocol>(
      IDL,
      TRIAD_PROTOCOL_PROGRAM_ID,
      this.provider
    )
  }

  /**
   * Create a new ticker
   *  @param name - The ticker's name
   *  @param pythPricePubKey - The pubkey of a token pairs
   *
   */
  public async createTicker({
    name,
    pythPricePubKey,
    protocolProgramId = new PublicKey(
      'dRiftyHA39MWEi3m9aunc5MzRF1JYuBsbn6VPcn33UH'
    )
  }: {
    name: string
    pythPricePubKey: PublicKey
    protocolProgramId: PublicKey
  }) {
    const tickerName = encodeString(name)
  }
}
