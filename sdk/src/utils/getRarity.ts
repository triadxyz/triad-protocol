import RARITY_LIST from './rarity.json';

export const getRarityRank = (onchainId: string, name: string) => {
  const item = RARITY_LIST.find(
    (entry) => entry.mint.onchainId === onchainId || entry.mint.name === name
  )
  return item ? item.mint.rarityRankHrtt : 0
}
