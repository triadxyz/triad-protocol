import { AnchorProvider, Program, Wallet } from '@coral-xyz/anchor'
import { Connection, PublicKey } from '@solana/web3.js'
import { TriadProtocol } from './types/triad_protocol'
import IDL from './types/idl_triad_protocol.json'
import Trade from './trade'
import { formatUser } from './utils/helpers'
import { getUserPDA } from './utils/pda'
import Stake from './stake'
import { CreateUserArgs, RpcOptions } from './types'
import sendTransactionWithOptions from './utils/sendTransactionWithOptions'

export default class TriadProtocolClient {
  program: Program<TriadProtocol>
  provider: AnchorProvider
  trade: Trade
  stake: Stake

  constructor(connection: Connection, wallet: Wallet) {
    this.provider = new AnchorProvider(connection, wallet, {
      commitment: 'confirmed'
    })
    this.program = new Program(IDL as TriadProtocol, this.provider)

    this.trade = new Trade(this.program, this.provider)
    this.stake = new Stake(this.program, this.provider)
  }

  /**
   * Get User by wallet
   * @param wallet - User wallet
   *
   */
  async getUser(wallet: PublicKey) {
    const userPDA = getUserPDA(this.program.programId, wallet)

    return formatUser(await this.program.account.user.fetch(userPDA))
  }

  /**
   * Get User by wallet
   * @param wallet - User wallet
   *
   */
  async getUsers() {
    const response = await this.program.account.user.all()

    return response
      .map((item) => formatUser(item.account))
      .sort((a, b) => b.referred - a.referred)
  }

  /**
   * Check if user exists
   * @param username - User name
   *
   */
  async hasUser(wallet: PublicKey) {
    try {
      await this.program.account.user.fetch(
        getUserPDA(this.program.programId, wallet)
      )

      return true
    } catch {
      return false
    }
  }

  /**
   * Get Refferal
   * @param name - User name
   *
   */
  async getReferral(name: string) {
    try {
      const users = await this.program.account.user.all([
        {
          memcmp: {
            offset: 8,
            bytes: Buffer.from(name).toString('base64')
          }
        }
      ])

      if (users.length > 0) {
        return users[0].publicKey.toString()
      }

      return ''
    } catch (error) {
      console.error('Error fetching referral:', error)
      return ''
    }
  }

  /**
   *  Create User
   *  @param wallet - User wallet
   *  @param name - user name
   *  @param referral - user referral
   *
   *  @param options - RPC options
   *
   */
  async createUser(
    { wallet, name, referral }: CreateUserArgs,
    options?: RpcOptions
  ) {
    return sendTransactionWithOptions(
      this.program.methods
        .createUser({
          name
        })
        .accounts({
          signer: wallet,
          referral
        }),
      options
    )
  }
}
