import axios from "axios";
import { useEffect, useState } from "react";
import { db } from "../../Firebase/index";

export default (receipt_id, setLoading, location, setReceipt, setTransaction, buyerStoreownerId) => {
    const [error, setError] = useState(false);
    useEffect(() => {
        if (receipt_id) {
            const getReceipt = async () => {
                setLoading(true);
                try {
                            const doc = await db.collection("credit-card-payments").where("receiptId", "==", receipt_id).get();
                            await axios
                                .get(
                                    `${process.env.PAY}/payments-receipt?receipt_id=${receipt_id}`,

                                    {
                                        headers: {
                                            Authorization: `Basic ${process.env.PAY_TOKEN}`,
                                        },
                                    },
                                )
                                .then((result) => {
                                    const { data } = result;
                                    if (!doc.empty) {
                                        const { installments, status } = doc.docs[0].data();
                                        setTransaction(doc.docs[0].data());
                                        data.location = location;
                                        data.installments = installments;
                                        data.statusZiro = status;
                                        setReceipt(data);
                                        if (installments) setLoading(false);
                                    } else {
                                        console.log("Document not found");
                                        setLoading(false);
                                        setError(true);
                                    }
                                });
                } catch (e) {
                    console.log("erro na requisição para o recibo da zoop");
                    setLoading(false);
                    setError(true);
                }
            };
            getReceipt();
        }
    }, [receipt_id]);
    return { error };
};
