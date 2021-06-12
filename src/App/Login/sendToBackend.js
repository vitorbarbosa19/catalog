import { db, auth } from "../../Firebase/index.ts";

const appName = {
    affiliate: "afiliados",
    suppliers: "fabricantes",
    operation: "interno",
};

const sendToBackend = (history, setLocation) => (state) => async () => {
    try {
        const { email, pass } = state;
        const doc = (await db.collection("users").where("email", "==", email).limit(1).get()).docs[0];
        const userApp = doc?.data().app;
        if (!(userApp === "catalog" || userApp === "admin")) {
            const app = appName[userApp];
            const msg = app ? `Não cadastrado no app. Cadastrado no app ${app}` : "Não cadastrado no app";
            throw { msg, customError: true };
        }
        try {
            await auth.signOut();
            const {
                user: { emailVerified },
            } = await auth.signInWithEmailAndPassword(email, pass);
            if (!emailVerified) {
                await auth.signOut();
                throw {
                    msg: "Acesse o email de confirmação",
                    customError: true,
                };
            } else if (history.find((old) => old.pathname.includes("/pagamento/"))?.pathname.split("/")[2]) {
                const paymentId = history.find((old) => old.pathname.includes("/pagamento/"))?.pathname.split("/")[2];
                const url = paymentId ? `/pagamento/${paymentId}/escolher-cartao` : "/galeria";
                setLocation(url);
            } else setLocation("/galeria");
        } catch (error) {
            if (error.code) {
                switch (error.code) {
                    case "auth/network-request-failed":
                        throw {
                            msg: "Sem conexão com a rede",
                            customError: true,
                        };
                    case "auth/invalid-email":
                        throw { msg: "Email inválido", customError: true };
                    case "auth/user-disabled":
                        throw { msg: "Usuário bloqueado", customError: true };
                    case "auth/user-not-found":
                        throw {
                            msg: "Usuário não cadastrado",
                            customError: true,
                        };
                    case "auth/wrong-password":
                        throw { msg: "Senha incorreta", customError: true };
                    case "auth/too-many-requests":
                        throw {
                            msg: "Muitas tentativas. Tente mais tarde",
                            customError: true,
                        };
                }
            } else throw error;
        }
    } catch (error) {
        if (error.response) console.log(error.response);
        throw error;
    }
};

export default sendToBackend;
