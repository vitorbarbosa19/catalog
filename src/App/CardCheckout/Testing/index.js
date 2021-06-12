import React, { useState, useEffect } from "react";
import Header from "@bit/vitorbarbosa19.ziro.header";
import Checkout from "@bit/vitorbarbosa19.ziro.checkout";
import ErrorLoading from "@bit/vitorbarbosa19.ziro.error-loading";
import ErrorExpired from "@bit/vitorbarbosa19.ziro.error-expired";
import Spinner from "@bit/vitorbarbosa19.ziro.spinner";
import { containerWithPadding } from "@ziro/theme";
import sendToBackend from "./sendToBackend";
import fetch from "./fetch";
import { useUserData } from "../../useInfo";

const CardCheckoutTesting = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [charge, setCharge] = useState("");
  const [installmentsMax, setInstallmentsMax] = useState("");
  const [seller, setSeller] = useState("");
  const [sellerZoopId, setSellerZoopId] = useState("");
  const [id, setId] = useState("");
  const [{ buyerStoreownerId, razao }] = useUserData();
  const checkoutProps = { charge, installmentsMax, seller };
  const doc = new URLSearchParams(window.location.search).get("doc");
  useEffect(
    () =>
      fetch(
        setIsLoading,
        setIsError,
        setIsExpired,
        setCharge,
        setInstallmentsMax,
        setSeller,
        setSellerZoopId,
        setId,
        doc
      ),
    []
  );
  if (isExpired) return <ErrorExpired />;
  return (
    <div style={containerWithPadding}>
      {isError ? (
        <ErrorLoading message="Acesse o link recebido novamente. Em caso de dúvidas, contate suporte" />
      ) : (
        <>
          <Header
            type="icon-link"
            title="Pagamento"
            icon="back"
            navigateTo="/pagamentos"
          />
          {isLoading ? (
            <div style={{ display: "grid" }}>
              <Spinner size="6rem" />
            </div>
          ) : (
            <Checkout
              {...checkoutProps}
              sendToBackend={sendToBackend(
                id,
                charge,
                seller,
                sellerZoopId,
                buyerStoreownerId,
                razao
              )}
              testing={{
                number: process.env.NUMBER,
                cardholder: process.env.HOLDER,
                expiry: process.env.EXPIRY,
                cvv: process.env.CVV,
                installments: "2",
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default CardCheckoutTesting;
