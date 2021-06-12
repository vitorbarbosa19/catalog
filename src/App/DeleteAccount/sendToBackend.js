import { fbauth, auth, db } from "../../Firebase/index.ts";

const sendToBackend = ({ cards, deleteCard, buyerStoreownerId, cart, deleteBatchFromCart, favorites, unfavorite }) => (state) => async () => {
    try {
        const { pass } = state;
        const user = auth.currentUser;
        const credential = fbauth.EmailAuthProvider.credential(user.email, pass);
        await user.reauthenticateWithCredential(credential);
        const snapUser = await db.collection("users").where("email", "==", user.email).get();
        if (snapUser.empty) throw { msg: "Ocorreu um erro", customError: true };
        const docUser = snapUser.docs[0];
        if (docUser.data().app === "admin") throw { msg: "Não permitido para admin", customError: true };
        if (docUser.data().app !== "catalog") throw { msg: "Não cadastrado no app", customError: true };
        // deletar os favoritos
        await Promise.all(Object.keys(favorites).map(unfavorite));
        // deletar os items do carrinho
        await Promise.all(Object.values(cart).map(({ brandName, productIds }) => deleteBatchFromCart(brandName, productIds)));
        // deletar os cartoes
        await Promise.all(cards.map(({ id }) => deleteCard(id)));
        // deletar o catalog-user-data
        await db.collection("catalog-user-data").doc(buyerStoreownerId).delete();
        // deletar o storeowner
        await db.collection("storeowners").doc(buyerStoreownerId).delete();
        // deletar o doc-user
        await docUser.ref.delete();
        // deletar o user
        await user.delete();
        // logout
        await auth.signOut();
        // go to root
        window.location.replace("/");
    } catch (error) {
        switch (error.code) {
            case "auth/network-request-failed":
                throw { msg: "Sem conexão com a rede", customError: true };
            case "auth/wrong-password":
                throw { msg: "Senha incorreta", customError: true };
            default:
                throw error;
        }
    }
};

export default sendToBackend;
