export interface BeforeFormat {
    email?: string;
    fname?: string;
    lname?: string;
    insta?: string;
    street?: string;
    number?: string;
    complement?: string;
    cep?: string;
    fone?: string;
}

export interface ToSheet {
    whats: string;
    cnpj: string;
    reason: string;
    fantasia: string;
    neighborhood: string;
    city: string;
    cityState: string;
    valueFromPaymentLink?: string;
    sellerFromPaymentLink?: string;
}

export interface StateSetters {
    setFname: (arg: string) => void;
    setLname: (arg: string) => void;
    setBirth: (arg: string) => void;
    setInsta: (arg: string) => void;
    setCnpj: (arg: string) => void;
    setReason: (arg: string) => void;
    setFantasia: (arg: string) => void;
    setStreet: (arg: string) => void;
    setNumber: (arg: string) => void;
    setComplement: (arg: string) => void;
    setNeighborhood: (arg: string) => void;
    setCep: (arg: string) => void;
    setCity: (arg: string) => void;
    setCityState: (arg: string) => void;
    setFone: (arg: string) => void;
    setWhats: (arg: string) => void;
    setEmail: (arg: string) => void;
    setProductOne: (arg: string) => void;
    setProductOneValue: (arg: string) => void;
    setProductTwo: (arg: string) => void;
    setProductTwoValue: (arg: string) => void;
    setBrandOne: (arg: string) => void;
    setBrandTwo: (arg: string) => void;
    setStore: (arg: string) => void;
    setAgreement: (arg: string) => void;
    setPass: (arg: string) => void;
    setConfirmPass: (arg: string) => void;
    setIsSent: (arg: string) => void;
}

export interface State extends ToSheet, BeforeFormat, StateSetters {
    cnpjValid: boolean;
    pass: string;
    createRollbackItem: Function;
    startRollback: Function;
    history: { pathname: string; search: string }[];
}
