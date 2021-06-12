import React, { useCallback } from "react";
import LoginPage from "@bit/vitorbarbosa19.ziro.login-page";
import { useHeader, useFooter } from "@bit/vitorbarbosa19.ziro.flow-manager";
import { containerWithPadding } from "@ziro/theme";
import { useFirestore, useAuth } from "reactfire";
import type { Screens } from "..";

const appName = {
    affiliate: "afiliados",
    suppliers: "fabricantes",
    operation: "interno",
};

const err = (msg: string) => ({ msg, customError: true });

const Login: React.FC<{ next: (screen: Screens) => void }> = ({ next }) => {
    useHeader(null);
    useFooter(null);

    const usersCollection = useFirestore().collection("users");
    const auth = useAuth();

    const sendToBackend = useCallback(
        ({ email, pass }) => async () => {
            try {
                const doc = (await usersCollection.where("email", "==", email).limit(1).get()).docs[0];
                const userApp = doc?.data().app;
                if (!(userApp === "catalog" || userApp === "admin")) {
                    let msg = "Não cadastrado no app.";
                    if (appName[userApp]) msg += ` Cadastrado no app ${appName[userApp]}`;
                    throw err(msg);
                }
                try {
                    const {
                        user: { emailVerified },
                    } = await auth.signInWithEmailAndPassword(email, pass);
                    if (!emailVerified) {
                        await auth.signOut();
                        throw err("Acesse o email de confirmação");
                    } else next("ChooseCard");
                } catch (error) {
                    if (error.code) {
                        switch (error.code) {
                            case "auth/network-request-failed":
                                throw err("Sem conexão com a rede");
                            case "auth/invalid-email":
                                throw err("Email inválido");
                            case "auth/user-disabled":
                                throw err("Usuário bloqueado");
                            case "auth/user-not-found":
                                throw err("Usuário não cadastrado");
                            case "auth/wrong-password":
                                throw err("Senha incorreta");
                            case "auth/too-many-requests":
                                throw err("Muitas tentativas. Tente mais tarde");
                        }
                    } else throw error;
                }
            } catch (error) {
                if (error.response) console.log(error.response);
                throw error;
            }
        },
        [usersCollection, auth, next],
    );

    return (
        <div style={containerWithPadding}>
            <LoginPage audience="REVENDEDOR" sendToBackend={sendToBackend} />
        </div>
    );
};

Login.displayName = "Login";

export default Login;
