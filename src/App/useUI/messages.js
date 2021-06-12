import React, { useMemo } from 'react';
import { useMessageModal } from '@bit/vitorbarbosa19.ziro.flow-manager';

export const createMessagesHook = createMessageObject => (...args) => {
    const messages = useMemo(() => createMessageObject(...args), args);
    return useMessageModal(messages);
  },
  PENDING_DOCUMENT = setMessage => ({
    illustration: 'cnhPhoto',
    title: 'Documento do portador',
    message: (
      <label>
        Adicione um documento <strong>com o mesmo nome escrito no cartão.</strong>
      </label>
    ),
    firstButtonAction: () => setTimeout(() => setMessage('DOC_READABILITY'), 100),
  }),
  PENDING_SELFIE = setIsCameraOpen => ({
    illustration: 'selfieOne',
    title: 'Selfie do titular',
    message: (
      <label>
        Tire uma foto <strong>com o mesmo rosto que está no documento.</strong>
      </label>
    ),
    firstButtonAction: () => setIsCameraOpen(true),
  }),
  PENDING_RGV = setMessage => ({
    illustration: 'cnhPhoto',
    title: 'Verso do RG',
    message: <label>Agora adicione o verso do RG que foi mandado anteriormente.</label>,
    firstButtonAction: () => setTimeout(() => setMessage('DOC_READABILITY'), 100),
  }),
  PENDING_RGF = setMessage => ({
    illustration: 'cnhPhoto',
    title: 'Frente do RG',
    message: <label>Agora adicione a frente do RG que foi mandado anteriormente</label>,
    firstButtonAction: () => setTimeout(() => setMessage('DOC_READABILITY'), 100),
  }),
  DOC_READABILITY = setIsCameraOpen => ({
    illustration: 'cnhPhoto',
    title: 'Documento legível',
    message: (
      <label>
        O documento precisa estar legível, <strong>APROXIME bem a câmera e retire do plástico</strong>.
      </label>
    ),
    firstButtonAction: () => setIsCameraOpen(true),
  }),
  MANUAL_APPROVAL = {
    title: 'Aguardando Revisão',
    message: 'Esse cartão está aguardando revisão para ser liberado.',
  },
  NO_CARD = {
    type: 'error',
    title: 'Selecione um cartão',
    message: 'É preciso selecionar um cartão para continuar.',
  },
  DELETE_CARD = (onYes, onNo) => ({
    type: 'error',
    title: 'Excluir cartão',
    message: 'Deseja mesmo excluir o cartão? Será preciso um novo upload de documento e selfie.',
    firstButtonTitle: 'Sim',
    firstButtonAction: onYes,
    secondButtonTitle: 'Não',
    secondButtonAction: onNo,
  }),
  CLOSE_PAYMENT = (setLocation, cartId) => ({
    title: 'Sair',
    type: 'error',
    message: 'Deseja retornar para a página principal? Você perderá o pagamento.',
    firstButtonTitle: 'Sim',
    firstButtonAction: () => setLocation('converge', cartId ? `/carrinho/${cartId}` : `/galeria`),
    secondButtonTitle: 'Não',
  }),
  INVALID_CARD_NUMBER = {
    type: 'error',
    title: 'Atenção',
    message: 'O número de cartão digitado é inválido',
  },
  INVALID_EXPIRY_MONTH = {
    type: 'error',
    title: 'Atenção',
    message: 'O mês de validade está incorreto',
  },
  INVALID_EXPIRY_YEAR = {
    type: 'error',
    title: 'Atenção',
    message: 'O ano de validade está incorreto',
  },
  CARD_EXPIRED = {
    type: 'error',
    title: 'Atenção',
    message: 'Este cartão consta como expirado',
  },
  UNAUTHORIZED_SELLER = {
    type: 'error',
    title: 'Estabelecimento não autorizado',
    message: 'Este estabelecimento não está autorizado a transacionar.',
  },
  CARD_DECLINED = {
    type: 'error',
    title: 'Cartão recusado',
    message: 'Por favor confira os dados corretamente. Se o erro persistir ligue para seu banco para liberar o cartão ou contate o suporte',
  },
  CLOSE_CARD_REGISTRATION = (setLocation, cartId) => ({
    type: 'error',
    title: 'Sair',
    message: 'É preciso concluir o upload de documento e selfie para pagar. Deseja encerrar?',
    firstButtonTitle: 'Sim',
    firstButtonAction: () => setLocation('converge', cartId ? `/carrinho/${cartId}` : `/galeria`),
    secondButtonTitle: 'Não',
  }),
  EXPIRED_DOC = {
    type: 'error',
    title: 'Documento vencido',
    message: 'O documento enviado possui mais de 10 anos, por favor envie um documento mais recente.',
  },
  INVALID_SELLER = {
    type: 'error',
    title: 'Vendedor não encontrado',
    message: 'Algumas informações não puderam ser carregadas. Verifique sua conexão e contate o suporte.',
  },
  NO_PHOTO = {
    type: 'error',
    title: 'Nenhuma foto',
    message: 'É necessário enviar uma foto para a análise',
  },
  NO_INFO = {
    type: 'error',
    title: 'Nenhuma informação',
    message: 'A imagem não contém nenhuma informação válida, por favor envie uma nova imagem do documento',
  },
  NOT_HOLDER_DOCUMENT = {
    type: 'error',
    title: 'Documento inválido',
    message: 'O documento enviado não pertence ao portador do cartão, por favor envie o documento do portador',
  },
  REJECTED_DOC = {
    type: 'error',
    title: 'Cartão reprovado',
    message: 'Esse cartão não pode ser aprovado devido a inconsistências nos dados enviados.',
  },
  TIMEOUT = {
    type: 'error',
    title: 'Requisição cancelada',
    message: 'Verifique sua conexão com a internet.',
  },
  NO_FACE = {
    type: 'error',
    title: 'Documento inválido',
    message: 'O documento enviado não possui um rosto, envie um documento com foto.',
  },
  SAME_DOC_RGF = {
    type: 'error',
    title: 'Mesmo documento',
    message: 'Envie uma foto do verso do RG.',
  },
  SAME_DOC_RGV = {
    type: 'error',
    title: 'Mesmo documento',
    message: 'Envie uma foto da frente do RG.',
  },
  REJECTED_SELFIE = {
    type: 'error',
    title: 'Selfie reprovada',
    message: 'Essa selfie não pode ser aprovada, os motivos podem ser má qualidade da imagem ou a foto de uma pessoa diferente do documento.',
  },
  PAYMENT_SUCCESS = (setCardId, setLocation) => ({
    title: 'Processando!',
    type: 'success',
    message: 'Acompanhe o status pelo menu Pagamentos',
    firstButtonAction: () => {
      setCardId();
      setLocation('converge', '/pagamentos');
    },
    firstButtonTitle: 'Ver Pagamentos',
    illustration: 'paymentSuccess',
  }),
  PAYMENT_FAILURE_DEFAULT = {
    title: 'Erro no envio!',
    type: 'error',
    message: 'Tente novamente ou contate o suporte.',
  },
  PAYMENT_FAILURE_CUSTOM = message => ({
    title: 'Erro no envio!',
    type: 'error',
    message,
  }),
  ZOOP_PROBLEM = {
    type: 'error',
    title: 'Erro de servidor',
    message: 'Não foi possível se conectar com os servidores do nossso parceiro. Tente novamente',
  };
