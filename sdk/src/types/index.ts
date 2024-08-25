import { Keypair, PublicKey } from '@solana/web3.js'

export type RpcOptions = {
  skipPreflight?: boolean
  microLamports?: number
}

export type CreateUserArgs = {
  wallet: PublicKey
  name: string
  referral?: PublicKey
}

export type OpenOreArgs = {
  user: PublicKey
  payer: Keypair
  name: string
  referralName: string
}

export type MineOreArgs = {
  user: PublicKey
  payer: PublicKey
  bus: PublicKey
  digest: number[]
  nonce: number[]
}
