import React, { useRef, useState } from "react";
import { useFooter, useHeader } from "@bit/vitorbarbosa19.ziro.flow-manager";
import BottomFlowButtons from "@bit/vitorbarbosa19.ziro.bottom-flow-buttons";
import ChooseInstallment from "@bit/vitorbarbosa19.ziro.choose-installment";
import { containerWithPadding } from "@ziro/theme";
import { useFirebaseCardDocument } from "@bit/vitorbarbosa19.ziro.firebase.catalog-user-data";
import { usePayment } from "@bit/vitorbarbosa19.ziro.pay.card-lifecycle";
import { useRecoilState, useRecoilValue } from "recoil";
import { useUserStatus } from "@bit/ziro.firebase.user-status";
import { cardIdBeenUsed, cardBeenUsed } from "../../atoms";
import CustomHeader from "./CustomHeader";

interface Props {
    payment: any;
    close: () => void;
    previous: () => void;
}

const CardCheckoutNew: React.FC<Props> = ({ payment, close, previous }) => {
    const [installments, setInstallments] = useState("");
    const [cardId, setCardId] = useRecoilState(cardIdBeenUsed);
    const cardAtom = useRecoilValue(cardBeenUsed);
    const card = useFirebaseCardDocument(useRef(cardId).current);
    const [, setStatus] = useUserStatus();
    const [onClick] = usePayment(
        () => {
            setStatus({
                status: "paid",
                paymentId: payment.id,
                paymentMethod: "creditCard",
            });
            setCardId(null);
        },
        payment.id,
        installments,
        cardAtom,
    );
    // @ts-ignore
    useHeader(card ? <CustomHeader onClose={close} firebaseCard={card} /> : null, [card, close]);
    useFooter(<BottomFlowButtons previous={previous} next={onClick} nextTitle="finalizar" submitting={false} />, [previous, onClick]);

    return (
        <div style={{ ...containerWithPadding, minHeight: "none" }}>
            <ChooseInstallment
                seller={payment.seller === "Ziro" && payment.onBehalfOfBrand ? payment.onBehalfOfBrand : payment.seller}
                charge={payment.charge}
                maxInstallments={payment.installmentsMax}
                installments={installments}
                setInstallments={setInstallments}
            />
        </div>
    );
};

export default CardCheckoutNew;
