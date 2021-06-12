import { db } from '../../../../Firebase/index'

const writeTransactionToFirestore = dbData =>
	db.collection('credit-card-payments').doc('Z3B7YEUmIu1ZjEcdjkMa').update(dbData) // FOR TESTING

export default writeTransactionToFirestore