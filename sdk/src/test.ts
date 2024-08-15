import fs from 'fs'
import { Connection, Keypair, PublicKey } from '@solana/web3.js'
import TriadProtocol from './index'
import { BN, Wallet } from '@coral-xyz/anchor'
import { STAKE_SEASON, TTRIAD_MINT } from './utils/constants'
import RARITY_JSON from './utils/stake-season-1/rarity.json'
import { getRarityRank } from './utils/getRarity'
import axios from 'axios'

const file = fs.readFileSync('/Users/dannpl/.config/solana/id.json')
const rpc_file = fs.readFileSync('/Users/dannpl/.config/solana/rpc.txt')
const keypair = Keypair.fromSecretKey(
  new Uint8Array(JSON.parse(file.toString()))
)
const connection = new Connection(rpc_file.toString(), 'confirmed')
const wallet = new Wallet(keypair)
const triadProtocol = new TriadProtocol(connection, wallet)

const getStake = async () => {
  const response = await triadProtocol.stake.getStakes(STAKE_SEASON)

  let available = 0
  let items = 0
  for (const stake of response) {
    const getRank = getRarityRank(RARITY_JSON, stake.mint, stake.name)

    try {
      available += await triadProtocol.stake.getStakeRewards({
        wallet: new PublicKey(stake.authority),
        nftName: stake.name,
        stakeVault: STAKE_SEASON,
        rank: getRank,
        collections: 1
      })

      items += 1
      console.log(items)
      console.log(available)
    } catch (e) {}
  }

  console.log(available)
  console.log(items)
  console.log(response.length)
}

const deposit = async () => {
  const response = await triadProtocol.stake.depositStakeRewards({
    wallet: wallet.publicKey,
    stakeVault: STAKE_SEASON,
    mint: new PublicKey(TTRIAD_MINT),
    amount: new BN(192388 * 10 ** 6)
  })

  console.log(response)
}

const getStakeVault = async () => {
  const response = await triadProtocol.stake.getStakeVaultByName(STAKE_SEASON)

  console.log(response)
}

const getStakeByWallet = async () => {
  const response = await triadProtocol.stake.getStakeByWallet(
    new PublicKey('HjJQdfTHgC3EBX3471w4st8BXbBmtbaMyCAXNgcUb7dq'),
    STAKE_SEASON,
    1,
    RARITY_JSON
  )

  console.log(response)
}

getStakeByWallet()

const updateBoost = async () => {
  const response: string[] = (await axios.get('https://api.triadfi.co/boost'))
    .data

  const stakes = await triadProtocol.stake.getStakes(STAKE_SEASON)
  const update: { name: string; wallet: string }[] = []

  for (const stake of stakes) {
    if (response.includes(stake.mint) && !stake.boost) {
      update.push({ name: stake.name, wallet: stake.authority })
    }
  }

  const updateBoost = await triadProtocol.stake.updateBoost({
    wallet: wallet.publicKey,
    stakeVault: STAKE_SEASON,
    nfts: update,
    boost: true
  })

  console.log(updateBoost)
}
