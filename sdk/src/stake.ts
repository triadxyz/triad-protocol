import { AnchorProvider, BN, Program } from '@coral-xyz/anchor'
import {
  Keypair,
  PublicKey,
  Transaction,
  TransactionInstruction
} from '@solana/web3.js'
import { TriadProtocol } from './types/triad_protocol'
import { formatStake, formatStakeVault } from './utils/helpers'
import { RpcOptions } from './types'
import {
  UpdateStakeVaultArgs,
  StakeNftArgs,
  RequestWithdrawArgs,
  WithdrawArgs,
  Stake as StakeResponse,
  ClaimStakeRewardsArgs,
  StakeTokenArgs,
  UpdateBoostArgs
} from './types/stake'
import { getStakeVaultPDA, getStakePDA } from './utils/pda/stake'
import { getUserPDA } from './utils/pda'
import {
  STAKE_VAULT_NAME,
  TRD_DECIMALS,
  TRD_MINT,
  VERIFIER,
  TRIAD_ADMIN
} from './utils/constants'
import { toByteArray } from 'base64-js'
import getRarityRank from './utils/getRarityRank'
import sendVersionedTransaction from './utils/sendVersionedTransaction'
import sendTransactionWithOptions from './utils/sendTransactionWithOptions'
import { convertSecretKeyToKeypair } from './utils/convertSecretKeyToKeypair'

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
    const stakeVaultPDA = getStakeVaultPDA(
      this.program.programId,
      this.stakeVaultName
    )
    const stakePDA = getStakePDA(this.program.programId, wallet, nftName)

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
      const rank = getRarityRank(ranks, stake.mint, stake.name)

      let available = 0

      try {
        available = await this.getStakeRewards({
          wallet,
          nftName: stake.name,
          rank,
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
  async stakeNft({ wallet, items }: StakeNftArgs, options?: RpcOptions) {
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

    return sendVersionedTransaction(this.provider, ixs, options)
  }

  /**
   *  Stake Token
   *  @param name - Index
   *  @param wallet - User wallet
   *  @param amount - Amount to stake
   *
   */
  async stakeToken(
    { name, wallet, amount }: StakeTokenArgs,
    options?: RpcOptions
  ) {
    const userPDA = getUserPDA(this.program.programId, wallet)

    return sendTransactionWithOptions(
      this.program.methods
        .stakeToken({
          name,
          amount: new BN(amount * 10 ** 6),
          stakeVault: this.stakeVaultName
        })
        .accounts({
          signer: wallet,
          mint: TRD_MINT,
          user: userPDA
        }),
      options
    )
  }

  /**
   *  Update Stake Vault
   *  @param wallet - User wallet
   *  @param amount - Reward amount to deposit (optional)
   *  @param status - Status of the stake vault (optional)
   *
   */
  async updateStakeVault(
    { wallet, amount, status }: UpdateStakeVaultArgs,
    options?: RpcOptions
  ) {
    return sendTransactionWithOptions(
      this.program.methods
        .updateStakeVault({
          amount,
          status,
          stakeVault: this.stakeVaultName
        })
        .accounts({
          signer: wallet,
          mint: TRD_MINT
        }),
      options
    )
  }

  /**
   *  Request Withdraw
   *  @param wallet - User wallet
   *  @param nfts - NFTs to Request withdraw
   *
   */
  async requestWithdraw(
    { wallet, nfts }: RequestWithdrawArgs,
    options?: RpcOptions
  ) {
    const ixs: TransactionInstruction[] = []

    const stakeVaultPDA = getStakeVaultPDA(
      this.program.programId,
      this.stakeVaultName
    )

    const userPDA = getUserPDA(this.program.programId, wallet)

    for (const nft of nfts) {
      const stakePDA = getStakePDA(this.program.programId, wallet, nft.name)

      ixs.push(
        await this.program.methods
          .requestWithdrawStake()
          .accounts({
            signer: wallet,
            mint: nft.mint,
            user: userPDA,
            stake: stakePDA,
            stakeVault: stakeVaultPDA
          })
          .instruction()
      )
    }

    return sendVersionedTransaction(this.provider, ixs, options)
  }

  /**
   *  Withdraw Stake
   *  @param wallet - User wallet
   *  @param name - Stake name
   *  @param mint - NFT mint
   *
   */
  async withdrawStake(
    { wallet, name, mint }: WithdrawArgs,
    options?: RpcOptions
  ) {
    const stakeVaultPDA = getStakeVaultPDA(
      this.program.programId,
      this.stakeVaultName
    )
    const userPDA = getUserPDA(this.program.programId, wallet)
    const stakePDA = getStakePDA(this.program.programId, wallet, name)

    return sendTransactionWithOptions(
      this.program.methods.withdrawStake().accounts({
        signer: wallet,
        stake: stakePDA,
        stakeVault: stakeVaultPDA,
        admin: TRIAD_ADMIN,
        mint: mint,
        user: userPDA
      }),
      options
    )
  }

  /**
   *  Claim All Stake Rewards
   *  @param wallet - User wallet
   *  @param collections - NFT collections
   *  @param ranks - Tensor ranks
   *
   */
  async claimStakeRewards(
    {
      wallet,
      collections,
      ranks,
      verifier,
      isToken
    }: {
      wallet: PublicKey
      collections: number
      ranks: {
        onchainId: string
        name: string
        rarityRankHrtt: number
      }[]
      verifier: string
      isToken?: boolean
    },
    options?: RpcOptions
  ) {
    const stakes = (await this.getUserStakes(wallet)).sort(
      (a, b) => a.claimedTs - b.claimedTs
    )

    const ixs: TransactionInstruction[] = []

    for (const stake of stakes) {
      if (stake.withdrawTs !== 0) {
        continue
      }

      const rank = getRarityRank(ranks, stake.mint, stake.name)

      if (ixs.length >= 10) {
        break
      }

      if (isToken && stake.mint !== TRD_MINT.toBase58()) {
        continue
      }

      const stakeVaultPDA = getStakeVaultPDA(
        this.program.programId,
        this.stakeVaultName
      )
      const stakePDA = getStakePDA(this.program.programId, wallet, stake.name)

      ixs.push(
        await this.program.methods
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
          .instruction()
      )
    }

    return sendVersionedTransaction(
      this.provider,
      ixs,
      options,
      convertSecretKeyToKeypair(verifier)
    )
  }

  /**
   *  Update Boost
   *  @param wallet - User wallet
   *  @param nfts - Name of the nfts
   *
   */
  async updateBoost({ wallet, nfts }: UpdateBoostArgs, options?: RpcOptions) {
    const ixs: TransactionInstruction[] = []

    for (const nft of nfts) {
      const stakePDA = getStakePDA(
        this.program.programId,
        new PublicKey(nft.wallet),
        nft.name
      )

      ixs.push(
        await this.program.methods
          .updateStakeBoost()
          .accounts({
            signer: wallet,
            stake: stakePDA
          })
          .instruction()
      )
    }

    return sendVersionedTransaction(this.provider, ixs, options)
  }
}
