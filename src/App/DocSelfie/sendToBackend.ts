import consultCnpj from './utils/consultCnpj'
import imageToLink from './utils/imageToLink'
import { sheet } from "@bit/vitorbarbosa19.ziro.utils.sheets"
import {SuccessMessage, FailureMessage} from './utils/promptMessages'

const sendToBackend = (state:any) => () => {
    return new Promise(async (resolve, reject) => {
        const {docType, setMessage, cnpj, frontDoc, backDoc, selfieDoc,setCnpj, setFrontDoc, setBackDoc, setSelfieDoc, setDocType, setFilenameFront, setFilenameSelfie, setFilenameBack} = state
        try {
            const cleanCnpj = cnpj.replace('.','').replace('.','').replace('/','').replace('-','')
            const resultCnpj = await consultCnpj(cnpj)
            const [status, razao] = resultCnpj
            if(status === 'error'){
                setMessage(FailureMessage(razao))
                reject(razao)
            }else{
                const conditionalEmptyImage = docType === 'CNH' ? frontDoc.size === 0 || selfieDoc.size === 0 : frontDoc.size === 0 || selfieDoc.size === 0 || backDoc.size === 0
                if (conditionalEmptyImage) {
                    setMessage(FailureMessage('Imagem com tamanho vazio.'))
                    reject('Imagem com tamanho vazio.')
                }else{
                    const linkFrontDoc = await imageToLink(frontDoc,'doc-selfie', `${cleanCnpj}-frontDoc`)
                    const linkBackDoc = backDoc ? await imageToLink(backDoc, 'doc-selfie', `${cleanCnpj}-backDoc`) : ''
                    const linkSelfieDoc = await imageToLink(selfieDoc, 'doc-selfie', `${cleanCnpj}-selfieDoc`)
                    if(linkFrontDoc === 'error' || linkBackDoc === 'error' || linkSelfieDoc === 'error'){
                        setMessage(FailureMessage('Erro ao enviar a imagem.'))
                        reject('Erro ao enviar a imagem.')
                    }else{
                        const arrayToSheet = [cnpj, razao, linkFrontDoc, linkBackDoc, linkSelfieDoc]
                        try {
                            await sheet(process.env.SHEET_ID_SUPPORT).write({ values: [arrayToSheet], range: "'Formulário Doc e Selfie'!A1" })
                            setCnpj('')
                            setFrontDoc('')
                            setBackDoc ? setBackDoc('') : null
                            setSelfieDoc('')
                            setDocType('')
                            setFilenameFront('')
                            setFilenameSelfie('')
                            setFilenameBack('')
                            setMessage(SuccessMessage(''))
                            resolve('Enviado com sucesso!')
                        } catch (error) {
                            console.log(error)
                            setMessage(FailureMessage('Erro ao enviar os arquivos.'))
                            reject('Erro ao enviar os arquivos.')
                        }
                }
                }
            }
        } catch (error) {
            console.log(error)
            setMessage(FailureMessage('Um erro inesperado ocorreu.'))
            reject(error)
        }
    })
}

export default sendToBackend