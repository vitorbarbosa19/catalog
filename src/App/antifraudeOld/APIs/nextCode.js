import axios, { post } from 'axios';

let nextCodeAuth = {
  token: null,
  exp: null,
};

const createHeader = () => ({ 'x-access-token': nextCodeAuth.token });

const login = async () => {
  const _url = 'https://auth.nxcd.com.br/v1.0/login/';
  const _body = {
    email: process.env.NEXTCODE_EMAIL,
    password: process.env.NEXTCODE_PASSWORD,
  };
  const { data } = await post(_url, _body);
  const { token, exp } = data;
  if (!token || !exp) {
    const error = 'NEXTCODE_LOGIN_ERROR';
    console.error(error, data);
    throw error;
  }
  nextCodeAuth = { token, exp };
};

const verifyLogin = async () => {
  const { token, exp } = nextCodeAuth;
  if (!token || exp < Date.now()) await login();
};

export const analiseDocument = url => {
  const cancelSource = axios.CancelToken.source();
  const timeout = setTimeout(() => cancelSource.cancel('TIMEOUT'), 40000);
  const result = new Promise(async (resolve, reject) => {
    try {
      await verifyLogin();
      const _url = 'https://id.nxcd.com.br/v1.0/id/extract-all-single-file-url/';
      const _body = { url };
      const _config = { headers: createHeader(), cancelToken: cancelSource.token };
      const { data } = await post(_url, _body, _config);
      const { refresh, ...result } = data;
      if (refresh && refresh.token) nextCodeAuth = refresh;
      resolve(result);
    } catch (e) {
      console.log({ e });
      if (axios.isCancel(e)) resolve(e.message);
      else reject(e);
    } finally {
      clearTimeout(timeout);
    }
  });
  return { cancelSource, timeout, result };
};

export const compare = (url1, url2) => {
  const cancelSource = axios.CancelToken.source();
  const timeout = setTimeout(() => cancelSource.cancel('TIMEOUT'), 40000);
  const result = new Promise(async (resolve, reject) => {
    try {
      await verifyLogin();
      const _url = 'https://id.nxcd.com.br/v1.0/bio/new-face-compare-url/';
      const _body = { url1, url2 };
      const _config = { headers: createHeader(), cancelToken: cancelSource.token };
      const { data } = await post(_url, _body, _config);
      const { refresh, ...result } = data;
      if (refresh && refresh.token) nextCodeAuth = refresh;
      resolve(result);
    } catch (e) {
      if (axios.isCancel(e)) resolve(e.message);
      else reject(e);
    } finally {
      clearTimeout(timeout);
    }
  });
  return { cancelSource, timeout, result };
};
