import { create } from 'axios';

const zoop = create({
  baseURL: process.env.PAY,
  headers: { Authorization: `Basic ${process.env.PAY_TOKEN}` },
});

export const getCardInfo = async card_id => {
  const { data } = await zoop.get('/card-read', { params: { card_id } });
  return data;
};

export const createBuyer = async ({
  fname: first_name,
  lname: last_name,
  cpf: taxpayer_id,
  email,
  endereco: line1,
  bairro: neighborhood,
  cidade: city,
  estado: state,
  cep: postal_code,
}) => {
  const { data } = await zoop.post('/buyer-create', {
    first_name,
    last_name,
    taxpayer_id,
    email,
    address: { line1, neighborhood, city, state, postal_code, country_code: 'BR' },
  });
  if (!data.id) {
    console.error('CANNOT CREATE BUYER', data);
    throw 'WRONG_RESPONSE';
  }
  return data.id;
};

export const createCardToken = async ({ cardholder: holder_name, number, cvv: security_code, expiry }) => {
  const [expiration_month, expiration_year] = expiry.replace('/', '/20').split('/');
  const card_number = number.replace(' ', '');
  const { data } = await zoop.post('/token-card-create', { holder_name, expiration_month, expiration_year, card_number, security_code });
  if (!data.id) {
    console.error('CANNOT CREATE CARD TOKEN', data);
    throw 'WRONG_RESPONSE';
  }
  return data.id;
};

export const associateCard = async (token, customer) => {
  const { data } = await zoop.post('/card-associate', { token, customer });
  if (!data.id) {
    console.error('CANNOT ASSOCIATE CARD', data);
    throw 'WRONG_RESPONSE';
  }
  return data.id;
};

export const deleteCard = card_id => zoop.delete('/card-delete', { params: { card_id } });
