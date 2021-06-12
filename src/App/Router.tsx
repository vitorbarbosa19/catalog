// @ts-nocheck
import React, { useCallback } from "react";
import { Redirect, useLocation, Router } from "wouter";
import useRootLocation from "wouter/use-location";
import { useAnimatedLocation } from "@bit/vitorbarbosa19.ziro.flow-manager";
import { Switch, Route } from "@bit/vitorbarbosa19.ziro.route";
import NotFound from "@bit/vitorbarbosa19.ziro.not-found";
import GalleryBrand from "./GalleryBrand/index";
import GalleryAll from "./GalleryAll/index";
import Login from "./Login/index";
import Register from "./Register/index";
import LoginTrouble from "./LoginTrouble/index";
import ResendEmail from "./ResendEmail/index";
import ResetPass from "./ResetPass/index";
import SuccessRegister from "./SuccessRegister/index";
import MyAccount from "./MyAccount/index";
import UpdatePass from "./UpdatePass/index";
import UpdateEmail from "./UpdateEmail/index";
import DeleteAccount from "./DeleteAccount/index";
import MyPayments from "./MyPayments/index";
import MyData from "./MyData/index";
import Favorites from "./Favorites/index";
import Menu from "./Menu";
import Cart from "./Cart";
import Receipt from "./Receipt/index";
import CartItem from "./CartItem";
import DocSelfie from "./DocSelfie/index";
import DoubleValidation from "./DoubleValidation/index";
import CompleteValidation from "./CompleteValidation/index";
import LoginSupportPage from "./LoginSupportPage";
import Payment, { PaymentHelmet } from "./Payment";
import SupportedCnaes from "./SupportedCnaes";

const customHook = () => {
    const [location, setLocation] = useAnimatedLocation();
    const [, setRloc] = useRootLocation();
    const cbk = useCallback(
        (loc: string) => {
            if (loc === location) return;
            let anim = { exit: { opacity: 0 }, enter: { opacity: 1 }, initial: { opacity: 0 } };
            if (location === "/menu") {
                if (loc === "/pagamentos") anim = "goLeft";
                if (loc === "/carrinho") anim = "goRight";
                if (loc === "/favoritos") anim = "goRight";
                if (loc === "/minha-conta") anim = "goLeft";
                if (loc === "/galeria") anim = "goRight";
            }
            if (location === "/login") {
                if (loc === "/galeria") anim = "goRight";
            }
            if (location.startsWith("/meus-dados") && loc.startsWith("/meus-dados")) {
                setRloc(loc);
                return;
            }
            setLocation(anim, loc);
        },
        [setLocation, location],
    );
    return [location, cbk];
};

export default ({ reactfire }: { reactfire: boolean }) => {
    const [location] = useLocation();
    return (
        <Router hook={customHook}>
            <Switch defaultPublicOnlyFallback={<NotFound />} defaultPrivateFallback={<Login />} reactfire={reactfire}>
                {/* common */}
                <Route path="/">
                    <Redirect to="/galeria" />
                </Route>
                <Route path="/galeria">
                    <GalleryAll />
                </Route>
                <Route path="/marcas/:marca">
                    <GalleryBrand />
                </Route>
                <Route path="/doc-selfie">
                    <DocSelfie />
                </Route>
                <Route path="/cartao-selfie">
                    <DoubleValidation />
                </Route>
                <Route path="/validacao-completa">
                    <CompleteValidation />
                </Route>
                <Route helmet={<PaymentHelmet />} path="/pagamento/:id/:any?">
                    <Payment />
                </Route>
                {/* public-only */}
                <Route publicOnly path="/login">
                    <Login />
                </Route>
                <Route publicOnly path="/cadastrar">
                    <Register />
                </Route>
                <Route publicOnly path="/problemas-acesso">
                    <LoginTrouble />
                </Route>
                <Route path="/reenviar-email">
                    <ResendEmail />
                </Route>
                <Route publicOnly path="/resetar-senha">
                    <ResetPass />
                </Route>
                <Route publicOnly path="/pagina-suporte">
                    <LoginSupportPage />
                </Route>
                <Route publicOnly path="/sucesso-cadastrar">
                    <SuccessRegister />
                </Route>
                <Route publicOnly path="/cnaes-validos">
                    <SupportedCnaes />
                </Route>
                {/* private-only */}
                <Route private path="/minha-conta">
                    <MyAccount />
                </Route>
                <Route private path="/trocar-senha">
                    <UpdatePass />
                </Route>
                <Route private path="/trocar-email">
                    <UpdateEmail />
                </Route>
                <Route private path="/deletar-conta">
                    <DeleteAccount />
                </Route>
                <Route private path="/pagamentos/:transactionId?">
                    <MyPayments key={location} />
                </Route>
                <Route private path="/meus-dados/fisica">
                    <MyData />
                </Route>
                <Route private path="/meus-dados/juridica">
                    <MyData />
                </Route>
                <Route private path="/favoritos">
                    <Favorites />
                </Route>
                <Route private path="/menu">
                    <Menu />
                </Route>
                <Route private path="/carrinho">
                    <Cart />
                </Route>
                <Route path="/comprovante/:receiptId?">
                    <Receipt />
                </Route>
                <Route private path="/carrinho/:id">
                    <CartItem />
                </Route>
                {/* NOT FOUND */}
                <Route path="/:rest*">
                    <NotFound />
                </Route>
            </Switch>
        </Router>
    );
};
