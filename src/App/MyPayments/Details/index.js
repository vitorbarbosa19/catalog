import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Details from "@bit/vitorbarbosa19.ziro.details";
import Error from "@bit/vitorbarbosa19.ziro.error";
import { useAnimatedLocation } from "@bit/vitorbarbosa19.ziro.flow-manager";
import Illustration from "@bit/vitorbarbosa19.ziro.illustration";
import Button from "@bit/vitorbarbosa19.ziro.button";
import SpinnerWithDiv from "@bit/vitorbarbosa19.ziro.spinner-with-div";
import ErrorLoading from "@bit/vitorbarbosa19.ziro.error";

const TransactionDetails = ({ transactions, transactionId }) => {
    const [receipt_id, setReceipt_id] = useState(""); // = '82d2bd9ade2f4a12a55c2ad7a7701f96';
    const [blocks, setBlocks] = useState([]);
    const [transaction, setTransaction] = useState({});
    const [, setLocation] = useAnimatedLocation();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(false);
    useEffect(() => {
        try {
            const effectTransaction = transactions.filter((transaction) => transaction.transactionId === transactionId);

            if (typeof effectTransaction[0] !== "undefined") {
                setTransaction(effectTransaction[0]);
                setReceipt_id(effectTransaction[0].receiptId);
                if (effectTransaction[0]) {
                    let block;
                    if (
                        effectTransaction[0].status === "Aprovada" ||
                        effectTransaction[0].status === "Pré Autorizado" ||
                        effectTransaction[0].status === "Cancelado"
                    ) {
                        const installmentsNumber = parseInt(effectTransaction[0].installments);
                        if (effectTransaction[0].installments > 0) {
                            block = [
                                {
                                    header: "Compra",
                                    body: [
                                        {
                                            title: "Marca",
                                            content: effectTransaction[0].seller,
                                        },
                                        {
                                            title: "Valor",
                                            content: effectTransaction[0].charge,
                                        },
                                        {
                                            title: "Forma",
                                            content: `Crédito ${installmentsNumber}x`,
                                        },
                                        {
                                            title: "Data",
                                            content: `${effectTransaction[0].datePaid}`,
                                        },
                                        {
                                            title: "Status",
                                            content: effectTransaction[0].status,
                                            color: effectTransaction[0].statusColor,
                                        },
                                    ],
                                },

                                {
                                    header: "Cartão",
                                    body: [
                                        {
                                            title: "Bandeira",
                                            content: effectTransaction[0].cardBrand,
                                        },
                                        {
                                            title: "Número",
                                            content: `${effectTransaction[0].cardFirstFour}...${effectTransaction[0].cardLastFour}`,
                                        },
                                        {
                                            title: "Portador",
                                            content: effectTransaction[0].cardholder.toUpperCase(),
                                        },
                                    ],
                                },
                            ];
                        }
                    } else {
                        block = [
                            {
                                header: "Compra",
                                body: [
                                    {
                                        title: "Marca",
                                        content: effectTransaction[0].seller,
                                    },
                                    {
                                        title: "Valor",
                                        content: effectTransaction[0].charge,
                                    },
                                    {
                                        title: "Forma",
                                        content: `Crédito ${effectTransaction[0].installments}x`,
                                    },
                                    {
                                        title: "Data",
                                        content: `${effectTransaction[0].datePaid}`,
                                    },
                                    {
                                        title: "Status",
                                        content: effectTransaction[0].status,
                                        color: effectTransaction[0].statusColor,
                                    },
                                ],
                            },
                            {
                                header: "Cartão",
                                body: [
                                    {
                                        title: "Bandeira",
                                        content: effectTransaction[0].cardBrand,
                                    },
                                    {
                                        title: "Número",
                                        content: `${effectTransaction[0].cardFirstFour}...${effectTransaction[0].cardLastFour}`,
                                    },
                                    {
                                        title: "Portador",
                                        content: effectTransaction[0].cardholder,
                                    },
                                ],
                            },
                        ];
                    }
                    setBlocks(block);
                }
            } else {
                setLoading(false);
                setErrorMessage(true);
            }
        } catch (e) {
            setLoading(false);
            setErrorMessage(true);
        }
        /**/
    }, []);

    if (!transaction) return <Error />;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {loading ? <SpinnerWithDiv /> : null}
            <div style={{ display: "grid", gridRowGap: "12px" }}>
                <Details blocks={blocks} blockGap="20px" />
            </div>
            {receipt_id ? (
                <div style={{ marginTop: "40px" }}>
                    <Button
                        type="link"
                        cta="Gerar comprovante"
                        template="regular"
                        navigate={() => setLocation("goLeft", `/comprovante/${receipt_id}`)}
                    />
                </div>
            ) : null}
            {errorMessage === true ? (
                <ErrorLoading
                    title={"Pagamento não encontrado"}
                    backRouteFunction={() => window.location.reload()}
                    backroute=""
                    btnMsg="Recarregar página"
                    message={
                        "Tente novamente. Se o erro persistir, entre em contato com o suporte"
                    }
                />
            ) : null}
        </motion.div>
    );
};

export default TransactionDetails;
