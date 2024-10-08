import axios, { AxiosResponse } from 'axios'

const getPriorityFee = async () => {
  const response: AxiosResponse<
    Record<'1' | '5' | '15', { priorityTx: number }>
  > = await axios.get('https://solanacompass.com/api/fees')

  return response.data[5].priorityTx || 1000
}

export default getPriorityFee
