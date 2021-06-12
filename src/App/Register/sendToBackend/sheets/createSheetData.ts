import type { ToSheet } from "../types";
import type { Formatted } from "../format";

export const createSheetData = (
    { today, fullName, email, insta, address, cep, telefone }: Formatted,
    { whats, cnpj, reason, fantasia, neighborhood, city, cityState, sellerFromPaymentLink, valueFromPaymentLink }: ToSheet,
) => {
    return [
        [
            today,
            fullName,
            whats,
            email,
            insta,
            cnpj,
            reason,
            fantasia,
            address,
            neighborhood,
            cep,
            city,
            cityState,
            telefone,
            sellerFromPaymentLink || "",
            valueFromPaymentLink || "",
        ],
    ];
};
