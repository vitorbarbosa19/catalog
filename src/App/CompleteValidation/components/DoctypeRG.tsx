import React from 'react'
import Form from '@bit/vitorbarbosa19.ziro.form'
import FormInput from '@bit/vitorbarbosa19.ziro.form-input'
import InputText from '@bit/vitorbarbosa19.ziro.input-text'
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown'
import maskInput from '@ziro/mask-input';
import SingleImageUpload from '../../SingleImageUpload/index'
import sendToBackend from '../sendToBackend'
import UploadInstructions from '../../DoubleValidation/components/UploadInstructions'

const DoctypeRG = ({ state }) => {
  const { frontDoc, setFrontDoc, filenameFront, setFilenameFront, backDoc, setBackDoc, filenameBack, setFilenameBack, setMessage, setFilenameCard, filenameCard, setCard, card, setFilenameSelfie, selfie, filenameSelfie, setSelfie, cnpj, setCnpj, lastFour, setLastFour, docType, setDocType } = state
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
        name: 'docType',
        validation: (value: any) => ['RG', 'CNH'].includes(value),
        value: docType,
        message: 'Documento inválido'
    },
    {
      name: 'card',
      validation: (value: any) => value !== undefined && value !== '' && validateFile(value),
      value: card,
      message: 'Formatos válidos: .png, .jpg e .jpeg'
    },
    {
      name: 'frontDoc',
      validation: (value: any) => value !== undefined && value !== '' && validateFile(value),
      value: frontDoc,
      message: 'Formatos válidos: .png, .jpg e .jpeg'
    },
    {
      name: 'backDoc',
      validation: (value: any) => value !== undefined && value !== '' && validateFile(value),
      value: backDoc,
      message: 'Formatos válidos: .png, .jpg e .jpeg'
    },
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
          <FormInput name='docType' label='Tipo de Documento' input={
            <Dropdown
                readOnly={true}
                value={docType}
                onChange={({ target: { value } }) => setDocType(value)}
                list={['RG', 'CNH']}
                placeholder="Escolha um documento"
                onChangeKeyboard={(element: { value: any }) =>
                element ? setDocType(element.value) : null
                }
            />
        } />,
        <FormInput name='frontDoc' label='Foto Frente do RG' input={
          <>
            <UploadInstructions instrucoesText={['Tire uma foto da frente do RG.', 'Esse é o lado onde aparece seu rosto.', 'Procure um ambiente iluminado e aproxime bem a imagem.', 'Siga o exemplo ao lado!']} imageType='rgfront' />
            <SingleImageUpload
              setMessage={setMessage}
              setFile={setFrontDoc}
              filename={filenameFront || ''}
              setFilename={setFilenameFront}
              indexOfFile={0}
            />
          </>
        } />,
        <FormInput name='backDoc' label='Foto Verso do RG' input={
          <>
            <UploadInstructions instrucoesText={['Tire uma foto do verso do RG.', 'Esse é o lado onde aparece seu nome e filiação.', 'Procure um ambiente iluminado e aproxime bem a imagem.', 'Siga o exemplo ao lado!']} imageType='rgback' />
            <SingleImageUpload
              setMessage={setMessage}
              setFile={setBackDoc}
              filename={filenameBack || ''}
              setFilename={setFilenameBack}
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
                indexOfFile={2}
              />
            </>
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
                indexOfFile={3}
              />
            </>
          } />,
        ]}
      />
    </div>
  )
}

export default DoctypeRG
