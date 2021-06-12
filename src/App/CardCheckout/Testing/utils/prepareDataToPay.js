const prepareDataToPay = (state, sellerZoopId, charge, seller) => {
	const { cardholder, expiry, number, cvv, installments } = state
	const cardholderFormatted = cardholder.trim().toLowerCase()
	const month = expiry.substring(0, 2)
	const year = `20${expiry.substring(3, 5)}`
	return { sellerZoopId, charge, cardholder, month, year, number, cvv, installments, seller }
}

export default prepareDataToPay