import React, { useRef, useCallback } from "react";
import UploadPhoto from "@bit/vitorbarbosa19.ziro.flow-upload-photo";
import { useDocumentAnalysis } from "@bit/vitorbarbosa19.ziro.pay.antifraud";
import { useFirebaseCardDocumentData } from "@bit/vitorbarbosa19.ziro.firebase.catalog-user-data";
import { useHeader } from "@bit/vitorbarbosa19.ziro.flow-manager";
import { useRecoilValue } from "recoil";
import { useUserStatus } from "@bit/ziro.firebase.user-status";
import { HeaderWithoutModal } from "../../Header";
import { cardBeenRegistered } from "../../atoms";
import { Instructions } from "./photoInstructions";
import type { Screens } from "..";

interface UploadDocumentProps {
    next: (s: Screens) => void;
    close: () => void;
    previous: () => void;
}

const recipients = ["15306017334", "5511985660341", "5511999280824"];

const title = {
    pendingRGF: "Frente do RG",
    pendingRGV: "Verso do RG",
    pendingCNHF: "Frente da CNH",
    document: "Documento do titular",
};

const UploadDocument: React.FC<UploadDocumentProps> = ({ next: _next, close, previous }) => {
    const zoopCard = useRecoilValue(cardBeenRegistered);
    const { status, ...d } = useFirebaseCardDocumentData(zoopCard.id);
    const docStatus = "docStatus" in d ? d.docStatus : ("document" as const);
    const camera = useRef<{ openCamera: () => void; closeCamera: () => void }>(null);
    const [, setStatus] = useUserStatus();
    const [cbk, sending] = useDocumentAnalysis({
        zoopCard,
        recipients,
        camera,
        onSuccess: (newData) => {
            if (newData.documentType === "rg") {
                if ("RG F" in newData && "RG V" in newData) {
                    setStatus({
                        status: "doc_added",
                        docType: "rg",
                        firstPic: newData["RG F"]?.url,
                        secondPic: newData["RG V"]?.url,
                    });
                } else {
                    setStatus({
                        status: "doc_added",
                        docType: "rg",
                        firstPic: newData["RG FV"]?.url || newData["RG F"]?.url || newData["RG V"]?.url,
                    });
                }
            }
            if (newData.documentType === "cnh") {
                if ("CNH F" in newData && "CNH V" in newData) {
                    setStatus({
                        status: "doc_added",
                        docType: "cnh",
                        firstPic: newData["CNH F"]?.url,
                        secondPic: newData["CNH V"]?.url,
                    });
                } else {
                    setStatus({
                        status: "doc_added",
                        docType: "cnh",
                        firstPic: newData["CNH FV"]?.url || newData["CNH F"]?.url || newData["CNH V"]?.url,
                    });
                }
            }
            if (newData.status === "pendingSelfie") _next("UploadSelfie");
        },
        onChangeValidationType: () => _next("ChooseAntifraudFlow"),
    });

    const next = useCallback(
        (args: any) => {
            if (!args.picture && status === "pendingSelfie") _next("UploadSelfie");
            else cbk(args);
        },
        [status, _next, cbk],
    );

    useHeader(<HeaderWithoutModal title={title[docStatus]} leftButton={{ icon: "close", onClick: close }} shadow />, [close, docStatus]);

    return (
        <div style={{ padding: "20px" }}>
            <UploadPhoto
                blockNext={status !== "pendingSelfie"}
                ref={camera}
                key={docStatus}
                maxWidth={window.innerWidth > 500 ? 405 : window.innerWidth}
                previous={previous}
                next={next}
                initialFacingMode="rear"
                submitting={sending}
                allowSwap={false}
                instructions={<Instructions docStatus={docStatus} />}
            />
        </div>
    );
};

export default UploadDocument;
