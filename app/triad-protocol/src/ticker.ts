import { AnchorProvider, Program, Wallet } from '@coral-xyz/anchor'
import { IDL, TriadProtocol } from './types/triad_protocol'
import { Connection, PublicKey } from '@solana/web3.js'
import { TRIAD_PROTOCOL_PROGRAM_ID } from './utils/constants'
import { decodeIdlAccount } from '@project-serum/anchor/dist/cjs/idl'
import { utf8 } from '@project-serum/anchor/dist/cjs/utils/bytes'
import { inflate } from 'pako'
import { encodeString } from './utils/helpers'
import { BN } from 'bn.js'
import { convertSecretKeyToKeypair } from './utils/convertSecretKeyToKeypair'

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

    const base = (
      await PublicKey.findProgramAddressSync([], protocolProgramId)
    )[0]
    const idlAddress = await PublicKey.createWithSeed(
      base,
      'anchor:idl',
      protocolProgramId
    )
    const idlAccountInfo = await this.connection.getAccountInfo(idlAddress)
    const idlAccount = decodeIdlAccount(idlAccountInfo.data.slice(8)) // chop off discriminator
    const inflatedIdl = inflate(idlAccount.data)
    const idlJson = JSON.parse(utf8.decode(inflatedIdl))

    console.log(idlJson, 'asasas')

    const p = new Program(idlJson, protocolProgramId)

    console.log(p.account.state!.all())

    return this.program.methods
      .createTicker({
        name: tickerName,
        pythPricePubKey: pythPricePubKey,
        priceOnchain: new BN(10)
      })
      .accounts({
        signer: this.wallet.publicKey
      })
      .rpc()
  }
}

