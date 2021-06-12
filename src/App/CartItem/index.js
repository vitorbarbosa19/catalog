import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useAnimatedLocation, useHeader } from "@bit/vitorbarbosa19.ziro.flow-manager";
import Button from "@bit/vitorbarbosa19.ziro.button";
import currencyFormat from "@ziro/currency-format";
import { container, priceTotal, saleSummary, summary, total } from "./styles";
import { db, fs } from "../../Firebase";
import { parseTotal, rqReducer } from "./utils";
import { useBrands, useCart, useUserData } from "../useInfo";

import Card from "./card";
import Header from "../Header";

export const getSupplierInfo = async (brandName) => {
    const snap = await db.collection("suppliers").where("fantasia", "==", brandName.toUpperCase()).get();
    if (snap.empty) return null;
    const doc = snap.docs[0];
    if (!doc.exists) return null;
    return doc.data();
};

export default ({ id }) => {
    const [{ cart, buyerStoreownerId, razao }] = useUserData();
    const { productIds, products, brandName, status, paymentId } = useMemo(() => cart[id] || {}, [cart]);
    const [, setLocation] = useAnimatedLocation();
    const { deleteFromCart, deleteBatchFromCart, updateRequestedQuantities } = useCart();
    const [mount, setMount] = useState(true);

    const [brands] = useBrands();
    const brandInfo = useMemo(() => brands.find(({ brand }) => brand === brandName), [brandName, brands]);
    const minimumQty = useMemo(() => parseInt(brandInfo?.minimumItemQty || 0), [brandInfo]);

    const [prices, setPrices] = useState({});
    const [totalItems, totalPrice] = useMemo(() => parseTotal(productIds, products, prices), [productIds, products, prices]);

    useEffect(() => {
        if (mount) setMount(false);
        else if (!productIds || !productIds.length) setLocation("goRight", "/carrinho");
    }, [productIds]);

    const excludeItem = useCallback(async () => deleteBatchFromCart(brandName, productIds), [brandName, productIds, deleteBatchFromCart]);
    const excludeProduct = useCallback(async (productId) => deleteFromCart(brandName, productId), [brandName, deleteFromCart]);
    const setRequestedQuantities = useCallback(async (productId, rq) => updateRequestedQuantities(brandName, productId, rq.reduce(rqReducer, {})), [
        brandName,
        updateRequestedQuantities,
    ]);

    const onClickPay = useCallback(async () => {
        const nowDate = fs.FieldValue.serverTimestamp();
        if (paymentId) setLocation("diverge", `/pagamento/${paymentId}/escolher-cartao`);
        else {
            try {
                let paymentData = {
                    buyerRazao: razao,
                    charge: totalPrice.toString(),
                    dateLinkCreated: nowDate,
                    dateLastUpdate: nowDate,
                    buyerStoreownerId,
                    status: "Aguardando Pagamento",
                    cartId: id,
                };
                const supplier = await getSupplierInfo(brandName);
                if (supplier && supplier.zoopEnabled)
                    paymentData = {
                        ...paymentData,
                        seller: brandName,
                        sellerZoopId: supplier.zoopId,
                        installmentsMax: 3,
                    };
                else {
                    const ziroSupplier = await getSupplierInfo("ZIRO");
                    paymentData = {
                        ...paymentData,
                        seller: "Ziro",
                        sellerZoopId: ziroSupplier.zoopId,
                        installmentsMax: 4,
                        onBehalfOfBrand: brandName,
                    };
                }
                const doc = await db.collection("credit-card-payments").add(paymentData);
                await db.collection("catalog-user-data").doc(buyerStoreownerId).collection("cart").doc(id).update({ paymentId: doc.id });
                setLocation("diverge", `/pagamento/${doc.id}/escolher-cartao`);
            } catch (error) {
                console.error(error);
            }
        }
    }, [paymentId, brandName, brandInfo, razao, totalPrice, id, buyerStoreownerId]);

    useHeader(
        <Header
            title={brandName}
            backPath="/carrinho"
            excludeItem={excludeItem}
            onClickTitle={() => setLocation("goRight", `/marcas/${brandName.toLowerCase().replace(" ", "-")}`)}
        />,
        [brandName, excludeItem],
    );

    const closeItem = useCallback(() => {
        //if (totalItems < minimumQty) return;
        db.collection("catalog-user-data")
            .doc(buyerStoreownerId)
            .collection("cart")
            .doc(id)
            .set(
                {
                    status: "waitingConfirmation",
                    total: totalPrice.toString(),
                    lastUpdate: fs.FieldValue.serverTimestamp(),
                    updatedBy: "storeowner",
                },
                { merge: true },
            )
            .then(() => console.log("closed"))
            .catch((error) => console.log({ error }));
    }, [totalItems, totalPrice, minimumQty]);

    if (!products) return null;
    return (
        <div style={container}>
            {productIds
                .filter((productId) => (status === "waitingPayment" ? !!products[productId].requestedQuantities : true))
                .map((productId) => (
                    <Card
                        key={productId}
                        productId={productId}
                        cartProduct={products[productId]}
                        update={(r) => setRequestedQuantities(productId, r)}
                        exclude={() => excludeProduct(productId)}
                        setPrice={(price) => setPrices((old) => ({ ...old, [productId]: price }))}
                        hideAllButtons={status === "waitingConfirmation" || status === "waitingPayment"}
                    />
                ))}
            <div style={summary}>
                <div style={saleSummary}>
                    <label style={total}>Total da compra</label>
                    <label style={priceTotal}>{currencyFormat(totalPrice)}</label>
                </div>
                <div style={saleSummary}>
                    <label style={total}>Quantidade</label>
                    <label style={priceTotal}>{totalItems}</label>
                </div>
            </div>
            {status === "waitingConfirmation" && <Button type="button" cta="Aguardando confirmação" click={() => {}} submitting />}
            {status !== "waitingConfirmation" && status !== "waitingPayment" && (
                <>
                    <Button
                        type="button"
                        cta="Solicitar variações e preços"
                        click={() =>
                            window.open(
                                "https://api.whatsapp.com/send?phone=551133340920&text=Oi, gostaria de saber variações e preços para as peças no meu carrinho",
                                "_blank",
                            )
                        }
                    />
                    <Button type="button" cta="Fechar pedido" click={closeItem} />
                </>
            )}
            {status === "waitingPayment" && <Button type="button" cta="Pagar" click={onClickPay} />}
        </div>
    );
};
