import fs from 'fs'
import { Connection, Keypair, PublicKey } from '@solana/web3.js'
import TriadProtocol from './index'
import { BN, Wallet } from '@coral-xyz/anchor'

export default class Test {
  file = fs.readFileSync('/Users/dannpl/.config/solana/id.json')
  Keypair = Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(this.file.toString()))
  )
  connection = new Connection('http://127.0.0.1:8899')
  wallet = new Wallet(this.Keypair)
  triadProtocol = new TriadProtocol(this.connection, this.wallet)

  constructor() {}

  init = async () => {}

  initializeStakeVault = async () => {
    const reponse = await this.triadProtocol.stake.initializeStakeVault({
      name: 'Rev 1',
      collection: 'Triad',
      slots: new BN(1939),
      amount: new BN(1000000000)
    })

    console.log('Initialize Stake Vault:', reponse)
  }

  stakeNFT = async () => {
    const reponse = await this.triadProtocol.stake.stake({
      name: 'Triad 2',
      wallet: this.wallet.publicKey,
      collections: { alligators: true, coleta: true, undead: true, pyth: true },
      mint: new PublicKey('DQ3Uq6GDX6HA99jVBaErtZcvhm1AsCpkB421a2MEDJ7B'),
      rarity: { common: {} }
    })

    console.log('Initialize Stake Vault:', reponse)
  }
}

const test = new Test()

test.stakeNFT()
