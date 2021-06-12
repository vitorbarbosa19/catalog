import React, { useMemo } from "react";
import FlowRegisterCard from "@bit/vitorbarbosa19.ziro.flow-register-card";
import { useRegisterCard } from "@bit/vitorbarbosa19.ziro.pay.card-lifecycle";
import { useSetRecoilState } from "recoil";
import { useUserStatus } from "@bit/ziro.firebase.user-status";
import { HeaderWithoutModal } from "../../Header";
import { cardIdBeenRegistered, cardIdBeenUsed } from "../../atoms";
import type { Screens } from "..";

interface Props {
    payment: any;
    next: (screen: Screens) => void;
    previous: (args: any) => any;
    close: () => void;
}

const RegisterCard: React.FC<Props> = ({ payment, next, previous, close }) => {
    const setCardIdBeenRegistered = useSetRecoilState(cardIdBeenRegistered);
    const setCardIdBeenUsed = useSetRecoilState(cardIdBeenUsed);
    const [status, setStatus] = useUserStatus();
    const header = useMemo(() => <HeaderWithoutModal title="Adicionar novo cartão" leftButton={{ icon: "close", onClick: close }} />, [close]);
    const [onClick] = useRegisterCard(({ card_id, transaction }) => {
        setStatus({
            status: "card_registered",
            cardId: card_id,
        });
        if (payment.insurance) {
            setCardIdBeenRegistered(card_id);
            next(transaction ? "ConfirmTransaction" : "UploadDocument");
        } else {
            setCardIdBeenUsed(card_id);
            next("RegisteredCheckout");
        }
    });

    return <FlowRegisterCard showInstallments={false} next={{ onClick }} previous={{ onClick: previous }} header={header} />;
};

RegisterCard.displayName = "RegisterCard";

export default RegisterCard;
