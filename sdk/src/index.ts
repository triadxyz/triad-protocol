import { AnchorProvider, Program, Wallet } from '@coral-xyz/anchor'
import { ComputeBudgetProgram, Connection, PublicKey } from '@solana/web3.js'
import { TriadProtocol } from './types/triad_protocol'
import IDL from './types/idl_triad_protocol.json'
import Ticker from './ticker'
import Vault from './vault'
import {
  formatUser,
  getUserAddressSync,
  getUserPositionAddressSync
} from './utils/helpers'
import Stake from './stake'
import { CreateUserArgs, RpcOptions } from './types'

export default class TriadProtocolClient {
  program: Program<TriadProtocol>
  provider: AnchorProvider
  ticker: Ticker
  vault: Vault
  stake: Stake

  constructor(connection: Connection, wallet: Wallet) {
    this.provider = new AnchorProvider(
      connection,
      wallet,
      AnchorProvider.defaultOptions()
    )

    this.program = new Program(IDL as TriadProtocol, this.provider)
    this.ticker = new Ticker(this.program, this.provider)
    this.vault = new Vault(this.program, this.provider)
    this.stake = new Stake(this.program, this.provider)
  }

  /**
   * Get all Users
   */
  getUsers = async () => {
    const response = await this.program.account.user.all()

    return response.map((item) => formatUser(item.account))
  }

  hasReferral = async (referral: string) => {
    try {
      await this.program.account.user.fetch(
        getUserAddressSync(this.program.programId, referral)
      )

      return true
    } catch {
      return false
    }
  }

  getUserPositions = async (userWallet: PublicKey) => {
    const tickers = await this.ticker.getTickers()

    const positions = await Promise.all(
      tickers
        .map(async (ticker) => {
          let data = {}

          try {
            const UserPositionPDA = getUserPositionAddressSync(
              this.program.programId,
              userWallet,
              ticker.publicKey
            )
            const position =
              await this.program.account.userPosition.fetch(UserPositionPDA)

            data = {
              ticker,
              position
            }
          } catch {
            return
          }

          return data
        })
        .filter(Boolean)
    )

    return positions
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
    const referralPDA = getUserAddressSync(this.program.programId, referral)

    const method = this.program.methods
      .createUser({
        name,
        referral: referralPDA
      })
      .accounts({
        signer: wallet,
        referral: referralPDA
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
