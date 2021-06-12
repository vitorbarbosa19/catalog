import { ZiroPromptMessage } from "ziro-messages";
import { writeToPreleads, writeToStoreowners } from "./sheets";
import { format } from "./format";
import type { State } from "./types";
import { getDocumentId } from "./getDocumentId";
import { getPaymentInfo } from "./getPaymentInfo";
import { createUser } from "./createUser";
import { sendEmailVerification } from "./sendEmailVerification";
import { writeToFirestore } from "./writeToFirestore";
import { e } from "./customError";
import { resetState } from "./resetState";
import { auth } from "../../../Firebase";

export const sendToBackend = (state: State, setMessage: (m: ZiroPromptMessage<any, any, any>) => void) => async () => {
    const formatted = format(state);
    const { startRollback } = state;
    if (state.cnpjValid) {
        if (state.reason && formatted.address) {
            const id = await getDocumentId(state.cnpj);
            const paymentId = state.history.find((old) => old.pathname.includes("/pagamento/"))?.pathname.split("/")[2];
            try {
                await createUser(formatted, state);
            } catch (err) {
                startRollback();
                if (err === "database doesnt exist") {
                    setMessage(
                        new ZiroPromptMessage({
                            title: "Ocorreu um erro inesperado",
                            code: "10000",
                            userDescription: "Será preciso efetuar o cadastro novamente.",
                            userResolution: "Clique em ok para recarregar a página.",
                            illustration: "errorLoading",
                            type: "destructive",
                            internalDescription: "ocorreu erro de indexedDB",
                            additionalData: undefined,
                            name: "INDEXED_DB_ERROR",
                        }).withButtons([
                            {
                                title: "ok",
                                action: () => window.location.reload(),
                            },
                        ]),
                    );
                    return;
                }
                throw err;
            }
            await writeToFirestore(formatted, state, id, paymentId);
            await sendEmailVerification(paymentId);
            const { sellerFromPaymentLink, valueFromPaymentLink } = paymentId ? await getPaymentInfo(paymentId) : ({} as any);
            await writeToPreleads(formatted, { ...state, sellerFromPaymentLink, valueFromPaymentLink });
            if (id) await writeToStoreowners(formatted, state);
            resetState(state);
            auth.signOut();
        } else throw e("Ocorreu um erro, refaça a validação do CNPJ");
    } else throw e("Cnpj não validado");
};
