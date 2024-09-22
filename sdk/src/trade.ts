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
import { TRD_DECIMALS, TRD_MINT, TRD_MINT_DEVNET } from './utils/constants'
import {
  encodeString,
  getMarketAddressSync,
  getUserTradeAddressSync
} from './utils/helpers'

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
    return this.program.account.market.all().then((markets) =>
      markets.map(({ account, publicKey }) => ({
        bump: account.bump,
        address: publicKey.toString(),
        authority: account.authority.toString(),
        marketId: account.marketId.toNumber(),
        name: account.name,
        hypePrice: account.hypePrice.toNumber(),
        flopPrice: account.flopPrice.toNumber(),
        hypeLiquidity: account.hypeLiquidity.toNumber(),
        flopLiquidity: account.flopLiquidity.toNumber(),
        totalHypeShares: account.totalHypeShares.toNumber(),
        totalFlopShares: account.totalFlopShares.toNumber(),
        totalVolume: account.totalVolume.toNumber(),
        vaultTokenAccount: account.vaultTokenAccount.toString(),
        mint: account.mint.toString(),
        ts: account.ts.toNumber(),
        updateTs: account.updateTs.toNumber(),
        openOrdersCount: account.openOrdersCount.toNumber(),
        nextOrderId: account.nextOrderId.toNumber(),
        feeBps: account.feeBps,
        feeVault: account.feeVault.toBase58(),
        isActive: account.isActive,
        isOfficial: account.isOfficial
      }))
    )
  }

  async getMarketByAddress(address: PublicKey): Promise<Market> {
    const account = await this.program.account.market.fetch(address)

    return {
      bump: account.bump,
      address: address.toString(),
      authority: account.authority.toString(),
      marketId: account.marketId.toNumber(),
      name: account.name,
      hypePrice: account.hypePrice.toNumber(),
      flopPrice: account.flopPrice.toNumber(),
      hypeLiquidity: account.hypeLiquidity.toNumber(),
      flopLiquidity: account.flopLiquidity.toNumber(),
      totalHypeShares: account.totalHypeShares.toNumber(),
      totalFlopShares: account.totalFlopShares.toNumber(),
      totalVolume: account.totalVolume.toNumber(),
      vaultTokenAccount: account.vaultTokenAccount.toString(),
      mint: account.mint.toString(),
      ts: account.ts.toNumber(),
      updateTs: account.updateTs.toNumber(),
      openOrdersCount: account.openOrdersCount.toNumber(),
      nextOrderId: account.nextOrderId.toNumber(),
      feeBps: account.feeBps,
      feeVault: account.feeVault.toBase58(),
      isActive: account.isActive,
      isOfficial: account.isOfficial
    }
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
    const method = this.program.methods
      .initializeMarket({
        marketId: new BN(marketId),
        name: name
      })
      .accounts({
        signer: this.provider.publicKey,
        mint: TRD_MINT
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
    const userTradePDA = getUserTradeAddressSync(
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
      limitPrice?: number
      comment?: string
    },
    options?: RpcOptions
  ): Promise<string> {
    const marketPDA = getMarketAddressSync(this.program.programId, marketId)

    const ixs: TransactionInstruction[] = []

    try {
      const userTradePDA = getUserTradeAddressSync(
        this.program.programId,
        this.provider.publicKey
      )
      await this.program.account.userTrade.fetch(userTradePDA)
    } catch {
      ixs.push(
        await this.program.methods
          .createUserTrade()
          .accounts({
            signer: this.provider.publicKey
          })
          .instruction()
      )
    }

    ixs.push(
      await this.program.methods
        .openOrder({
          amount: new BN(args.amount * 10 ** TRD_DECIMALS),
          direction: args.direction,
          orderType: args.orderType,
          limitPrice: new BN(args.limitPrice * 10 ** TRD_DECIMALS),
          comment: encodeString(args.comment, 64)
        })
        .accounts({
          signer: this.provider.publicKey,
          market: marketPDA,
          mint: this.mint
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
    const marketPDA = getMarketAddressSync(this.program.programId, marketId)

    const method = this.program.methods.closeOrder(new BN(orderId)).accounts({
      signer: this.provider.publicKey,
      market: marketPDA,
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
}
