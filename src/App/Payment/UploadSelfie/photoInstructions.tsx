import React from "react";

import Icon from "@bit/vitorbarbosa19.ziro.icon";
import TooltipHelp from "@bit/vitorbarbosa19.ziro.tooltip-help";

const title = <h1 style={{ color: "#2D9CDB", margin: "10px 0", fontWeight: "normal" }}>Dicas para uma boa selfie</h1>;

const body = (
    <>
        <div
            style={{
                display: "grid",
                gridRowGap: "0px",
                gridColumnGap: "10px",
                gridTemplateColumns: `1fr 1fr`,
                gridTemplateRows: `1fr 1fr`,
            }}
        >
            <div style={{ display: "grid", gridTemplateRows: "1fr 1fr", gridRowGap: "5px", justifyItems: "center" }}>
                <Icon type="noFlash" size={70} />
                <label style={{ fontSize: "1.5rem" }}>Evite utilizar o flash</label>
            </div>
            <div style={{ display: "grid", gridTemplateRows: "1fr 1fr", gridRowGap: "5px", justifyItems: "center" }}>
                <Icon type="shadowFace" size={70} />
                <label style={{ fontSize: "1.5rem" }}>Evite sombras em seu rosto</label>
            </div>
            <div style={{ display: "grid", gridTemplateRows: "1fr 1fr", gridRowGap: "5px", justifyItems: "center" }}>
                <Icon type="noAccessories" size={70} />
                <label style={{ fontSize: "1.5rem" }}>Retire óculos e acessórios</label>
            </div>
            <div style={{ display: "grid", gridTemplateRows: "1fr 1fr", gridRowGap: "5px", justifyItems: "center" }}>
                <Icon type="happyEmoji" size={70} />
                <label style={{ fontSize: "1.5rem" }}>Mantenha os olhos abertos</label>
            </div>
        </div>
    </>
);

const PhotoInstructions = () => {
    return (
        <>
            <br />
            <br />
            <p style={{ fontSize: "1.6rem" }}>
                Dicas para uma boa selfie <TooltipHelp title={title} body={body} />
            </p>
        </>
    );
};

export const Instructions = React.memo(() => {
    return (
        <>
            <p style={{ fontSize: "1.6rem" }}>
                Envie uma foto da mesma pessoa que está no documento enviado anteriormente. A foto precisa estar bem enquadrada e com boa iluminação{" "}
                <TooltipHelp
                    illustration="selfieOne"
                    title="Por que enviar uma foto?"
                    body="Esse é um procedimento de segurança que visa combater fraudes,
        evitando uso não autorizado do cartão. Não salvamos sua foto conosco,
        e esse procedimento é feito apenas uma vez por cartão"
                />
            </p>
            <PhotoInstructions />
        </>
    );
});
