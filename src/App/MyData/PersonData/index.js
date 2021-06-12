import React, { useState, useContext } from 'react';
import maskInput from '@ziro/mask-input';
import capitalize from '@ziro/capitalize';
import InputEdit from '@bit/vitorbarbosa19.ziro.input-edit';
import { update } from './styles';
import sendToBackend from '../sendToBackend';
import { useUserData } from '../../useInfo';

const PersonData = () => {
  const [{ fname, lname, rg, cpf, nascimento, instagram, whatsapp, email, cnpj, storeownerRow }] = useUserData();
  const [newName, setNewName] = useState(fname !== 'undefined' ? fname : '');
  const [errorName, setErrorName] = useState('');
  const [loadingName, setLoadingName] = useState(false);
  const [newSurname, setNewSurname] = useState(lname !== 'undefined' ? lname : '');
  const [errorSurname, setErrorSurname] = useState('');
  const [loadingSurname, setLoadingSurname] = useState(false);
  const [newBirthDate, setNewBirthDate] = useState(nascimento !== 'undefined' ? nascimento : '');
  const [errorBirthDate, setErrorBirthDate] = useState('');
  const [loadingBirthDate, setLoadingBirthDate] = useState(false);
  const [newInsta, setNewInsta] = useState(instagram !== 'undefined' ? instagram : '');
  const [errorInsta, setErrorInsta] = useState('');
  const [loadingInsta, setLoadingInsta] = useState(false);
  const [newRg, setNewRg] = useState(rg !== 'undefined' ? rg : '');
  const [errorRg, setErrorRg] = useState('');
  const [loadingRg, setLoadingRg] = useState(false);
  const [newCpf, setNewCpf] = useState(cpf !== 'undefined' ? cpf : '');
  const [errorCpf, setErrorCpf] = useState('');
  const [loadingCpf, setLoadingCpf] = useState(false);

  const validateName = () => {
    if (newName !== '') {
      setErrorName('');
      return true;
    }
    setErrorName('Valor inválido');
    return false;
  };
  const validateSurname = () => {
    if (newSurname !== '') {
      setErrorSurname('');
      return true;
    }
    setErrorSurname('Valor inválido');
    return false;
  };
  const validateBirthDate = () => {
    if (
      newBirthDate === '' ||
      /^(?:(?:31(\/)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/.test(
        newBirthDate,
      )
    ) {
      setErrorBirthDate('');
      return true;
    }
    setErrorBirthDate('Data inválida');
    return false;
  };
  const validateCpf = () => {
    if (newCpf === '' || /(^\d{3}\.\d{3}\.\d{3}-\d{2}$)|(^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$)/.test(newCpf)) {
      setErrorCpf('');
      return true;
    }
    setErrorCpf('CPF inválido');
    return false;
  };

  return (
    <div>
      <InputEdit
        name="Nome"
        value={newName}
        onChange={({ target: { value } }) => setNewName(capitalize(value))}
        validateInput={validateName}
        submit={sendToBackend(cnpj, 'B', storeownerRow, { fname: newName }, `${newName} ${newSurname}`, setLoadingName, setErrorName)}
        setError={() => {}}
        error={errorName}
        editable
        isLoading={loadingName}
      />
      <InputEdit
        name="Sobrenome"
        value={newSurname}
        onChange={({ target: { value } }) => setNewSurname(capitalize(value))}
        validateInput={validateSurname}
        submit={sendToBackend(cnpj, 'B', storeownerRow, { lname: newSurname }, `${newName} ${newSurname}`, setLoadingSurname, setErrorSurname)}
        setError={() => {}}
        error={errorSurname}
        editable
        isLoading={loadingSurname}
      />
      <InputEdit
        name="RG"
        value={newRg}
        onChange={({ target: { value } }) => setNewRg(value)}
        validateInput={() => true}
        submit={sendToBackend(cnpj, 'E', storeownerRow, { rg: newRg }, newRg, setLoadingRg, setErrorRg)}
        setError={() => {}}
        error={errorRg}
        editable
        isLoading={loadingRg}
        warning={newRg === '' ? 'preencha p/ pagar pelo app' : ''}
      />
      <InputEdit
        name="CPF"
        value={newCpf}
        onChange={({ target: { value } }) => setNewCpf(maskInput(value, '###.###.###-##', true))}
        validateInput={validateCpf}
        submit={sendToBackend(cnpj, 'F', storeownerRow, { cpf: newCpf }, newCpf, setLoadingCpf, setErrorCpf)}
        setError={() => {}}
        error={errorCpf}
        editable
        isLoading={loadingCpf}
        warning={newCpf === '' ? 'preencha p/ pagar pelo app' : ''}
      />
      <InputEdit
        name="Nascimento"
        value={newBirthDate}
        onChange={({ target: { value } }) => setNewBirthDate(maskInput(value, '##/##/####', true))}
        validateInput={validateBirthDate}
        submit={sendToBackend(cnpj, 'G', storeownerRow, { nascimento: newBirthDate }, newBirthDate, setLoadingBirthDate, setErrorBirthDate)}
        setError={() => {}}
        error={errorBirthDate}
        editable
        isLoading={loadingBirthDate}
        warning={newBirthDate === '' ? 'preencha p/ pagar pelo app' : ''}
      />
      <InputEdit
        name="Instagram da loja"
        value={newInsta}
        onChange={({ target: { value } }) => setNewInsta(value)}
        validateInput={() => true}
        submit={sendToBackend(
          cnpj,
          'H',
          storeownerRow,
          { instagram: newInsta ? newInsta.replace('@', '').trim().toLowerCase() : '' },
          newInsta ? newInsta.replace('@', '').trim().toLowerCase() : '',
          setLoadingInsta,
          setErrorInsta,
        )}
        placeholder="Ex.: ateliederoupa. Não use .com"
        setError={() => {}}
        error={errorInsta}
        editable
        isLoading={loadingInsta}
      />
      <InputEdit
        name="Email"
        value={email || ''}
        onChange={() => {}}
        validateInput={() => {}}
        submit={() => {}}
        setError={() => {}}
        error=""
        editable={false}
        isLoading={false}
      />
      <InputEdit
        name="Whatsapp"
        value={whatsapp || ''}
        onChange={() => {}}
        validateInput={() => {}}
        submit={() => {}}
        setError={() => {}}
        error=""
        editable={false}
        isLoading={false}
      />
      <div style={update}>
        *Para alterar email ou whatsapp,
        <br />
        contate suporte
      </div>
    </div>
  );
};

export default PersonData;
