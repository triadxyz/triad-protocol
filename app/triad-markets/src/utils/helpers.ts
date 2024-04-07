import { PublicKey } from '@solana/web3.js'

export const getTicketPDA = (address: PublicKey, programId: PublicKey) => {
  const [TicketPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from('ticket'), address.toBuffer()],
    programId
  )

  return TicketPDA
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
