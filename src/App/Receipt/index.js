import React, { useState, useMemo } from "react";
import { useHeader, useHistory, usePersistentScroll } from "@bit/vitorbarbosa19.ziro.flow-manager";
import Details from "@bit/vitorbarbosa19.ziro.details";
import Logo from "@bit/vitorbarbosa19.ziro.logo";
import { motion } from "framer-motion";
import { useLocation, Redirect } from "wouter";
import { formatDateUTC3 } from "@ziro/format-date-utc3";
import currencyFormat from "@ziro/currency-format";
import SpinnerWithDiv from "@bit/vitorbarbosa19.ziro.spinner-with-div";
import matchStatusColor from "../MyPayments/matchStatusColor";
import Header from "../Header";
import useFetch from "./useFetch";
import { container, header, body, footer, footerText } from "./styles";
import ReceiptError from "./ReceiptError/index";
import { useUserData } from "../useInfo";

export default ({ receiptId }) => {
    const [location] = useLocation();
    const [transaction, setTransaction] = useState("");
    const [receipt, setReceipt] = useState("");
    const history = useHistory();
    const backPath = useMemo(() => {
        if (history[history.length - 1].pathname === location) return "/pagamentos";
        return history[history.length - 1].pathname;
    }, [history]);
    const [loading, setLoading] = useState(false);
    usePersistentScroll();
    const [{ buyerStoreownerId }] = useUserData();
    let block;
    const { error } = useFetch(receiptId, setLoading, location, setReceipt, setTransaction, buyerStoreownerId);

    useHeader(<Header title="Comprovante" backPath={backPath} drawerMenu />);

    if (!receiptId) return <Redirect to="/pagamentos" />;
    if (!loading && receipt) {
        let headerReceipt = "pagamento";
        if (receipt.statusZiro === "Cancelado") {
            headerReceipt = "estorno";
        }
        block = [
            {
                header: `Comprovante de ${headerReceipt}`,
                body: [
                    {
                        title: "Data",
                        content: `${formatDateUTC3(new Date(receipt.created_at))}`,
                    },
                    {
                        title: "Vendedor",
                        content: receipt.business_name.toUpperCase(),
                    },
                    {
                        title: "Total",
                        content: currencyFormat(Math.round(receipt.amount * 100)),
                    },
                    {
                        title: "Parcelas",
                        content: receipt.installments,
                    },
                    {
                        title: "Número",
                        content: `${receipt.card.first6_digits}...( ${receipt.card.card_brand} )`,
                    },
                    {
                        title: "NSU",
                        content: receipt.auth_nsu,
                    },
                    {
                        title: "Autorização",
                        content: receipt.auth_number.toUpperCase(),
                    },
                    {
                        title: "Status",
                        content: receipt.statusZiro,
                        color: matchStatusColor(receipt.statusZiro),
                    },
                ],
            },
        ];
        if (transaction.onBehalfOfBrand) {
            block[0].body.splice(1, 0, {
                title: "Marca",
                content: transaction.onBehalfOfBrand,
            });
        } /* else {
      block[0].body.splice(1, 0, {
        title: "Marca",
        content: transaction.seller,
      });
    } */
    }
    if (loading) return <SpinnerWithDiv />;
    if (error) return <ReceiptError />;
    return (
        <div style={{ marginTop: "20px" }}>
            <label style={header}>
                <Logo size={38} />
                Via do Cliente
            </label>
            <div style={body}> {receipt && block ? <Details centerTitle blocks={block} /> : null}</div>
            <div style={footer}>
                <label style={footerText}>Ziro Marketplace</label>
                <label style={footerText}>CNPJ: 28.026.371/0001-61</label>
            </div>
        </div>
    );
};
