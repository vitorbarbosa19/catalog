import axios from 'axios';
import { useEffect, useState } from 'react';
import { db } from '../../Firebase/index';

const fetch = (setIsLoading, setIsError, setStoreowners, history, setValueFromPaymentLink, setSellerFromPaymentLink) => {
  const source = axios.CancelToken.source();
  const [transactionSearch] = history.filter(obj => {
    return obj.search.includes('?doc');
  });
  if (transactionSearch) {
    const firebaseDocumentId = transactionSearch.pathname.split(['/']);
    const paymentsRef = db.collection('credit-card-payments');
    paymentsRef
      .doc(firebaseDocumentId[2])
      .get()
      .then(snapshot => {
        if (snapshot.empty) {
          console.log('No matching documents.');
          return;
        }
        const { charge, seller, onBehalfOfBrand } = snapshot.data();
        setValueFromPaymentLink(charge / 100)
        setSellerFromPaymentLink(seller === 'Ziro' && onBehalfOfBrand ? `Ziro - ${onBehalfOfBrand}` : seller);
      })
      .catch(err => {
        console.log('Error getting documents', err);
      });
    // window.location.replace(`${transactionSearch.pathname}`);
  } else {
    // window.location.replace(`/galeria`);
  }

  const run = async () => {
    /* */
    const config = {
      method: 'POST',
      url: process.env.SHEET_URL,
      data: {
        apiResource: 'values',
        apiMethod: 'get',
        spreadsheetId: process.env.SHEET_ID_PRELEADS_APPEND,
        range: 'Base!F:F',
      },
      headers: {
        Authorization: process.env.SHEET_TOKEN,
        'Content-Type': 'application/json',
      },
      cancelToken: source.token,
    };
    try {
      const {
        data: { values },
      } = await axios(config);
      const [, ...list] = values.flat();
      setStoreowners(list);
    } catch (error) {
      if (error.response) console.log(error.response);
      else console.log(error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };
  run();
  return () => source.cancel('Canceled fetch request. Component unmounted');
};

export default fetch;
