import {
  useCache,
  useScrollPagination,
} from "@bit/vitorbarbosa19.ziro.flow-manager";
import { useEffect, useState } from "react";
import { db } from "../../Firebase";
import { useUserData } from "../useInfo";

export default (brands) => {
  const [{ uid, buyerStoreownerId }] = useUserData();
  const [photos, setPhotos] = useCache([], "photos");
  const [lastDoc, setLastDoc] = useCache(undefined, "lastDoc");
  const [isQuering, setIsQuering] = useState(false);
  const [empty, setEmpty] = useState(false);
  const [error] = useState();
  const [finished, setFinished] = useState(false);
  const [shouldKeepFetching, setShouldKeepFecthing] = useState(false);
  const shouldFetchMore = useScrollPagination();
  // const [withoutAuthentication, setWithoutAuthentication] = useState(false);

  useEffect(() => {
    if (isQuering || finished) return;
    if (!lastDoc || shouldKeepFetching) {
      setIsQuering(true);
      setShouldKeepFecthing(false);
      let query = db
        .collection("catalog-images")
        .where("photoPeriod", "==", "Nova")
        .orderBy("timestamp", "desc")
        .limit(350);

      if (!uid) query = query.where("pricetag", "==", "Não");

      if (lastDoc) query = query.startAfter(lastDoc);

      const fetch = async () => {
        let validResult = false;
        while (!validResult) {
          try {
            // eslint-disable-next-line no-await-in-loop
            const snap = await query.get();
            let valid = 0;
            snap.forEach((doc) => {
              const {
                brandName,
                url,
                timestamp,
                favorited,
                addedToCart,
                price,
                status,
              } = doc.data();
              const timePast = Date.now() - timestamp;
              const timeInDays = Math.floor(timePast / (1000 * 60 * 60 * 24));
              const infoAboutBrand = brands.find(
                ({ brand: _brand }) => _brand === brandName
              );
              let freeShipping = null;
              let minimumItemQty = null;
              if (infoAboutBrand) {
                if (infoAboutBrand.freeShipping) {
                  freeShipping = infoAboutBrand.freeShipping;
                }
                if (infoAboutBrand.minimumItemQty) {
                  minimumItemQty = infoAboutBrand.minimumItemQty;
                }
              }
              let cartQuantity;
              if (addedToCart) {
                cartQuantity = addedToCart.includes(buyerStoreownerId)
                  ? addedToCart.length - 1
                  : addedToCart.length;
              }
              let today = false;
              let plural = "";
              if (timeInDays > 1) {
                plural = "s";
              } else {
                today = true;
              }

              brandName &&
                setPhotos((oldPhotos) => [
                  ...oldPhotos,
                  {
                    brandName,
                    url,
                    productId: doc.id,
                    timeInDays,
                    plural,
                    favorited,
                    price,
                    today,
                    cartQuantity,
                    addedToCart,
                    minimumItemQty,
                    freeShipping,
                    status,
                  },
                ]);
              valid += 1;
            });
            setShouldKeepFecthing(valid < 10);
            setLastDoc(snap.docs[snap.docs.length - 1]);
            setEmpty(snap.empty);
            setLastDoc(snap.docs[snap.docs.length - 1]);
            setFinished(snap.docs.length < 20);
            setIsQuering(false);
            validResult = true;
          } catch (error) {
            console.log({ error });
          }
        }
      };
      fetch();
    }
  }, [!!lastDoc, shouldFetchMore, shouldKeepFetching]);

  return {
    photos,
    setPhotos,
    setShouldKeepFecthing,
    shouldKeepFetching,
    shouldFetchMore,
    isQuering,
    empty,
    error,
  };
};
