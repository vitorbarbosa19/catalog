import React, { memo } from "react";
import { CardRow } from "@bit/vitorbarbosa19.ziro.choose-card";
import EmptyCardRow from "./EmptyCardRow";
import { container as headerContainer } from "../../../Header/styles";
import { HeaderWithoutModal } from "../../../Header";
import { zoopCard } from "../../../atoms.ts";

export default memo(({ reset, onClose, firebaseCard, shouldShowStatus }) => (
    <div style={{ ...headerContainer, gridTemplateColumns: "1fr", height: undefined, padding: undefined }}>
        <HeaderWithoutModal title="Escolha um cartão" leftButton={{ icon: "close", onClick: onClose }} />
        <div style={{ margin: "10px", padding: "5px 10px 0px 10px", border: "grey dashed 2px", borderRadius: 10 }}>
            {firebaseCard ? (
                <CardRow
                    firebaseCard={firebaseCard}
                    zoopAtom={zoopCard}
                    rightButton={{ icon: "close", color: "black", onClick: reset }}
                    shouldShowStatus={shouldShowStatus}
                />
            ) : (
                <EmptyCardRow />
            )}
        </div>
    </div>
));
