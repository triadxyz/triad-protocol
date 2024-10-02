import { PublicKey } from '@solana/web3.js'

export const getStakeVaultPDA = (programId: PublicKey, vaultName: string) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('stake_vault'), Buffer.from(vaultName)],
    programId
  )[0]
}

export const getStakePDA = (
  programId: PublicKey,
  wallet: PublicKey,
  name: string
) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('stake'), wallet.toBuffer(), Buffer.from(name)],
    programId
  )[0]
}

export const getNFTRewardsPDA = (programId: PublicKey, stake: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('nft_rewards'), stake.toBuffer()],
    programId
  )[0]
}
