import { sheet } from "@bit/vitorbarbosa19.ziro.utils.sheets";

export const findStoreownerRow = async (cnpj) => {
    const values = await sheet(process.env.SHEET_ID_STOREOWNERS).read({ range: "Base" });
    const index = values.findIndex((user) => user[8] === cnpj);
    if (index === -1) return null;
    return index + 1;
};

export const supportPhoneNumber = "+55 (11) 98566-0341";
