import { PublicKey } from '@solana/web3.js'
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID
} from '@solana/spl-token'

export const getUserPDA = (programId: PublicKey, wallet: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('user'), wallet.toBuffer()],
    programId
  )[0]
}

export const getTickerPDA = (programId: PublicKey, tickerName: string) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('ticker'), Buffer.from(tickerName)],
    programId
  )[0]
}

export const getTokenATA = (address: PublicKey, Mint: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [address.toBytes(), TOKEN_2022_PROGRAM_ID.toBytes(), Mint.toBytes()],
    new PublicKey(ASSOCIATED_TOKEN_PROGRAM_ID)
  )[0]
}
