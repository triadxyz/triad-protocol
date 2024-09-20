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
  TRD_DECIMALS,
  TRD_MINT,
  VERIFIER,
  TRIAD_ADMIN
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
    const stakeVaultPDA = getStakeVaultAddressSync(
      this.program.programId,
      this.stakeVaultName
    )
    const stakePDA = getStakeAddressSync(
      this.program.programId,
      wallet,
      nftName
    )

    const method = await this.program.methods
      .claimStakeRewards({
        collections,
        rank
      })
      .accounts({
        signer: wallet,
        mint: TRD_MINT,
        stake: stakePDA,
        stakeVault: stakeVaultPDA,
        verifier: VERIFIER
      })
      .simulate()

    let value = method.raw[method.raw.length - 2].split(' ')[3]

    return new BN(toByteArray(value), 'le').toNumber() / 10 ** TRD_DECIMALS
  }

  /**
   * Get all Stakes
   */
  async getStakes() {
    const response = await this.program.account.stakeV2.all()

    return response.map((stake) => formatStake(stake.account))
  }

  /**
   * Get User Stakes
   */
  async getUserStakes(wallet: PublicKey) {
    const response = await this.program.account.stakeV2.all([
      {
        memcmp: {
          offset: 8 + 1,
          bytes: wallet.toBase58()
        }
      }
    ])

    return response.map((stake) => formatStake(stake.account))
  }

  /**
   * Get Stake By Wallet
   * @param wallet - User wallet
   * @param collections - NFT collections
   * @param tensor rank
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
    const response = await this.getUserStakes(wallet)

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
   *  Stake Token
   *  @param name - Index
   *  @param wallet - User wallet
   *  @param amount - Amount to stake
   *
   */
  public async stakeToken(
    { name, wallet, amount }: StakeTokenArgs,
    options?: RpcOptions
  ) {
    const userPDA = getUserAddressSync(this.program.programId, wallet)

    const method = this.program.methods
      .stakeToken({
        name,
        amount: new BN(amount * 10 ** 6),
        stakeVault: this.stakeVaultName
      })
      .accounts({
        signer: wallet,
        mint: TRD_MINT,
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
    const userPDA = getUserAddressSync(this.program.programId, wallet)

    const method = this.program.methods.requestWithdrawStake().accounts({
      signer: wallet,
      mint: mint,
      user: userPDA,
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
      admin: TRIAD_ADMIN,
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
    const stakeVaultPDA = getStakeVaultAddressSync(
      this.program.programId,
      this.stakeVaultName
    )
    const stakePDA = getStakeAddressSync(
      this.program.programId,
      wallet,
      nftName
    )

    const method = this.program.methods
      .claimStakeRewards({
        collections,
        rank
      })
      .accounts({
        signer: wallet,
        mint: TRD_MINT,
        stake: stakePDA,
        stakeVault: stakeVaultPDA,
        verifier: VERIFIER
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
   *  Update Boost
   *  @param wallet - User wallet
   *  @param nfts - Name of the nfts
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

    return this.provider.sendAndConfirm(
      new VersionedTransaction(
        new TransactionMessage({
          instructions: ixs,
          recentBlockhash: blockhash,
          payerKey: wallet
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
