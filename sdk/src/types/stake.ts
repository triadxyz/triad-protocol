import { PublicKey } from '@solana/web3.js'
import BN from 'bn.js'

export type Collection = 'alligators' | 'coleta' | 'undead' | 'pyth'

export type StakeNftArgs = {
  wallet: PublicKey
  items: {
    mint: PublicKey
    name: string
  }[]
}

export type StakeTokenArgs = {
  name: string
  wallet: PublicKey
  amount: number
}

export type InitializeStakeArgs = {
  name: string
  slots: BN
  amount: BN
  collection: string
}

export type UpdateStakeVaultArgs = {
  wallet: PublicKey
  amount?: BN
  status?: boolean
}

export type RequestWithdrawArgs = {
  wallet: PublicKey
  name: string
  mint: PublicKey
}

export type WithdrawArgs = {
  wallet: PublicKey
  name: string
  mint: PublicKey
}

export type ClaimStakeRewardsArgs = {
  wallet: PublicKey
  nftName: string
  collections: number
  rank: number
}

export type UpdateBoostArgs = {
  wallet: PublicKey
  nfts: { name: string; wallet: string }[]
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

export type StakeVault = {
  name: string
  collection: string
  authority: string
  slots: number
  amount: number
  isLocked: boolean
  tokenMint: string
  amountPaid: number
  nftStaked: number
  tokenDecimals: number
  tokenStaked: number
  week: number
  initTs: number
  endTs: number
}

export type Stake = {
  name: string
  stakeVault: string
  authority: string
  initTs: number
  withdrawTs: number
  mint: string
  claimedTs: number
  boost: boolean
  claimed: number
  available: number
  amount: number
}
