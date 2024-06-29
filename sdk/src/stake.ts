import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { ComputeBudgetProgram, PublicKey } from '@solana/web3.js'
import { TriadProtocol } from './types/triad_protocol'
import {
  formatStake,
  formatStakeVault,
  getATASync,
  getStakeVaultAddressSync
} from './utils/helpers'
import { RpcOptions } from './types'
import {
  DepositStakeRewardsArgs,
  InitializeStakeArgs,
  StakeArgs,
  RequestWithdrawArgs,
  WithdrawArgs
} from './types/stake'
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

    return response.map((stakeVault) => formatStakeVault(stakeVault.account))
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

    return formatStakeVault(
      await this.program.account.stakeVault.fetch(StakeVault)
    )
  }

  /**
   * Get all stakes
   */
  async getStakes() {
    const response = await this.program.account.stake.all()

    return response.map((stake) => formatStake(stake.account))
  }

  /**
   * Get Stake by wallet
   * @param wallet - User wallet
   */
  async getStakeByWallet(wallet: PublicKey) {
    const response = await this.program.account.stake.all()

    return response
      .filter((stake) => stake.account.authority.equals(wallet))
      .map((stake) => formatStake(stake.account))
  }

  async getStakeVaultRewards(stakeVault: string) {
    const StakeVault = getStakeVaultAddressSync(
      this.program.programId,
      stakeVault
    )
    const response = await this.program.account.stakeVault.fetch(StakeVault)

    const amount = response.amount.toNumber() / 10 ** TTRIAD_DECIMALS
    const period =
      (response.endTs.toNumber() - response.initTs.toNumber()) / (60 * 60 * 24) // Days
    const netAmount = amount - (amount * TTRIAD_FEE) / 100

    const data = {
      amount: netAmount,
      perDay: netAmount / period,
      perWeek: (netAmount / period) * 7,
      perMonth: (netAmount / period) * 30,
      period,
      days: []
    }

    for (
      let ts = response.initTs.toNumber() * 1000;
      ts <= response.endTs.toNumber() * 1000;
      ts += 1000 * 60 * 60 * 24
    ) {
      data.days.push(ts)
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

  /**
   *  Request Withdraw
   *  @param wallet - User wallet
   *  @param nftName - NFT name
   *  @param stakeVault - Name of the stake vault
   *
   */
  public async requestWithdraw(
    { wallet, nftName, mint, stakeVault }: RequestWithdrawArgs,
    options?: RpcOptions
  ) {
    const method = this.program.methods
      .requestWithdrawNft({
        nftName,
        stakeVault
      })
      .accounts({
        signer: wallet,
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
   *  Withdraw NFT
   *  @param wallet - User wallet
   *  @param nftName - NFT name
   *  @param mint - NFT mint
   *  @param stakeVault - Name of the stake vault
   *
   */
  public async withdraw(
    { wallet, nftName, mint, stakeVault }: WithdrawArgs,
    options?: RpcOptions
  ) {
    const StakeVault = getStakeVaultAddressSync(
      this.program.programId,
      stakeVault
    )

    const FromAta = getATASync(StakeVault, mint)
    const ToAta = getATASync(wallet, mint)

    const method = this.program.methods
      .withdrawNft({
        nftName,
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
