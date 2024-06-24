import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { PublicKey } from '@solana/web3.js'
import { TriadProtocol } from './types/triad_protocol'
import { getATASync, getStakeVaultAddressSync } from './utils/helpers'
import BN from 'bn.js'

export default class Stake {
  program: Program<TriadProtocol>
  provider: AnchorProvider

  constructor(program: Program<TriadProtocol>, provider: AnchorProvider) {
    this.provider = provider
    this.program = program
  }

  /**
   * Get all stakes
   */
  async getStakes() {
    return this.program.account.stake.all()
  }

  /**
   *  Stake NFT
   *  @param name - NFT name
   *  @param wallet - User wallet
   *  @param mint - NFT mint
   *  @param collections - NFT collections
   *  @param rarity - NFT rarity
   *
   */
  public async stake({
    name,
    wallet,
    mint,
    collections,
    rarity
  }: {
    name: string
    wallet: PublicKey
    mint: PublicKey
    collections: {
      alligators: boolean
      coleta: boolean
      undead: boolean
      pyth: boolean
    }
    rarity:
      | { common: {} }
      | { uncommon: {} }
      | { rare: {} }
      | { epic: {} }
      | { legendary: {} }
  }) {
    const stakeVaultName = 'Triad Share 1'
    const FromAta = getATASync(wallet, mint)
    const StakeVault = getStakeVaultAddressSync(
      this.program.programId,
      stakeVaultName
    )
    const ToAta = getATASync(StakeVault, mint)

    let items = []

    Object.keys(collections).forEach((key) => {
      if (collections[key]) {
        items.push({ [key]: {} })
      }
    })

    return this.program.methods
      .stake({
        name,
        collections: items,
        rarity,
        stakeVault: stakeVaultName
      })
      .accounts({
        signer: wallet,
        fromAta: FromAta,
        toAta: ToAta,
        mint: mint
      })
      .rpc({
        skipPreflight: true
      })
  }

  /**
   *  Initialize Stake Vault
   *  @param name - The ticker's name
   *  @param amount - Reward amount
   *  @param slots - Amount available to users joining the vault
   *  @param collection - The Collection name
   *
   */
  public async initializeStakeVault({
    name,
    amount,
    slots,
    collection
  }: {
    name: string
    amount: BN
    slots: BN
    collection: string
  }) {
    return this.program.methods
      .initializeStakeVault({
        name,
        amount,
        slots,
        collection
      })
      .accounts({
        signer: this.provider.wallet.publicKey
      })
      .rpc()
  }
}
