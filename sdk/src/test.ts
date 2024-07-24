import fs from 'fs'
import { Connection, Keypair, PublicKey } from '@solana/web3.js'
import TriadProtocol from './index'
import { BN, Wallet } from '@coral-xyz/anchor'
import { STAKE_SEASON, TTRIAD_DECIMALS } from './utils/constants'
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
      week: 5,
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
      mint: new PublicKey(''),
      week: [],
      stakeVault: STAKE_SEASON,
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
  const response = await triadProtocol.stake.getStakes(STAKE_SEASON)

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
