import { BN } from '@coral-xyz/anchor'

const formatNumber = (number: bigint | BN, decimals = 6) => {
  return Number(number.toString()) / 10 ** decimals
}

export default formatNumber
