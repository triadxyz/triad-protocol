import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { TriadProtocol } from './types/triad_protocol'
import {
  ComputeBudgetProgram,
  PublicKey,
  TransactionInstruction,
  VersionedTransaction,
  TransactionMessage
} from '@solana/web3.js'
import { Market, OrderDirection, OrderType } from './types/trade'
import { RpcOptions } from './types'
import BN from 'bn.js'
import { TRD_DECIMALS, TRD_MINT_DEVNET } from './utils/constants'
import { accountToMarket, encodeString } from './utils/helpers'
import {
  getFeeVaultPDA,
  getMarketPDA,
  getUserTradePDA
} from './utils/pda/trade'
import { getTokenATA, getUserPDA } from './utils/pda'

export default class Trade {
  program: Program<TriadProtocol>
  provider: AnchorProvider
  mint: PublicKey = TRD_MINT_DEVNET

  constructor(program: Program<TriadProtocol>, provider: AnchorProvider) {
    this.provider = provider
    this.program = program
  }

  /**
   * Get all Markets
   */
  async getMarkets(): Promise<Market[]> {
    return this.program.account.market
      .all()
      .then((markets) =>
        markets.map(({ account, publicKey }) =>
          accountToMarket(account, publicKey)
        )
      )
  }

  async getMarketByAddress(address: PublicKey): Promise<Market> {
    const account = await this.program.account.market.fetch(address)

    return accountToMarket(account, address)
  }

  /**
   * Initialize Market
   * @param market id - new markert id - length + 1
   * @param name - PYTH/TRD JUP/TRD DRIFT/TRD
   *
   */
  async initializeMarket(
    { marketId, name }: { marketId: number; name: string },
    options?: RpcOptions
  ): Promise<string> {
    const marketPDA = getMarketPDA(this.program.programId, marketId)
    const feeVaultPDA = getFeeVaultPDA(this.program.programId, marketId)

    const method = this.program.methods
      .initializeMarket({
        marketId: new BN(marketId),
        name: name
      })
      .accounts({
        signer: this.provider.publicKey,
        mint: this.mint
      })

    if (options?.microLamports) {
      method.postInstructions([
        ComputeBudgetProgram.setComputeUnitPrice({
          microLamports: options.microLamports
        })
      ])
    }

    return method.rpc({ skipPreflight: options?.skipPreflight })
  }

  async getUserTrade() {
    const userTradePDA = getUserTradePDA(
      this.program.programId,
      this.provider.publicKey
    )

    return this.program.account.userTrade.fetch(userTradePDA)
  }

  async openOrder(
    marketId: number,
    args: {
      amount: number
      direction: OrderDirection
      orderType: OrderType
      comment?: string
    },
    options?: RpcOptions
  ): Promise<string> {
    const marketPDA = getMarketPDA(this.program.programId, marketId)
    const feeVualtPDA = getFeeVaultPDA(this.program.programId, marketId)
    const userTradePDA = getUserTradePDA(
      this.program.programId,
      this.provider.publicKey
    )
    const userPDA = getUserPDA(this.program.programId, this.provider.publicKey)
    const userFromATA = getTokenATA(this.provider.publicKey, this.mint)

    const ixs: TransactionInstruction[] = []

    try {
      await this.program.account.userTrade.fetch(userTradePDA)
    } catch {
      ixs.push(
        await this.program.methods
          .createUserTrade()
          .accounts({
            signer: this.provider.publicKey,
            user: userPDA
          })
          .instruction()
      )
    }

    ixs.push(
      await this.program.methods
        .openOrder({
          amount: new BN(args.amount * 10 ** TRD_DECIMALS),
          direction: args.direction,
          comment: encodeString(args.comment, 64)
        })
        .accounts({
          signer: this.provider.publicKey,
          market: marketPDA,
          feeVault: feeVualtPDA,
          userTrade: userTradePDA,
          mint: this.mint,
          userFromAta: userFromATA
        })
        .instruction()
    )

    if (options?.microLamports) {
      ixs.push(
        ComputeBudgetProgram.setComputeUnitPrice({
          microLamports: options.microLamports
        })
      )
    }

    const { blockhash } = await this.provider.connection.getLatestBlockhash()

    return this.provider.sendAndConfirm(
      new VersionedTransaction(
        new TransactionMessage({
          instructions: ixs,
          recentBlockhash: blockhash,
          payerKey: this.provider.publicKey
        }).compileToV0Message()
      ),
      [],
      {
        skipPreflight: options?.skipPreflight,
        commitment: 'confirmed'
      }
    )
  }

  async closeOrder(
    { marketId, orderId }: { marketId: number; orderId: number },
    options?: RpcOptions
  ): Promise<string> {
    const marketPDA = getMarketPDA(this.program.programId, marketId)
    const userTradePDA = getUserTradePDA(
      this.program.programId,
      this.provider.publicKey
    )

    const method = this.program.methods.closeOrder(new BN(orderId)).accounts({
      signer: this.provider.publicKey,
      market: marketPDA,
      mint: this.mint,
      userTrade: userTradePDA
    })

    if (options?.microLamports) {
      method.postInstructions([
        ComputeBudgetProgram.setComputeUnitPrice({
          microLamports: options.microLamports
        })
      ])
    }

    return method.rpc({ skipPreflight: options?.skipPreflight })
  }
}
