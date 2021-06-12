import { db, auth } from "../../Firebase/index.ts";

const sendToBackend = (state) => () =>
    new Promise(async (resolve, reject) => {
        try {
            const { email, pass, history } = state;
            const doc = (await db.collection("users").where("email", "==", email).limit(1).get()).docs[0];
            const userApp = doc?.data().app;
            if (userApp !== "catalog") throw { msg: "Não cadastrado no app", customError: true };
            try {
                const {
                    user: { emailVerified },
                } = await auth.signInWithEmailAndPassword(email, pass);
                if (!emailVerified) {
                    try {
                        const paymentId = history ? history.find((old) => old.pathname.includes("/pagamento/"))?.pathname.split("/")[2] : "";
                        const url = process.env.CONTINUE_URL + (paymentId ? `/pagamento/${paymentId}/escolher-cartao` : "/login");
                        await auth.currentUser.sendEmailVerification({ url });
                        await auth.signOut();
                    } catch (error) {
                        throw error;
                    }
                    resolve("Enviado com sucesso!");
                } else {
                    await auth.signOut();
                    throw { msg: "E-mail já validado!", customError: true };
                }
            } catch (error) {
                if (error.code) {
                    switch (error.code) {
                        case "auth/network-request-failed":
                            throw { msg: "Sem conexão com a rede", customError: true };
                        case "auth/invalid-email":
                            throw { msg: "Email inválido", customError: true };
                        case "auth/user-disabled":
                            throw { msg: "Usuário bloqueado", customError: true };
                        case "auth/user-not-found":
                            throw { msg: "Usuário não cadastrado", customError: true };
                        case "auth/wrong-password":
                            throw { msg: "Senha incorreta", customError: true };
                        case "auth/too-many-requests":
                            throw { msg: "Muitas tentativas. Tente mais tarde", customError: true };
                    }
                } else throw error;
            }
        } catch (error) {
            if (error.response) console.log(error.response);
            reject(error);
        }
    });

export default sendToBackend;
