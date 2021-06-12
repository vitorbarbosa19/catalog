import React from 'react';
import { useHeader, useFooter } from "@bit/vitorbarbosa19.ziro.flow-manager";
import { HeaderWithoutModal } from "../../../Header";
import BottomFlowButtons from "@bit/vitorbarbosa19.ziro.bottom-flow-buttons";
import Button from "@bit/vitorbarbosa19.ziro.button";
import { containerWithPadding } from "@ziro/theme";
import { bodyText } from "../../Resume/styles";
import type { Screens } from "../..";
import Illustration from "@bit/vitorbarbosa19.ziro.illustration"
import { supportPhoneNumber } from "@bit/vitorbarbosa19.ziro.utils.support-phone-number";
import { usePromiseShowingMessage } from "@bit/vitorbarbosa19.ziro.utils.async-hooks";
import * as regMessages from "ziro-messages/dist/src/catalogo/antifraude/registerCard";
import { useRegistrationTransaction } from "@bit/vitorbarbosa19.ziro.pay.card-lifecycle";
import { cardIdBeenRegistered } from "../../../atoms";
import { useRecoilValue } from "recoil";
import { useMessage } from "@bit/vitorbarbosa19.ziro.message-modal";
import { useFirebaseCardDocument } from "@bit/vitorbarbosa19.ziro.firebase.catalog-user-data";

interface Props {
  close: () => void;
  previous: () => void;
  next: (screen: Screens) => void;
}

const ConfirmTransactionSupport: React.FC<Props> = ({close, previous, next}) => {
  const transact = useRegistrationTransaction();
  const cardId = useRecoilValue(cardIdBeenRegistered);
  const fbCard = useFirebaseCardDocument(cardId);
  const setMessage = useMessage();

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
    setMessage(regMessages.prompt.TRANSACTION_SEND.withButtons([{title: "ok", action: () => next("ConfirmTransaction")}]))
});

  useHeader(<HeaderWithoutModal title="Não recebi a transação" leftButton={{ icon: "close", onClick: close }} shadow />, [close]);
  useFooter(<BottomFlowButtons previous={previous} />, [previous]);

  return (
    <div style={{ ...containerWithPadding, display: "grid", gap: 20, alignContent: "flex-start", justifyItems: "center", minHeight: 0 }}>
      <Illustration type="errorLoading" size={200} />

      <label style={bodyText as any}>Caso não tenha recebido a transação na fatura do seu cartão, escolha uma das opções abaixo para continuar.</label>

      <Button type="button" cta="Receber nova transação" click={newTransaction} />
      <Button type="button" cta="Validar de outra forma" click={() => next("ChooseAntifraudFlow")} />
      <Button type="button" cta="Falar com suporte" template="light" click={() =>
                      window.open(`https://api.whatsapp.com/send?phone=${supportPhoneNumber.replace(/\+|\s|\(|\)|-/g, "")}`, "_blank")} />
    </div>
  )
}

ConfirmTransactionSupport.displayName = "ConfirmTransactionSupport";

export default ConfirmTransactionSupport
