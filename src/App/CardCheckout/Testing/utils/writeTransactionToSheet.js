import axios from 'axios'

const writeTransactionToSheet = async body => {
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
		range: 'Transacoes!A1',
		resource: {
			values: [body],
		},
		valueInputOption: 'user_entered',
	}
	return axios({ url, method, headers, data })
}

export default writeTransactionToSheet