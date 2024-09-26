import { PublicKey } from '@solana/web3.js'
import BN from 'bn.js'

export const getMarketPDA = (programId: PublicKey, marketId: number) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('market'), new BN(marketId).toArrayLike(Buffer, 'le', 8)],
    programId
  )[0]
}

export const getFeeVaultPDA = (
  programId: PublicKey,
  marketId: number
): PublicKey => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('fee_vault'), new BN(marketId).toArrayLike(Buffer, 'le', 8)],
    programId
  )[0]
}

export const getUserTradePDA = (programId: PublicKey, wallet: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('user_trade'), wallet.toBuffer()],
    programId
  )[0]
}
