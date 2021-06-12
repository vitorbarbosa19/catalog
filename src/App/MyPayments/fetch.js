import currencyFormat from "@ziro/currency-format";
import { db } from "../../Firebase/index.ts";

import matchStatusColor from "./matchStatusColor";

const fetch = (setIsLoading, setErrorLoading, setPayments, uid) => {
    try {
        if (typeof uid !== "undefined") {
            const run = async () => {
                db.collection("credit-card-payments")
                    .where("buyerStoreownerId", "==", uid)
                    .orderBy("datePaid", "desc")
                    .onSnapshot(
                        (snapshot) => {
                            if (!snapshot.empty) {
                                const paymentDoc = [];
                                snapshot.forEach((doc) => {
                                    const {
                                        seller,
                                        charge,
                                        status,
                                        datePaid,
                                        cardBrand,
                                        cardFirstFour,
                                        cardLastFour,
                                        installments,
                                        cardholder,
                                        receiptId,
                                        onBehalfOfBrand,
                                    } = doc.data();
                                    const chargeFormatted = currencyFormat(charge);
                                    const dateFormatted = new Date(datePaid.seconds * 1000)
                                        .toLocaleDateString("pt-br", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "2-digit",
                                        })
                                        .replace(" de ", "/");
                                    const statusColor = matchStatusColor(status);
                                    paymentDoc.push({
                                        transactionId: doc.id,
                                        seller: seller === "Ziro" && onBehalfOfBrand ? `${onBehalfOfBrand} - Ziro` : seller,
                                        charge: chargeFormatted,
                                        status,
                                        datePaid: dateFormatted,
                                        cardBrand,
                                        cardFirstFour,
                                        cardLastFour,
                                        installments,
                                        cardholder,
                                        statusColor,
                                        receiptId,
                                    });
                                });
                                setPayments(paymentDoc);
                            }
                            setIsLoading(false);
                        },
                        (error) => {
                            console.log(error);
                            setErrorLoading(true);
                            setIsLoading(false);
                        },
                    );
            };
            run();
        } else {
            setErrorLoading(true);
            setIsLoading(false);
        }
    } catch {
        setErrorLoading(true);
        setIsLoading(false);
    }
};

export default fetch;
