import React from "react";
import ResendEmail from "@bit/vitorbarbosa19.ziro.resend-email";
import { useHistory } from "@bit/vitorbarbosa19.ziro.flow-manager";
import sendToBackend from "./sendToBackend";

export default () => {
    const history = useHistory();
    return <ResendEmail sendToBackend={sendToBackend} navigateTo="/problemas-acesso" history={history} />;
};
