import fs from 'fs'
import { Connection, Keypair, PublicKey } from '@solana/web3.js'
import TriadProtocol from './index'
import { BN, Wallet } from '@coral-xyz/anchor'
import { STAKE_SEASON, TTRIAD_MINT } from './utils/constants'
import RARITY_JSON from './utils/stake-season-1/rarity.json'
import { getRarityRank } from './utils/getRarity'

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

deposit()
