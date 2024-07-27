import { AnchorProvider, BN, Program } from '@coral-xyz/anchor'
import { ComputeBudgetProgram, PublicKey } from '@solana/web3.js'
import { TriadProtocol } from './types/triad_protocol'
import {
  formatStake,
  formatStakeVault,
  getATASync,
  getStakeAddressSync,
  getStakeVaultAddressSync
} from './utils/helpers'
import { RpcOptions } from './types'
import {
  DepositStakeRewardsArgs,
  InitializeStakeArgs,
  StakeNftArgs,
  RequestWithdrawArgs,
  WithdrawArgs,
  StakeResponse,
  UpdateStakeVaultStatusArgs,
  ClaimStakeRewardsArgs,
  StakeTokenArgs
} from './types/stake'
import { TTRIAD_DECIMALS, TTRIAD_FEE, TTRIAD_MINT } from './utils/constants'

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
    const response = await this.program.account.stakeV2.all()
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

    const myStakes = response.filter(
      (item) => item.authority === wallet.toBase58()
    )

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
   *
   */
  public async stakeNft(
    { name, wallet, mint, stakeVault }: StakeNftArgs,
    options?: RpcOptions
  ) {
    const FromAta = getATASync(wallet, mint)

    const method = this.program.methods
      .stakeNft({
        name,
        stakeVault
      })
      .accounts({
        signer: wallet,
        fromAta: FromAta,
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
   *  Stake NFT
   *  @param wallet - User wallet
   *  @param mint - NFT mint
   *  @param collections - NFT collections
   *  @param rarity - NFT rarity
   *
   */
  public async stakeToken(
    { name, wallet, stakeVault, amount }: StakeTokenArgs,
    options?: RpcOptions
  ) {
    const ttriad = new PublicKey(TTRIAD_MINT)
    const FromAta = getATASync(wallet, ttriad)

    const method = this.program.methods
      .stakeToken({
        name,
        amount: new BN(amount * 10 ** 6),
        stakeVault
      })
      .accounts({
        signer: wallet,
        fromAta: FromAta,
        mint: ttriad
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

    const method = this.program.methods
      .depositStakeRewards({
        amount,
        stakeVault
      })
      .accounts({
        signer: wallet,
        fromAta: FromAta,
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
   *  @param name - Stake name
   *  @param stakeVault - Name of the stake vault
   *
   */
  public async requestWithdraw(
    { wallet, name, mint, stakeVault }: RequestWithdrawArgs,
    options?: RpcOptions
  ) {
    const stakeVaultPDA = getStakeVaultAddressSync(
      this.program.programId,
      stakeVault
    )
    const stakePDA = getStakeAddressSync(this.program.programId, wallet, name)

    const method = this.program.methods.requestWithdrawStake().accounts({
      signer: wallet,
      mint: mint,
      stake: stakePDA,
      stakeVault: stakeVaultPDA
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
   *  Withdraw Stake
   *  @param wallet - User wallet
   *  @param name - Stake name
   *  @param mint - NFT mint
   *  @param stakeVault - Name of the stake vault
   *
   */
  public async withdrawStake(
    { wallet, name, mint, stakeVault }: WithdrawArgs,
    options?: RpcOptions
  ) {
    const stakeVaultPDA = getStakeVaultAddressSync(
      this.program.programId,
      stakeVault
    )

    const FromAta = getATASync(stakeVaultPDA, mint)
    const stakePDA = getStakeAddressSync(this.program.programId, wallet, name)

    const method = this.program.methods.withdrawStake().accounts({
      signer: wallet,
      fromAta: FromAta,
      stake: stakePDA,
      stakeVault: stakeVaultPDA,
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
        isLocked
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
   *  Claim Stake Rewards
   *  @param wallet - User wallet
   *  @param mint - NFT mint
   *  @param stakeVault - Name of the stake vault
   *  @param nftName - Name of the nft
   *
   */
  public async claimStakeRewards(
    { wallet, mint, stakeVault, nftName }: ClaimStakeRewardsArgs,
    options?: RpcOptions
  ) {
    const StakeVault = getStakeVaultAddressSync(
      this.program.programId,
      stakeVault
    )
    const Stake = getStakeAddressSync(this.program.programId, wallet, nftName)
    const FromAta = getATASync(StakeVault, mint)

    const method = this.program.methods.claimStake().accounts({
      signer: wallet,
      fromAta: FromAta,
      mint: mint,
      stake: Stake,
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
}
