const getRarityRank = (
  ranks: {
    onchainId: string
    name: string
    rarityRankHrtt: number
  }[],
  onchainId: string,
  name: string
) => {
  const item = ranks.find(
    (entry) => entry.onchainId === onchainId || entry.name === name
  )

  return item ? item.rarityRankHrtt : 963
}

export default getRarityRank
