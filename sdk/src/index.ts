import { AnchorProvider, Program, Wallet } from '@coral-xyz/anchor'
import { ComputeBudgetProgram, Connection, PublicKey } from '@solana/web3.js'
import { TriadProtocol } from './types/triad_protocol'
import IDL from './types/idl_triad_protocol.json'
import Trade from './trade'
import { formatUser, getUserAddressSync } from './utils/helpers'
import Stake from './stake'
import { CreateUserArgs, RpcOptions } from './types'

export default class TriadProtocolClient {
  program: Program<TriadProtocol>
  provider: AnchorProvider
  trade: Trade
  stake: Stake

  constructor(connection: Connection, wallet: Wallet) {
    this.provider = new AnchorProvider(
      connection,
      wallet,
      AnchorProvider.defaultOptions()
    )

    this.program = new Program(IDL as TriadProtocol, this.provider)
    this.trade = new Trade(this.program, this.provider)
    this.stake = new Stake(this.program, this.provider)
  }

  /**
   * Get User by wallet
   * @param wallet - User wallet
   */
  getUser = async (wallet: PublicKey) => {
    const UserPDA = getUserAddressSync(this.program.programId, wallet)
    const response = await this.program.account.user.fetch(UserPDA)

    return formatUser(response)
  }

  /**
   * Get User by wallet
   * @param wallet - User wallet
   */
  getUsers = async () => {
    const response = await this.program.account.user.all()

    return response
      .map((item) => formatUser(item.account))
      .sort((a, b) => b.referred - a.referred)
  }

  /**
   * Check if user exists
   * @param username - User name
   */
  hasUser = async (wallet: PublicKey) => {
    try {
      await this.program.account.user.fetch(
        getUserAddressSync(this.program.programId, wallet)
      )

      return true
    } catch {
      return false
    }
  }

  /**
   * Get Refferal
   * @param name - User name
   */
  getReferral = async (name: string): Promise<string> => {
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
   */
  createUser = (
    { wallet, name, referral }: CreateUserArgs,
    options?: RpcOptions
  ) => {
    const method = this.program.methods
      .createUser({
        name
      })
      .accounts({
        signer: wallet,
        payer: wallet,
        referral
      })

    if (options?.microLamports) {
      method.postInstructions([
        ComputeBudgetProgram.setComputeUnitPrice({
          microLamports: options.microLamports
        })
      ])
    }

    return method.rpc({ skipPreflight: options?.skipPreflight })
  }
}
