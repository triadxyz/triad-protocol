import { ComputeBudgetProgram } from '@solana/web3.js'
import { RpcOptions } from '../types'

const sendTransactionWithOptions = (method: any, options?: RpcOptions) => {
  if (options?.microLamports) {
    method.postInstructions([
      ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: options.microLamports
      })
    ])
  }

  return method.rpc({ skipPreflight: options?.skipPreflight })
}

export default sendTransactionWithOptions
