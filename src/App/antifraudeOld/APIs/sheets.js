import axios from 'axios';
import { formatDateUTC3 } from '@ziro/format-date-utc3';

const prepareData = (
  { validDocument, responses, pictures, holder_name, first4_digits, last4_digits, expiration_month, expiration_year, status },
  { cnpj, razao, name },
) => {
  const { found, extracted, fileInfo } = (validDocument === 'CNH' ? responses?.cnh : responses?.rg?.verso) || {};
  const nascimento = found?.birthdate || extracted?.dataNascimento || '';
  const cpf = found?.cpf || extracted?.cpf || '';
  const mae = found?.mothersName || extracted?.nomeMae || '';
  const nome = found?.name || extracted?.nome || '';
  const rg = extracted?.rg || '';
  const emissor = extracted?.emissor || '';
  const documentType = extracted?.documentType || '';
  const month = expiration_month ? `${expiration_month < 10 ? `0${expiration_month}` : expiration_month}` : null;
  const year = expiration_year && expiration_year.slice(2);
  const expiry = month && year && `${month}/${year}`;
  const cardNumber = first4_digits && last4_digits ? `${first4_digits}...${last4_digits}` : '';
  const holderName = holder_name ? holder_name.trim() : '';
  const probability = fileInfo?.classifiedAs?.probability || '';
  const confidence = responses.selfie?.confidence || '';
  const isApproved = status === 'approved' ? 'sim' : 'não';
  const doc1 = validDocument === 'RG' ? pictures.rg.frente : pictures.cnh;
  const doc2 = validDocument === 'RG' ? pictures.rg.verso : null;
  const { selfie } = pictures;
  return [
    cnpj,
    razao,
    name,
    nascimento,
    `${rg}`,
    `${cpf}`,
    emissor,
    mae,
    nome,
    holderName,
    cardNumber,
    expiry,
    documentType,
    probability,
    confidence,
    isApproved,
    doc1,
    doc2,
    selfie,
  ];
};

const prepareSuccessData = (card, userData) => [formatDateUTC3(new Date()), ...prepareData(card, userData)];
const prepareFailureData = (error, card, userData) => [formatDateUTC3(new Date()), error, ...prepareData(card, userData)];

const writeTransactionToSheet = async (body, tab) => {
  const url = process.env.SHEET_URL;
  const method = 'POST';
  const headers = {
    Authorization: process.env.SHEET_TOKEN,
    'Content-Type': 'application/json',
  };
  const data = {
    apiResource: 'values',
    apiMethod: 'append',
    spreadsheetId: process.env.SHEET_ID_TRANSACTIONS,
    range: `${tab}!A1`,
    resource: { values: [body] },
    valueInputOption: 'user_entered',
  };
  return axios({ url, method, headers, data });
};

export const writeSuccessData = async (card, userData) => {
  const body = prepareSuccessData(card, userData);
  await writeTransactionToSheet(body, 'Antifraude');
};

export const writeFailureData = async ({ error, ...card }, userData) => {
  const body = prepareFailureData(error, card, userData);
  await writeTransactionToSheet(body, 'Antifraude_Erros');
};
