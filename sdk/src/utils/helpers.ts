import { PublicKey } from '@solana/web3.js'
import * as anchor from '@coral-xyz/anchor'
import BN from 'bn.js'

export const getTickerPDA = (address: PublicKey, programId: PublicKey) => {
  const [TickerPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from('ticker'), address.toBuffer()],
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

export function getVaultAddressSync(
  programId: PublicKey,
  encodedName: number[]
): PublicKey {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode('vault')),
      Buffer.from(encodedName)
    ],
    programId
  )[0]
}

export function getTokenVaultAddressSync(
  programId: PublicKey,
  vault: PublicKey
): PublicKey {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode('vault_token_account')),
      vault.toBuffer()
    ],
    programId
  )[0]
}

export function getVaultDepositorAddressSync(
  programId: PublicKey,
  vault: PublicKey,
  authority: PublicKey
): PublicKey {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode('vault_depositor')),
      vault.toBuffer(),
      authority.toBuffer()
    ],
    programId
  )[0]
}

export const formatNumber = (number: bigint | BN, decimals = 6) => {
  return Number(number.toString()) / 10 ** decimals
}
