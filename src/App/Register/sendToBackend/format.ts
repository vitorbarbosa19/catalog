import { formatDateUTC3 } from "@ziro/format-date-utc3";
import maskInput from "@ziro/mask-input";
import type { BeforeFormat } from "./types";

export const format = (state: BeforeFormat) => {
    const email = state.email ? state.email.toLowerCase() : "";
    const today = formatDateUTC3(new Date()) as string;
    const fname = state.fname ? state.fname.trim() : "";
    const lname = state.lname ? state.lname.trim() : "";
    const fullName = fname + (lname ? " " + lname : "");
    const insta = state.insta ? state.insta.replace("@", "").trim().toLowerCase() : "";
    const complement = state.complement ? ", " + state.complement : "";
    const address = state.street ? state.street + ", " + state.number + complement : "";
    const telefone = state.fone ? (maskInput(state.fone, state.fone.length === 14 ? "(##) ####-####" : "(##) #####-####") as string) : "";
    const cep = state.cep ? (maskInput(state.cep, "##.###-###", true) as string) : "";
    return {
        email,
        today,
        fname,
        lname,
        fullName,
        insta,
        address,
        telefone,
        cep,
    };
};

export type Formatted = ReturnType<typeof format>;
