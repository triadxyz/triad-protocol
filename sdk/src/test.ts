import fs from 'fs'
import { Connection, Keypair, PublicKey } from '@solana/web3.js'
import TriadProtocol from './index'
import { BN, Wallet } from '@coral-xyz/anchor'
import { TTRIAD_MINT } from './utils/constants'
import RARITY_JSON from './utils/stake-season-1/rarity.json'
import { getRarityRank } from './utils/getRarity'
import axios from 'axios'

const file = fs.readFileSync('/Users/dannpl/.config/solana/triad-builder.json')
const rpc_file = fs.readFileSync('/Users/dannpl/.config/solana/rpc.txt')
const keypair = Keypair.fromSecretKey(
  new Uint8Array(JSON.parse(file.toString()))
)
const connection = new Connection(rpc_file.toString(), 'confirmed')
const wallet = new Wallet(keypair)
const triadProtocol = new TriadProtocol(connection, wallet)

const getStake = async () => {
  const response = await triadProtocol.stake.getStakes()

  let available = 0
  let items = 0
  for (const stake of response) {
    const getRank = getRarityRank(RARITY_JSON, stake.mint, stake.name)

    try {
      available += await triadProtocol.stake.getStakeRewards({
        wallet: new PublicKey(stake.authority),
        nftName: stake.name,
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

const getStakeByWallet = async () => {
  const response = await triadProtocol.stake.getStakeByWallet(
    new PublicKey('HjJQdfTHgC3EBX3471w4st8BXbBmtbaMyCAXNgcUb7dq'),
    1,
    RARITY_JSON
  )

  console.log(response)
}

const depositStakeRewards = async () => {
  const response = await triadProtocol.stake.depositStakeRewards({
    wallet: wallet.publicKey,
    mint: new PublicKey(TTRIAD_MINT),
    amount: new BN(192388 * 10 ** 6)
  })

  console.log(response)
}

const updateBoost = async () => {
  const response: string[] = (await axios.get('https://api.triadfi.co/boost'))
    .data

  const stakes = await triadProtocol.stake.getStakes()
  const update: { name: string; wallet: string }[] = []

  for (const stake of stakes) {
    if (update.length >= 10) {
      break
    }

    if (response.includes(stake.mint) && !stake.boost) {
      update.push({ name: stake.name, wallet: stake.authority })
    }
  }

  const updateBoostResponse = await triadProtocol.stake.updateBoost({
    wallet: wallet.publicKey,
    nfts: update,
    boost: true
  })

  console.log(updateBoostResponse)
}
