import { useEffect, useState, useRef } from "react";
import { useGlobalCache } from "@bit/vitorbarbosa19.ziro.flow-manager";
import { post } from "axios";
import { useLocation } from "wouter";
import { BRANDS, IS_QUERYING, USER_DATA } from "./cacheKeys";
import { auth, db } from "../../Firebase/index.ts";

const url = process.env.SHEET_URL;
const config = {
    headers: {
        "Content-type": "application/json",
        Authorization: process.env.SHEET_TOKEN,
    },
};
const body = {
    apiResource: "values",
    apiMethod: "get",
    range: "Base",
    spreadsheetId: process.env.SHEET_ID_STOREOWNERS,
};

export const useFetchInfo = () => {
    const [, setBrands] = useGlobalCache([], BRANDS);
    const [, setFetchingBrands] = useGlobalCache(true, IS_QUERYING);
    const [loginTransaction, setLoginTransaction] = useGlobalCache(false, Symbol.for("LOGIN_TRANSACTION"));
    const [userData, setUserData] = useGlobalCache({ favorites: {}, cart: {} }, USER_DATA);

    const [errorLoading, setErrorLoading] = useState();

    // auth listener
    const [loadingUserState, setLoadingUserState] = useState(true);
    useEffect(
        () =>
            auth.onAuthStateChanged((user) => {
                if (user && user.emailVerified) {
                    setUserData((old) => ({
                        ...old,
                        name: user.displayName,
                        uid: user.uid,
                    }));
                } else {
                    setUserData({ favorites: {}, cart: {} });
                    localStorage.clear();
                }
                setLoadingUserState(false);
            }),
        [],
    );

    // storeownerInfoListener
    const [loadingStoreownerInfo, setLoadingStoreownerInfo] = useState(false);
    useEffect(() => {
        if (userData.uid) {
            setLoadingStoreownerInfo(true);
            return db
                .collection("storeowners")
                .where("uid", "==", userData.uid)
                .onSnapshot(
                    (snap) => {
                        if (!snap.empty) {
                            snap.docs.forEach((doc) => {
                                const data = doc.data();
                                const buyerStoreownerId = doc.id;
                                setUserData((old) => ({ ...old, ...data, buyerStoreownerId }));
                            });
                        }
                        setLoadingStoreownerInfo(false);
                    },
                    () => setErrorLoading(true),
                );
        }
    }, [userData.uid]);

    useEffect(() => {
        if (!userData.cnpj) return;
        if (!userData.storeownerRow || userData.storeownerRow === "") {
            post(url, body, config)
                .then(({ data: { values } }) => {
                    const index = values.findIndex((user) => user[8] === userData.cnpj);
                    if (index) setUserData((old) => ({ ...old, storeownerRow: index + 1 }));
                })
                .catch((error) => console.log({ error }));
        }
    }, [userData.cnpj, userData.storeownerRow]);

    // catalogBrands listener
    useEffect(
        () =>
            db
                .collection("catalog-brands")
                .orderBy("updatedAt", "desc")
                .onSnapshot(
                    (brandSnap) => {
                        const _brands = brandSnap.docs.reduce((prev, cur) => {
                            const data = cur.data();
                            if (!data.brand) return prev;
                            return [...prev, data];
                        }, []);
                        setBrands(_brands);
                        setFetchingBrands(false);
                    },
                    (brandError) => console.log({ brandError }),
                ),
        [],
    );

    useEffect(() => {
        const { cnpj, razao, buyerStoreownerId } = userData || {};
        if (!cnpj || !razao || !buyerStoreownerId || loginTransaction) return;
        setLoginTransaction(true);
        db.runTransaction(async (transaction) => {
            const userRef = db.collection("catalog-user-data").doc(buyerStoreownerId);
            const userSnap = await transaction.get(userRef);
            if (userSnap.exists) {
                const _userData = userSnap.data();
                const newData = {};
                if (!_userData?.cnpj) newData.cnpj = cnpj;
                if (!_userData?.razao) newData.razao = razao;
                if (!_userData?.status) newData.status = "logged";
                return transaction.set(userRef, newData, { merge: true });
            }
            return transaction.set(userRef, { cnpj, razao, status: "logged" }, { merge: true });
        });
    }, [userData]);

    // catalog-user-data listeners
    useEffect(() => {
        if (!userData.buyerStoreownerId) return;
        const favoritesObserver = db
            .collection("catalog-images")
            .where("favorited", "array-contains", userData.buyerStoreownerId)
            .onSnapshot((snap) => {
                const favorites = snap.docs.reduce((prev, cur) => ({ ...prev, [cur.id]: cur.data() }), {});
                setUserData((old) => ({ ...old, favorites }));
            });
        const cartObserver = db
            .collection("catalog-user-data")
            .doc(userData.buyerStoreownerId)
            .collection("cart")
            .orderBy("added", "desc")
            .onSnapshot(
                (cartSnap) => {
                    const cart = cartSnap.docs.reduce((prev, cur) => ({ ...prev, [cur.id]: cur.data() }), {});
                    setUserData((old) => ({ ...old, cart }));
                },
                (cartError) => {
                    console.log({ cartError });
                },
            );
        const userDataObserver = db
            .collection("catalog-user-data")
            .doc(userData.buyerStoreownerId)
            .onSnapshot((userDataSnap) => {
                const data = userDataSnap.data();
                setUserData((old) => ({ ...old, ...data }));
            });
        const cardsObserver = db
            .collection("catalog-user-data")
            .doc(userData.buyerStoreownerId)
            .collection("cards")
            .onSnapshot(
                (cardsSnap) => {
                    const [cardIds, cards] = cardsSnap.docs.reduce((prev, cur) => [[...prev[0], cur.id], { ...prev[1], [cur.id]: cur.data() }], [
                        [],
                        {},
                    ]);
                    setUserData((old) => ({ ...old, cards, cardIds }));
                },
                (error) => console.log({ error }),
            );
        return () => {
            favoritesObserver();
            cartObserver();
            userDataObserver();
            cardsObserver();
        };
    }, [userData.buyerStoreownerId, setUserData]);
    return [loadingUserState || loadingStoreownerInfo, errorLoading, !!userData.uid];
};
