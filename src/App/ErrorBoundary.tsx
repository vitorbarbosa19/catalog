import React from "react";
import * as Sentry from "@sentry/react";
import ErrorMessage from "@bit/vitorbarbosa19.ziro.error-boundary/dist/ErrorBoundary/ErrorMessage";

const config: Sentry.ReportDialogOptions = {
    title: "Parece que ocorreu um erro inesperado",
    subtitle: "Nosso time foi notificado e está trabalhando para corrigí-lo.",
    subtitle2: "Caso queira nos ajudar, por favor preencha as informações abaixo.",
    labelName: "Nome",
    labelClose: "Fechar",
    labelComments: "O que aconteceu?",
    labelSubmit: "Enviar",
    lang: "pt-BR",
    errorGeneric: "Ocorreu um erro desconhecido ao enviar o formulário, por favor tente novamente.",
    errorFormEntry: "Alguns campos contêm dados inválidos, por favor revise as informações e tente novamente",
    successMessage: "As informações foram enviadas, obrigado por nos ajudar!",
};

const ErrorBoundary: React.FC = ({ children }) => {
    return (
        <Sentry.ErrorBoundary fallback={ErrorMessage} showDialog dialogOptions={config}>
            {children}
        </Sentry.ErrorBoundary>
    );
};

export default ErrorBoundary;
