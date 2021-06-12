import React, { memo } from "react";
import { CardRow } from "@bit/vitorbarbosa19.ziro.choose-card";
import { HeaderWithoutModal } from "../../Header";
import { container as headerContainer } from "../../Header/styles";
import { zoopCard } from "../../atoms.ts";

export default memo(({ onClose, firebaseCard }) => (
    <div style={{ ...headerContainer, gridTemplateColumns: "1fr", height: undefined, padding: undefined }}>
        <HeaderWithoutModal title="Finalizar" leftButton={{ icon: "close", onClick: onClose }} />
        <div style={{ margin: "10px", padding: "5px 10px 0px 10px", border: "grey dashed 2px", borderRadius: 10 }}>
            <CardRow firebaseCard={firebaseCard} zoopAtom={zoopCard} shouldShowStatus={false} />
        </div>
    </div>
));
