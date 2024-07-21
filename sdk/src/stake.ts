import { AnchorProvider, Program } from '@coral-xyz/anchor'
import {
  ComputeBudgetProgram,
  PublicKey,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction
} from '@solana/web3.js'
import { TriadProtocol } from './types/triad_protocol'
import {
  formatStake,
  formatStakeVault,
  getATASync,
  getNFTRewardsAddressSync,
  getStakeAddressSync,
  getStakeVaultAddressSync
} from './utils/helpers'
import { RpcOptions } from './types'
import {
  DepositStakeRewardsArgs,
  InitializeStakeArgs,
  StakeArgs,
  RequestWithdrawArgs,
  WithdrawArgs,
  StakeResponse,
  UpdateStakeVaultStatusArgs,
  UpdateStakeRewardsArgs,
  ClaimStakeRewardsArgs
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
   * Get all stakes by vault
   * @param stakeVault - Stake Vault name
   *
   */
  async getStakes(stakeVault: string) {
    const response = await this.program.account.stake.all()
    const StakeVault = getStakeVaultAddressSync(
      this.program.programId,
      stakeVault
    )

    return response
      .filter(
        (item) => item.account.stakeVault.toBase58() === StakeVault.toBase58()
      )
      .map((stake) => formatStake(stake.account))
  }

  /**
   * Get Stake by wallet
   * @param wallet - User wallet
   * @param stakeVault - Stake Vault name
   *
   */
  async getStakeByWallet(wallet: PublicKey, stakeVault: string) {
    const response = await this.getStakes(stakeVault)
    const stakeVaultByName = await this.getStakeVaultByName(stakeVault)

    const myStakes = response.filter(
      (item) => item.authority === wallet.toBase58()
    )

    for (const stake of myStakes) {
      try {
        const stakeRewards = await this.program.account.nftRewards.fetch(
          new PublicKey(stake.stakeRewards)
        )

        let start = stakeVaultByName.week * 7
        let end = stakeVaultByName.week == 4 ? 30 : start + 7

        stake.apr = stakeRewards.apr
        stake.dailyRewards = stakeRewards.dailyRewards.map(
          (reward) => reward.toNumber() / 10 ** TTRIAD_DECIMALS
        )
        stake.weeklyRewardsPaid = stakeRewards.weeklyRewardsPaid

        let rewards = stake.dailyRewards
          .slice(start, end)
          .reduce((a, b) => a + b, 0)
        let allRewards = stake.dailyRewards.reduce((a, b) => a + b)

        stake.rewardsToClaim = 0

        let index = 0
        let week = 0
        let limit = 7

        for (const item of stake.dailyRewards) {
          if (!stake.weeklyRewardsPaid[week]) {
            stake.rewardsToClaim += item
          }

          if (index === limit) {
            limit += 6
            week += 1
          }

          index++
        }

        stake.weeklyRewards = rewards
        stake.allRewards = allRewards
      } catch (error) {
        console.log(error)
        stake.apr = 0
        stake.dailyRewards = []
        stake.weeklyRewardsPaid = []
        stake.weeklyRewards = 0
        stake.rewardsToClaim = 0
        stake.allRewards = 0
      }
    }

    return myStakes
  }

  /**
   * Get Stake Vault Rewards details
   * @param stakeVault - Stake Vault name
   */
  async getStakeVaultRewards(stakeVault: string) {
    const StakeVault = getStakeVaultAddressSync(
      this.program.programId,
      stakeVault
    )
    const response = await this.program.account.stakeVault.fetch(StakeVault)

    const amount = response.amount.toNumber() / 10 ** TTRIAD_DECIMALS
    const period =
      (response.endTs.toNumber() - response.initTs.toNumber()) / (60 * 60 * 24)
    const netAmount = amount - (amount * TTRIAD_FEE) / 100

    const data: {
      amount: number
      perDay: number
      perWeek: number
      perMonth: number
      period: number
      days: number[]
    } = {
      amount: netAmount,
      perDay: netAmount / period,
      perWeek: (netAmount / period) * 7,
      perMonth: (netAmount / period) * 30,
      period,
      days: []
    }

    for (
      let ts = response.initTs.toNumber();
      ts <= response.endTs.toNumber();
      ts += 60 * 60 * 24
    ) {
      data.days.push(ts)
    }

    return data
  }

  /**
   * Get Stakes by day
   * @param stakeVault - Stake Vault name
   * @param day - Day timestamp
   */
  async getStakesByDay(stakeVault: string, day: number) {
    const stakes = await this.getStakes(stakeVault)

    const rewards: StakeResponse[] = []

    stakes.forEach((stake) => {
      const date = stake.initTs * 1000
      const stakeDay = day * 1000
      const currentDate = new Date().getTime()

      if (date <= stakeDay && stakeDay <= currentDate) {
        rewards.push(stake)
      }
    })

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
  public async stakeNft(
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
      .stakeNft({
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
    const Stake = getStakeAddressSync(this.program.programId, nftName)
    const NFTRewards = getNFTRewardsAddressSync(this.program.programId, Stake)

    const method = this.program.methods
      .withdrawNft({
        nftName,
        stakeVault
      })
      .accounts({
        signer: wallet,
        fromAta: FromAta,
        toAta: ToAta,
        nftRewards: NFTRewards,
        admin: new PublicKey('82ppCojm3yrEKgdpH8B5AmBJTU1r1uAWXFWhxvPs9UCR'),
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
   *  Update Stake Vault Status
   *  @param wallet - User wallet
   *  @param stakeVault - Name of the stake vault
   *  @param isLocked - Status of the stake vault
   *  @param week - Current week rewards (Starts from 0)
   *
   */
  public async updateStakeVaultStatus(
    { wallet, isLocked, week, stakeVault }: UpdateStakeVaultStatusArgs,
    options?: RpcOptions
  ) {
    const StakeVault = getStakeVaultAddressSync(
      this.program.programId,
      stakeVault
    )

    const method = this.program.methods
      .updateStakeVaultStatus({
        isLocked,
        week
      })
      .accounts({
        signer: wallet,
        stakeVault: StakeVault
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
   *  Update Stake Rewards
   *  @param wallet - User wallet
   *  @param nft_name - Name of the nft
   *  @param apr - APR based in the current day
   *  @param day - Day for update rewards (Starts from 0)
   *  @param rewards - Rewards for the day
   *
   */
  public async updateStakeRewards(
    { wallet, day, items }: UpdateStakeRewardsArgs,
    options?: RpcOptions
  ) {
    const ixs: TransactionInstruction[] = [
      ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: options.microLamports
      }),
      ComputeBudgetProgram.setComputeUnitLimit({
        units: 600000
      })
    ]

    for (const item of items) {
      const Stake = getStakeAddressSync(this.program.programId, item.nftName)

      ixs.push(
        await this.program.methods
          .updateStakeRewards({
            rewards: item.rewards,
            apr: item.apr,
            day
          })
          .accounts({
            signer: wallet,
            stake: Stake
          })
          .instruction()
      )
    }

    const { blockhash } = await this.provider.connection.getLatestBlockhash()

    const messageV0 = new TransactionMessage({
      instructions: ixs,
      recentBlockhash: blockhash,
      payerKey: wallet
    }).compileToV0Message()

    const tx = new VersionedTransaction(messageV0)

    return this.provider.sendAndConfirm(tx, [], {
      skipPreflight: options?.skipPreflight,
      commitment: 'confirmed'
    })
  }

  /**
   *  Claim Stake Rewards
   *  @param wallet - User wallet
   *  @param mint - NFT mint
   *  @param week - Week rewards
   *  @param stakeVault - Name of the stake vault
   *  @param nftName - Name of the nft
   *
   */
  public async claimStakeRewards(
    { wallet, mint, week, stakeVault, nftName }: ClaimStakeRewardsArgs,
    options?: RpcOptions
  ) {
    const StakeVault = getStakeVaultAddressSync(
      this.program.programId,
      stakeVault
    )
    const Stake = getStakeAddressSync(this.program.programId, nftName)
    const NFTRewards = getNFTRewardsAddressSync(this.program.programId, Stake)
    const FromAta = getATASync(StakeVault, mint)
    const ToAta = getATASync(wallet, mint)

    let ixs: TransactionInstruction[] = []

    for (let w of week) {
      ixs.push(
        await this.program.methods
          .claimStakeRewards({
            week: w
          })
          .accounts({
            signer: wallet,
            fromAta: FromAta,
            toAta: ToAta,
            mint: mint,
            nftRewards: NFTRewards,
            stake: Stake,
            stakeVault: StakeVault
          })
          .instruction()
      )
    }

    if (options?.microLamports) {
      ixs.push(
        ComputeBudgetProgram.setComputeUnitPrice({
          microLamports: options.microLamports
        })
      )
    }

    const { blockhash } = await this.provider.connection.getLatestBlockhash()
    const messageV0 = new TransactionMessage({
      payerKey: wallet,
      recentBlockhash: blockhash,
      instructions: ixs
    }).compileToV0Message()

    const tx = new VersionedTransaction(messageV0)

    return this.provider.sendAndConfirm(tx, [], {
      skipPreflight: options?.skipPreflight,
      commitment: 'confirmed'
    })
  }
}
