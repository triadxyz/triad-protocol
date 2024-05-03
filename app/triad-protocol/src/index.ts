import { AnchorProvider, Program, Wallet } from '@coral-xyz/anchor'
import { Connection, PublicKey } from '@solana/web3.js'
import { IDL, TriadProtocol } from './types/triad_protocol'
import { TRIAD_PROTOCOL_PROGRAM_ID } from './utils/constants'
import Vault from './vault'
import Ticker from './ticker'
import { convertSecretKeyToKeypair } from './utils/convertSecretKeyToKeypair'

export default class TriadProtocolClient {
  program: Program<TriadProtocol>
  provider: AnchorProvider
  connection: Connection
  wallet: Wallet
  vault: Vault

  constructor(connection: Connection, wallet: Wallet) {
    this.connection = connection
    this.wallet = wallet
    this.provider = new AnchorProvider(
      this.connection,
      this.wallet,
      AnchorProvider.defaultOptions()
    )
    this.program = new Program<any>(
      IDL,
      TRIAD_PROTOCOL_PROGRAM_ID,
      this.provider
    )
    this.vault = new Vault(this.connection, this.wallet)
  }

  async createTickerInConsole() {
    const tickerClient = new Ticker(this.connection, this.wallet)

    const name = 'TDrift Protocol'
    const pythPricePubKey = new PublicKey(
      '0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43'
    )
    const programId = new PublicKey(
      'dRiftyHA39MWEi3m9aunc5MzRF1JYuBsbn6VPcn33UH'
    )

    try {
      const result = await tickerClient.createTicker({
        name: name,
        pythPricePubKey: pythPricePubKey,
        protocolProgramId: programId
      })
      console.log('Resultado do teste:', result)
    } catch (error) {
      console.error('Erro ao chamar a função createTicker:', error)
    }
  }
}

export const connection = new Connection(
  'https://mainnet.helius-rpc.com/?api-key=3fb2333b-4396-4db0-94c5-663cca63697e'
)

const x = convertSecretKeyToKeypair(
  'j2MApmrcZTjXPvfWfnsb69Gukdnhxp3tCHMa7oL5DVevxGCFFSANhT79jkKr8N8t5cLTzm3Po4vZsSPhSwJJN8Y'
)
const wallet = new Wallet(x)

const client = new TriadProtocolClient(connection, wallet)
client.createTickerInConsole()
