import fs from 'fs'
import { Connection, Keypair, PublicKey } from '@solana/web3.js'
import TriadProtocol from './index'
import { Wallet } from '@coral-xyz/anchor'
import { STAKE_SEASON_1 } from './utils/constants'
import RARITY from './utils/stake-season-1/rarity.json'
import { calculateAPR, calculateTotalMultiplier } from './utils/helpers'

const file = fs.readFileSync('/Users/dannpl/.config/solana/triad-man.json')
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
  const day = 1719842251
  const stakes = await triadProtocol.stake.getStakesByDay(STAKE_SEASON_1, day)

  const newItems = []

  stakes.forEach((item) => {
    const itemRarity = RARITY.find((rarity) => rarity.onchainId === item.mint)

    if (!itemRarity) {
      return
    }

    newItems.push({
      ...item,
      rarity: itemRarity.rarity,
      rarityRankHrtt: itemRarity.rarityRankHrtt,
      totalMultiplier: calculateTotalMultiplier(
        Object.keys(item.collections).map((x) => x.toUpperCase()) as any,
        {
          max: 1839,
          currentPosition: itemRarity.rarityRankHrtt
        }
      )
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

  console.log(stakes.length)

  fs.writeFileSync(
    `./src/utils/stake-season-1/stakes/1/${day}.json`,
    JSON.stringify(orderedRewards, null, 2)
  )
}

populateStakeDay()

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

const withdraw = async () => {
  const response = await triadProtocol.stake.withdraw(
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
  const response = await triadProtocol.stake.getStakeByWallet(wallet.publicKey)
  const stakeVaults = await triadProtocol.stake.getStakeVaults()

  console.log(response)
  console.log(stakeVaults)
}

const getStakes = async () => {
  const response = await triadProtocol.stake.getStakes(STAKE_SEASON_1)

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
  const response = await triadProtocol.stake.stake(
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
