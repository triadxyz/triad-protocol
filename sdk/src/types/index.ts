import { PublicKey } from '@solana/web3.js'

export type RpcOptions = {
  skipPreflight?: boolean
  microLamports?: number
}

export type CreateUserArgs = {
  wallet: PublicKey
  name: string
  referral?: PublicKey
}

export type User = {
  ts: number
  authority: string
  referral: string
  referred: number
  name: string
  swapsMade: number
  swaps: number
  staked: number
}
