import {db} from '../../../Firebase'

const consultCnpj = async (cnpj:string) => {
    try {
        const query = db.collection('storeowners').where('cnpj', '==', cnpj)
        const storeownerInfo = await query.get()
        const razao = []
        storeownerInfo.forEach(doc => razao.push(doc.data().razao))
        if(razao[0]){
            return ['found', razao[0]]
        }else{
            return['error', 'CNPJ não encontrado.']
        }
    } catch (error) {
        return ['error', 'Erro ao consultar o banco de dados.']
    }
};

export default consultCnpj;