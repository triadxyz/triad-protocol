import { Address, AnchorProvider, Program, Wallet } from '@coral-xyz/anchor'
import { Connection, PublicKey } from '@solana/web3.js'
import { IDL, TriadProtocol } from './types/triad_protocol'
import { TRIAD_PROTOCOL_PROGRAM_ID } from './utils/constants'
import Ticker from './ticker'
import { getUserAddressSync } from './utils/helpers'
import Vault from './vault'
import { convertSecretKeyToKeypair } from './utils/convertSecretKeyToKeypair'

export default class TriadProtocolClient {
  program: Program<TriadProtocol>
  provider: AnchorProvider
  ticker: Ticker
  vault: Vault

  constructor(connection: Connection, wallet: Wallet) {
    this.provider = new AnchorProvider(
      connection,
      wallet,
      AnchorProvider.defaultOptions()
    )

    this.program = new Program<any>(
      IDL,
      TRIAD_PROTOCOL_PROGRAM_ID,
      this.provider
    )
    this.ticker = new Ticker(this.program, this.provider)
    this.vault = new Vault(this.program, this.provider)
  }

  /**
   * Get all users
   */
  async getUsers() {
    return this.program.account.user.all()
  }

  /**
   * Create a new user
   *  @param name - The ticker's name
   *  @param referrer - The referrer's public key
   *  @param community - The community's public key
   *
   */
  public async createUser({
    name,
    referrer,
    community
  }: {
    name: string
    referrer: string
    community: string
  }) {
    const UserPDA = getUserAddressSync(
      this.program.programId,
      this.provider.wallet.publicKey
    )

    return this.program.methods
      .createUser({
        name,
        referrer,
        community
      })
      .accounts({
        signer: this.provider.wallet.publicKey,
        user: UserPDA
      })
      .rpc()
  }

  /**
   * Get user data
   *  @param user - The user's public key
   *
   */
  public async getUserData(user: Address) {
    try {
      return this.program.account.user.fetch(user)
    } catch (error) {
      throw new Error('User not found')
    }
  }
}

const connection = new Connection('https://devnet.helius-rpc.com/?api-key=3fb2333b-4396-4db0-94c5-663cca63697e', 'confirmed')
const keypair = convertSecretKeyToKeypair(
  '43ZaBtQz9KKRw9n731qoxSk18Crp4v11uAre8ucfh8xJMvvkDC7HbsoGGTLFP1Hr1HXLPwKhLaLwetfJ53FQrMC4'
)
const wallet = new Wallet(keypair)
const triadProtocolClient = new TriadProtocolClient(connection, wallet)

triadProtocolClient.vault
  .closePosition({
    tickerPDA: new PublicKey('4gCEAiCm6nHazMsJ1MA1zdAsxLa6kEVkTcaazzpRFMSL'),
    amount: '1',
    position: 'Long',
    mint: new PublicKey('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'),
    positionPubkey: new PublicKey(
      '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'
    )
  })
  .then((a) => {
    console.log(a)
  })
