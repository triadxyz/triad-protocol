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
  formatStake,
  formatStakeVault,
  getATASync,
  getStakeAddressSync,
  getStakeVaultAddressSync,
  getUserAddressSync
} from './utils/helpers'
import { RpcOptions } from './types'
import {
  DepositStakeRewardsArgs,
  StakeNftArgs,
  RequestWithdrawArgs,
  WithdrawArgs,
  StakeResponse,
  ClaimStakeRewardsArgs,
  StakeTokenArgs,
  UpdateBoostArgs
} from './types/stake'
import {
  STAKE_VAULT_NAME,
  TTRIAD_DECIMALS,
  TTRIAD_MINT,
  VERIFIER
} from './utils/constants'
import { toByteArray } from 'base64-js'
import { getRarityRank } from './utils/getRarity'

export default class Stake {
  program: Program<TriadProtocol>
  provider: AnchorProvider
  stakeVaultName: string = STAKE_VAULT_NAME

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
   * Get Stake Rewards
   */
  async getStakeRewards({
    wallet,
    nftName,
    collections,
    rank
  }: ClaimStakeRewardsArgs) {
    const StakeVault = getStakeVaultAddressSync(
      this.program.programId,
      this.stakeVaultName
    )
    const mint = new PublicKey(TTRIAD_MINT)
    const Stake = getStakeAddressSync(this.program.programId, wallet, nftName)

    const method = await this.program.methods
      .claimStakeRewards({
        collections,
        rank
      })
      .accounts({
        signer: wallet,
        mint: mint,
        stake: Stake,
        stakeVault: StakeVault,
        verifier: new PublicKey(VERIFIER)
      })
      .simulate()

    let value = method.raw[method.raw.length - 2].split(' ')[3]

    return new BN(toByteArray(value), 'le').toNumber() / 10 ** TTRIAD_DECIMALS
  }

  async getStakes() {
    const response = await this.program.account.stakeV2.all()
    const StakeVault = getStakeVaultAddressSync(
      this.program.programId,
      this.stakeVaultName
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
   * @param collections - NFT collections
   *
   */
  async getStakeByWallet(
    wallet: PublicKey,
    collections: number,
    ranks: {
      onchainId: string
      name: string
      rarityRankHrtt: number
    }[]
  ) {
    const response = (await this.getStakes()).filter(
      (item) => item.authority === wallet.toBase58()
    )
    const data: StakeResponse[] = []

    for (const stake of response) {
      const getRank = getRarityRank(ranks, stake.mint, stake.name)

      let available = 0

      await new Promise((resolve) => setTimeout(resolve, 1000))

      try {
        available = await this.getStakeRewards({
          wallet,
          nftName: stake.name,
          rank: getRank,
          collections
        })
      } catch {}

      data.push({
        ...stake,
        available
      })
    }

    return data
  }

  /**
   * Get Stakes by day
   * @param day - Day timestamp
   */
  async getStakesByDay(day: number) {
    const stakes = await this.getStakes()

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
   *  @param mint - NFT mint
   *  @param items - NFT items
   *
   */
  public async stakeNft({ wallet, items }: StakeNftArgs, options?: RpcOptions) {
    let ixs: TransactionInstruction[] = []

    for (let i = 0; i < items.length; i++) {
      let item = items[i]

      ixs.push(
        await this.program.methods
          .stakeNft({
            name: item.name,
            stakeVault: this.stakeVaultName
          })
          .accounts({
            signer: wallet,
            mint: item.mint
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
   *  Stake NFT
   *  @param wallet - User wallet
   *  @param mint - NFT mint
   *  @param collections - NFT collections
   *  @param rarity - NFT rarity
   *
   */
  public async stakeToken(
    { name, wallet, amount }: StakeTokenArgs,
    options?: RpcOptions
  ) {
    const stakeVaultPDA = getStakeVaultAddressSync(
      this.program.programId,
      this.stakeVaultName
    )
    const ttriad = new PublicKey(TTRIAD_MINT)
    const userPDA = getUserAddressSync(this.program.programId, wallet)
    const toAta = getATASync(stakeVaultPDA, ttriad)

    const method = this.program.methods
      .stakeToken({
        name,
        amount: new BN(amount * 10 ** 6),
        stakeVault: this.stakeVaultName
      })
      .accounts({
        signer: wallet,
        mint: ttriad,
        user: userPDA
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
    { wallet, mint, amount }: DepositStakeRewardsArgs,
    options?: RpcOptions
  ) {
    const method = this.program.methods
      .depositStakeRewards({
        amount,
        stakeVault: this.stakeVaultName
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
   *  Request Withdraw
   *  @param wallet - User wallet
   *  @param name - Stake name
   *
   */
  public async requestWithdraw(
    { wallet, name, mint }: RequestWithdrawArgs,
    options?: RpcOptions
  ) {
    const stakeVaultPDA = getStakeVaultAddressSync(
      this.program.programId,
      this.stakeVaultName
    )
    const stakePDA = getStakeAddressSync(this.program.programId, wallet, name)
    const userPAD = getUserAddressSync(this.program.programId, wallet)

    const method = this.program.methods.requestWithdrawStake().accounts({
      signer: wallet,
      mint: mint,
      user: userPAD,
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
   *
   */
  public async withdrawStake(
    { wallet, name, mint }: WithdrawArgs,
    options?: RpcOptions
  ) {
    const stakeVaultPDA = getStakeVaultAddressSync(
      this.program.programId,
      this.stakeVaultName
    )

    const userPDA = getUserAddressSync(this.program.programId, wallet)

    const stakePDA = getStakeAddressSync(this.program.programId, wallet, name)

    const method = this.program.methods.withdrawStake().accounts({
      signer: wallet,
      stake: stakePDA,
      stakeVault: stakeVaultPDA,
      admin: new PublicKey('82ppCojm3yrEKgdpH8B5AmBJTU1r1uAWXFWhxvPs9UCR'),
      mint: mint,
      user: userPDA
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
   *  @param nftName - Name of the nft
   *
   */
  public async claimStakeRewards(
    { wallet, nftName, collections, rank }: ClaimStakeRewardsArgs,
    options?: RpcOptions
  ) {
    const StakeVault = getStakeVaultAddressSync(
      this.program.programId,
      this.stakeVaultName
    )
    const mint = new PublicKey(TTRIAD_MINT)
    const Stake = getStakeAddressSync(this.program.programId, wallet, nftName)

    const method = this.program.methods
      .claimStakeRewards({
        collections,
        rank
      })
      .accounts({
        signer: wallet,
        mint: mint,
        stake: Stake,
        stakeVault: StakeVault,
        verifier: new PublicKey(VERIFIER)
      })

    if (options?.microLamports) {
      method.postInstructions([
        ComputeBudgetProgram.setComputeUnitPrice({
          microLamports: options.microLamports
        })
      ])
    }

    return method.transaction()
  }

  /**
   *  Update Stake Boost
   *  @param wallet - User wallet
   *  @param nftName - Name of the nft
   *
   */
  public async updateBoost(
    { wallet, nfts }: UpdateBoostArgs,
    options?: RpcOptions
  ) {
    const ixs = []

    for (const nft of nfts) {
      const Stake = getStakeAddressSync(
        this.program.programId,
        new PublicKey(nft.wallet),
        nft.name
      )

      ixs.push(
        await this.program.methods
          .updateStakeBoost()
          .accounts({
            signer: wallet,
            stake: Stake
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
}
