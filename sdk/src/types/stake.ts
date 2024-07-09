import { PublicKey } from '@solana/web3.js'
import BN from 'bn.js'

export type Collection = 'alligators' | 'coleta' | 'undead' | 'pyth'

export type StakeArgs = {
  name: string
  wallet: PublicKey
  stakeVault: string
  mint: PublicKey
  collections: Record<Collection, boolean>
  rarity:
    | { common: {} }
    | { uncommon: {} }
    | { rare: {} }
    | { epic: {} }
    | { legendary: {} }
    | { mythic: {} }
}

export type InitializeStakeArgs = {
  name: string
  slots: BN
  amount: BN
  collection: string
}

export type DepositStakeRewardsArgs = {
  wallet: PublicKey
  amount: BN
  mint: PublicKey
  stakeVault: string
}

export type RequestWithdrawArgs = {
  wallet: PublicKey
  nftName: string
  mint: PublicKey
  stakeVault: string
}

export type WithdrawArgs = {
  wallet: PublicKey
  nftName: string
  mint: PublicKey
  stakeVault: string
}

export type UpdateStakeVaultStatusArgs = {
  wallet: PublicKey
  isLocked: boolean
  week: number
  stakeVault: string
}

export type ClaimStakeRewardsArgs = {
  wallet: PublicKey
  week: number[]
  mint: PublicKey
  stakeVault: string
  nftName: string
}

export type UpdateStakeRewardsArgs = {
  day: number
  wallet: PublicKey
  items: {
    rewards: BN
    apr: number
    nftName: string
  }[]
}

export enum RARITY_WEIGHT {
  COMMON = 1,
  UNCOMMON = 2,
  RARE = 3,
  EPIC = 4,
  LEGENDARY = 5,
  MYTHIC = 6
}

export enum COLLECTION_MUlTIPLIER {
  ALLIGATORS = 1.5,
  COLETA = 1.5,
  UNDEAD = 1.5,
  UNDEAD_TRIADFI = 2.5,
  PYTH = 1.5
}

export type StakeVaultResponse = {
  name: string
  collection: string
  slots: number
  amount: number
  isLocked: boolean
  usersPaid: PublicKey
  amountPaid: number
  amountUsers: number
  apr: number
  week: number
  initTs: number
  endTs: number
}

export type StakeResponse = {
  name: string
  collections: Record<Collection, {}>
  rarity: string
  stakeVault: string
  authority: string
  initTs: number
  isLocked: boolean
  withdrawTs: number
  mint: string
  stakeRewards: string
  apr?: number
  dailyRewards?: number[]
  weeklyRewardsPaid?: boolean[]
  weeklyRewards?: number
  rewardsToClaim?: number
  allRewards?: number
}
