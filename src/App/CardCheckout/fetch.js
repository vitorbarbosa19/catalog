import { db } from "../../Firebase";

const fetch = (
  setIsLoading,
  setIsError,
  setIsExpired,
  setCharge,
  setInstallmentsMax,
  setSeller,
  setSellerZoopId,
  setId,
  docIdPayment,
  setSellerZoopPlan
) => {
  const run = async () => {
    try {
      const payment = await db
        .collection("credit-card-payments")
        .doc(docIdPayment)
        .get();
      if (payment.exists) {
        const {
          charge,
          installmentsMax,
          seller,
          sellerZoopId,
          status,
          sellerZoopPlan,
          insurance,
        } = payment.data();
        if (status === "Aguardando Pagamento") {
          if (charge && installmentsMax && seller && sellerZoopId) {
            setCharge(charge);
            setInstallmentsMax(installmentsMax);
            setSeller(seller);
            setSellerZoopId(sellerZoopId);
            setId(docIdPayment);
            setIsLoading(false);
            sellerZoopPlan
              ? setSellerZoopPlan({ ...sellerZoopPlan, insurance })
              : setSellerZoopPlan(null);
          } else setIsError(true);
        } else setIsExpired(true);
      } else setIsError(true);
    } catch (error) {
      console.log(error);
      setIsError(true);
    }
  };
  run();
};

export default fetch;
