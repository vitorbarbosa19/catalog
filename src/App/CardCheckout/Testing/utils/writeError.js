import axios from 'axios'
import { db } from '../../../../Firebase/index'
import { formatDateUTC3 } from '@ziro/format-date-utc3'

const writeError = async (error, buyerStoreownerId, razao) => {
  if (error.customError) return error
  if (error.response) {
    const { status_code: httpStatus, message, message_display } = error.response.data?.error ?? { status_code: '', message: '' }
    const userMessage = message_display ?? ''
    const authorizer = error.response.data?.gateway_authorizer ?? ''
    const [creation, authorization] = error.response.data?.history ?? [null,null]
    const zoopStatus = creation?.status ?? ''
    const { response_code, response_message } = authorization ?? { response_code: '', response_message: '' }
    try {
      const url = process.env.SHEET_URL
      const method = 'POST'
      const headers = {
        Authorization: process.env.SHEET_TOKEN,
        'Content-Type': 'application/json'
      }
      const data = {
        apiResource: 'values',
        apiMethod: 'append',
        spreadsheetId: process.env.SHEET_ID_TRANSACTIONS,
        range: 'Transacoes_Erros!A1',
        resource: {
          values: [[
            formatDateUTC3(new Date()),
            razao,
            httpStatus,
            message,
            userMessage,
            authorizer,
            zoopStatus,
            response_code,
            response_message
          ]],
        },
        valueInputOption: 'user_entered',
      }
      await axios({ url, method, headers, data })
      await db.collection('credit-card-errors').add({
        date: new Date(),
        buyerStoreownerId,
        buyerRazao: razao,
        httpStatus,
        message,
        userMessage,
        authorizer,
        zoopStatus,
        acquirerStatus: response_code,
        acquirerMsg: response_message
      })
      if (message_display) return { msg: message_display, customError: true }
      return message
    } catch (error) {
      return error
    }
  }
}

export default writeError
