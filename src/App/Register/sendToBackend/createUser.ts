import { auth } from "../../../Firebase";
import { format } from "./format";
import { e } from "./customError";
import { State } from "./types";

export const createUser = async ({ email, fname: displayName }: ReturnType<typeof format>, { pass, createRollbackItem }: State) => {
    try {
        const { user } = await auth.createUserWithEmailAndPassword(email, pass);
        const userData: IUserData = { origin: "auth", pass };
        createRollbackItem(userData);
        await user.updateProfile({ displayName });
    } catch (error) {
        switch (error.code) {
            case "auth/network-request-failed":
                throw e("Sem conexão com a rede");
            case "auth/invalid-email":
                throw e("Email inválido");
            case "auth/email-already-in-use":
                throw e("Email já cadastrado");
            case "auth/operation-not-allowed":
                throw e("Operação não permitida");
            case "auth/weak-password":
                throw e("Senha fraca. Mínimo 6 caracteres");
            default:
                throw error;
        }
    }
};
