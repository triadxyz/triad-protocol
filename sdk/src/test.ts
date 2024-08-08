import fs from 'fs'
import { Connection, Keypair, PublicKey } from '@solana/web3.js'
import TriadProtocol from './index'
import { Wallet } from '@coral-xyz/anchor'
import { STAKE_SEASON } from './utils/constants'

const file = fs.readFileSync('/Users/dannpl/.config/solana/id.json')
const rpc_file = fs.readFileSync('/Users/dannpl/.config/solana/rpc.txt')
const keypair = Keypair.fromSecretKey(
  new Uint8Array(JSON.parse(file.toString()))
)
const connection = new Connection(rpc_file.toString(), 'confirmed')
const wallet = new Wallet(keypair)
const triadProtocol = new TriadProtocol(connection, wallet)

const updateStakeVaultStatus = async () => {
  const response = await triadProtocol.stake.updateStakeVaultStatus(
    {
      wallet: wallet.publicKey,
      isLocked: false,
      stakeVault: STAKE_SEASON,
      initTs: 0
    },
    {
      skipPreflight: true,
      microLamports: 10000
    }
  )

  console.log(response)
}

const getStake = async () => {
  const response = await triadProtocol.stake.getStakeByWallet(
    new PublicKey('BCTdjdcjMiECGFbF5Ps15yjLRPzy5YZGJNa4VdGRbhjB'),
    STAKE_SEASON
  )

  console.log(response)
}

const getRewards = async () => {
  let sum = 0

  const a = await triadProtocol.stake.getStakeByWallet(
    new PublicKey('HjJQdfTHgC3EBX3471w4st8BXbBmtbaMyCAXNgcUb7dq'),
    STAKE_SEASON
  )

  for (let i = 0; i < a.length; i++) {
    const stake = a[i]

    const response = await triadProtocol.stake.getStakeRewards({
      wallet: new PublicKey('HjJQdfTHgC3EBX3471w4st8BXbBmtbaMyCAXNgcUb7dq'),
      mint: new PublicKey('t3DohmswhKk94PPbPYwA6ZKACyY3y5kbcqeQerAJjmV'),
      nftName: stake.name,
      stakeVault: STAKE_SEASON,
      collections: 5,
      rank: i
    })

    sum += response
  }

  console.log(sum)
}
