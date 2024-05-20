import { Address, AnchorProvider, Program, Wallet } from '@coral-xyz/anchor'
import { Connection, PublicKey } from '@solana/web3.js'
import { IDL, TriadProtocol } from './types/triad_protocol'
import { TRIAD_PROTOCOL_PROGRAM_ID } from './utils/constants'
import Ticker from './ticker'
import { getUserAddressSync } from './utils/helpers'
import Vault from './vault'
import { convertSecretKeyToKeypair } from './utils/convertSecretKeyToKeypair'

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
   * Get all users
   */
  // async getUsers() {
  //   return this.program.account.userPosition.fetch()
  // }

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
