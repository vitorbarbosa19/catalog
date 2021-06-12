import cuid from 'cuid';
import { storage } from '../../Firebase';
import { writeFailureData, writeSuccessData } from './APIs/sheets';
import { sendWhats } from './APIs/whats';

const convertBase64toFile = async url => {
  const data = await fetch(url);
  const file = await data.blob();
  return file;
};

export const uploadFile = async ({ first4_digits, last4_digits }, picture) => {
  const child = storage.child(`antifraude/${first4_digits}-${last4_digits}/${cuid()}`);
  const file = await convertBase64toFile(picture);
  const uploadTask = await child.put(file);
  const url = await uploadTask.ref.getDownloadURL();
  return url;
};

export const deleteFile = url => storage.storage.refFromURL(url).delete();

export const getNames = nome => {
  const names = nome.split(' ');
  return [names[0], names[names.length - 1]];
};

export const errorDealer = userData => card => async error => {
  await writeFailureData(error, card, userData);
  throw error;
};

export const finish = async (cardData, userData) => {
  if (cardData.status !== 'approved') sendWhats(userData);
  if (cardData.error) await writeFailureData(cardData, userData);
  else await writeSuccessData(cardData, userData);
};

export const parseCard = ({ cardholder: holder_name, number, cvv: security_code, expiry }) => {
  const [expiration_month, expiration_year] = expiry.replace('/', '/20').split('/');
  const card_number = number.replace(/ /g, '');
  return {
    holder_name,
    security_code,
    expiration_month,
    expiration_year,
    card_number,
  };
};
