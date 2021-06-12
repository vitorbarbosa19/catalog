import React from "react";
import { useHeader, usePersistentScroll } from "@bit/vitorbarbosa19.ziro.flow-manager";
import DrawerPanel from "@bit/vitorbarbosa19.ziro.drawer-panel";
import Icon from "@bit/vitorbarbosa19.ziro.icon";
import { containerWithPadding } from "@ziro/theme";
import Header from "../Header";
import { auth } from "../../Firebase/index.ts";
import { useUserData } from "../useInfo";

const Menu = () => {
    const [{ cnpj, name }] = useUserData();
    useHeader(<Header title="Menu" />, []);
    usePersistentScroll();
    return (
        <div style={{ ...containerWithPadding, minHeight: "0" }}>
            <DrawerPanel
                v2style
                username={name || "Usuário"}
                userdata={cnpj ? `CNPJ: ${cnpj}` : ""}
                options={[
                    {
                        path: "/pagamentos",
                        icon: <Icon type="card" size={18} strokeWidth={2} />,
                        text: "Pagamentos",
                    },
                    {
                        path: "/carrinho",
                        icon: <Icon type="cart" size={18} strokeWidth={2} />,
                        text: "Carrinho",
                    },
                    {
                        path: "/favoritos",
                        icon: <Icon type="heart" size={18} strokeWidth={2} />,
                        text: "Favoritos",
                    },
                    {
                        path: "/minha-conta",
                        icon: <Icon type="gear" size={18} strokeWidth={2} />,
                        text: "Conta",
                    },
                    {
                        path: "/menu",
                        onClick: () => window.open("https://ziro.com.br", "_blank"),
                        icon: <Icon type="globe" size={18} strokeWidth={2} />,
                        text: "Conheça a Ziro",
                    },
                    {
                        path: "/galeria",
                        onClick: () => auth.signOut(),
                        icon: <Icon type="logout" size={18} strokeWidth={2} />,
                        text: "Sair",
                    },
                ]}
            />
        </div>
    );
};

export default Menu;
