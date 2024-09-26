import { Stake, StakeVault } from './../types/stake'
import { User } from './../types'

export const encodeString = (value: string, alloc = 32): number[] => {
  const buffer = Buffer.alloc(alloc)

  buffer.fill(value)
  buffer.fill(' ', value.length)

  return Array(...buffer)
}

export const decodeString = (bytes: number[]): string => {
  const buffer = Buffer.from(bytes)
  return buffer.toString('utf8').trim()
}

export const formatStakeVault = (stakeVault: any): StakeVault => {
  return {
    name: stakeVault.name,
    collection: stakeVault.collection,
    slots: stakeVault.slots.toNumber(),
    amount: stakeVault.amount.toNumber(),
    isLocked: stakeVault.isLocked,
    tokenMint: stakeVault.tokenMint.toBase58(),
    tokenDecimals: stakeVault.tokenDecimals,
    amountPaid: stakeVault.amountPaid.toNumber(),
    nftStaked: stakeVault.nftStaked.toNumber(),
    week: stakeVault.week,
    initTs: stakeVault.initTs.toNumber(),
    endTs: stakeVault.endTs.toNumber(),
    authority: stakeVault.authority.toBase58(),
    tokenStaked:
      stakeVault.tokenStaked.toNumber() / 10 ** stakeVault.tokenDecimals
  }
}

export const formatStake = (stake: any): Stake => {
  return {
    name: stake.name,
    stakeVault: stake.stakeVault.toBase58(),
    authority: stake.authority.toBase58(),
    initTs: stake.initTs.toNumber(),
    withdrawTs: stake.withdrawTs.toNumber(),
    mint: stake.mint.toBase58(),
    claimedTs: stake?.claimedTs?.toNumber(),
    boost: stake?.boost,
    claimed: (stake?.claimed?.toNumber() || 0) / 10 ** 6,
    available: (stake?.available?.toNumber() || 0) / 10 ** 6,
    amount: stake?.amount?.toNumber() || 1
  }
}

export const formatUser = (user: any): User => {
  return {
    ts: user.ts.toNumber(),
    authority: user.authority.toBase58(),
    referral: user.referral,
    referred: user.referred.toNumber(),
    swapsMade: user.swapsMade,
    swaps: user.swaps,
    staked: user.staked.toNumber(),
    name: user.name
  }
}
