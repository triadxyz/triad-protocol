import { AnchorProvider, Program, Wallet } from '@coral-xyz/anchor'
import { Connection, PublicKey } from '@solana/web3.js'
import { TriadProtocol } from './types/triad_protocol'
import IDL from './types/idl_triad_protocol.json'
import Ticker from './ticker'
import Vault from './vault'
import { getUserPositionAddressSync } from './utils/helpers'
import Stake from './stake'

export default class TriadProtocolClient {
  program: Program<TriadProtocol>
  provider: AnchorProvider
  ticker: Ticker
  vault: Vault
  stake: Stake

  constructor(connection: Connection, wallet: Wallet) {
    this.provider = new AnchorProvider(
      connection,
      wallet,
      AnchorProvider.defaultOptions()
    )

    this.program = new Program(IDL as TriadProtocol, this.provider)
    this.ticker = new Ticker(this.program, this.provider)
    this.vault = new Vault(this.program, this.provider)
    this.stake = new Stake(this.program, this.provider)
  }

  getUserPositions = async (userWallet: PublicKey) => {
    const tickers = await this.ticker.getTickers()

    const positions = await Promise.all(
      tickers
        .map(async (ticker) => {
          let data = {}

          try {
            const UserPositionPDA = getUserPositionAddressSync(
              this.program.programId,
              userWallet,
              ticker.publicKey
            )
            const position =
              await this.program.account.userPosition.fetch(UserPositionPDA)

            data = {
              ticker,
              position
            }
          } catch {
            return
          }

          return data
        })
        .filter(Boolean)
    )

    return positions
  }
}
