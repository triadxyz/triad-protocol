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
