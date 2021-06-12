import React, { useState, useEffect, useContext, useCallback } from "react";
import { useHeader, usePersistentScroll, useHideOnScroll } from "@bit/vitorbarbosa19.ziro.flow-manager";
import { motion } from "framer-motion";
import Spinner from "@bit/vitorbarbosa19.ziro.spinner";
import ErrorLoading from "@bit/vitorbarbosa19.ziro.error";
import Timeline from "@bit/vitorbarbosa19.ziro.timeline";
import { containerWithPadding } from "@ziro/theme";
import Header from "../Header";
import { spinner } from "./styles";
import fetch from "./fetch";
import { useUserData } from "../useInfo";
import TransactionDetails from "./Details";
import TransactionList from "./List";

const MyPayments = ({ transactionId }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [errorLoading, setErrorLoading] = useState(false);
    const [payments, setPayments] = useState([]);
    const [{ buyerStoreownerId }] = useUserData();

    useHideOnScroll();
    usePersistentScroll();

    useHeader(<Header title={transactionId ? "Detalhes" : "Pagamentos"} backPath={transactionId ? "/pagamentos" : "/menu"} drawerMenu />, [
        transactionId,
    ]);

    useEffect(() => fetch(setIsLoading, setErrorLoading, setPayments, buyerStoreownerId), [buyerStoreownerId]);
    if (isLoading)
        return (
            <div style={spinner}>
                <Spinner size="5.5rem" />
            </div>
        );
    if (errorLoading)
        return (
            <ErrorLoading
                title={"Ocorreu um erro na conexão"}
                backRouteFunction={() => window.location.reload()}
                backroute=""
                btnMsg="Recarregar página"
            />
        );

    if (transactionId)
        return (
            <div style={containerWithPadding}>
                <TransactionDetails transactions={payments} transactionId={transactionId} />
            </div>
        );

    return (
        <div style={containerWithPadding}>
            <TransactionList transactions={payments} />
        </div>
    );
};

export default MyPayments;
