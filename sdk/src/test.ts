import fs from 'fs'
import { Connection, Keypair } from '@solana/web3.js'
import TriadProtocol from './index'
import { Wallet } from '@coral-xyz/anchor'

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
}
