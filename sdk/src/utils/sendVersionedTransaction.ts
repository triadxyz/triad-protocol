import {
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
  ComputeBudgetProgram
} from '@solana/web3.js'
import { RpcOptions } from '../types'
import { AnchorProvider } from '@coral-xyz/anchor'
import { Keypair } from '@solana/web3.js'

const sendVersionedTransaction = async (
  provider: AnchorProvider,
  ixs: TransactionInstruction[],
  options?: RpcOptions,
  payer?: Keypair
): Promise<string> => {
  if (options?.microLamports) {
    ixs.push(
      ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: options.microLamports
      })
    )
  }

  const { blockhash } = await provider.connection.getLatestBlockhash()

  const tx = new VersionedTransaction(
    new TransactionMessage({
      instructions: ixs,
      recentBlockhash: blockhash,
      payerKey: provider.publicKey
    }).compileToV0Message()
  )

  if (payer) {
    tx.sign([payer])
  }

  return provider.sendAndConfirm(tx, payer ? [payer] : [], {
    skipPreflight: options?.skipPreflight,
    commitment: 'confirmed'
  })
}

export default sendVersionedTransaction
