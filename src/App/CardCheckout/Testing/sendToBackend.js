import prepareDataToPay from './utils/prepareDataToPay'
import createTransaction from './utils/createTransaction'
import prepareDataToDbAndSheet from './utils/prepareDataToDbAndSheet'
import writeTransactionToSheet from './utils/writeTransactionToSheet'
import writeTransactionToFirestore from './utils/writeTransactionToFirestore'
import writeError from './utils/writeError'

// function to create transaction via Zoop and save info to sheet and firestore

const sendToBackend = (docId, charge, seller, sellerZoopId, buyerStoreownerId, razao) => state => () =>
  new Promise(async (resolve, reject) => {
    try {
      if (!buyerStoreownerId) throw { msg: 'Conta admin não pode pagar pelo app', customError: true }
      const paymentData = prepareDataToPay(state, sellerZoopId, charge, seller)
      const transaction = await createTransaction(paymentData)
      const [sheetData, dbData] = prepareDataToDbAndSheet(transaction, seller, razao, buyerStoreownerId)
      await writeTransactionToSheet(sheetData)
      await writeTransactionToFirestore(dbData)
    } catch (error) {
      const errorMsg = await writeError(error, buyerStoreownerId, razao)
      reject(errorMsg)
    }
    reject('Ok') // FOR TESTING
  })

export default sendToBackend
