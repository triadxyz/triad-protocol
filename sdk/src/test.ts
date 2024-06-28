import fs from 'fs'
import { Connection, Keypair, PublicKey } from '@solana/web3.js'
import TriadProtocol from './index'
import { Wallet } from '@coral-xyz/anchor'
import { STAKE_SEASON } from './utils/constants'
import STAKES from './utils/stakes.json'

const file = fs.readFileSync('/Users/dannpl/.config/solana/id.json')
const rpc_file = fs.readFileSync('/Users/dannpl/.config/solana/rpc.txt')
const keypair = Keypair.fromSecretKey(
  new Uint8Array(JSON.parse(file.toString()))
)
const connection = new Connection(rpc_file.toString(), 'confirmed')
const wallet = new Wallet(keypair)
const triadProtocol = new TriadProtocol(connection, wallet)

const getDailyBaseRewards = async () => {
  const stakeVaultRewards =
    await triadProtocol.stake.getStakeVaultRewards(STAKE_SEASON)

  const days = {}

  STAKES.forEach((stake) => {
    const keys = Object.keys(stake.rewards)

    keys.forEach((key) => {
      if (!days[key]) {
        days[key] = 0
      }

      days[key] += Object.values(stake.rewards[key]).length
    })
  })

  const values = {}

  Object.keys(days).forEach((key) => {
    values[key] = stakeVaultRewards.perDay / days[key]
  })

  console.log('Daily Rewards:', values)
}

const getStakesByWallet = async () => {
  const response = await triadProtocol.stake.getStakes()
  const stakeVaultRewards =
    await triadProtocol.stake.getStakeVaultRewards(STAKE_SEASON)

  const users = response
    .map((stake) => stake.authority)
    .filter((value, index, self) => self.indexOf(value) === index)

  const data = []

  for (const user of users) {
    const rewardsByWallet = await triadProtocol.stake.getStakeRewardsByWallet(
      new PublicKey(user),
      stakeVaultRewards
    )

    data.push({
      wallet: user,
      rewards: rewardsByWallet
    })
  }

  fs.writeFileSync('./src/utils/stakes.json', JSON.stringify(data, null, 2))
}
