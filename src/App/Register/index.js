/* eslint-disable */
import React, { useState, useEffect, useMemo } from "react";
import { useHeader, useFooter, useAnimatedLocation, useHistory } from "@bit/vitorbarbosa19.ziro.flow-manager";
import { Link } from "wouter";
import maskInput from "@ziro/mask-input";
import capitalize from "@ziro/capitalize";
import Spinner from "@bit/vitorbarbosa19.ziro.spinner";
import Error from "@bit/vitorbarbosa19.ziro.error";
import Header from "@bit/vitorbarbosa19.ziro.header";
import Form from "@bit/vitorbarbosa19.ziro.form";
import FormInput from "@bit/vitorbarbosa19.ziro.form-input";
import InputText from "@bit/vitorbarbosa19.ziro.input-text";
import InputPhone from "@bit/vitorbarbosa19.ziro.input-phone";
import InputEmail from "@bit/vitorbarbosa19.ziro.input-email";
import Footer from "@bit/vitorbarbosa19.ziro.footer";
import GetCnpj from "@bit/vitorbarbosa19.ziro.get-cnpj";
import { containerWithPadding } from "@ziro/theme";
import { useMessage } from "@bit/vitorbarbosa19.ziro.message-modal";
import Button from "@bit/vitorbarbosa19.ziro.button";
import { loginText } from "../Payment/Resume/styles";
import { sendToBackend } from "./sendToBackend/index.ts";
import fetch from "./fetch";
import { welcome, marker, info, login } from "./styles";
import { supportPhoneNumber } from "../utils";
import useRollback from "../utils/useRollback/index";

const Register = ({ login: _login = undefined, paymentOrigin = false }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [cnpjValid, setCnpjValid] = useState(false);
  const [storeowners, setStoreowners] = useState([]);
  const [valueFromPaymentLink, setValueFromPaymentLink] = useState("");
  const [sellerFromPaymentLink, setSellerFromPaymentLink] = useState("");
  // form fields
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [birth, setBirth] = useState("");
  const [insta, setInsta] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [reason, setReason] = useState("");
  const [fantasia, setFantasia] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [cep, setCep] = useState("");
  const [city, setCity] = useState("");
  const [cityState, setCityState] = useState("");
  const [fone, setFone] = useState("");
  const [whats, setWhats] = useState("");
  const [email, setEmail] = useState("");
  const [productOne, setProductOne] = useState("");
  const [productOneValue, setProductOneValue] = useState("");
  const [productTwo, setProductTwo] = useState("");
  const [productTwoValue, setProductTwoValue] = useState("");
  const [brandOne, setBrandOne] = useState("");
  const [brandTwo, setBrandTwo] = useState("");
  const [store, setStore] = useState("");
  const [agreement, setAgreement] = useState("");
  const [isSent, setIsSent] = useState("");

  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [, setLocation] = useAnimatedLocation();

  const validCnaes = [
    "10.91-1-02",
    "14.12-6-01",
    "14.12-6-02",
    "14.12-6-03",
    "14.13-4-03",
    "15.31-9-01",
    "20.62-2-00",
    "26.52-3-00",
    "46.16-8-00",
    "46.42-7-01",
    "46.49-4-10",
    "46.49-4-99",
    "47.12-1-00",
    "47.21-1-02",
    "47.59-8-99",
    "47.63-6-01",
    "47.63-6-02",
    "47.63-6-03",
    "47.63-6-04",
    "47.63-6-05",
    "47.81-4-00",
    "47.83-1-01",
    "47.83-1-02",
    "47.89-0-01",
    "47.89-0-99",
    "66.11-8-03",
    "74.10-2-03",
    "74.90-1-99",
    "77.23-3-00",
    "85.99-6-99",
    "96.02-5-01",
    "96.02-5-02",
    "47.55-5-02",
    "47.82-2-01",
    "47.55-5-01",
    "77.32-2-01"
  ];
  const cnpjUrl = process.env.CNPJ_URL || "";
  const cnpjToken = process.env.CNPJ_TOKEN || "";

  const bodyTooltipCnpj = useMemo(() => {
    return (
      <>
        <p style={{ marginTop: "5px" }}>O CNAE é o ramo de atividade de seu CNPJ. Verifique abaixo.</p>
        <br />
        <Button type="link" navigate={() => setLocation("goLeft", "/cnaes-validos")} cta="Ver CNAEs Válidos" />
      </>
    );
  });

  const history = useHistory();

  const { startRollback, createRollbackItem, cleanRollback } = useRollback();

  const setState = {
    setFname,
    setLname,
    setBirth,
    setInsta,
    setCnpj,
    setReason,
    setFantasia,
    setStreet,
    setNumber,
    setComplement,
    setNeighborhood,
    setCep,
    setCity,
    setCityState,
    setFone,
    setWhats,
    setEmail,
    setProductOne,
    setProductOneValue,
    setProductTwo,
    setProductTwoValue,
    setBrandOne,
    setBrandTwo,
    setStore,
    setAgreement,
    setPass,
    setConfirmPass,
    setIsSent,
    cnpjUrl,
    cnpjToken,
    createRollbackItem,
  };
  const state = {
    fname,
    lname,
    birth,
    insta,
    cnpj,
    reason,
    fantasia,
    street,
    number,
    complement,
    neighborhood,
    cep,
    city,
    cityState,
    fone,
    whats,
    email,
    productOne,
    productOneValue,
    productTwo,
    productTwoValue,
    brandOne,
    brandTwo,
    store,
    agreement,
    pass,
    confirmPass,
    valueFromPaymentLink,
    sellerFromPaymentLink,
    ...setState,
    cnpjValid,
    history,
  };
  useEffect(() => fetch(setIsLoading, setIsError, setStoreowners, history, setValueFromPaymentLink, setSellerFromPaymentLink), []);

  const setMessage = useMessage();

  const validations = [
    {
      name: "fname",
      validation: (value) => !!value,
      value: fname,
      message: "Campo obrigatório",
    },
    {
      name: "lname",
      validation: (value) => !!value,
      value: lname,
      message: "Campo obrigatório",
    },
    {
      name: "whats",
      validation: (value) => value.length >= 14,
      value: whats,
      message: "Formato inválido",
    },
    {
      name: "email",
      validation: (value) => /^\S+@\S+\.\S+$/g.test(value), // tests for pattern a@b.c
      value: email,
      message: "Formato inválido",
    },
    {
      name: "pass",
      validation: (value) => !/^.{0,5}$/g.test(value), // tests for min length of 6 char
      value: pass,
      message: "Mínimo 6 caracteres",
    },
    {
      name: "confirmPass",
      validation: (value) => value === pass,
      value: confirmPass,
      message: "Deve ser igual ao campo anterior",
    },
  ];
  useHeader(null);
  useFooter(null);
  const backPath = useMemo(() => (history[history.length - 2] ? history[history.length - 2].pathname : "/login"), [history].pathname);
  useEffect(() => {
    if (isSent) {
      setIsSent("");
      setLocation("goLeft", "/sucesso-cadastrar");
    }
  }, [isSent]);
  if (isLoading)
    return (
      <div style={{ display: "grid" }}>
        <Spinner size="5rem" />
      </div>
    );

  if (isError) {
    return <Error />;
  }
  return (
    <div style={containerWithPadding}>
      {/* eslint-disable-next-line no-nested-ternary */}
      {paymentOrigin ? (
        _login ? (
          <Button style={loginText} type="link" cta="Já tem conta? Faça login." navigate={_login} />
        ) : (
          <Link style={login} to="/login">
            Já tem conta? Faça login.
          </Link>
        )
      ) : (
        <Header type="icon-link" title="Cadastro" icon="back" navigateTo={backPath} />
      )}

      <h1 style={welcome}>
        Crie sua conta de <span style={marker}>revendedor</span>,
            </h1>

      {paymentOrigin ? (
        <label style={info}>Pague suas compras com rapidez e segurança e conte com todo o suporte da Ziro.&nbsp;</label>
      ) : (
        <label style={info}>
          veja preços, variações e compre qualquer peça do catálogo.&nbsp;
          <Link style={login} to="/login">
            Já tem conta? Faça login.
                    </Link>
        </label>
      )}

      <GetCnpj
        cnpj={cnpj}
        setState={setState}
        baseCnpj={storeowners}
        setCnpjValid={setCnpjValid}
        validCnaes={validCnaes}
        tooltip
        tooltipTitle="Necessário CNAE válido"
        tooltipBody={bodyTooltipCnpj}
      />
      <Form
        validations={validations}
        buttonName="Cadastrar"
        sendToBackend={sendToBackend(state, setMessage)}
        inputs={[
          <FormInput
            name="fname"
            label="Nome"
            input={
              <InputText
                value={fname}
                onChange={({ target: { value } }) => setFname(capitalize(value))}
                placeholder="Nome do revendedor"
              />
            }
          />,
          <FormInput
            name="lname"
            label="Sobrenome"
            input={
              <InputText
                value={lname}
                onChange={({ target: { value } }) => setLname(capitalize(value))}
                placeholder="Sobrenome do revendedor"
              />
            }
          />,
          <FormInput name="whats" label="Whatsapp" input={<InputPhone value={whats} setValue={setWhats} />} />,
          <FormInput name="email" label="Email" input={<InputEmail value={email} setValue={setEmail} />} />,
          <FormInput
            name="pass"
            label="Senha"
            input={
              <InputText
                value={pass}
                onChange={({ target: { value } }) => setPass(value)}
                placeholder="Mínimo 6 caracteres"
                type="password"
              />
            }
          />,
          <FormInput
            name="confirmPass"
            label="Confirme a senha"
            input={
              <InputText
                value={confirmPass}
                onChange={({ target: { value } }) => setConfirmPass(value)}
                placeholder="Igual ao campo anterior"
                type="password"
              />
            }
          />,
        ]}
      />
      <Footer phone={supportPhoneNumber} />
    </div>
  );
};

export default Register;
