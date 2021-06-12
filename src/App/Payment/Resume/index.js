import React from "react";
import { motion } from "framer-motion";

import Logo from "@bit/vitorbarbosa19.ziro.logo";
import Illustration from "@bit/vitorbarbosa19.ziro.illustration";
import currencyFormat from "@ziro/currency-format";
import Button from "@bit/vitorbarbosa19.ziro.button";
import { useFooter } from "@bit/vitorbarbosa19.ziro.flow-manager";
import TooltipHelp from "@bit/vitorbarbosa19.ziro.tooltip-help";

import { containerWithPadding } from "@ziro/theme";
import {
    container,
    illustrationContainer,
    proposeContainer,
    infoContainer,
    header,
    summary,
    modalMessage,
    buttonsContainer,
    titleText,
    bodyText,
    infoTitle,
    sellerText,
    payInfo,
    loginText,
} from "./styles";

const PaymentResume = ({ payment, isLogged, next, login }) => {
    useFooter(null);
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ ...containerWithPadding, ...container }}>
            <div style={illustrationContainer}>
                <Illustration type="creditCard" size={140} />
            </div>
            <div style={proposeContainer}>
                <label key="Pague sua compra no cartão" style={titleText}>
                    Pagar compra com cartão
                </label>
                <label key="Você recebeu um link da ziro" style={bodyText}>
                    Pague sua compra com agilidade e segurança pelo link da <span style={{ fontWeight: "500" }}>ZIRO</span>.
                </label>
            </div>
            <div style={infoContainer}>
                <div style={header}>
                    <p style={summary}>
                        RESUMO
                        <TooltipHelp
                            illustration="chatting"
                            title="Precisa de suporte?"
                            body={
                                <label style={modalMessage}>
                                    Qualquer dúvida acerca da compra, fale direto com o vendedor. Mas também estamos à disposição.
                                </label>
                            }
                            iconSize={16}
                            iconColor="#2D9CDB"
                            supportButton
                        />
                    </p>
                    <Logo size={32} style={{ justifySelf: "end" }} />
                </div>
                <label key="seller" style={sellerText}>
                    <label style={infoTitle}>Fabricante</label>
                    <label style={payInfo}>{payment.seller}</label>
                </label>
                <label key="charge" style={sellerText}>
                    <label style={infoTitle}>Valor</label>
                    <label style={payInfo}>{currencyFormat(payment.charge)}</label>
                </label>
                <label key="installmentsMax" style={sellerText}>
                    <label style={infoTitle}>Parcelas</label>
                    <label style={payInfo}>Até {payment.installmentsMax}x s/ juros</label>
                </label>
            </div>

            <div style={buttonsContainer}>
                {payment.checkoutWithoutRegister && <Button type="link" cta="Pagar agora" navigate={() => next("DetachedCheckout")} />}
                {!payment.checkoutWithoutRegister && isLogged && <Button type="link" cta="Pagar agora" navigate={() => next("ChooseCard")} />}
                {!payment.checkoutWithoutRegister && !isLogged && (
                    <>
                        <Button type="link" cta="Cadastrar e pagar" navigate={() => next("Register")} />
                        <Button style={loginText} type="link" cta="Já tem conta? Faça login." navigate={login} />
                    </>
                )}
            </div>
        </motion.div>
    );
};

PaymentResume.displayName = "PaymentResume";

export default PaymentResume;
