import React from "react";
import Timeline from "@bit/vitorbarbosa19.ziro.timeline";
import { useHeader, useAnimatedLocation } from "@bit/vitorbarbosa19.ziro.flow-manager";
import Header from "../../Header";

export default ({ transactions }) => {
    const [, setLocation] = useAnimatedLocation();
    return (
        <div>
            <Timeline
                transactions={transactions}
                transactionClick={({ transaction }) => setLocation("goLeft", `/pagamentos/${transaction.transactionId}`)}
            />
        </div>
    );
};
