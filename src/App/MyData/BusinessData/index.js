import React, { useState, useContext } from 'react';
import maskInput from '@ziro/mask-input';
import InputEdit from '@bit/vitorbarbosa19.ziro.input-edit';
import { update } from './styles';
import sendToBackend from '../sendToBackend';
import { useUserData } from '../../useInfo';

const BusinessData = () => {
  const [
    {
      fone,
      cnpj,
      razao,
      fantasia,
      endereco,
      bairro,
      cep,
      cidade,
      estado,
      ie,
      entrega,
      bairroEntrega,
      cepEntrega,
      cidadeEntrega,
      estadoEntrega,
      storeownerRow,
    },
  ] = useUserData();
  const partAddress = entrega && entrega !== 'undefined' ? entrega.split(', ') : [];
  const [newIe, setNewIe] = useState(ie !== 'undefined' ? ie : '');
  const [errorIe, setErrorIe] = useState('');
  const [loadingIe, setLoadingIe] = useState(false);
  const [newFone, setNewFone] = useState(fone !== 'undefined' ? fone : '');
  const [errorFone, setErrorFone] = useState('');
  const [loadingFone, setLoadingFone] = useState(false);
  const [newStreet, setNewStreet] = useState(partAddress[0] ? partAddress[0] : '');
  const [errorStreet, setErrorStreet] = useState('');
  const [loadingStreet, setLoadingStreet] = useState(false);
  const [newNumber, setNewNumber] = useState(partAddress[1] ? partAddress[1] : '');
  const [errorNumber, setErrorNumber] = useState('');
  const [loadingNumber, setLoadingNumber] = useState(false);
  const [newComplement, setNewComplement] = useState(partAddress.length === 3 ? partAddress[2] : '');
  const [errorComplement, setErrorComplement] = useState('');
  const [loadingComplement, setLoadingComplement] = useState(false);
  const [newNeighborhood, setNewNeighborhood] = useState(bairroEntrega !== 'undefined' ? bairroEntrega : '');
  const [errorNeighborhood, setErrorNeighborhood] = useState('');
  const [loadingNeighborhood, setLoadingNeighborhood] = useState(false);
  const [newCep, setNewCep] = useState(cepEntrega !== 'undefined' ? cepEntrega : '');
  const [errorCep, setErrorCep] = useState('');
  const [loadingCep, setLoadingCep] = useState(false);
  const [newCity, setNewCity] = useState(cidadeEntrega !== 'undefined' ? cidadeEntrega : '');
  const [errorCity, setErrorCity] = useState('');
  const [loadingCity, setLoadingCity] = useState(false);
  const [newState, setNewState] = useState(estadoEntrega !== 'undefined' ? estadoEntrega : '');
  const [errorState, setErrorState] = useState('');
  const [loadingState, setLoadingState] = useState(false);
  const statesList = [
    'AC',
    'AL',
    'AP',
    'AM',
    'BA',
    'CE',
    'DF',
    'ES',
    'GO',
    'MA',
    'MT',
    'MS',
    'MG',
    'PA',
    'PB',
    'PR',
    'PE',
    'PI',
    'RJ',
    'RN',
    'RS',
    'RO',
    'RR',
    'SC',
    'SP',
    'SE',
    'TO',
  ];

  const validateFone = () => {
    if (
      newFone === '' ||
      (newFone.length <= 14 && /(^\(\d{2}\) \d{4}\-\d{4}$)/.test(newFone)) ||
      (newFone.length === 15 && /(^\(\d{2}\) \d{5}\-\d{4}$)/.test(newFone))
    ) {
      setErrorFone('');
      return true;
    }
    setErrorFone('Telefone inválido');
    return false;
  };
  const validateCep = () => {
    if (newCep === '' || /(^\d{2}\.\d{3}\-\d{3}$)/.test(newCep)) {
      setErrorCep('');
      return true;
    }
    setErrorCep('CEP inválido');
    return false;
  };
  const validateState = () => {
    if (newState === '' || statesList.includes(newState)) {
      setErrorState('');
      return true;
    }
    setErrorState('Valor inválido');
    return false;
  };

  return (
    <div>
      <InputEdit
        name="CNPJ"
        value={cnpj || ''}
        onChange={() => {}}
        validateInput={() => {}}
        submit={() => {}}
        setError={() => {}}
        error=""
        editable={false}
        isLoading={false}
      />
      <InputEdit
        name="Razão Social"
        value={razao || ''}
        onChange={() => {}}
        validateInput={() => {}}
        submit={() => {}}
        setError={() => {}}
        error=""
        editable={false}
        isLoading={false}
      />
      <InputEdit
        name="Nome Fantasia"
        value={fantasia || ''}
        onChange={() => {}}
        validateInput={() => {}}
        submit={() => {}}
        setError={() => {}}
        error=""
        editable={false}
        isLoading={false}
      />
      <InputEdit
        name="Inscrição Estadual"
        value={newIe}
        onChange={({ target: { value } }) => setNewIe(maskInput(value, '#############', true))}
        validateInput={() => true}
        submit={sendToBackend(cnpj, 'J', storeownerRow, { ie: newIe }, newIe, setLoadingIe, setErrorIe)}
        setError={() => {}}
        error={errorIe}
        editable
        isLoading={loadingIe}
      />
      <InputEdit
        name="Telefone"
        value={newFone}
        onChange={({ target: { value } }) => {
          const mask = value.length <= 14 ? '(##) ####-####' : '(##) #####-####';
          setNewFone(maskInput(value, mask, true));
        }}
        validateInput={validateFone}
        submit={sendToBackend(cnpj, 'R', storeownerRow, { fone: newFone }, newFone, setLoadingFone, setErrorFone)}
        setError={() => {}}
        error={errorFone}
        editable
        isLoading={loadingFone}
      />
      <InputEdit
        name="Rua"
        value={endereco ? endereco.split(', ')[0] : ''}
        onChange={() => {}}
        validateInput={() => {}}
        submit={() => {}}
        setError={() => {}}
        error=""
        editable={false}
        isLoading={false}
      />
      <InputEdit
        name="Número"
        value={endereco ? endereco.split(', ')[1] : ''}
        onChange={() => {}}
        validateInput={() => {}}
        submit={() => {}}
        setError={() => {}}
        error=""
        editable={false}
        isLoading={false}
      />
      <InputEdit
        name="Complemento"
        value={endereco && endereco.split(', ')[2] ? endereco.split(', ')[2] : ''}
        onChange={() => {}}
        validateInput={() => {}}
        submit={() => {}}
        setError={() => {}}
        error=""
        editable={false}
        isLoading={false}
      />
      <InputEdit
        name="Bairro"
        value={bairro || ''}
        onChange={() => {}}
        validateInput={() => {}}
        submit={() => {}}
        setError={() => {}}
        error=""
        editable={false}
        isLoading={false}
      />
      <InputEdit
        name="Cep"
        value={cep || ''}
        onChange={() => {}}
        validateInput={() => {}}
        submit={() => {}}
        setError={() => {}}
        error=""
        editable={false}
        isLoading={false}
      />
      <InputEdit
        name="Cidade"
        value={cidade || ''}
        onChange={() => {}}
        validateInput={() => {}}
        submit={() => {}}
        setError={() => {}}
        error=""
        editable={false}
        isLoading={false}
      />
      <InputEdit
        name="Estado"
        value={estado || ''}
        onChange={() => {}}
        validateInput={() => {}}
        submit={() => {}}
        setError={() => {}}
        error=""
        editable={false}
        isLoading={false}
      />
      <InputEdit
        name="Rua (entrega)"
        value={newStreet}
        onChange={({ target: { value } }) => setNewStreet(value.toUpperCase())}
        validateInput={() => true}
        submit={sendToBackend(
          cnpj,
          'X',
          storeownerRow,
          {
            entrega: newComplement
              ? (newStreet ? `${newStreet}, ` : '') + (newNumber ? `${newNumber}, ` : '') + newComplement
              : (newStreet ? `${newStreet}, ` : '') + (newNumber ? `${newNumber}` : ''),
          },
          newComplement
            ? (newStreet ? `${newStreet}, ` : '') + (newNumber ? `${newNumber}, ` : '') + newComplement
            : (newStreet ? `${newStreet}, ` : '') + (newNumber ? `${newNumber}` : ''),
          setLoadingStreet,
          setErrorStreet,
        )}
        setError={() => {}}
        error={errorStreet}
        editable
        isLoading={loadingStreet}
      />
      <InputEdit
        name="Número (entrega)"
        value={newNumber}
        onChange={({ target: { value } }) => setNewNumber(value)}
        validateInput={() => true}
        submit={sendToBackend(
          cnpj,
          'X',
          storeownerRow,
          {
            entrega: newComplement
              ? (newStreet ? `${newStreet}, ` : '') + (newNumber ? `${newNumber}, ` : '') + newComplement
              : (newStreet ? `${newStreet}, ` : '') + (newNumber ? `${newNumber}` : ''),
          },
          newComplement
            ? (newStreet ? `${newStreet}, ` : '') + (newNumber ? `${newNumber}, ` : '') + newComplement
            : (newStreet ? `${newStreet}, ` : '') + (newNumber ? `${newNumber}` : ''),
          setLoadingNumber,
          setErrorNumber,
        )}
        setError={() => {}}
        error={errorNumber}
        editable
        isLoading={loadingNumber}
      />
      <InputEdit
        name="Complemento (entrega)"
        value={newComplement}
        onChange={({ target: { value } }) => setNewComplement(value.toUpperCase())}
        validateInput={() => true}
        submit={sendToBackend(
          cnpj,
          'X',
          storeownerRow,
          {
            entrega: newComplement
              ? (newStreet ? `${newStreet}, ` : '') + (newNumber ? `${newNumber}, ` : '') + newComplement
              : (newStreet ? `${newStreet}, ` : '') + (newNumber ? `${newNumber}` : ''),
          },
          newComplement
            ? (newStreet ? `${newStreet}, ` : '') + (newNumber ? `${newNumber}, ` : '') + newComplement
            : (newStreet ? `${newStreet}, ` : '') + (newNumber ? `${newNumber}` : ''),
          setLoadingComplement,
          setErrorComplement,
        )}
        setError={() => {}}
        error={errorComplement}
        editable
        isLoading={loadingComplement}
      />
      <InputEdit
        name="Bairro (entrega)"
        value={newNeighborhood || ''}
        onChange={({ target: { value } }) => setNewNeighborhood(value.toUpperCase())}
        validateInput={() => true}
        submit={sendToBackend(
          cnpj,
          'Y',
          storeownerRow,
          { bairroEntrega: newNeighborhood },
          newNeighborhood,
          setLoadingNeighborhood,
          setErrorNeighborhood,
        )}
        setError={() => {}}
        error={errorNeighborhood}
        editable
        isLoading={loadingNeighborhood}
      />
      <InputEdit
        name="Cep (entrega)"
        value={newCep}
        onChange={({ target: { value } }) => setNewCep(maskInput(value, '##.###-###', true))}
        validateInput={validateCep}
        submit={sendToBackend(cnpj, 'Z', storeownerRow, { cepEntrega: newCep }, newCep, setLoadingCep, setErrorCep)}
        setError={() => {}}
        error={errorCep}
        editable
        isLoading={loadingCep}
      />
      <InputEdit
        name="Cidade (entrega)"
        value={newCity}
        onChange={({ target: { value } }) => setNewCity(value.toUpperCase())}
        validateInput={() => true}
        submit={sendToBackend(cnpj, 'AA', storeownerRow, { cidadeEntrega: newCity }, newCity, setLoadingCity, setErrorCity)}
        setError={() => {}}
        error={errorCity}
        editable
        isLoading={loadingCity}
      />
      <InputEdit
        name="Estado (entrega)"
        value={newState}
        onChange={({ target: { value } }) => setNewState(maskInput(value.toUpperCase(), '##', false))}
        validateInput={validateState}
        submit={sendToBackend(cnpj, 'AB', storeownerRow, { estadoEntrega: newState }, newState, setLoadingState, setErrorState)}
        setError={() => {}}
        error={errorState}
        editable
        isLoading={loadingState}
      />
      <div style={update}>
        *Para alterar cnpj, razão, nome fantasia <br />
        ou endereço, contate suporte
      </div>
    </div>
  );
};

export default BusinessData;
