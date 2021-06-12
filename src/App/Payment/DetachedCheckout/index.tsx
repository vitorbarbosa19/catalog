import React, { useMemo } from "react";
import { fontTitle, primaryColor } from "@ziro/theme";
import Button from "@bit/vitorbarbosa19.ziro.button";
import { usePayment } from "@bit/vitorbarbosa19.ziro.pay.card-lifecycle";
import RegisterCard from "@bit/vitorbarbosa19.ziro.flow-register-card";
import { useUserStatus, useSetUserStatus } from "@bit/ziro.firebase.user-status";
import { HeaderWithoutModal } from "../../Header";

interface Props {
    payment: any;
    close: () => void;
    login: () => void;
}

const DetachedCheckout: React.FC<Props> = ({ payment, close, login }) => {
    const header = useMemo(() => <HeaderWithoutModal title="Finalizar" leftButton={{ icon: "close", onClick: close }} />, [close]);
    const setStatus = useSetUserStatus();
    const [onClick] = usePayment(() => {
        setStatus({
            status: "paid",
            paymentId: payment.id,
            paymentMethod: "creditCard",
        }).catch(() => null);
    }, payment.id);
    return (
        <div style={{ paddingTop: "40px" }}>
            <div style={{ width: "100%", textAlign: "center" }}>
                <Button
                    style={{
                        fontSize: "1.5rem",
                        fontFamily: fontTitle,
                        textDecoration: "underline",
                        color: primaryColor,
                        cursor: "pointer",
                    }}
                    type="link"
                    cta="Já tem conta? Faça login."
                    navigate={login}
                />
            </div>
            <RegisterCard
                header={header}
                showInstallments
                installmentsMax={payment.installmentsMax}
                charge={payment.charge}
                seller={payment.seller}
                next={{
                    onClick,
                    title: "pagar",
                }}
            />
        </div>
    );
};

export default DetachedCheckout;
