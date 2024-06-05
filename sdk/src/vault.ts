import { AnchorProvider, BN, Program } from '@coral-xyz/anchor'
import {
  ComputeBudgetProgram,
  PublicKey,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction
} from '@solana/web3.js'
import { TriadProtocol } from './types/triad_protocol'
import {
  getVaultAddressSync,
  getTokenVaultAddressSync,
  formatNumber,
  getUserPositionAddressSync
} from './utils/helpers'
import { getAccount, getAssociatedTokenAddress } from '@solana/spl-token'

export default class Vault {
  program: Program<TriadProtocol>
  provider: AnchorProvider

  constructor(program: Program<TriadProtocol>, provider: AnchorProvider) {
    this.provider = provider
    this.program = program
  }

  /**
   * Get all vaults
   */
  async getVaults() {
    return this.program.account.vault.all()
  }

  /**
   * Get vault by ticker Address
   */
  public async getVaultByTickerAddress(tickerAddress: PublicKey) {
    const VaultPDA = getVaultAddressSync(this.program.programId, tickerAddress)

    try {
      const vault = await this.program.account.vault.fetch(VaultPDA)

      const tokenAcc = await getAccount(
        this.provider.connection,
        vault.tokenAccount
      )

      return {
        ...vault,
        tvl: formatNumber(tokenAcc.amount)
      }
    } catch (e) {
      throw new Error(e)
    }
  }

  /**
   * Open Position
   *  @param tickerPDA - Ticker PDA
   *  @param amount - The amount to deposit
   *  @param position - Long or Short
   *  @param mint - Token mint for the vault (e.g. USDC)
   */
  public async openPosition(
    {
      tickerPDA,
      amount,
      position,
      mint
    }: {
      tickerPDA: PublicKey
      amount: string
      position: 'Long' | 'Short'
      mint: PublicKey
    },
    options?: { priorityFee: number }
  ) {
    try {
      const UserPositionPDA = getUserPositionAddressSync(
        this.program.programId,
        this.provider.wallet.publicKey,
        tickerPDA
      )
      const VaultPDA = getVaultAddressSync(this.program.programId, tickerPDA)
      const VaultTokenAccountPDA = getTokenVaultAddressSync(
        this.program.programId,
        VaultPDA
      )
      const userTokenAccount = await getAssociatedTokenAddress(
        mint,
        this.provider.wallet.publicKey
      )

      let hasUserPosition = false

      try {
        await this.program.account.userPosition.fetch(UserPositionPDA)

        hasUserPosition = true
      } catch {}

      const instructions: TransactionInstruction[] = []

      if (options?.priorityFee) {
        instructions.push(
          ComputeBudgetProgram.setComputeUnitPrice({
            microLamports: options.priorityFee
          })
        )
      }

      if (!hasUserPosition) {
        instructions.push(
          await this.program.methods
            .createUserPosition()
            .accounts({
              signer: this.provider.wallet.publicKey,
              userPosition: UserPositionPDA,
              ticker: tickerPDA
            })
            .instruction()
        )
      }

      instructions.push(
        await this.program.methods
          .openPosition({
            amount: new BN(amount),
            isLong: position === 'Long'
          })
          .accounts({
            userPosition: UserPositionPDA,
            ticker: tickerPDA,
            vault: VaultPDA,
            vaultTokenAccount: VaultTokenAccountPDA,
            userTokenAccount
          })
          .instruction()
      )

      const { blockhash } = await this.provider.connection.getLatestBlockhash()

      const message = new TransactionMessage({
        payerKey: this.provider.wallet.publicKey,
        recentBlockhash: blockhash,
        instructions
      }).compileToV0Message()

      const hash = await this.provider.sendAndConfirm(
        new VersionedTransaction(message)
      )

      const { blockhash: blockhash2, lastValidBlockHeight } =
        await this.provider.connection.getLatestBlockhash()

      const confirmTx = await this.provider.connection.confirmTransaction(
        {
          signature: hash,
          blockhash: blockhash2,
          lastValidBlockHeight
        },
        'finalized'
      )

      if (confirmTx.value.err) {
        throw new Error('Failed to open position')
      }

      return hash
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * Withdraw from a vault
   *  @param tickerPDA - Ticker PDA
   *  @param amount - The amount to deposit
   *  @param position - Long or Short
   *  @param mint - Token mint for the vault (e.g. USDC)
   *  @param positionPubkey - The position public key
   *
   */
  public async closePosition(
    {
      tickerPDA,
      mint,
      positionIndex
    }: {
      tickerPDA: PublicKey
      mint: PublicKey
      positionIndex: number
    },
    options?: { priorityFee: number }
  ) {
    try {
      const UserPositionPDA = getUserPositionAddressSync(
        this.program.programId,
        this.provider.wallet.publicKey,
        tickerPDA
      )
      const VaultPDA = getVaultAddressSync(this.program.programId, tickerPDA)
      const VaultTokenAccountPDA = getTokenVaultAddressSync(
        this.program.programId,
        VaultPDA
      )
      const userTokenAccount = await getAssociatedTokenAddress(
        mint,
        this.provider.wallet.publicKey
      )

      let hasUser = false

      try {
        await this.program.account.userPosition.fetch(UserPositionPDA)

        hasUser = true
      } catch (e) {
        console.log(e)
      }

      const instructions: TransactionInstruction[] = []

      if (options?.priorityFee) {
        instructions.push(
          ComputeBudgetProgram.setComputeUnitPrice({
            microLamports: options.priorityFee
          })
        )
      }

      if (!hasUser) {
        instructions.push(
          await this.program.methods
            .createUserPosition()
            .accounts({
              signer: this.provider.wallet.publicKey,
              userPosition: UserPositionPDA,
              ticker: tickerPDA
            })
            .instruction()
        )
      }

      instructions.push(
        await this.program.methods
          .closePosition({ positionIndex })
          .accounts({
            userPosition: UserPositionPDA,
            ticker: tickerPDA,
            vault: VaultPDA,
            vaultTokenAccount: VaultTokenAccountPDA,
            userTokenAccount
          })
          .instruction()
      )

      const { blockhash } = await this.provider.connection.getLatestBlockhash()

      const message = new TransactionMessage({
        payerKey: this.provider.wallet.publicKey,
        recentBlockhash: blockhash,
        instructions
      }).compileToV0Message()

      const hash = await this.provider.sendAndConfirm(
        new VersionedTransaction(message)
      )

      const { blockhash: blockhash2, lastValidBlockHeight } =
        await this.provider.connection.getLatestBlockhash()

      const confirmTx = await this.provider.connection.confirmTransaction(
        {
          signature: hash,
          blockhash: blockhash2,
          lastValidBlockHeight
        },
        'finalized'
      )

      if (confirmTx.value.err) {
        throw new Error('Failed to open position')
      }

      return hash
    } catch (error) {
      console.error(error)
    }
  }
}
