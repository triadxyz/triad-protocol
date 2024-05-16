import { AnchorProvider, BN, Program } from '@coral-xyz/anchor'
import {
  PublicKey,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction
} from '@solana/web3.js'
import { TriadProtocol } from './types/triad_protocol'
import {
  getVaultAddressSync,
  getTokenVaultAddressSync,
  encodeString,
  formatNumber,
  getTickerAddressSync,
  getUserAddressSync
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
   * Create a new vault
   *  @param protocolProgramId - The program ID of the protocol
   *  @param mint - Token mint for the vault (e.g. USDC)
   *
   */
  public async createVault({
    protocolProgramId,
    mint
  }: {
    protocolProgramId: PublicKey
    mint: PublicKey
  }) {
    const TickerPDA = getTickerAddressSync(
      this.program.programId,
      protocolProgramId
    )
    const VaultPDA = getVaultAddressSync(this.program.programId, TickerPDA)
    const TokenAccountPDA = getTokenVaultAddressSync(
      this.program.programId,
      VaultPDA
    )

    return this.program.methods
      .createVault()
      .accounts({
        signer: this.provider.wallet.publicKey,
        vault: VaultPDA,
        ticker: TickerPDA,
        tokenAccount: TokenAccountPDA,
        payerTokenMint: mint
      })
      .rpc()
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
  public async openPosition({
    tickerPDA,
    amount,
    position,
    mint
  }: {
    tickerPDA: PublicKey
    amount: string
    position: 'Long' | 'Short'
    mint: PublicKey
  }) {
    const UserPDA = getUserAddressSync(
      this.program.programId,
      this.provider.wallet.publicKey
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

    return this.program.methods
      .openPosition({
        amount: new BN(amount),
        isLong: position === 'Long'
      })
      .accounts({
        user: UserPDA,
        vault: VaultPDA,
        vaultTokenAccount: VaultTokenAccountPDA,
        userTokenAccount
      })
      .rpc()
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
  public async withdraw({
    tickerPDA,
    amount,
    position,
    mint,
    positionPubkey
  }: {
    tickerPDA: PublicKey
    amount: string
    position: 'Long' | 'Short'
    mint: PublicKey
    positionPubkey: PublicKey
  }) {
    const UserPDA = getUserAddressSync(
      this.program.programId,
      this.provider.wallet.publicKey
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

    return this.program.methods
      .closePosition({
        amount: new BN(amount),
        isLong: position === 'Long',
        pubkey: positionPubkey
      })
      .accounts({
        user: UserPDA,
        vault: VaultPDA,
        vaultTokenAccount: VaultTokenAccountPDA,
        userTokenAccount
      })
      .rpc()
  }
}
