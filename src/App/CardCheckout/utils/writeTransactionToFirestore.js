import { db } from '../../../Firebase/index';

const writeTransactionToFirestore = (docId, dbData) => {
  db.collection('credit-card-payments').doc(docId).update(dbData);
};

export default writeTransactionToFirestore;
