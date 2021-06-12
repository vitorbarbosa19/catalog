import React, { useState, useCallback, useMemo } from "react";
import FlowForm from "@bit/vitorbarbosa19.ziro.flow-form";
import FormInput from "@bit/vitorbarbosa19.ziro.form-input";
import InputText from "@bit/vitorbarbosa19.ziro.input-text";
import {
  useHeader,
  useMessageModal,
  useAnimatedLocation,
} from "@bit/vitorbarbosa19.ziro.flow-manager";
import Header from "../Header";
import { db } from "../../Firebase";
import { useUserData } from "../useInfo";

const cpfMask = (text) => {
  const _text = text.replace(/[^0-9]/g, "");
  const first = _text.slice(0, 3);
  const second = _text.slice(3, 6);
  const third = _text.slice(6, 9);
  const last = _text.slice(9, 11);
  let newText = first;
  if (second !== "") newText += `.${second}`;
  if (third !== "") newText += `.${third}`;
  if (last !== "") newText += `-${last}`;
  return newText;
};

const birthdateMask = (text) => {
  const _text = text.replace(/[^0-9]/g, "");
  const first = _text.slice(0, 2);
  const second = _text.slice(2, 4);
  const third = _text.slice(4, 6);
  let newText = first;
  if (second !== "") newText += `/${second}`;
  if (third !== "") newText += `/${third}`;
  return newText;
};

export default ({ id }) => {
  const [
    { buyerStoreownerId, cpf: oldCpf, nascimento: oldNascimento },
  ] = useUserData();
  const [cpf, setCpf] = useState("");
  const [nascimento, setNascimento] = useState("");

  useHeader(<Header title="Informações adicionais" />);

  const setMessage = useMessageModal();

  const [, setLocation] = useAnimatedLocation();

  const next = useCallback(async () => {
    try {
      const docRef = db.collection("storeowners").doc(buyerStoreownerId);
      if (cpf !== "") await docRef.set({ cpf }, { merge: true });
      if (nascimento !== "") await docRef.set({ nascimento }, { merge: true });
      setLocation("goLeft", `/pagamento/${id}/escolher-cartao`);
    } catch (error) {
      setMessage(error);
    }
  }, [cpf, nascimento, setMessage]);

  const previous = useCallback(async () => {
    setLocation("goRight", `/pagamento/${id}/sumario`);
  }, [id, setLocation]);

  const inputs = useMemo(
    () => [
      ...(oldCpf && oldCpf !== ""
        ? []
        : [
            <FormInput
              name="cpf"
              label="CPF"
              input={
                <InputText
                  value={cpf}
                  onChange={({ target: { value } }) => setCpf(cpfMask(value))}
                  placeholder="000.000.000-00"
                />
              }
            />,
          ]),
      ...(oldNascimento && oldNascimento !== ""
        ? []
        : [
            <FormInput
              name="birthdate"
              label="Data de nascimento"
              input={
                <InputText
                  value={nascimento}
                  onChange={({ target: { value } }) =>
                    setNascimento(birthdateMask(value))
                  }
                  placeholder="00/00/00"
                />
              }
            />,
          ]),
    ],
    [oldCpf, oldNascimento, cpf, setCpf, nascimento, setNascimento]
  );

  const validations = useMemo(
    () => [
      ...(oldCpf && oldCpf !== ""
        ? []
        : [
            {
              name: "cpf",
              validation: (value) =>
                !!value && value.replace(/[^0-9]/g, "").length === 11,
              value: cpf,
              message: cpf.length
                ? "Verifique as informações"
                : "Campo obrigatório",
            },
          ]),
      ...(oldNascimento && oldNascimento !== ""
        ? []
        : [
            {
              name: "birthdate",
              validation: (value) =>
                !!value && value.replace(/[^0-9]/g, "").length === 6,
              value: nascimento,
              message: nascimento.length
                ? "Verifique as informações"
                : "Campo obrigatório",
            },
          ]),
    ],
    [oldCpf, oldNascimento, cpf, nascimento]
  );

  return (
    <>
      <div style={{ display: "grid", padding: "10px" }}>
        <label style={{ textAlign: "center" }}>
          Para comprar com a Ziro precisamos de algumas informações adicionais.
        </label>
      </div>
      <FlowForm
        next={next}
        previous={previous}
        validations={validations}
        inputs={inputs}
      />
    </>
  );
};
