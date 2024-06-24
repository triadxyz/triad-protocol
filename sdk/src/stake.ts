import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { ComputeBudgetProgram, PublicKey } from '@solana/web3.js'
import { TriadProtocol } from './types/triad_protocol'
import { getATASync, getStakeVaultAddressSync } from './utils/helpers'
import BN from 'bn.js'
import { RpcOptions } from './types'

export default class Stake {
  program: Program<TriadProtocol>
  provider: AnchorProvider

  constructor(program: Program<TriadProtocol>, provider: AnchorProvider) {
    this.provider = provider
    this.program = program
  }

  /**
   * Get all Stake Vaults
   */
  async getStakeVaults() {
    const response = await this.program.account.stakeVault.all()

    return response.map((stakeVault) => ({
      name: stakeVault.account.name,
      collection: stakeVault.account.collection,
      slots: stakeVault.account.slots.toNumber(),
      amount: stakeVault.account.amount.toNumber(),
      isLocked: stakeVault.account.isLocked,
      usersPaid: stakeVault.account.usersPaid,
      amountPaid: stakeVault.account.amountPaid.toNumber(),
      amountUsers: stakeVault.account.amountUsers.toNumber(),
      apr: stakeVault.account.apr,
      initTs: stakeVault.account.initTs.toNumber(),
      endTs: stakeVault.account.endTs.toNumber()
    }))
  }

  /**
   * Get all stakes
   */
  async getStakes() {
    const response = await this.program.account.stake.all()

    return response.map((stake) => ({
      name: stake.account.name,
      collections: stake.account.collections,
      rarity: stake.account.rarity,
      stakeVault: stake.account.stakeVault,
      account: stake.account.authority,
      initTs: stake.account.initTs.toNumber(),
      isLocked: stake.account.isLocked,
      withdrawTs: stake.account.withdrawTs.toNumber(),
      mint: stake.account.mint
    }))
  }

  async getStakeByWallet(wallet: PublicKey) {
    const response = await this.program.account.stake.all()

    return response
      .filter((stake) => stake.account.authority.equals(wallet))
      .map((stake) => ({
        name: stake.account.name,
        collections: stake.account.collections,
        rarity: stake.account.rarity,
        stakeVault: stake.account.stakeVault,
        account: stake.account.authority,
        initTs: stake.account.initTs.toNumber(),
        isLocked: stake.account.isLocked,
        withdrawTs: stake.account.withdrawTs.toNumber(),
        mint: stake.account.mint
      }))
  }

  /**
   *  Stake NFT
   *  @param name - NFT name
   *  @param wallet - User wallet
   *  @param mint - NFT mint
   *  @param collections - NFT collections
   *  @param rarity - NFT rarity
   *
   */
  public async stake(
    {
      name,
      wallet,
      mint,
      collections,
      rarity
    }: {
      name: string
      wallet: PublicKey
      mint: PublicKey
      collections: {
        alligators: boolean
        coleta: boolean
        undead: boolean
        pyth: boolean
      }
      rarity:
        | { common: {} }
        | { uncommon: {} }
        | { rare: {} }
        | { epic: {} }
        | { legendary: {} }
        | { mythic: {} }
    },
    options?: RpcOptions
  ) {
    const stakeVaultName = 'Triad Share 1'
    const FromAta = getATASync(wallet, mint)
    const StakeVault = getStakeVaultAddressSync(
      this.program.programId,
      stakeVaultName
    )
    const ToAta = getATASync(StakeVault, mint)

    let items = []

    Object.keys(collections).forEach((key) => {
      if (collections[key]) {
        items.push({ [key]: {} })
      }
    })

    const method = this.program.methods
      .stake({
        name,
        collections: items,
        rarity,
        stakeVault: stakeVaultName
      })
      .accounts({
        signer: wallet,
        fromAta: FromAta,
        toAta: ToAta,
        mint: mint
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

  /**
   *  Initialize Stake Vault
   *  @param name - The ticker's name
   *  @param amount - Reward amount
   *  @param slots - Amount available to users joining the vault
   *  @param collection - The Collection name
   *
   */
  public async initializeStakeVault(
    {
      name,
      amount,
      slots,
      collection
    }: {
      name: string
      amount: BN
      slots: BN
      collection: string
    },
    options?: RpcOptions
  ) {
    const method = this.program.methods
      .initializeStakeVault({
        name,
        amount,
        slots,
        collection
      })
      .accounts({
        signer: this.provider.wallet.publicKey
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
