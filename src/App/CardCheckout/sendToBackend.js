import createTransaction from "./utils/createTransaction";
import prepareDataToDbAndSheet from "./utils/prepareDataToDbAndSheet";
import prepareDataToPay from "./utils/prepareDataToPay";
import writeError from "./utils/writeError";
import writeTransactionToFirestore from "./utils/writeTransactionToFirestore";
import writeTransactionToSheet from "./utils/writeTransactionToSheet";

// function to create transaction via Zoop and save info to sheet and firestore

const sendToBackend = (
  docId,
  charge,
  seller,
  sellerZoopId,
  buyerStoreownerId,
  razao,
  sellerZoopPlan
) => (state) => () =>
  new Promise(async (resolve, reject) => {
    try {
      if (!buyerStoreownerId)
        throw { msg: "Conta admin não pode pagar pelo app", customError: true };
      const paymentData = prepareDataToPay(
        state,
        sellerZoopId,
        charge,
        seller,
        sellerZoopPlan
      );
      const transaction = await createTransaction(paymentData);
      const [sheetData, dbData] = prepareDataToDbAndSheet(
        transaction,
        seller,
        razao,
        buyerStoreownerId
      );
      await writeTransactionToSheet(sheetData);
      await writeTransactionToFirestore(docId, dbData);
    } catch (error) {
      const errorMsg = await writeError(error, buyerStoreownerId, razao);
      reject(errorMsg);
    }
    resolve("Ok");
  });

export default sendToBackend;
