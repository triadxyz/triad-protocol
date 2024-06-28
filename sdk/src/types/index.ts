import { PublicKey } from '@solana/web3.js'
import BN from 'bn.js'

export type RpcOptions = {
  skipPreflight?: boolean
  microLamports?: number
}

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

export enum RARITY_WEIGHT {
  COMMON = 1,
  UNCOMMON = 2,
  RARE = 3,
  EPIC = 4,
  LEGENDARY = 5,
  MYTHIC = 6
}

export enum COLLECTION_MUlTIPlIER {
  ALLIGATORS = 1.5,
  COLETA = 1.5,
  UNDEAD = 1.5,
  UNDEAD_TRIADFI = 2.5,
  PYTH = 1.5
}
