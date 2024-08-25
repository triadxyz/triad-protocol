import { AnchorProvider, Program, Wallet } from '@coral-xyz/anchor'
import {
  ComputeBudgetProgram,
  Connection,
  PublicKey,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction
} from '@solana/web3.js'
import { TriadProtocol } from './types/triad_protocol'
import IDL from './types/idl_triad_protocol.json'
import Ticker from './ticker'
import Vault from './vault'
import {
  configOreProgramAddressSync,
  formatUser,
  getProofOreAddressSync,
  getUserAddressSync,
  getUserPositionAddressSync
} from './utils/helpers'
import Stake from './stake'
import { CreateUserArgs, MineOreArgs, OpenOreArgs, RpcOptions } from './types'
import { NOOP_PROGRAM_ID, ORE_PROGRAM_ID } from './utils/constants'

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
  getRefferal = async (name: string) => {
    try {
      const response = await this.program.account.user.all()

      const data = response.find((item) => item.account.name === name)

      return data.publicKey
    } catch {
      return ''
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
    const method = this.program.methods
      .createUser({
        name
      })
      .accounts({
        signer: wallet,
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

  openOre = async (
    { user, payer, name, referralName }: OpenOreArgs,
    options?: RpcOptions
  ) => {
    const userPDA = getUserAddressSync(this.program.programId, user)

    const ixs: TransactionInstruction[] = []

    try {
      await this.program.account.user.fetch(userPDA)
    } catch {
      const referral = await this.getRefferal(referralName)

      ixs.push(
        await this.program.methods
          .createUser({
            name
          })
          .accounts({
            signer: user,
            referral
          })
          .instruction()
      )
    }

    const proofInfoPDA = getProofOreAddressSync(userPDA)

    ixs.push(
      await this.program.methods
        .openOre()
        .accounts({
          signer: user,
          minerInfo: userPDA,
          proofInfo: proofInfoPDA,
          sysvarHashesInfo: new PublicKey(
            'SysvarS1otHashes111111111111111111111111111'
          ),
          oreProgram: new PublicKey(ORE_PROGRAM_ID)
        })
        .instruction()
    )

    if (options?.microLamports) {
      ixs.push(
        ComputeBudgetProgram.setComputeUnitPrice({
          microLamports: options.microLamports
        })
      )
    }

    const { blockhash } = await this.provider.connection.getLatestBlockhash()

    return this.provider.sendAndConfirm(
      new VersionedTransaction(
        new TransactionMessage({
          instructions: ixs,
          recentBlockhash: blockhash,
          payerKey: payer
        }).compileToV0Message()
      ),
      [],
      {
        skipPreflight: options?.skipPreflight,
        commitment: 'confirmed'
      }
    )
  }

  mineOre = async (
    { user, payer, bus, digest, nonce }: MineOreArgs,
    options?: RpcOptions
  ) => {
    const userPDA = getUserAddressSync(this.program.programId, user)
    const proofInfoPDA = getProofOreAddressSync(userPDA)

    const ixs: TransactionInstruction[] = []

    ixs.push(
      new TransactionInstruction({
        keys: [],
        programId: new PublicKey(NOOP_PROGRAM_ID),
        data: Buffer.from(proofInfoPDA.toBytes())
      })
    )

    ixs.push(
      await this.program.methods
        .mineOre({
          digest,
          nonce
        })
        .accounts({
          signer: user,
          bus,
          configProgram: configOreProgramAddressSync(),
          proofInfo: proofInfoPDA,
          sysvarHashesInfo: new PublicKey(
            'SysvarS1otHashes111111111111111111111111111'
          ),
          sysvarInstructionsInfo: new PublicKey(
            'Sysvar1nstructions1111111111111111111111111'
          ),
          oreProgram: new PublicKey(ORE_PROGRAM_ID)
        })
        .instruction()
    )

    if (options?.microLamports) {
      ixs.push(
        ComputeBudgetProgram.setComputeUnitPrice({
          microLamports: options.microLamports
        })
      )
    }

    const { blockhash } = await this.provider.connection.getLatestBlockhash()

    return this.provider.sendAndConfirm(
      new VersionedTransaction(
        new TransactionMessage({
          instructions: ixs,
          recentBlockhash: blockhash,
          payerKey: payer
        }).compileToV0Message()
      ),
      [],
      {
        skipPreflight: options?.skipPreflight,
        commitment: 'confirmed'
      }
    )
  }
}
