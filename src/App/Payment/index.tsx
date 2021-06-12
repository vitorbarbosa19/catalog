import React, { useMemo, useCallback, useEffect } from "react";
import { useCreditCardPaymentDocument } from "@bit/vitorbarbosa19.ziro.firebase.credit-card-payments";
import { usePersistentScroll, useAnimatedLocation } from "@bit/vitorbarbosa19.ziro.flow-manager";
import { useAnalytics, useUser, AuthCheck } from "reactfire";
import ErrorLoading from "@bit/vitorbarbosa19.ziro.error-loading";
import ErrorExpired from "@bit/vitorbarbosa19.ziro.error-expired";
import { Helmet } from "react-helmet";
import currencyFormat from "@ziro/currency-format";
import { containerWithPadding } from "@ziro/theme";
import { useMessagePromise } from "@bit/vitorbarbosa19.ziro.message-modal";
import { prompt as payPrompt } from "ziro-messages/dist/src/catalogo/pay/common";
import { atom, useRecoilState } from "recoil";
import { useUserStatus } from "@bit/ziro.firebase.user-status";
import Resume from "./Resume";
import Login from "./Login";
import DetachedCheckout from "./DetachedCheckout";
import ChooseCard from "./ChooseCard";
import RegisterCard from "./RegisterCard";
import UploadDocument from "./UploadDocument";
import UploadSelfie from "./UploadSelfie";
import RegisteredCheckout from "./RegisteredCheckout";
import Register from "../Register";
import ConfirmTransaction from "./ConfirmTransaction";
import ConfirmTransactionSupport from "./ConfirmTransaction/ConfirmTransactionSupport";
import ChooseAntifraudFlow from "./ChooseAntifraudFlow";

interface Props {
    id?: string;
}

export type Screens =
    | "Resume"
    | "ChooseCard"
    | "RegisterCard"
    | "ChooseAntifraudFlow"
    | "ConfirmTransaction"
    | "ConfirmTransactionSupport"
    | "UploadDocument"
    | "UploadSelfie"
    | "DetachedCheckout"
    | "RegisteredCheckout"
    | "Login"
    | "Register"
    | "PaymentExcluded";

const screenAtom = atom<Screens>({
    key: "screen",
    default: "Resume",
});

const PaymentPublic: React.FC<Props> = ({ id }) => {
    usePersistentScroll();
    const analytics = useAnalytics();
    const user = useUser<firebase.default.User>().data;
    const isLogged = useMemo(() => user && user.emailVerified, [user]);
    const payDoc = useCreditCardPaymentDocument(id);
    const payData = useMemo(() => (payDoc.exists ? { ...payDoc.data(), id: payDoc.id } : "NOT_FOUND"), [payDoc]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const payDataSteady = useMemo(() => (payDoc.exists ? { ...payDoc.data(), id: payDoc.id } : "NOT_FOUND"), []);
    const [screen, setScreen] = useRecoilState(screenAtom);

    useEffect(() => {
        if (payData !== "NOT_FOUND") analytics.logEvent("payment_link_opened", { id: payData.id });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!user) return;
        if (!isLogged) {
            if (screen === "Register") setScreen("Login");
            return;
        }
        if (screen === "Register" || screen === "Login") setScreen("ChooseCard");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (payData === "NOT_FOUND") setScreen("PaymentExcluded");
    }, [payData, setScreen]);

    const next = useCallback(
        (_screen: Screens) => {
            setScreen((cur) => {
                if (payData === "NOT_FOUND" || payData.status !== "Aguardando Pagamento") return cur;
                return _screen || cur;
            });
        },
        [setScreen, payData],
    );
    const previous = useCallback(() => {
        setScreen((cur) => {
            if (payData === "NOT_FOUND" || payData.status !== "Aguardando Pagamento") return cur;
            switch (cur) {
                case "RegisterCard":
                case "UploadDocument":
                    return "ChooseAntifraudFlow";
                case "RegisteredCheckout":
                case "ChooseAntifraudFlow":
                    return "ChooseCard";
                case "UploadSelfie":
                    return "UploadDocument";
                case "ConfirmTransaction":
                    return "ChooseAntifraudFlow";
                case "ConfirmTransactionSupport":
                    return "ConfirmTransaction";
                default:
                    return cur;
            }
        });
    }, [payData, setScreen]);

    const [, setLocation] = useAnimatedLocation();

    const setMessagePromise = useMessagePromise();

    const closeLocation = useMemo(() => (payData !== "NOT_FOUND" && payData.cartId ? `/carrinho/${payData.cartId}` : `/galeria`), [payData]);

    const close = useCallback(
        () =>
            setMessagePromise(payPrompt.CLOSE)
                .then(() => setLocation("converge", closeLocation))
                .catch(() => null),
        [setMessagePromise, setLocation, closeLocation],
    );

    if (payDataSteady === "NOT_FOUND" || payDataSteady.status !== "Aguardando Pagamento") return <ErrorExpired />;
    if (!payDataSteady.charge || !payDataSteady.installmentsMax || !payDataSteady.seller || !payDataSteady.sellerZoopId)
        return (
            <div style={containerWithPadding as any}>
                <ErrorLoading message="Acesse o link recebido novamente. Em caso de dúvidas, contate suporte" />
            </div>
        );
    switch (screen) {
        case "Resume":
            return <Resume payment={payData} isLogged={isLogged} next={next} login={() => setScreen("Login")} />;
        case "Login":
            return <Login next={next} />;
        case "DetachedCheckout":
            return <DetachedCheckout payment={payData} close={close} login={() => setScreen(isLogged ? "ChooseCard" : "Login")} />;
        case "ChooseCard":
            return <ChooseCard payment={payData} next={next} newCard={() => setScreen("RegisterCard")} close={close} />;
        case "RegisterCard":
            return <RegisterCard payment={payData} next={next} previous={previous} close={close} />;
        case "UploadDocument":
            return <UploadDocument next={next} previous={previous} close={close} />;
        case "UploadSelfie":
            return <UploadSelfie next={next} previous={previous} close={close} />;
        case "RegisteredCheckout":
            return <RegisteredCheckout payment={payData} close={close} previous={previous} />;
        case "Register":
            return <Register login={() => setScreen("Login")} paymentOrigin />;
        case "ConfirmTransaction":
            return <ConfirmTransaction previous={previous} close={close} next={next} />;
        case "ConfirmTransactionSupport":
            return <ConfirmTransactionSupport previous={previous} close={close} next={next} />;
        case "ChooseAntifraudFlow":
            return <ChooseAntifraudFlow previous={previous} close={close} next={next} />;
        case "PaymentExcluded":
            return <ErrorExpired />;
        default:
            return (
                <div style={containerWithPadding as any}>
                    <ErrorLoading message="Acesse o link recebido novamente. Em caso de dúvidas, contate suporte" />
                </div>
            );
    }
};

PaymentPublic.displayName = "PaymentPublic";

const PaymentPrivate: React.FC<Props> = ({ id }) => {
    const [, setUserStatus] = useUserStatus();
    React.useEffect(() => {
        console.log("setting user status");
        setUserStatus({
            status: "opened_link",
            paymentId: id,
        });
    }, []);
    return null;
};

PaymentPrivate.displayName = "PaymentPrivate";

const Payment: React.FC<Props> = ({ id }) => {
    return (
        <>
            <AuthCheck fallback={null}>
                <PaymentPrivate id={id} />
            </AuthCheck>
            <PaymentPublic id={id} />
        </>
    );
};

Payment.displayName = "Payment";

export default Payment;

export const PaymentHelmet: React.FC<Props> = ({ id }) => {
    const payDoc = useCreditCardPaymentDocument(id);
    const title = useMemo(() => {
        if (payDoc.exists) {
            const data = payDoc.data();
            if (data?.seller && data?.charge) return `${data.seller} te enviou uma cobrança de ${currencyFormat(data.charge)}`;
            return "Você recebeu uma cobrança";
        }
        return "Pagamento inexistente";
    }, [payDoc]);
    return (
        <Helmet>
            <meta name="fragment" content="!" />
            <meta property="og:title" content={title} />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={`https://ziro.app/pagamento/${id}/escolher-cartao`} />
            <meta property="og:image" content="https://ziro.com.br/wp-content/uploads/2020/07/phonefull.png" />
            <meta property="og:locale" content="pt-BR" />
            <meta property="og:site_name" content="Ziro App" />
        </Helmet>
    );
};

PaymentHelmet.displayName = "PaymentHelmet";
