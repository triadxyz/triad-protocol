import fs from 'fs'
import { Connection, Keypair, PublicKey } from '@solana/web3.js'
import TriadProtocol from './index'
import { BN, Wallet } from '@coral-xyz/anchor'

export default class Test {
  file = fs.readFileSync('/Users/dannpl/.config/solana/id.json')
  Keypair = Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(this.file.toString()))
  )
  connection = new Connection(
    'https://mainnet.helius-rpc.com/?api-key=17c07b72-cbb1-4408-9069-8624f01ddc8f'
  )
  wallet = new Wallet(this.Keypair)
  triadProtocol = new TriadProtocol(this.connection, this.wallet)

  constructor() {}

  init = async () => {}

  getStakeVaults = async () => {
    const response = await this.triadProtocol.stake.getStakeVaults()

    console.log('Stake Vaults:', response)
  }

  getStakes = async () => {
    const response = await this.triadProtocol.stake.getStakes()

    console.log('Stakes:', response)
  }

  initializeStakeVault = async () => {
    const reponse = await this.triadProtocol.stake.initializeStakeVault(
      {
        name: 'Triad Share 1',
        collection: 'Triad',
        slots: new BN(1839)
      },
      { skipPreflight: true, microLamports: 40000 }
    )

    console.log('Initialize Stake Vault:', reponse)
  }

  stakeNFT = async () => {
    const reponse = await this.triadProtocol.stake.stake({
      name: 'Triad 2',
      wallet: this.wallet.publicKey,
      collections: { alligators: true, coleta: true, undead: true, pyth: true },
      mint: new PublicKey('DQ3Uq6GDX6HA99jVBaErtZcvhm1AsCpkB421a2MEDJ7B'),
      rarity: { mythic: {} }
    })

    console.log('Initialize Stake Vault:', reponse)
  }

  depositStakeRewards = async () => {
    const reponse = await this.triadProtocol.stake.depositStakeRewards(
      {
        wallet: this.wallet.publicKey,
        amount: new BN(0),
        mint: new PublicKey('t3DohmswhKk94PPbPYwA6ZKACyY3y5kbcqeQerAJjmV')
      },
      { skipPreflight: true, microLamports: 40000 }
    )

    console.log('Deposit Stake Rewards:', reponse)
  }
}
