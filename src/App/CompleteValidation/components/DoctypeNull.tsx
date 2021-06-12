import React from 'react'
import maskInput from '@ziro/mask-input';
import FormInput from '@bit/vitorbarbosa19.ziro.form-input'
import Form from '@bit/vitorbarbosa19.ziro.form'
import InputText from '@bit/vitorbarbosa19.ziro.input-text'
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown'

const DoctypeNull = ({state}) => {
    const {cnpj, setCnpj, docType, setDocType} = state
    const validations = [
        {
            name: 'cnpj',
            validation: (value: String) => value.match(/\d{2}[.]\d{3}[.]\d{3}[\/]\d{4}[\-]\d{2}/gm),
            value: cnpj,
            message: 'CNPJ inválido'
        },
        {
            name: 'docType',
            validation: (value: any) => ['RG', 'CNH'].includes(value),
            value: docType,
            message: 'Documento inválido'
        },
    ]
    return (
        <Form
            validations={validations}
            sendToBackend={() => null}
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
                } />
            ]}
        />
    )
}

export default DoctypeNull