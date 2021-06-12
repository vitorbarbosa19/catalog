import axios from 'axios'

const createTransaction = async ({ sellerZoopId, charge, cardholder, month, year, number, cvv, installments, seller }) => {
	const url = process.env.PAY_TESTING // FOR TESTING
	const method = 'POST'
	const headers = {
		Authorization: `Basic ${process.env.PAY_TOKEN_TESTING}`, // FOR TESTING
		'Content-Type': 'application/json' // FOR TESTING
	}
	const data = {
		payment_type: 'credit',
		capture: false,
		on_behalf_of: sellerZoopId,
		source: {
			usage: 'single_use',
			amount: charge,
			currency: 'BRL',
			type: 'card',
			card: {
				holder_name: cardholder,
				expiration_month: month,
				expiration_year: year,
				card_number: number,
				security_code: cvv
			}
		},
		installment_plan: {
			mode: 'interest_free',
			number_installments: installments
		},
		statement_descriptor: `${seller}`
	}
	const { data: result } = await axios({ url, method, headers, data })
	return result
}

export default createTransaction
