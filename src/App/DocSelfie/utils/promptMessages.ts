import { ZiroPromptMessage } from "ziro-messages";

export const SuccessMessage = (msg:string) =>{
    return new ZiroPromptMessage({
        name: "successMsg",
        type: "success",
        code: "201",
        title: "Enviado com sucesso!",
        userDescription: msg,
        userResolution: "Vamos avaliar as imagens e entraremos em contato.",
        internalDescription: "prompt de sucesso",
        illustration: "paymentSuccess",
        additionalData: undefined,
    });
} 


export const FailureMessage = (msg:string) =>{
    return new ZiroPromptMessage({
        name: "failTest",
        type: "destructive",
        code: "200",
        title: "Ocorreu um erro!",
        userDescription: msg,
        userResolution: "Tente novamente ou contate suporte.",
        internalDescription: "prompt de falha",
        illustration: "errorLoading",
        additionalData: undefined,
    });
}