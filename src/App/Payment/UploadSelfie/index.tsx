import React, { useRef } from "react";
import UploadPhoto from "@bit/vitorbarbosa19.ziro.flow-upload-photo";
import { useSelfieAnalysis } from "@bit/vitorbarbosa19.ziro.pay.antifraud";
import { useHeader } from "@bit/vitorbarbosa19.ziro.flow-manager";
import { useRecoilValue, useRecoilState } from "recoil";
import { useUserStatus } from "@bit/ziro.firebase.user-status";
import { HeaderWithoutModal } from "../../Header";
import { cardBeenRegistered, cardIdBeenUsed } from "../../atoms";
import { Instructions } from "./photoInstructions";
import type { Screens } from "..";

interface UploadSelfieProps {
    next: (s: Screens) => void;
    close: () => void;
    previous: () => void;
}

const recipients = ["15306017334", "5511985660341", "5511999280824"];

const UploadSelfie: React.FC<UploadSelfieProps> = ({ next: _next, close, previous }) => {
    const zoopCard = useRecoilValue(cardBeenRegistered);
    const [, setCardIdBeenUsed] = useRecoilState(cardIdBeenUsed);
    const camera = useRef<{ openCamera: () => void; closeCamera: () => void }>();
    const [, setStatus] = useUserStatus();
    const [next, sending] = useSelfieAnalysis({
        zoopCard,
        recipients,
        camera,
        onChangeValidationType: () => _next("ChooseAntifraudFlow"),
        onSuccess: (newData) => {
            setStatus({
                status: "selfie_added",
                selfieUrl: newData.selfie.url,
            });
            if (newData.status === "pendingManualApproval") _next("ChooseCard");
            else {
                setStatus({
                    status: "antifraud_approved",
                    method: "doc_upload",
                });
                setCardIdBeenUsed(zoopCard.id);
                _next("RegisteredCheckout");
            }
        },
    });

    useHeader(<HeaderWithoutModal title="Foto do titular" leftButton={{ icon: "close", onClick: close }} shadow />, [close]);

    return (
        <div style={{ padding: "20px" }}>
            <UploadPhoto
                key="selfie"
                ref={camera}
                maxWidth={window.innerWidth > 500 ? 405 : window.innerWidth}
                previous={previous}
                next={next}
                initialFacingMode="front"
                submitting={sending}
                allowSwap
                instructions={<Instructions />}
            />
        </div>
    );
};

export default UploadSelfie;
