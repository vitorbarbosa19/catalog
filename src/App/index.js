import React, { Suspense, useEffect, useState } from "react";
import InitialLoader from "@bit/vitorbarbosa19.ziro.initial-loader";
import Error from "@bit/vitorbarbosa19.ziro.error";
import FlowManager, { useToastModal } from "@bit/vitorbarbosa19.ziro.flow-manager";
import { FirebaseAppProvider, useAnalytics } from "reactfire";
import MessageModal from "@bit/vitorbarbosa19.ziro.message-modal";
import { RecoilRoot } from "recoil";
import ErrorBoundary from "./ErrorBoundary.tsx";
import { config } from "../Firebase/index.ts";
import Router from "./Router.tsx";
import BottomTabBar from "./BottomTabBar";
import { useFetchInfo } from "./useInfo";
import { useToast } from "./useUI";
import ToastNotification from "./ToastNotification";

const Root = ({ reactfire }) => {
    const [loading, errorLoading] = useFetchInfo();

    const { openToast, setOpenToast, messageToast } = useToast();
    useToastModal(<ToastNotification openToastRoot={openToast} setOpenToastRoot={setOpenToast} messageToastRoot={messageToast} />, [openToast]);

    // if (loading) return <InitialLoader />;
    if (errorLoading) return <Error />;
    return <Router reactfire={reactfire} />;
};

const CheckAnalytics = ({ setAnalytics }) => {
    const support = useAnalytics.isSupported;
    useEffect(() => {
        support().then(setAnalytics);
    }, []);
    return null;
};

export const App = () => {
    const [analytics, setAnalytics] = useState(null);
    return (
        <ErrorBoundary>
            <Suspense fallback={<InitialLoader />}>
                <RecoilRoot>
                    <FirebaseAppProvider firebaseConfig={config} suspense>
                        <CheckAnalytics setAnalytics={setAnalytics} />
                        {typeof analytics === "boolean" && (
                            <MessageModal reactfire={analytics}>
                                <FlowManager defaultFooter={<BottomTabBar />} maxWidth={window.innerWidth > 500 ? 400 : window.innerWidth}>
                                    <Root reactfire={analytics} />
                                </FlowManager>
                            </MessageModal>
                        )}
                    </FirebaseAppProvider>
                </RecoilRoot>
            </Suspense>
        </ErrorBoundary>
    );
};
