import React from "react";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import { render } from "react-dom";
import { load as FontLoader } from "webfontloader";
import { App } from "./App/index";
import "./index.css";
import pkg from "../package.json";

const environment = process.env.NODE_ENV;
const release = `catalogo@${pkg.version}`;
console.info(`RUNNING ${release} in ${environment}`);

Sentry.init({
    dsn: "https://2d6dc7c536a74eacbdb41d5652d290ad@o416954.ingest.sentry.io/5314511",
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 1.0,
    normalizeDepth: 10,
    environment,
    release,
});

FontLoader({
    google: { families: ["Rubik:500,600", "Work Sans:300,400,500", "Karla"] },
});

render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById("app"),
);
