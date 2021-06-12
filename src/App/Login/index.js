import React from "react";
import PropTypes from "prop-types";
import { Redirect, useLocation } from "wouter";
import LoginPage from "@bit/vitorbarbosa19.ziro.login-page";
import { useHeader, usePersistentScroll, useHistory } from "@bit/vitorbarbosa19.ziro.flow-manager";
import { containerWithPadding } from "@ziro/theme";
import sendToBackend from "./sendToBackend";

const Login = () => {
    const history = useHistory();
    const [, setLocation] = useLocation();
    useHeader(null);
    usePersistentScroll();

    return (
        <div style={containerWithPadding}>
            <LoginPage audience="REVENDEDOR" sendToBackend={sendToBackend(history, setLocation)} />
        </div>
    );
};

export default Login;
