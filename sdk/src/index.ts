import { Address, AnchorProvider, Program, Wallet } from '@coral-xyz/anchor'
import { Connection } from '@solana/web3.js'
import { IDL, TriadProtocol } from './types/triad_protocol'
import { TRIAD_PROTOCOL_PROGRAM_ID } from './utils/constants'
import Ticker from './ticker'
import { getUserAddressSync } from './utils/helpers'
import Vault from './vault'

export default class TriadProtocolClient {
  program: Program<TriadProtocol>
  provider: AnchorProvider
  ticker: Ticker
  vault: Vault

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
    this.ticker = new Ticker(this.program, this.provider)
    this.vault = new Vault(this.program, this.provider)
  }

  /**
   * Create a new user
   *  @param name - The ticker's name
   *  @param referrer - The referrer's public key
   *  @param community - The community's public key
   *
   */
  public async createUser({
    name,
    referrer,
    community
  }: {
    name: string
    referrer: string
    community: string
  }) {
    const UserPDA = getUserAddressSync(
      this.program.programId,
      this.provider.wallet.publicKey
    )

    return this.program.methods
      .createUser({
        name,
        referrer,
        community
      })
      .accounts({
        signer: this.provider.wallet.publicKey,
        user: UserPDA
      })
      .rpc()
  }

  /**
   * Get user data
   *  @param user - The user's public key
   *
   */
  public async getUserData(user: Address) {
    try {
      return this.program.account.user.fetch(user)
    } catch (error) {
      throw new Error('User not found')
    }
  }
}
