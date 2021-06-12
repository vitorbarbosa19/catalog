import React from "react";
import { useHeader, useFooter } from "@bit/vitorbarbosa19.ziro.flow-manager";
import { containerWithPadding } from "@ziro/theme";
import Button from "@bit/vitorbarbosa19.ziro.button";
import Input from "@bit/vitorbarbosa19.ziro.input-text";
import { useFirebaseCardDocument } from "@bit/vitorbarbosa19.ziro.firebase.catalog-user-data";
import BottomFlowButtons from "@bit/vitorbarbosa19.ziro.bottom-flow-buttons";
import ErrorLoading from "@bit/vitorbarbosa19.ziro.error-loading";
import { useRecoilState, useRecoilValue } from "recoil";
import currencyFormat from "@ziro/currency-format";
import { useMessage } from "@bit/vitorbarbosa19.ziro.message-modal";
import { useRegistrationTransaction } from "@bit/vitorbarbosa19.ziro.pay.card-lifecycle";
import { usePromiseShowingMessage } from "@bit/vitorbarbosa19.ziro.utils.async-hooks";
import * as regMessages from "ziro-messages/dist/src/catalogo/antifraude/registerCard";
import Illustration from "@bit/vitorbarbosa19.ziro.illustration";
import { useUserStatus } from "@bit/ziro.firebase.user-status";
import type { Screens } from "..";
import { cardIdBeenRegistered, cardIdBeenUsed } from "../../atoms";
import { bodyText, loginText } from "../Resume/styles";
import { HeaderWithoutModal } from "../../Header";

interface Props {
    close: () => void;
    next: (screen: Screens) => void;
    previous: () => void;
}

const ConfirmTransaction: React.FC<Props> = ({ close, next, previous }) => {
    const cardId = useRecoilValue(cardIdBeenRegistered);
    const fbCard = useFirebaseCardDocument(cardId);
    const [value, setValue] = React.useState("");
    const setMessage = useMessage();
    const transact = useRegistrationTransaction();
    const [, setStatus] = useUserStatus();
    const [, setCardIdBeenUsed] = useRecoilState(cardIdBeenUsed);
    const _next = React.useCallback(() => {
        if (value === fbCard.data().antifraudTransaction) {
            fbCard.ref.update({ status: "approved", approvalType: "transaction" }).then(() => {
                setCardIdBeenUsed(cardId);
                next("RegisteredCheckout");
            });
            setStatus({
                status: "antifraud_approved",
                method: "random_transaction",
            });
        } else
            setMessage(
                regMessages.prompt.WRONG_TRANSACTION_VALUE.withButtons([{ title: "Enviar novamente", action: () => null }]).withGenericButton({
                    title: "Validar de outra forma",
                    action: () => next("ChooseAntifraudFlow"),
                }),
            );
    }, [value, fbCard]);
    const [newTransaction] = usePromiseShowingMessage(regMessages.waiting.SENDING_TRANSACTION, async () => {
        const transaction = await transact({ id: cardId }).catch((er) => {
            throw er.withButtons([
                {
                    title: "Escolher outro método",
                    action: () => next("ChooseAntifraudFlow"),
                },
            ]);
        });
        await fbCard.ref.update({ antifraudTransaction: transaction.amount.replace(/\./g, "") });
        setMessage(regMessages.prompt.TRANSACTION_SEND);
    });
    React.useEffect(() => {
        setMessage(regMessages.prompt.INITIAL_TRANSACTION);
        if (!fbCard.exists) return;
        if (!fbCard.data().antifraudTransaction)
            setMessage(
                regMessages.prompt.CONFIRM_TRANSACTION.withButtons([{ title: "sim", action: () => newTransaction() }]).withSupportButton({
                    title: "Validar de outra forma",
                    action: () => next("ChooseAntifraudFlow"),
                }),
            );
    }, []);
    useHeader(<HeaderWithoutModal title="Transação na Fatura" leftButton={{ icon: "close", onClick: close }} shadow />, [close]);
    useFooter(<BottomFlowButtons previous={previous} next={_next} blockNext={value === ""} />, [previous, _next, value]);
    if (!fbCard.exists)
        return (
            <div style={containerWithPadding as any}>
                <ErrorLoading message="Ocorreu um erro ao carregar as informações do cartão, por favor recarregue a página." />
            </div>
        );
    return (
        <div style={{ ...containerWithPadding, display: "grid", gap: 20, alignContent: "flex-start", justifyItems: "center", minHeight: 0 }}>
            <Illustration type="creditCard" size={150} />
            <label style={bodyText as any}>Foi enviada uma transação de pequeno valor na sua fatura do cartão. Digite abaixo o valor recebido.</label>
            <div style={{ width: 100 }}>
                <Input
                    // @ts-ignore
                    placeholder="R$0,00"
                    value={currencyFormat(parseInt(value))}
                    inputMode="numeric"
                    onChange={({ target: { value } }) => {
                        const n = parseInt(value.replace(/[R$\.,]/g, ""), 10);
                        if (Number.isNaN(n) || n > 200) return;
                        let str = n.toString();
                        if (n < 100) str = `0${str}`;
                        if (n < 10) str = `0${str}`;
                        setValue(str);
                    }}
                />
            </div>

            <Button style={loginText} type="link" cta="Não recebi a transação na fatura" navigate={() => next("ConfirmTransactionSupport")} />
        </div>
    );
};

ConfirmTransaction.displayName = "ConfirmTransaction";

export default ConfirmTransaction;
