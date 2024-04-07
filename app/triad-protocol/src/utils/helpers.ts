import { PublicKey } from '@solana/web3.js'

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
