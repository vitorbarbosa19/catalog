import { sheet } from "@bit/vitorbarbosa19.ziro.utils.sheets";
import { createSheetData } from "./createSheetData";
import type { State } from "../types";
import type { Formatted } from "../format";
import { findStoreownerRow } from "../../../utils";

export const writeToPreleads = async (formatted: Formatted, state: State) => {
    const values = createSheetData(formatted, state);
    await sheet(process.env.SHEET_ID_PRELEADS_APPEND)
        .write({ range: "Base!A1", values })
        .catch((error) => console.error("could not write to preleads sheet", error));
};

export const writeToStoreowners = async (formatted: Formatted, state: State) => {
    const row = await findStoreownerRow(state.cnpj);
    if (row) {
        const range = `Base!B${row}:D${row}`;
        const values = [[formatted.fullName, state.whats, formatted.email]];
        await sheet(process.env.SHEET_ID_STOREOWNERS)
            .write({ range, values, apiMethod: "update" })
            .catch((error) => console.error("could not write to storeowners sheet", error));
    }
};
