import React from 'react'
import maskInput from '@ziro/mask-input';
import Form from '@bit/vitorbarbosa19.ziro.form'
import FormInput from '@bit/vitorbarbosa19.ziro.form-input'
import InputText from '@bit/vitorbarbosa19.ziro.input-text'
import SingleImageUpload from '../../SingleImageUpload/index'
import UploadInstructions from './UploadInstructions'
import sendToBackend from '../sendToBackend'

const DoctypeRG = ({ state }) => {
  const { setMessage, setFilenameCard, filenameCard, setCard, card, setFilenameSelfie, selfie, filenameSelfie, setSelfie, cnpj, setCnpj, lastFour, setLastFour } = state
  const validateFile = file => {
    const validTypes = ['image/jpeg', 'image/png'];
    const { name, type } = file;
    return /(\.jpg|\.jpeg|\.png)$/.test(name.toLowerCase()) && validTypes.includes(type);
  };
  const validations = [
    {
      name: 'cnpj',
      validation: (value: string) => value.match(/\d{2}[.]\d{3}[.]\d{3}[\/]\d{4}[\-]\d{2}/gm),
      value: cnpj,
      message: 'CNPJ inválido'
    },
    {
      name: 'lastFour',
      validation: (value: any) => value.match(/\d{4}/gm),
      value: lastFour,
      message: 'Dígitos inválidos'
    },
    {
      name: 'selfie',
      validation: (value: any) => value !== undefined && value !== '' && validateFile(value),
      value: selfie,
      message: 'Formatos válidos: .png, .jpg e .jpeg'
    },
    {
      name: 'card',
      validation: (value: any) => value !== undefined && value !== '' && validateFile(value),
      value: card,
      message: 'Formatos válidos: .png, .jpg e .jpeg'
    }
  ]
  return (
    <div>
      <Form
        validations={validations}
        sendToBackend={sendToBackend ? sendToBackend(state) : () => null}
        inputs={[
          <FormInput name='cnpj' label='CNPJ' input={
            <InputText
              value={cnpj}
              onChange={({ target: { value } }) => setCnpj(maskInput(value, '##.###.###/####-##', true))}
              placeholder='Digite seu cnpj'
              inputMode='numeric'
            />
          } />,
          <FormInput name='lastFour' label='Últimos 4 dígitos do cartão' input={
            <InputText
              value={lastFour}
              onChange={({ target: { value } }) => setLastFour(maskInput(value, '####', true))}
              placeholder='Digite os 4 últimos dígitos'
              inputMode='numeric'
            />
          } />,
          <FormInput name='card' label='Foto do cartão' input={
            <>
              <UploadInstructions instrucoesText={['Tire uma foto do cartão de crédito.', 'Cubra data de validade e CVV.', 'Mostre apenas os quatro últimos dígitos do cartão e o nome do titular.', 'Siga o exemplo ao lado!']} imageType='card' />
              <SingleImageUpload
                setMessage={setMessage}
                setFile={setCard}
                filename={filenameCard || ''}
                setFilename={setFilenameCard}
                indexOfFile={1}
              />
            </>
          } />,
          <FormInput name='selfie' label='Rosto do titular com RG' input={
            <>
              <UploadInstructions instrucoesText={['Tire uma foto do seu rosto, segurando o RG.', 'Procure um ambiente iluminado e aproxime bem a imagem.', 'Não se esqueça de retirar acessórios, como óculos escuros e bonés.', 'Siga o exemplo ao lado!']} imageType='selfierg' />
              <SingleImageUpload
                setMessage={setMessage}
                setFile={setSelfie}
                filename={filenameSelfie || ''}
                setFilename={setFilenameSelfie}
                indexOfFile={0}
              />
            </>
          } />,
        ]}
      />
    </div>
  )
}

export default DoctypeRG
