import React, { useCallback, useState, useMemo, useEffect } from "react";
import ChooseCard from "@bit/vitorbarbosa19.ziro.choose-card";
import { useHeader, useFooter } from "@bit/vitorbarbosa19.ziro.flow-manager";
import BottomFlowButtons from "@bit/vitorbarbosa19.ziro.bottom-flow-buttons";
import { useFirebaseCardsCollection } from "@bit/vitorbarbosa19.ziro.firebase.catalog-user-data";
import { useDeleteCard } from "@bit/vitorbarbosa19.ziro.pay.card-lifecycle";
import { zoopCard, cardIdBeenRegistered as cardIdBeenRegisteredAtom, cardIdBeenUsed as cardIdBeenUsedAtom } from "../../atoms";
import CustomHeader from "./CustomHeader";
import { useRecoilState } from "recoil";
import { useMessage } from "@bit/vitorbarbosa19.ziro.message-modal";
import { prompt } from "ziro-messages/dist/src/catalogo/pay/chooseCard";
import type { Screens } from "..";

interface ChooseCardProps {
    payment: any;
    close: () => void;
    next: (screen: Screens) => void;
    newCard: () => void;
}

const Component: React.FC<ChooseCardProps> = ({ payment, close, next, newCard }) => {
    const cardsCollection = useFirebaseCardsCollection();
    const [, setCardIdBeenRegistered] = useRecoilState(cardIdBeenRegisteredAtom);
    const [cardIdBeenUsed, setCardIdBeenUsed] = useRecoilState(cardIdBeenUsedAtom);
    const [selected, setSelected] = useState<string>(cardIdBeenUsed);

    const reset = useCallback(() => {
        setSelected(null);
        setCardIdBeenUsed(null);
        setCardIdBeenRegistered(null);
    }, [setSelected, setCardIdBeenRegistered, setCardIdBeenUsed]);

    useEffect(() => {
        reset();
    }, []);

    const setMessage = useMessage();

    const [onDelete] = useDeleteCard();
    const selectedDoc = useMemo(() => cardsCollection.docs.find((doc) => doc.id === selected), [selected, cardsCollection]);

    const onNext = useCallback(() => {
        if (!selected) return;
        const { status } = selectedDoc.data();
        if (!payment.insurance || status === "approved") {
            setCardIdBeenUsed(selected);
            next("RegisteredCheckout");
            return;
        }
        if (status === "pendingManualApproval") return setMessage(prompt.PENDING_MANUAL_APPROVAL);
        setCardIdBeenRegistered(selected);
        next("ChooseAntifraudFlow");
    }, [selected, payment, selectedDoc, setCardIdBeenUsed, setCardIdBeenRegistered, setMessage, prompt, next]);

    useHeader(
        <CustomHeader
            //@ts-ignore
            reset={reset}
            onClose={close}
            firebaseCard={selectedDoc}
            shouldShowStatus={payment.insurance}
        />,
        [selected, setSelected, selectedDoc, payment, close],
    );

    useFooter(<BottomFlowButtons next={onNext} submitting={!selected} />, [onNext, selected]);

    return (
        <div style={{ padding: 10 }}>
            <ChooseCard
                cardsCollection={cardsCollection}
                zoopAtom={zoopCard}
                selected={selected}
                onClick={setSelected}
                newCard={newCard}
                onDelete={onDelete}
                shouldShowStatus={payment.insurance}
            />
        </div>
    );
};

Component.displayName = "ChooseCard";

export default Component;
