import { post } from 'axios'
import { db } from '../../Firebase'

const sendToBackend = (cnpj, column, row, obj, newProp, setIsLoading, setError) => () => {
  let property
  if (Object.keys(obj)[0] === 'ie') property = `'${newProp}`
  else property = newProp
  const url = process.env.SHEET_URL
  const body = {
    apiResource: 'values',
    apiMethod: 'update',
    range: `Base!${column}${row}`,
    valueInputOption: 'user_entered',
    spreadsheetId: process.env.SHEET_ID_STOREOWNERS,
    resource: {
      values: [[property]]
    }
  }

  const config = {
    headers: {
      'Content-type': 'application/json',
      'Authorization': process.env.SHEET_TOKEN
    }
  }
  return new Promise(async (resolve, reject) => {
    setIsLoading(true)
    try {
      if (row) await post(url, body, config)
      try {
        const snapCollection = await db.collection('storeowners').where('cnpj', '==', cnpj).get()
        let docId
        snapCollection.forEach(doc => docId = doc.id)
        await db.collection('storeowners').doc(docId).update(obj)
      } catch (error) {
        console.log(error)
        if (error.response) console.log(error.response)
        throw 'Erro ao salvar na Firestore'
      }
      resolve('Deu bom!')
    } catch (error) {
      if (error.customError) {
        setError(error)
        reject(error)
      }
      else {
        console.log(error)
        if (error.response) console.log(error.response)
        reject(error)
      }
    } finally {
      setIsLoading(false)
    }
  })
}

export default sendToBackend
