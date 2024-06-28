import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { ComputeBudgetProgram, PublicKey } from '@solana/web3.js'
import { TriadProtocol } from './types/triad_protocol'
import { getATASync, getStakeVaultAddressSync } from './utils/helpers'
import {
  DepositStakeRewardsArgs,
  InitializeStakeArgs,
  RpcOptions,
  StakeArgs
} from './types'
import { TTRIAD_DECIMALS, TTRIAD_FEE } from './utils/constants'

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
   * Get Stake Vault by name
   * @param stakeVault - Stake Vault name
   */
  async getStakeVaultByName(stakeVault: string) {
    const StakeVault = getStakeVaultAddressSync(
      this.program.programId,
      stakeVault
    )

    const response = await this.program.account.stakeVault.fetch(StakeVault)

    return {
      name: response.name,
      collection: response.collection,
      slots: response.slots.toNumber(),
      amount: response.amount.toNumber(),
      isLocked: response.isLocked,
      usersPaid: response.usersPaid,
      amountPaid: response.amountPaid.toNumber(),
      amountUsers: response.amountUsers.toNumber(),
      apr: response.apr,
      initTs: response.initTs.toNumber(),
      endTs: response.endTs.toNumber()
    }
  }

  /**
   * Get all stakes
   */
  async getStakes() {
    const response = await this.program.account.stake.all()

    return response.map((stake) => ({
      name: stake.account.name,
      collections: stake.account.collections,
      rarity: Object.keys(stake.account.rarity)[0],
      stakeVault: stake.account.stakeVault.toBase58(),
      authority: stake.account.authority.toBase58(),
      initTs: stake.account.initTs.toNumber(),
      isLocked: stake.account.isLocked,
      withdrawTs: stake.account.withdrawTs.toNumber(),
      mint: stake.account.mint.toBase58(),
      stakeRewards: stake.account.stakeRewards.toBase58()
    }))
  }

  /**
   * Get Stake by wallet
   * @param wallet - User wallet
   */
  async getStakeByWallet(wallet: PublicKey) {
    const response = await this.program.account.stake.all()

    return response
      .filter((stake) => stake.account.authority.equals(wallet))
      .map((stake) => ({
        name: stake.account.name,
        collections: stake.account.collections,
        rarity: Object.keys(stake.account.rarity)[0],
        stakeVault: stake.account.stakeVault.toBase58(),
        authority: stake.account.authority.toBase58(),
        initTs: stake.account.initTs.toNumber(),
        isLocked: stake.account.isLocked,
        withdrawTs: stake.account.withdrawTs.toNumber(),
        mint: stake.account.mint.toBase58(),
        stakeRewards: stake.account.stakeRewards.toBase58()
      }))
  }

  async getStakeVaultRewards(stakeVault: string) {
    const StakeVault = getStakeVaultAddressSync(
      this.program.programId,
      stakeVault
    )

    const response = await this.program.account.stakeVault.fetch(StakeVault)

    const data: {
      amount: number
      perDay: number
      perWeek: number
      perMonth: number
      period: number
      days: number[]
    } = {
      amount: 0,
      perDay: 0,
      perWeek: 0,
      perMonth: 0,
      period: 0,
      days: []
    }

    const amount = response.amount.toNumber() / 10 ** TTRIAD_DECIMALS

    data.period =
      (response.endTs.toNumber() * 1000 - response.initTs.toNumber() * 1000) /
      (1000 * 60 * 60 * 24)
    data.amount = amount - (amount * TTRIAD_FEE) / 100
    data.perDay = data.amount / data.period
    data.perWeek = data.perDay * 7
    data.perMonth = data.perDay * 30

    const endTsInMs = response.endTs.toNumber() * 1000
    const initTsInMs = response.initTs.toNumber() * 1000

    let currentTs = initTsInMs

    while (currentTs <= endTsInMs) {
      data.days.push(currentTs)
      currentTs = currentTs + 1000 * 60 * 60 * 24
    }

    return data
  }

  async getStakeRewardsByWallet(
    wallet: PublicKey,
    stakeVaultRewards: {
      amount: number
      perDay: number
      perWeek: number
      perMonth: number
      period: number
      days: number[]
    }
  ) {
    const stakes = await this.getStakeByWallet(wallet)

    const rewards = {}

    for (const day of stakeVaultRewards.days) {
      stakes.forEach((stake) => {
        const date = stake.initTs * 1000
        const currentDate = new Date().getTime()

        if (date <= day && day <= currentDate) {
          const key = new Date(day).toISOString().split('T')[0]

          if (!rewards[key]) {
            rewards[key] = []
          }

          rewards[key].push(stake)
        }
      })
    }

    return rewards
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
    { name, wallet, mint, collections, rarity, stakeVault }: StakeArgs,
    options?: RpcOptions
  ) {
    const FromAta = getATASync(wallet, mint)
    const StakeVault = getStakeVaultAddressSync(
      this.program.programId,
      stakeVault
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
        stakeVault
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
   *  @param slots - Amount available to users joining the vault
   *  @param collection - The Collection name
   *
   */
  public async initializeStakeVault(
    { name, slots, collection, amount }: InitializeStakeArgs,
    options?: RpcOptions
  ) {
    const method = this.program.methods
      .initializeStakeVault({
        name,
        slots,
        collection,
        amount
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

  /**
   *  Deposit Stake Rewards
   *  @param wallet - User wallet
   *  @param mint - NFT mint
   *  @param amount - Reward amount
   *
   */
  public async depositStakeRewards(
    { wallet, mint, amount, stakeVault }: DepositStakeRewardsArgs,
    options?: RpcOptions
  ) {
    const FromAta = getATASync(wallet, mint)
    const StakeVault = getStakeVaultAddressSync(
      this.program.programId,
      stakeVault
    )
    const ToAta = getATASync(StakeVault, mint)

    const method = this.program.methods
      .depositStakeRewards({
        amount,
        stakeVault
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
}
