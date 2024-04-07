import { AnchorProvider, Program, Wallet } from '@coral-xyz/anchor'
import {
  Connection,
  TransactionMessage,
  VersionedTransaction
} from '@solana/web3.js'
import { IDL, TriadMarkets } from './types/triad_markets'
import { TRIAD_MARKETS_PROGRAM_ID } from './utils/constants'
import { encodeString } from './utils/helpers'

export default class TriadMarketClient {
  program: Program<TriadMarkets>
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
      TRIAD_MARKETS_PROGRAM_ID,
      this.provider
    )
  }

  /**
   * Create a new Ticket
   *  @param name User name
   *  @param bio bio name
   *  @param avatar Avatar name
   */
  createUser = async ({
    name,
    bio,
    avatar
  }: {
    name: string
    bio: string
    avatar: string
  }) => {
    const UserPDA = getUserPDA(this.wallet.publicKey, this.program.programId)

    const ix = await this.program.methods
      .createUser({
        name: encodeString(name),
        bio: bio,
        avatar: avatar
      })
      .accounts({
        signer: this.wallet.publicKey,
        user: UserPDA
      })
      .instruction()

    const { blockhash } = await this.connection.getLatestBlockhash()

    const message = new TransactionMessage({
      payerKey: this.wallet.publicKey,
      instructions: [ix],
      recentBlockhash: blockhash
    }).compileToV0Message()

    const signature = await this.wallet.signTransaction(
      new VersionedTransaction(message)
    )

    const hash = await this.connection.sendRawTransaction(signature.serialize())

    return hash
  }
}
