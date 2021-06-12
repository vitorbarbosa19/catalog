import React from "react";

import Icon from "@bit/vitorbarbosa19.ziro.icon";
import TooltipHelp from "@bit/vitorbarbosa19.ziro.tooltip-help";

const title = <h1 style={{ color: "#2D9CDB", margin: "10px 0", fontWeight: "normal" }}>Dicas para uma boa foto</h1>;

const body = (
    <>
        <div
            style={{
                display: "grid",
                gridRowGap: "20px",
                gridColumnGap: "10px",
                gridTemplateColumns: `1fr 1fr`,
                gridTemplateRows: `1fr 1fr`,
            }}
        >
            <div style={{ display: "grid", gridTemplateRows: "1fr 1fr", gridRowGap: "5px", justifyItems: "center" }}>
                <Icon type="magnifier" size={70} />
                <label style={{ fontSize: "1.5rem" }}>Verifique se os dados estão legíveis</label>
            </div>
            <div style={{ display: "grid", gridTemplateRows: "1fr 1fr", gridRowGap: "5px", justifyItems: "center" }}>
                <Icon type="sun" size={70} />
                <label style={{ fontSize: "1.5rem" }}>Procure lugares iluminados e evite reflexos</label>
            </div>
            <div style={{ display: "grid", gridTemplateRows: "1fr 1fr", gridRowGap: "5px", justifyItems: "center" }}>
                <Icon type="document" size={70} />
                <label style={{ fontSize: "1.5rem" }}>Retire o documento do plástico</label>
            </div>
            <div style={{ display: "grid", gridTemplateRows: "1fr 1fr", gridRowGap: "5px", justifyItems: "center" }}>
                <Icon type="noBackground" size={70} />
                <label style={{ fontSize: "1.5rem" }}>Evite fundos com estampa</label>
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
                Dicas para uma boa foto <TooltipHelp title={title} body={body} />
            </p>
        </>
    );
};

export const Instructions = React.memo<{ docStatus: "document" | "pendingRGF" | "pendingRGV" | "pendingCNHF" }>(({ docStatus }) => {
    switch (docStatus) {
        case "pendingRGF":
            return (
                <>
                    <p style={{ fontSize: "1.6rem" }}>
                        Envie a <strong>frente</strong> do RG (lado <strong>COM</strong> foto)
                    </p>
                    <PhotoInstructions />
                </>
            );
        case "pendingRGV":
            return (
                <>
                    <p style={{ fontSize: "1.6rem" }}>
                        Envie o <strong>verso</strong> do RG (lado <strong>SEM</strong> foto)
                    </p>
                    <PhotoInstructions />
                </>
            );
        case "pendingCNHF":
            return (
                <>
                    <p style={{ fontSize: "1.6rem" }}>
                        Envie a <strong>frente</strong> da CNH (lado <strong>COM</strong> foto)
                    </p>
                    <PhotoInstructions />
                </>
            );
        default:
            return (
                <>
                    <p style={{ fontSize: "1.6rem" }}>
                        Envie uma foto de um RG, CNH ou outro documento com foto. O documento precisa ser do <strong>titular do cartão</strong>
                        (se seu nome não está no cartão, peça o documento ao titular){" "}
                        <TooltipHelp
                            illustration="cnhPhoto"
                            illustrationSize={125}
                            title="Por que enviar um documento?"
                            body="Esse é um procedimento de segurança que visa combater fraudes,
                  evitando uso não autorizado do cartão. Não salvamos seus documentos conosco,
                  e esse procedimento é feito apenas uma vez por cartão."
                        />
                    </p>
                    <PhotoInstructions />
                </>
            );
    }
});
