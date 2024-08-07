import {
  COLLECTION_MUlTIPLIER,
  StakeResponse,
  StakeVaultResponse,
  UserResponse
} from './../types/stake'
import { PublicKey } from '@solana/web3.js'
import * as anchor from '@coral-xyz/anchor'
import BN from 'bn.js'
import { TOKEN_2022_PROGRAM_ID } from '@solana/spl-token'
import { ATA_PROGRAM_ID } from './constants'

export const getTickerAddressSync = (
  programId: PublicKey,
  tickerName: string
) => {
  const [TickerPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from('ticker'), Buffer.from(tickerName)],
    programId
  )

  return TickerPDA
}

export const encodeString = (value: string): number[] => {
  const buffer = Buffer.alloc(32)
  buffer.fill(value)
  buffer.fill(' ', value.length)

  return Array(...buffer)
}

export const decodeString = (bytes: number[]): string => {
  const buffer = Buffer.from(bytes)
  return buffer.toString('utf8').trim()
}

export const getVaultAddressSync = (
  programId: PublicKey,
  tickerAddress: PublicKey
): PublicKey => {
  const [VaultPDA] = PublicKey.findProgramAddressSync(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode('vault')),
      tickerAddress.toBuffer()
    ],
    programId
  )

  return VaultPDA
}

export const getTokenVaultAddressSync = (
  programId: PublicKey,
  vault: PublicKey
) => {
  const [VaultTokenPDA] = PublicKey.findProgramAddressSync(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode('vault_token_account')),
      vault.toBuffer()
    ],
    programId
  )

  return VaultTokenPDA
}

export function getUserPositionAddressSync(
  programId: PublicKey,
  authority: PublicKey,
  ticker: PublicKey
): PublicKey {
  const [UserPositionPDA] = PublicKey.findProgramAddressSync(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode('user_position')),
      authority.toBuffer(),
      ticker.toBuffer()
    ],
    programId
  )

  return UserPositionPDA
}

export const getStakeVaultAddressSync = (
  programId: PublicKey,
  vaultName: string
) => {
  const [StakeVaultPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from('stake_vault'), Buffer.from(vaultName)],
    programId
  )

  return StakeVaultPDA
}

export const getStakeAddressSync = (
  programId: PublicKey,
  wallet: PublicKey,
  name: string
) => {
  const [StakePDA] = PublicKey.findProgramAddressSync(
    [Buffer.from('stake'), wallet.toBuffer(), Buffer.from(name)],
    programId
  )

  return StakePDA
}

export const getNFTRewardsAddressSync = (
  programId: PublicKey,
  stake: PublicKey
) => {
  const [NFTRewardsPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from('nft_rewards'), stake.toBuffer()],
    programId
  )

  return NFTRewardsPDA
}

export const getATASync = (address: PublicKey, Mint: PublicKey) => {
  const [ATA] = PublicKey.findProgramAddressSync(
    [address.toBytes(), TOKEN_2022_PROGRAM_ID.toBytes(), Mint.toBytes()],
    new PublicKey(ATA_PROGRAM_ID)
  )

  return ATA
}

export const getUserAddressSync = (programId: PublicKey, wallet: PublicKey) => {
  const [StakePDA] = PublicKey.findProgramAddressSync(
    [Buffer.from('user'), wallet.toBuffer()],
    programId
  )

  return StakePDA
}

export const formatNumber = (number: bigint | BN, decimals = 6) => {
  return Number(number.toString()) / 10 ** decimals
}

export const formatStakeVault = (stakeVault: any): StakeVaultResponse => {
  return {
    name: stakeVault.name,
    collection: stakeVault.collection,
    slots: stakeVault.slots.toNumber(),
    amount: stakeVault.amount.toNumber(),
    isLocked: stakeVault.isLocked,
    tokenMint: stakeVault.tokenMint.toBase58(),
    tokenDecimals: stakeVault.tokenDecimals,
    amountPaid: stakeVault.amountPaid.toNumber(),
    nftStaked: stakeVault.nftStaked.toNumber(),
    week: stakeVault.week,
    initTs: stakeVault.initTs.toNumber(),
    endTs: stakeVault.endTs.toNumber(),
    authority: stakeVault.authority.toBase58(),
    tokenStaked:
      stakeVault.tokenStaked.toNumber() / 10 ** stakeVault.tokenDecimals
  }
}

export const formatStake = (stake: any): StakeResponse => {
  return {
    name: stake.name,
    stakeVault: stake.stakeVault.toBase58(),
    authority: stake.authority.toBase58(),
    initTs: stake.initTs.toNumber(),
    withdrawTs: stake.withdrawTs.toNumber(),
    mint: stake.mint.toBase58(),
    claimedTs: stake?.claimedTs?.toNumber(),
    boost: stake?.boost,
    claimed: (stake?.claimed?.toNumber() || 0) / 10 ** 6,
    available: (stake?.available?.toNumber() || 0) / 10 ** 6,
    amount: stake?.amount?.toNumber() || 1
  }
}

export const formatUser = (user: any): UserResponse => {
  return {
    ts: user.ts.toNumber(),
    authority: user.authority.toBase58(),
    referral: user.referral,
    referred: user.referred.toNumber(),
    swapsMade: user.swapsMade,
    swaps: user.swaps,
    staked: user.staked.toNumber(),
    name: user.name
  }
}

export const calculateTotalMultiplier = (
  collections: COLLECTION_MUlTIPLIER[],
  rank: { max: number; currentPosition: number }
) => {
  let multiplier = 1

  collections.forEach((collection) => {
    if (COLLECTION_MUlTIPLIER[collection]) {
      multiplier *= Number(COLLECTION_MUlTIPLIER[collection])
    }
  })

  let rankMultiplier = (rank.max + 1 - rank.currentPosition) / rank.max

  return multiplier * rankMultiplier
}

export const calculateAPR = ({
  rewards,
  rate,
  amount,
  baseRewards
}: {
  rewards: number
  rate: number
  amount: number
  baseRewards: number
}) => {
  return ((rewards * rate) / (amount * baseRewards)) * 100
}
