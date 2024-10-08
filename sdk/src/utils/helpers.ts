import { Stake, StakeVault } from './../types/stake'
import { User } from './../types'
import { ResolvedQuestion, Market, WinningDirection } from '../types/trade'
import { PublicKey } from '@solana/web3.js'

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

export const accountToMarket = (account: any, address: PublicKey): Market => {
  return {
    bump: account.bump,
    address: address.toString(),
    authority: account.authority.toString(),
    marketId: account.marketId.toString(),
    name: account.name,
    hypePrice: account.hypePrice.toString(),
    flopPrice: account.flopPrice.toString(),
    hypeLiquidity: account.hypeLiquidity.toString(),
    flopLiquidity: account.flopLiquidity.toString(),
    totalHypeShares: account.totalHypeShares.toString(),
    totalFlopShares: account.totalFlopShares.toString(),
    totalVolume: account.totalVolume.toString(),
    mint: account.mint.toString(),
    ts: account.ts.toString(),
    updateTs: account.updateTs.toString(),
    openOrdersCount: account.openOrdersCount.toString(),
    nextOrderId: account.nextOrderId.toString(),
    feeBps: account.feeBps,
    feeVault: account.feeVault.toBase58(),
    isActive: account.isActive,
    marketPrice: account.marketPrice.toString(),
    previousResolvedQuestion: accountToResolvedQuestion(
      account.previousResolvedQuestion
    ),
    currentQuestionId: account.currentQuestionId.toString(),
    currentQuestionStart: account.currentQuestionStart.toString(),
    currentQuestionEnd: account.currentQuestionEnd.toString(),
    currentQuestion: Buffer.from(account.currentQuestion)
      .toString()
      .replace(/\0+$/, '')
  }
}

const accountToResolvedQuestion = (question: any): ResolvedQuestion => {
  return {
    question: Buffer.from(question.question).toString().replace(/\0+$/, ''),
    startTime: question.startTime.toString(),
    endTime: question.endTime.toString(),
    hypeLiquidity: question.hypeLiquidity.toString(),
    flopLiquidity: question.flopLiquidity.toString(),
    winningDirection: WinningDirection[question.winningDirection],
    marketPrice: question.marketPrice.toString(),
    finalHypePrice: question.finalHypePrice.toString(),
    finalFlopPrice: question.finalFlopPrice.toString()
  }
}
