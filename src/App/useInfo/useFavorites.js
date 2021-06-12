import { useCallback, useMemo, useState } from "react";
import { useUserData } from "./useInfo";
import { db, fs } from "../../Firebase";
import { useGlobalCache } from "@bit/vitorbarbosa19.ziro.flow-manager/dist/FlowManager/hooks";
import { useToast } from "../useUI";

const PENDING_FAVORITES = Symbol("PENDING_FAVORITES");
const PENDING_TO_BE_REMOVED = Symbol("PENDING_TO_BE_REMOVED");

export const useFavorites = () => {
  const [{ favorites, buyerStoreownerId, uid }] = useUserData();
  const { setMessageToast, setOpenToast } = useToast();
  const [pendingFavorites, setPendingFavorites] = useGlobalCache(
    [],
    PENDING_FAVORITES
  );
  const [pendingRemoved, setPendingRemoved] = useGlobalCache(
    [],
    PENDING_TO_BE_REMOVED
  );
  const favorite = useCallback(
    async (productId) => {
      if (!buyerStoreownerId) return;
      const { arrayUnion } = fs.FieldValue;
      try {
        setPendingFavorites((old) => [...old, productId]);
        await db
          .collection("catalog-images")
          .doc(productId)
          .update({ favorited: arrayUnion(buyerStoreownerId) });
        console.log("favorited", { productId });
      } catch (error) {
        console.log("error favoriting", { error });
      } finally {
        setTimeout(
          () =>
            setPendingFavorites((old) =>
              old.filter((pId) => pId !== productId)
            ),
          500
        );
      }
    },
    [buyerStoreownerId]
  );

  const unfavorite = useCallback(
    async (productId) => {
      if (!buyerStoreownerId) return;
      const { arrayRemove } = fs.FieldValue;
      try {
        setPendingRemoved((old) => [...old, productId]);
        await db
          .collection("catalog-images")
          .doc(productId)
          .update({ favorited: arrayRemove(buyerStoreownerId) });
        console.log("unfavorited", { productId });
      } catch (error) {
        console.log("error unfavoriting", { error });
      } finally {
        setTimeout(
          () =>
            setPendingRemoved((old) => old.filter((pId) => pId !== productId)),
          500
        );
      }
    },
    [buyerStoreownerId, favorites]
  );

  const favoriteIds = useMemo(
    () =>
      [...Object.keys(favorites), ...pendingFavorites].filter(
        (pId) => !pendingRemoved.includes(pId)
      ),
    [favorites, pendingFavorites, pendingRemoved]
  );

  const favoritesByBrand = useMemo(
    () =>
      Object.entries(favorites).reduce(
        (prev, [productId, { brandName, ..._favorite }]) => ({
          ...prev,
          [brandName]: [
            ...(prev[brandName] || []),
            { ..._favorite, productId },
          ],
        }),
        {}
      ),
    [favorites]
  );

  const onFavoritePress = useCallback(
    (productId, status) => {
      if (!uid) {
        setMessageToast("Cadastre-se para salvar peças e ver preços");
        setOpenToast(true);
        return;
      }
      if (status === "soldOut" || status === "unavailbale") {
        setMessageToast("Este item está esgotado");
        setOpenToast(true);
        return;
      }
      if (favoriteIds.includes(productId)) unfavorite(productId);
      else favorite(productId);
    },
    [favoriteIds]
  );

  return {
    favorite,
    unfavorite,
    onFavoritePress,
    favorites,
    favoriteIds,
    favoritesByBrand,
  };
};
