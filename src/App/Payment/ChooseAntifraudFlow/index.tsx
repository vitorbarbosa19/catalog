import React from "react";
import { useHeader, useFooter } from "@bit/vitorbarbosa19.ziro.flow-manager";
import { containerWithPadding } from "@ziro/theme";
import Button from "@bit/vitorbarbosa19.ziro.button";
import { useFirebaseCardDocumentData } from "@bit/vitorbarbosa19.ziro.firebase.catalog-user-data";
import BottomFlowButtons from "@bit/vitorbarbosa19.ziro.bottom-flow-buttons";
import TooltipHelp from "@bit/vitorbarbosa19.ziro.tooltip-help";
import Illustration from "@bit/vitorbarbosa19.ziro.illustration";
import { supportPhoneNumber } from "@bit/vitorbarbosa19.ziro.utils.support-phone-number";
import { useRecoilValue } from "recoil";
import ErrorLoading from "@bit/vitorbarbosa19.ziro.error-loading";
import { HeaderWithoutModal } from "../../Header";
import type { Screens } from "..";
import { bodyText } from "../Resume/styles";
import { cardIdBeenRegistered } from "../../atoms";

interface Props {
    close: () => void;
    next: (screen: Screens) => void;
    previous: () => void;
}

const tooltipBody = (
    <>
        <div style={{ display: "grid", gap: 10 }}>
            <label style={{ marginTop: 10 }}>
                No método <strong>Transação na fatura</strong> será enviada e estornada uma transação aleatória de baixo valor na sua fatura. Deve ser
                digitado o valor recebido.
            </label>

            <label>
                No método <strong>Documentação do titular</strong> você enviará fotos do documento de identidade e do rosto do titular.
            </label>
        </div>
    </>
);

const ChooseAntifraudFlow: React.FC<Props> = ({ close, next, previous }) => {
    const cardId = useRecoilValue(cardIdBeenRegistered);
    const fbCard = useFirebaseCardDocumentData(cardId);
    useHeader(<HeaderWithoutModal title="Validação" leftButton={{ icon: "close", onClick: close }} shadow />, [close]);
    useFooter(<BottomFlowButtons previous={previous} />, [previous]);
    if (!fbCard)
        return (
            <div style={containerWithPadding as any}>
                <ErrorLoading message="Acesse o link recebido novamente. Em caso de dúvidas, contate suporte" />
            </div>
        );
    return (
        <div style={{ ...containerWithPadding, display: "grid", gap: 20, alignContent: "flex-start", justifyItems: "center", minHeight: 0 }}>
            <Illustration type="security" size={200} />
            <label style={bodyText as any}>
                Escolha uma opção para validar seu cartão.&nbsp;
                <TooltipHelp illustration="securityTwo" title="Métodos de validação" body={tooltipBody} />
            </label>
            <Button type="button" cta="Transação na fatura" click={() => next("ConfirmTransaction")} />
            <Button
                type="button"
                cta="Documentação do titular"
                click={() => {
                    if (fbCard.status === "pendingSelfie") return next("UploadSelfie");
                    if (fbCard.status === "pendingDocument") return next("UploadDocument");
                }}
            />
            <Button
                type="button"
                cta="Falar com suporte"
                template="light"
                click={() => window.open(`https://api.whatsapp.com/send?phone=${supportPhoneNumber.replace(/\+|\s|\(|\)|-/g, "")}`, "_blank")}
            />
        </div>
    );
};

ChooseAntifraudFlow.displayName = "ChooseAntifraudFlow";

export default ChooseAntifraudFlow;
