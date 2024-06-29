import fs from 'fs'
import { Connection, Keypair, PublicKey } from '@solana/web3.js'
import TriadProtocol from './index'
import { Wallet } from '@coral-xyz/anchor'
import { STAKE_SEASON } from './utils/constants'

const file = fs.readFileSync('/Users/dannpl/.config/solana/triad-man.json')
const rpc_file = fs.readFileSync('/Users/dannpl/.config/solana/rpc.txt')
const keypair = Keypair.fromSecretKey(
  new Uint8Array(JSON.parse(file.toString()))
)
const connection = new Connection(rpc_file.toString(), 'confirmed')
const wallet = new Wallet(keypair)
const triadProtocol = new TriadProtocol(connection, wallet)

triadProtocol.stake.getStakeVaults().then(console.log)

triadProtocol.stake.getStakeVaultByName('Triad Share 1').then(console.log)

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

const getDailyBaseRewards = async () => {
  const stakeVaultRewards =
    await triadProtocol.stake.getStakeVaultRewards(STAKE_SEASON)

  const days = {}

  // STAKES.forEach((stake) => {
  //   const keys = Object.keys(stake.rewards)

  //   keys.forEach((key) => {
  //     if (!days[key]) {
  //       days[key] = 0
  //     }

  //     days[key] += Object.values(stake.rewards[key]).length
  //   })
  // })

  // const values = {}

  // Object.keys(days).forEach((key) => {
  //   values[key] = stakeVaultRewards.perDay / days[key]
  // })

  // console.log('Daily Rewards:', values)
}

const getStakesByWallet = async () => {
  const response = await triadProtocol.stake.getStakes()
  const stakeVaultRewards =
    await triadProtocol.stake.getStakeVaultRewards(STAKE_SEASON)

  const users = response
    .map((stake) => stake.authority)
    .filter((value, index, self) => self.indexOf(value) === index)

  const data = []

  let i = 0

  for (const user of users) {
    const rewardsByWallet = await triadProtocol.stake.getStakeRewardsByWallet(
      new PublicKey(user),
      stakeVaultRewards
    )

    data.push({
      wallet: user,
      rewards: rewardsByWallet
    })
    i++
    console.log(i, '/', users.length)
  }

  fs.writeFileSync('./src/utils/stakes1.json', JSON.stringify(data, null, 2))
}
