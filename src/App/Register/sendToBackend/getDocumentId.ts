import { db } from "../../../Firebase";

export const getDocumentId = async (cnpj: string) => {
    const snapshot = (await db.collection("storeowners").where("cnpj", "==", cnpj).limit(1).get()).docs[0];
    return snapshot?.id;
};
