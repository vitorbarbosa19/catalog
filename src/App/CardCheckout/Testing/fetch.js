import { db } from '../../../Firebase'

const fetch = (setIsLoading, setIsError, setIsExpired, setCharge, setInstallmentsMax, setSeller, setSellerZoopId, setId, docIdPayment) => {
  const run = async () => {
    try {
      const payment = await db.collection('credit-card-payments').doc('Z3B7YEUmIu1ZjEcdjkMa').get() // FOR TESTING
      if (payment.exists) {
        const { charge, installmentsMax, seller, sellerZoopId, status } = payment.data()
        if (true/*status === 'Aguardando Pagamento'*/) { // FOR TESTING
          if (charge && installmentsMax && seller && sellerZoopId) {
            setCharge(charge)
            setInstallmentsMax(installmentsMax )
            setSeller(seller)
            setSellerZoopId(sellerZoopId)
            setId(docIdPayment)
            setIsLoading(false)
          } else setIsError(true)
        } else setIsExpired(true)
      } else setIsError(true)
    } catch (error) {
      console.log(error)
      setIsError(true)
    }
  }
  run()
}

export default fetch
