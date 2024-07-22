import fs from 'fs'
import { Connection, Keypair, PublicKey } from '@solana/web3.js'
import TriadProtocol from './index'
import { BN, Wallet } from '@coral-xyz/anchor'
import { STAKE_SEASON_1, TTRIAD_DECIMALS } from './utils/constants'
import RARITY from './utils/stake-season-1/rarity.json'
import USERS_COLLECTIONS_WEEK_1 from './utils/stake-season-1/users-collections-week-1.json'
import { calculateAPR, calculateTotalMultiplier } from './utils/helpers'

const file = fs.readFileSync('/Users/dannpl/.config/solana/id.json')
const rpc_file = fs.readFileSync('/Users/dannpl/.config/solana/rpc.txt')
const keypair = Keypair.fromSecretKey(
  new Uint8Array(JSON.parse(file.toString()))
)
const connection = new Connection(rpc_file.toString(), 'confirmed')
const wallet = new Wallet(keypair)
const triadProtocol = new TriadProtocol(connection, wallet)

const populateStakeDay = async () => {
  const { perDay } =
    await triadProtocol.stake.getStakeVaultRewards(STAKE_SEASON_1)
  const day = 1720360651
  const stakes = await triadProtocol.stake.getStakesByDay(STAKE_SEASON_1, day)

  const newItems = []

  const itemsByAuthority = stakes.reduce((acc, item) => {
    const itemRarity = RARITY.find((rarity) => rarity.onchainId === item.mint)

    if (!itemRarity) {
      return acc
    }

    if (item.withdrawTs !== 0 && item.withdrawTs < 1720441379) {
      return acc
    }

    if (!acc[item.authority]) {
      acc[item.authority] = []
    }

    acc[item.authority].push({
      ...item,
      rarity: itemRarity.rarity,
      rarityRankHrtt: itemRarity.rarityRankHrtt,
      collections: {}
    })

    return acc
  }, {})

  Object.keys(itemsByAuthority).forEach((authority) => {
    const items = itemsByAuthority[authority]

    items.sort((a, b) => a.rarityRankHrtt - b.rarityRankHrtt)

    items.forEach((item, index) => {
      const collections = USERS_COLLECTIONS_WEEK_1[item.authority] ?? {}

      const items: string[] = []

      Object.keys(collections).forEach((collection) => {
        if (collections[collection]) {
          items.push(collection)
        }
      })

      let totalMultiplier = calculateTotalMultiplier(
        index === 0 ? items.map((item) => item.toUpperCase() as any) : [],
        {
          max: 1839,
          currentPosition: item.rarityRankHrtt
        }
      )

      newItems.push({
        ...item,
        totalMultiplier,
        collections: index === 0 ? collections[0] : {}
      })
    })
  })

  const totalMultiplierSum = newItems.reduce(
    (sum, user) => sum + user.totalMultiplier,
    0
  )

  const rewards = newItems.map((item) => {
    const rewards = (item.totalMultiplier / totalMultiplierSum) * perDay

    return {
      ...item,
      rewards,
      apr: calculateAPR({
        rewards,
        rate: 7,
        amount: 1,
        baseRewards: perDay
      })
    }
  })

  const orderedRewards = rewards.sort((a, b) => b.rewards - a.rewards)

  fs.writeFileSync(
    `./src/utils/stake-season-1/stakes/2/${day}.json`,
    JSON.stringify(orderedRewards, null, 2)
  )
}

const requestWithdraw = async () => {
  const response = await triadProtocol.stake.requestWithdraw(
    {
      wallet: wallet.publicKey,
      nftName: 'Triad 0',
      mint: new PublicKey('FXRhaGeYue7bMCwcksNw4hJRY7jZ1YMwgmCu1Y8fyUNd'),
      stakeVault: 'Rev 1'
    },
    {
      microLamports: 10000,
      skipPreflight: true
    }
  )

  console.log(response)
}

const updateStakeVaultStatus = async () => {
  const response = await triadProtocol.stake.updateStakeVaultStatus(
    {
      wallet: wallet.publicKey,
      isLocked: true,
      week: 1,
      stakeVault: STAKE_SEASON_1
    },
    {
      skipPreflight: true,
      microLamports: 10000
    }
  )

  console.log(response)
}

const withdraw = async () => {
  const response = await triadProtocol.stake.withdrawStake(
    {
      wallet: wallet.publicKey,
      nftName: 'Triad 0',
      mint: new PublicKey('FXRhaGeYue7bMCwcksNw4hJRY7jZ1YMwgmCu1Y8fyUNd'),
      stakeVault: 'Rev 1'
    },
    {
      microLamports: 10000,
      skipPreflight: true
    }
  )

  console.log(response)
}

const getStake = async () => {
  const response = await triadProtocol.stake.getStakeByWallet(
    new PublicKey('E48CKgbZVpDzerQ7DdommgqNobRHLqHy8RUVi8HXkSHE'),
    STAKE_SEASON_1
  )

  const stakeVaults = await triadProtocol.stake.getStakeVaults()

  console.log(response)
  console.log(stakeVaults)
}

const claimStakeRewards = async () => {
  const response = await triadProtocol.stake.claimStakeRewards(
    {
      wallet: wallet.publicKey,
      mint: new PublicKey(''),
      week: [],
      stakeVault: STAKE_SEASON_1,
      nftName: ''
    },
    {
      skipPreflight: true,
      microLamports: 10000
    }
  )

  console.log(response)
}

const getStakers = async () => {
  const response = await triadProtocol.stake.getStakes(STAKE_SEASON_1)

  console.log(JSON.stringify(response, null, 2))

  const users = response
    .filter(
      (item, index, self) =>
        index === self.findIndex((t) => t.authority === item.authority)
    )
    .map((user) => user.authority)

  fs.writeFileSync(
    './src/utils/stake-season-1/users.json',
    JSON.stringify(users, null, 2)
  )
}

const stake = async () => {
  const response = await triadProtocol.stake.stakeNft(
    {
      name: 'Triad 0',
      wallet: wallet.publicKey,
      stakeVault: 'Rev 1',
      rarity: { mythic: {} },
      collections: {
        coleta: false,
        undead: false,
        alligators: false,
        pyth: false
      },
      mint: new PublicKey('FXRhaGeYue7bMCwcksNw4hJRY7jZ1YMwgmCu1Y8fyUNd')
    },
    {
      skipPreflight: true,
      microLamports: 20000
    }
  )

  console.log(response)
}

const updateStakeRewards = async () => {
  const day = null
  const ts = null

  let file = fs.readFileSync(`./src/utils/stake-season-1/stakes/2/${ts}.json`)

  const data = JSON.parse(file.toString())

  const chunkLengths = 10
  const chunks = []

  for (let i = 0; i < data.length; i += chunkLengths) {
    chunks.push(data.slice(i, i + chunkLengths))
  }

  console.log(chunks.length)

  const failedChunks = []

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i]
    const items = []

    console.log(`Processing chunk ${i + 1} of ${chunks.length}`)

    for (let j = 0; j < chunk.length; j++) {
      const item = chunk[j]

      items.push({
        rewards: new BN(item.rewards * 10 ** TTRIAD_DECIMALS),
        apr: item.apr,
        nftName: item.name
      })
    }

    try {
      const rewards = await triadProtocol.stake.updateStakeRewards(
        {
          day,
          wallet: wallet.publicKey,
          items: items
        },
        {
          skipPreflight: false,
          microLamports: 20000
        }
      )

      console.log(rewards)
    } catch (error) {
      console.error(`Failed to update stake rewards for chunk ${i}:`, error)
      failedChunks.push(chunk)
    }
  }

  if (failedChunks.length > 0) {
    fs.writeFileSync(
      `./src/utils/stake-season-1/stakes/2/failedChunks_${ts}.json`,
      JSON.stringify(failedChunks, null, 2)
    )
    console.log(
      `Failed chunks saved to ./src/utils/stake-season-1/stakes/2/failedChunks_${ts}.json`
    )
  }
}
