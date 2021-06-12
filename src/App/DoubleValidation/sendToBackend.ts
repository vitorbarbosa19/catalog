import consultCnpj from './utils/consultCnpj'
import imageToLink from './utils/imageToLink'
import { sheet } from "@bit/vitorbarbosa19.ziro.utils.sheets"
import {SuccessMessage, FailureMessage} from './utils/promptMessages'

const sendToBackend = (state:any) => () => {
    return new Promise(async (resolve, reject) => {
        const {selfie, setSelfie, setFilenameSelfie, card, setCard, setFilenameCard, setMessage, cnpj, setCnpj, lastFour, setLastFour} = state
        try {
            const cleanCnpj = cnpj.replace('.','').replace('.','').replace('/','').replace('-','')
            const resultCnpj = await consultCnpj(cnpj)
            const [status, razao] = resultCnpj
            if(status === 'error'){
                setMessage(FailureMessage(razao))
                reject(razao)
            }else{
                const conditionalEmptyImage = selfie.size === 0 || card.size === 0
                if (conditionalEmptyImage) {
                    setMessage(FailureMessage('Imagem com tamanho vazio.'))
                    reject('Imagem com tamanho vazio.')
                }else{
                    const linkSelfie = await imageToLink(selfie,'card-validation', `${cleanCnpj}-selfie`)
                    const linkCard = await imageToLink(card, 'card-validation', `${cleanCnpj}-card`)
                    if(linkSelfie === 'error' || linkCard === 'error'){
                        setMessage(FailureMessage('Erro ao enviar a imagem.'))
                        reject('Erro ao enviar a imagem.')
                    }else{
                        const arrayToSheet = [cnpj, razao, lastFour, linkCard, linkSelfie]
                        try {
                            await sheet(process.env.SHEET_ID_SUPPORT).write({ values: [arrayToSheet], range: "'Formulário Dupla Validação'!A1" })
                            setLastFour('')
                            setCnpj('')
                            setSelfie('')
                            setCard('')
                            setFilenameSelfie('')
                            setFilenameCard('')
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