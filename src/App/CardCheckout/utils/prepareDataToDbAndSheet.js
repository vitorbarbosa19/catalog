import { formatDateUTC3 } from "@ziro/format-date-utc3";
import currencyFormat from "@ziro/currency-format";
import translateStatus from "./translateStatus";

const prepareDataToDbAndSheet = (
  transaction,
  seller,
  razao,
  buyerStoreownerId
) => {
  const {
    id: transactionId,
    status,
    amount,
    payment_type,
    payment_method,
    installment_plan,
    sales_receipt,
    gateway_authorizer: authorizer,
  } = transaction;
  const installments = installment_plan.number_installments;
  const type = payment_type === "credit" ? "crédito" : "";
  const {
    holder_name,
    first4_digits,
    last4_digits,
    created_at,
    card_brand,
  } = payment_method;
  const sheetData = [
    transactionId,
    formatDateUTC3(new Date(created_at)),
    translateStatus(status),
    type,
    installments,
    seller,
    razao,
    holder_name.toLowerCase(),
    card_brand,
    `${first4_digits}...${last4_digits}`,
    currencyFormat(amount * 100).replace("R$", ""),
  ];
  const dbData = {
    buyerStoreownerId,
    buyerRazao: razao,
    status: translateStatus(status),
    installments,
    datePaid: new Date(),
    brand: card_brand,
    cardholder: holder_name.toLowerCase(),
    cardFirstFour: first4_digits,
    cardLastFour: last4_digits,
    transactionZoopId: transactionId,
    receiptId: sales_receipt,
    authorizer,
  };
  return [sheetData, dbData];
};

export default prepareDataToDbAndSheet;
