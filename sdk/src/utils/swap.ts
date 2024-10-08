import axios, { AxiosResponse } from 'axios'
import {
  AddressLookupTableAccount,
  Connection,
  PublicKey,
  TransactionInstruction,
  ComputeBudgetProgram
} from '@solana/web3.js'
import { TRD_MINT } from './constants'

export const swap = async ({
  connection,
  wallet,
  inToken,
  amount
}: {
  connection: Connection
  wallet: string
  inToken: string
  amount: number
}) => {
  const token = TOKENS[inToken]

  if (!token) {
    throw new Error('Token not found')
  }

  const formattedAmountIn = amount * 10 ** token.decimals

  const quoteResponse = await axios.get(
    `https://quote-api.jup.ag/v6/quote?inputMint=${inToken}&outputMint=${TRD_MINT.toBase58()}&amount=${formattedAmountIn}&slippageBps=10`
  )

  const { data: quoteData } = quoteResponse

  const swapResponse = await axios.post(
    'https://quote-api.jup.ag/v6/swap-instructions',
    {
      userPublicKey: wallet,
      wrapAndUnwrapSol: true,
      quoteResponse: quoteData
    }
  )

  const {
    setupInstructions,
    swapInstruction,
    addressLookupTableAddresses,
    cleanupInstruction
  } = swapResponse.data

  return {
    swapIxs: [
      deserializeInstruction(swapInstruction),
      ComputeBudgetProgram.setComputeUnitLimit({
        units: 500000
      }),
      ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: await getPriorityFee()
      })
    ],
    addressLookupTableAccounts: await getAddressLookupTableAccounts(
      connection,
      addressLookupTableAddresses
    ),
    setupInstructions: setupInstructions.map(deserializeInstruction),
    cleanupInstruction: deserializeInstruction(cleanupInstruction),
    trdAmount: quoteData.outAmount
  }
}

const deserializeInstruction = (instruction: any) => {
  return new TransactionInstruction({
    programId: new PublicKey(instruction.programId),
    keys: instruction.accounts.map((key: any) => ({
      pubkey: new PublicKey(key.pubkey),
      isSigner: key.isSigner,
      isWritable: key.isWritable
    })),
    data: Buffer.from(instruction.data, 'base64')
  })
}

export const getAddressLookupTableAccounts = async (
  connection: Connection,
  keys: string[]
): Promise<AddressLookupTableAccount[]> => {
  const addressLookupTableAccountInfos =
    await connection.getMultipleAccountsInfo(
      keys.map((key) => new PublicKey(key))
    )

  return addressLookupTableAccountInfos.reduce((acc, accountInfo, index) => {
    const addressLookupTableAddress = keys[index]
    if (accountInfo) {
      const addressLookupTableAccount = new AddressLookupTableAccount({
        key: new PublicKey(addressLookupTableAddress),
        state: AddressLookupTableAccount.deserialize(accountInfo.data)
      })
      acc.push(addressLookupTableAccount)
    }

    return acc
  }, new Array<AddressLookupTableAccount>())
}

const getPriorityFee = async () => {
  const response: AxiosResponse<
    Record<'1' | '5' | '15', { priorityTx: number }>
  > = await axios.get('https://solanacompass.com/api/fees')

  return response.data[15].priorityTx || 1000
}

const TOKENS: Record<string, { mint: string; decimals: number }> = {
  oreoU2P8bN6jkk3jbaiVxYnG1dCXcYxwhwyK9jSybcp: {
    mint: 'oreoU2P8bN6jkk3jbaiVxYnG1dCXcYxwhwyK9jSybcp',
    decimals: 11
  },
  So11111111111111111111111111111111111111112: {
    mint: 'So11111111111111111111111111111111111111112',
    decimals: 9
  },
  EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v: {
    mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    decimals: 6
  }
}
