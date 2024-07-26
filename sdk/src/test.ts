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

const requestWithdraw = async () => {
  const response = await triadProtocol.stake.requestWithdraw(
    {
      wallet: wallet.publicKey,
      name: 'Triad 873',
      mint: new PublicKey('FnLsRRfs7Ghhiwybr7fzZhFyfQEKQbxCJMtLghjiKLHy'),
      stakeVault: STAKE_SEASON
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
      week: 4,
      stakeVault: STAKE_SEASON
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
      name: 'Triad 2807',
      mint: new PublicKey('A4fu2s6bCbKAveVgACkxpMgtJUHqoRJsTyzRp1Jp8nuE'),
      stakeVault: STAKE_SEASON
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
    new PublicKey('BCTdjdcjMiECGFbF5Ps15yjLRPzy5YZGJNa4VdGRbhjB'),
    STAKE_SEASON
  )

  const stakeVaults = await triadProtocol.stake.getStakeVaults()

  console.log(response)
  console.log(stakeVaults)
}

getStake()

const claimStakeRewardsV1 = async () => {
  const response = await triadProtocol.stake.claimStakeRewards(
    {
      wallet: wallet.publicKey,
      mint: new PublicKey('t3DohmswhKk94PPbPYwA6ZKACyY3y5kbcqeQerAJjmV'),
      week: [4],
      stakeVault: STAKE_SEASON,
      nftName: 'Triad 2807'
    },
    {
      skipPreflight: true,
      microLamports: 10000
    }
  )

  console.log(response)
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

const getUsers = async () => {
  const response = await triadProtocol.stake.getUsers()

  console.log(response)
}

const migrateStake = async () => {
  const response = await triadProtocol.stake.migrateStake(
    {
      wallet: wallet.publicKey,
      name: 'Triad 190',
      mint: new PublicKey('7zEm9fzrRVAooEBWgCkt4gxvtsbpKRLaoPjB7SvCtvKM'),
      stakeVault: STAKE_SEASON
    },
    {
      skipPreflight: true,
      microLamports: 10000
    }
  )

  console.log(response)
}
