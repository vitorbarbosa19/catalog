import { useCache, useCachedEffect, useScrollPagination } from "@bit/vitorbarbosa19.ziro.flow-manager";
import { useCallback, useEffect, useMemo, useState } from "react";

import { db } from "../../Firebase";
import { useUserData } from "../useInfo";

const PHOTOS = Symbol("PHOTOS");
const DOCS = Symbol("DOCS");
const FETCHING = Symbol("FETCHING");
const ERROR = Symbol("ERROR");
const _MS_PER_DAY = 1000 * 60 * 60 * 24;
function dateDiffInDays(a, b) {
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

function removeDuplicates(collection) {
    return [...new Set(collection)];
}

export default function useFetch(brand, isOld, brandInfo, setRender) {
    const [{ uid, buyerStoreownerId }] = useUserData();
    const [docs, setDocs] = useCache([], DOCS);
    const [photos, setPhotos] = useCache([], PHOTOS);
    const [fetching, setFetching] = useCache(true, FETCHING);
    const [error, setError] = useCache(undefined, ERROR);
    const shouldFetchMore = useScrollPagination();
    const [sizeSnap, setSizeSnap] = useState(20);
    const [photosWithSoldOut, setPhotosWithSoldOut] = useState([]);
    const fetch = useCallback(() => {
        setFetching(true);
        let query = db
            .collection("catalog-images")
            .where("brandName", "==", brand)
            .orderBy("timestamp", "desc")
            .endBefore(new Date().setDate(new Date().getDate() - 40))
            .limit(20);

        if (isOld) query = query.where("photoPeriod", "==", "Antiga");
        if (!uid) query = query.where("pricetag", "==", "Não");
        if (docs.length) query = query.startAfter(docs[docs.length - 1]);

        query.onSnapshot((snap) => {
            setSizeSnap(snap.size);
        });
        if (sizeSnap !== 20) {
            setFetching(false);
        }
        query.onSnapshot(({ docs }) => {
            try {
                const photos = docs.map((doc) => {
                    const infoAboutBrand = brandInfo;
                    const { timestamp, status, favorited, addedToCart, url, ...photo } = doc.data();
                    if (status === "soldOut") {
                        if (addedToCart[addedToCart.length - 1]) {
                            const querySoldOutToNotShow = db
                                .collection("catalog-user-data")
                                .doc(addedToCart[addedToCart.length - 1])
                                .collection("cart");
                            querySoldOutToNotShow.onSnapshot((snap) => {
                                const { lastUpdate } = snap.docs[0].data();
                                const daySubtract = new Date();
                                daySubtract.setDate(daySubtract.getDate());

                                if (dateDiffInDays(lastUpdate.toDate(), daySubtract) > 6) {
                                    const photoToRemove = {
                                        timestamp,
                                        status,
                                        favorited,
                                        addedToCart,
                                        url,
                                        ...photo,
                                    };
                                    const listOfPhotos = photosWithSoldOut;
                                    listOfPhotos.push(photoToRemove);
                                    setPhotosWithSoldOut(listOfPhotos);

                                    const indexOfPhoto = photos
                                        .map(function (e) {
                                            return e.url;
                                        })
                                        .indexOf(photoToRemove.url);

                                    const newArrayOfPhotos = photos;
                                    // console.log(photoToRemove.url);
                                    newArrayOfPhotos.splice(indexOfPhoto, 1);
                                }
                            });
                        }
                    }
                    const timePast = Date.now() - timestamp;
                    const timeInDays = Math.floor(timePast / (1000 * 60 * 60 * 24));
                    let cartQuantity = 0;
                    let favQuantity = 0;
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

                    if (addedToCart) {
                        cartQuantity = addedToCart.includes(buyerStoreownerId) ? addedToCart.length - 1 : addedToCart.length;
                    }
                    if (favorited) {
                        favQuantity = favorited.includes(buyerStoreownerId) ? favorited.length - 1 : favorited.length;
                    }
                    return {
                        ...photo,
                        timestamp,
                        status,
                        favorited,
                        addedToCart,
                        minimumItemQty,
                        freeShipping,
                        timeInDays,
                        cartQuantity,
                        favQuantity,
                        url,
                        productId: doc.id,
                    };
                });
                setDocs((old) => [...old, ...docs]);
                if (photosWithSoldOut) {
                    setPhotos((old) => [...old, ...photos]);
                    const a = photosWithSoldOut;
                    const b = photos;
                    // console.log(photos);

                    // eslint-disable-next-line no-plusplus
                    for (let i = 0, len = a.length; i < len; i++) {
                        // eslint-disable-next-line no-plusplus
                        for (let j = 0, len2 = b.length; j < len2; j++) {
                            if (a[i].url === b[j].url) {
                                b.splice(j, 1);
                                len2 = b.length;
                            }
                        }
                    }
                    // console.log(b);

                    setRender(0);
                    setPhotos(removeDuplicates((old) => [...old, ...b]));
                    // console.log(a, b);
                    // setPhotos(old => [...old, ...listTest]);
                    /* const filteredKeywords = photos
            .filter(function (o1) {
              // filter out (!) items in result2
              return !photosWithSoldOut.some(function (o2) {
                console.log('o1:', o1.url, 'o2:', o2.url);
                return o1.url === o2.url; // assumes unique id
              });
            })
            .map(function (o) {
              // use reduce to make objects with only the required properties
              // and map to apply this to the filtered array as a whole
              return o;
            });
          // photos.filter(photo => !photosWithSoldOut.includes(photo.url));
          console.log(filteredKeywords); */
                } else {
                    setPhotos(removeDuplicates((old) => [...old, ...photos]));
                }
            } catch (err) {
                setError(true);
            } finally {
                setFetching(false);
            }
        });
    }, [brand, uid, isOld, docs, setFetching]);

    useCachedEffect(
        "clean",
        () => {
            setDocs([]);
            setPhotos([]);
            fetch();
        },
        [isOld, brand],
    );

    useEffect(() => {
        // console.log('teste');
    }, [photosWithSoldOut]);

    useCachedEffect(
        "fetchMore",
        () => {
            if (shouldFetchMore) fetch();
        },
        [shouldFetchMore],
    );
    return {
        photos,
        setPhotos,
        fetching,
        sizeSnap,
        empty: !(photos.length && photos.length > 0),
        error,
    };
}
