import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { TriadProtocol } from './types/triad_protocol'
import { PublicKey, TransactionInstruction } from '@solana/web3.js'
import { InitializeQuestionArgs, Market, OpenOrderArgs } from './types/trade'
import { RpcOptions } from './types'
import BN from 'bn.js'
import { TRD_DECIMALS, TRD_MINT } from './utils/constants'
import { accountToMarket, encodeString } from './utils/helpers'
import {
  getFeeVaultPDA,
  getMarketPDA,
  getUserTradePDA
} from './utils/pda/trade'
import { getTokenATA, getUserPDA } from './utils/pda'
import sendVersionedTransaction from './utils/sendVersionedTransaction'
import sendTransactionWithOptions from './utils/sendTransactionWithOptions'

export default class Trade {
  program: Program<TriadProtocol>
  provider: AnchorProvider
  mint: PublicKey = TRD_MINT

  constructor(program: Program<TriadProtocol>, provider: AnchorProvider) {
    this.provider = provider
    this.program = program
  }

  /**
   * Get all Markets
   */
  async getAllMarkets(): Promise<Market[]> {
    return this.program.account.market
      .all()
      .then((markets) =>
        markets.map(({ account, publicKey }) =>
          accountToMarket(account, publicKey)
        )
      )
  }

  /**
   * Get Market by ID
   * @param marketId - The ID of the market
   *
   */
  async getMarketById(marketId: number): Promise<Market> {
    const marketPDA = getMarketPDA(this.program.programId, marketId)

    const response = await this.program.account.market.fetch(marketPDA)

    return accountToMarket(response, marketPDA)
  }

  /**
   * Get Market by Address
   * @param address - The address of the market
   *
   */
  async getMarketByAddress(address: PublicKey): Promise<Market> {
    const account = await this.program.account.market.fetch(address)

    return accountToMarket(account, address)
  }

  /**
   * Get User Trade
   * @param user - The user's public key
   *
   */
  async getUserTrade(user: PublicKey) {
    const userTradePDA = getUserTradePDA(this.program.programId, user)

    return this.program.account.userTrade.fetch(userTradePDA)
  }

  /**
   * Initialize Market
   * @param market id - new markert id - length + 1
   * @param name - PYTH/TRD JUP/TRD DRIFT/TRD
   *
   * @param options - RPC options
   *
   */
  async initializeMarket(
    { marketId, name }: { marketId: number; name: string },
    options?: RpcOptions
  ) {
    return sendTransactionWithOptions(
      this.program.methods
        .initializeMarket({
          marketId: new BN(marketId),
          name: name
        })
        .accounts({
          signer: this.provider.publicKey,
          mint: this.mint
        }),
      options
    )
  }

  /**
   * Open Order
   * @param marketId - The ID of the market
   * @param amount - The amount of the order
   * @param direction - The direction of the order
   * @param comment - The comment of the order
   *
   * @param options - RPC options
   *
   */
  async openOrder(
    { marketId, amount, direction, comment }: OpenOrderArgs,
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
          amount: new BN(amount * 10 ** TRD_DECIMALS),
          direction: direction,
          comment: encodeString(comment, 64)
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

    return sendVersionedTransaction(this.provider, ixs, options)
  }

  /**
   * Close Order
   * @param marketId - The ID of the market
   * @param orderId - The ID of the order
   *
   * @param options - RPC options
   *
   */
  async closeOrder(
    { marketId, orderId }: { marketId: number; orderId: number },
    options?: RpcOptions
  ): Promise<string> {
    const marketPDA = getMarketPDA(this.program.programId, marketId)
    const userTradePDA = getUserTradePDA(
      this.program.programId,
      this.provider.publicKey
    )

    return sendTransactionWithOptions(
      this.program.methods.closeOrder(new BN(orderId)).accounts({
        signer: this.provider.publicKey,
        market: marketPDA,
        mint: this.mint,
        userTrade: userTradePDA
      }),
      options
    )
  }

  /**
   * Initialize a new question for a market
   * @param marketId - The ID of the market
   * @param question - The question to initialize
   * @param startTime - The start time of the question
   * @param endTime - The end time of the question
   *
   * @param options - RPC options
   *
   */
  async initializeQuestion(
    { marketId, question, startTime, endTime }: InitializeQuestionArgs,
    options?: RpcOptions
  ): Promise<string> {
    const marketPDA = getMarketPDA(this.program.programId, marketId)

    return sendTransactionWithOptions(
      this.program.methods
        .initializeQuestion({
          question: encodeString(question, 80),
          startTime: new BN(startTime),
          endTime: new BN(endTime)
        })
        .accounts({
          signer: this.provider.publicKey,
          market: marketPDA
        }),
      options
    )
  }

  /**
   * Resolve the current question for a market
   * @param marketId - The ID of the market
   *
   * @param options - RPC options
   *
   */
  async resolveQuestion(
    marketId: number,
    options?: RpcOptions
  ): Promise<string> {
    const marketPDA = getMarketPDA(this.program.programId, marketId)

    const method = this.program.methods.resolveQuestion().accounts({
      signer: this.provider.publicKey,
      market: marketPDA
    })

    return sendTransactionWithOptions(method, options)
  }

  /**
   * Settle an order
   * @param marketId - The ID of the market
   * @param orderId - The ID of the order to settle
   *
   * @param options - RPC options
   *
   */
  async settleOrder(
    { marketId, orderId }: { marketId: number; orderId: number },
    options?: RpcOptions
  ): Promise<string> {
    const marketPDA = getMarketPDA(this.program.programId, marketId)
    const userTradePDA = getUserTradePDA(
      this.program.programId,
      this.provider.publicKey
    )

    return sendTransactionWithOptions(
      this.program.methods.settleOrder(new BN(orderId)).accounts({
        signer: this.provider.publicKey,
        userTrade: userTradePDA,
        market: marketPDA,
        mint: this.mint
      }),
      options
    )
  }
}
