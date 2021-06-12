import type { StateSetters } from "./types";

export const resetState = ({ setIsSent, ...setters }: StateSetters) => {
    Object.values(setters).forEach((setter) => typeof setter === "function" && setter(""));
    setIsSent("Yes");
};
