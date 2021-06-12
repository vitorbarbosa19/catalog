import firebase from "firebase/app";
import type { State } from "./types";
import type { Formatted } from "./format";
import { auth, db } from "../../../Firebase";

type UpdateData = {
    uid: string;
    fname: string;
    lname: string;
    whatsapp: string;
    email: string;
    linkOrigin?: string;
};

type AddData = {
    cadastro: Date;
    uid: string;
    fname: string;
    lname: string;
    instagram: string;
    fone: string;
    whatsapp: string;
    email: string;
    lojaFisica: string;
    cnpj: string;
    razao: string;
    fantasia: string;
    endereco: string;
    bairro: string;
    cep: string;
    cidade: string;
    estado: string;
    registerComplete: string;
    linkOrigin?: string;
};

export const writeToFirestore = async (formatted: Formatted, state: State, id?: string, paymentId?: string) => {
    try {
        await db.collection("users").add({ email: formatted.email, app: "catalog" });
        if (id) {
            const data: UpdateData = {
                uid: auth.currentUser.uid,
                fname: formatted.fname,
                lname: formatted.lname,
                whatsapp: state.whats,
                email: formatted.email,
            };
            if (paymentId) data.linkOrigin = paymentId;
            await db.collection("storeowners").doc(id).update(data);
        } else {
            const data: AddData = {
                cadastro: new Date(),
                uid: auth.currentUser.uid,
                fname: formatted.fname,
                lname: formatted.lname,
                instagram: formatted.insta,
                fone: formatted.telefone,
                whatsapp: state.whats,
                email: formatted.email,
                lojaFisica: "",
                cnpj: state.cnpj,
                razao: state.reason,
                fantasia: state.fantasia,
                endereco: formatted.address,
                bairro: state.neighborhood,
                cep: formatted.cep,
                cidade: state.city,
                estado: state.cityState,
                registerComplete: "",
            };
            if (paymentId) data.linkOrigin = paymentId;
            const doc = await db.collection("storeowners").add(data);
            await db.collection("catalog-user-data").doc(doc.id).collection("status").add({
                status: "registered",
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            });
            const storeownersFirebaseData: IFirebaseData = { origin: "firebase", collection: "storeowners", field: "uid", identifier: id };
            state.createRollbackItem(storeownersFirebaseData);
        }
    } catch (error) {
        console.error("Error saving to firestore", error);
        auth.currentUser.delete();
        throw error;
    }
};
