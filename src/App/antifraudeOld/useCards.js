import { useGlobalCache } from "@bit/vitorbarbosa19.ziro.flow-manager";
import { useEffect, useMemo, useCallback } from "react";
import firebase from "firebase";
import { useUserData } from "../useInfo";
import {
  getCardInfo,
  createBuyer,
  createCardToken,
  associateCard,
  deleteCard,
} from "./APIs/zoop";
import { db, storage } from "../../Firebase/index.ts";

const CARD_ID = Symbol("CARD_NUMBER");
const ZOOP_CARDS = Symbol("ZOOP_CARDS");

const filterCards = (set, ids) =>
  set((old) =>
    Object.fromEntries(Object.entries(old).filter(([key]) => ids.includes(key)))
  );
const isFetching = (id) => (old) => ({ ...old, [id]: { fetching: true } });
const doneFetching = (id, info) => (old) => ({
  ...old,
  [id]: { info, fetching: false },
});
const getInfo = (set, ids, cards) =>
  ids.forEach((id) => {
    const { info, fetching } = cards[id] || {};
    if (info || fetching) return;
    set(isFetching(id));
    getCardInfo(id)
      .then((info) => {
        console.log(JSON.stringify(info));
        set(doneFetching(id, info));
      })
      .catch((error) => console.error(`error fetching card ${id}`, error));
  });
const createCards = (ids, cards, fetching, zoopCards) => () => {
  if (
    !ids ||
    !cards ||
    fetching ||
    ids.length !== Object.keys(zoopCards).length
  )
    return [];
  return ids.map((id) => {
    const { info: card } = zoopCards[id] || {};
    const { first4_digits, last4_digits } = card;
    return {
      ...cards[id],
      ...card,
      number: `${first4_digits} **** ${last4_digits}`,
    };
  });
};

export const useCards = () => {
  const [{ cardIds, cards: _cards, buyerStoreownerId }] = useUserData();
  const [cardId, setCardId] = useGlobalCache(undefined, CARD_ID);
  const [zoopCards, setZoopCards] = useGlobalCache({}, ZOOP_CARDS);

  useEffect(() => {
    if (!cardIds) return;
    filterCards(setZoopCards, cardIds);
    getInfo(setZoopCards, cardIds, zoopCards);
  }, [cardIds]);

  const fetching = useMemo(
    () => Object.values(zoopCards).some(({ fetching }) => fetching),
    [zoopCards]
  );
  const cards = useMemo(createCards(cardIds, _cards, fetching, zoopCards), [
    cardIds,
    _cards,
    fetching,
    zoopCards,
  ]);
  const card = useMemo(() => cardId && cards.find(({ id }) => id === cardId), [
    cards,
    cardId,
  ]);
  const setCard = useCallback(({ id }) => setCardId(id), [setCardId]);
  const cardRef = useMemo(
    () =>
      cardId &&
      buyerStoreownerId &&
      db
        .collection("catalog-user-data")
        .doc(buyerStoreownerId)
        .collection("cards")
        .doc(cardId),
    [buyerStoreownerId, cardId]
  );

  return { cards, setCard, card, fetching, setCardId, cardRef, cardId };
};

const useZoopRegistration = () => {
  const [{ zoopId, buyerStoreownerId, ...userData }] = useUserData();
  const userRef = useMemo(
    () =>
      buyerStoreownerId && db.collection("storeowners").doc(buyerStoreownerId),
    [buyerStoreownerId]
  );
  useEffect(() => {
    if (!zoopId)
      createBuyer(userData)
        .then((id) => userRef.set({ zoopId: id }, { merge: true }))
        .catch((error) =>
          console.error("CANNOT REGISTER STOREOWNER TO ZOOP", { error })
        );
  }, []);
  return zoopId;
};

export const useRegisterCard = () => {
  const customer = useZoopRegistration();
  const [{ buyerStoreownerId, status }] = useUserData();
  const userRef = useMemo(
    () =>
      buyerStoreownerId &&
      db.collection("catalog-user-data").doc(buyerStoreownerId),
    [buyerStoreownerId]
  );
  const cardsRef = useMemo(() => userRef && userRef.collection("cards"), [
    userRef,
  ]);
  return useCallback(
    async (card) => {
      const token = await createCardToken(card);
      const card_id = await associateCard(token, customer);
      await cardsRef
        .doc(card_id)
        .set(
          {
            status: "pendingDocument",
            added: firebase.firestore.FieldValue.serverTimestamp(),
            updated: firebase.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true }
        );
      if (status === "logged")
        await userRef.set({ status: "cardAdded" }, { merge: true });
      return card_id;
    },
    [customer, cardsRef]
  );
};

export const useDeleteCard = () => {
  const [{ buyerStoreownerId }] = useUserData();
  const cardsRef = useMemo(
    () =>
      buyerStoreownerId &&
      db
        .collection("catalog-user-data")
        .doc(buyerStoreownerId)
        .collection("cards"),
    [buyerStoreownerId]
  );
  return useCallback(
    async (id) => {
      // delete from zoop
      await deleteCard(id).then((response) => console.log(response));
      // delete from firestore
      await cardsRef.doc(id).delete();
    },
    [cardsRef]
  );
};
