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
}
