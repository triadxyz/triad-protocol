import {
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
  ComputeBudgetProgram
} from '@solana/web3.js'
import { RpcOptions } from '../types'
import { Provider } from '@coral-xyz/anchor'

const sendVersionedTransaction = async (
  provider: Provider,
  ixs: TransactionInstruction[],
  options?: RpcOptions
): Promise<string> => {
  if (options?.microLamports) {
    ixs.push(
      ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: options.microLamports
      })
    )
  }

  const { blockhash } = await provider.connection.getLatestBlockhash()

  return provider.sendAndConfirm(
    new VersionedTransaction(
      new TransactionMessage({
        instructions: ixs,
        recentBlockhash: blockhash,
        payerKey: provider.publicKey
      }).compileToV0Message()
    ),
    [],
    {
      skipPreflight: options?.skipPreflight,
      commitment: 'confirmed'
    }
  )
}

export default sendVersionedTransaction
