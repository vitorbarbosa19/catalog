import React from "react";
import Illustration from "@bit/vitorbarbosa19.ziro.illustration";
import Button from "@bit/vitorbarbosa19.ziro.button";

const ReceiptError = () => {
    return (
        <div style={{ display: "grid", maxWidth: "350px", margin: "0 auto", padding: "20px", gridGap: "20px", justifyItems: "center" }}>
            <Illustration type="noData" size={150} />
            <label style={{ textAlign: "center" }}>Ocorreu um erro ao buscar o recibo. Tente novamente ou contate suporte.</label>
            <Button type="button" cta="Tentar novamente" click={() => window.location.reload()} />
        </div>
    );
};

export default ReceiptError;
