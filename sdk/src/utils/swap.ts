import axios, { AxiosResponse } from 'axios'
import {
  AddressLookupTableAccount,
  Connection,
  PublicKey,
  TransactionInstruction,
  ComputeBudgetProgram
} from '@solana/web3.js'

export const swapToTRD = async ({
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
  const outToken = 't3DohmswhKk94PPbPYwA6ZKACyY3y5kbcqeQerAJjmV'

  const quoteResponse = await axios.get(
    `https://quote-api.jup.ag/v6/quote?inputMint=${getTokenInfo(inToken).mint}&outputMint=${outToken}&amount=${amount}&slippageBps=10&computeAutoSlippage=true&swapMode=ExactIn&onlyDirectRoutes=false&asLegacyTransaction=false&maxAccounts=64&minimizeSlippage=false&experimentalDexes=Jupiter%20LO0`
  )

  const { data: quoteData } = quoteResponse

  let trdAmount = 0

  console.log(quoteData)

  if (inToken !== 'USDC' && quoteData && quoteData.outAmount) {
    const outAmountNumber =
      Number(quoteData.outAmount) / 10 ** getTokenInfo(inToken).decimals

    trdAmount = outAmountNumber
  }

  if (inToken === 'USDC' && quoteData && quoteData.outAmount) {
    const outAmountNumber = Number(quoteData.outAmount) / 10 ** 6
    const inAmountNumber =
      Number(quoteData.inAmount) / 10 ** getTokenInfo(inToken).decimals

    const tokenAmount = inAmountNumber / outAmountNumber

    trdAmount = tokenAmount
  }

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

  console.log(
    setupInstructions,
    swapInstruction,
    addressLookupTableAddresses,
    cleanupInstruction
  )
  
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

const getTokenInfo = (token: string) => {
  const tokens: Record<string, { mint: string; decimals: number }> = {
    ORE: {
      mint: 'oreoU2P8bN6jkk3jbaiVxYnG1dCXcYxwhwyK9jSybcp',
      decimals: 11
    },
    SOL: {
      mint: 'So11111111111111111111111111111111111111112',
      decimals: 9
    },
    USDC: {
      mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
      decimals: 6
    }
  }

  return tokens[token]
}
