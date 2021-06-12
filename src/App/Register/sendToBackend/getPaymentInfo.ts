import currencyFormat from "@ziro/currency-format";
import { db } from "../../../Firebase";

export const getPaymentInfo = async (docId: string) => {
    const snapshot = await db.collection("credit-card-payments").doc(docId).get();
    if (!snapshot.exists) return { sellerFromPaymentLink: "", valueFromPaymentLink: "" };
    const { charge, seller, onBehalfOfBrand } = snapshot.data();
    if (seller === "Ziro")
        return {
            sellerFromPaymentLink: onBehalfOfBrand ? `${seller} - ${onBehalfOfBrand}` : seller,
            valueFromPaymentLink: currencyFormat(charge).replace("R$", "") || "",
        };
    return { sellerFromPaymentLink: seller, valueFromPaymentLink: currencyFormat(charge).replace("R$", "") || "" };
};
