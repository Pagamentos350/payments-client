import { validarCPF } from "./textValidation";

export const firebaseAuthErrorsHandler = (message: string): string => {
  return (
    {
      INVALID_LOGIN_CREDENTIALS: "Credenciais Não Encontradas",
      TOO_MANY_ATTEMPTS_TRY_LATER:
        "Muitas Tentativas tente novamente mais tarde",
      MISSING_EMAIL: "Por favor, preencha o campo de email",
    }?.[message?.split(" ")?.[0]] || "Erro Desconhecido"
  );
};

interface args {
  [key: string]: any;
}

export const formErrorsHandler = ({
  email,
  password,
  cadastroDePessoaFisica,
  cpf,
  registroGeral,
  rg,
  contato,
  telefone,
}: args): string | null => {
  if (password && password.length < 6) {
    return "As senhas precisma de no mínimo 6 caracteres";
  }
  if (contato && contato.length < 11) {
    return "O contato precisar ter 11 numeros contando com o DDD";
  }
  if (cadastroDePessoaFisica || cpf) {
    if (cadastroDePessoaFisica?.length !== 11 && cpf?.length !== 11) {
      return "CPF precisa ter 11 digitos";
    }
    // if (!validarCPF(cadastroDePessoaFisica || cpf)) {
    //   return "CPF inválido";
    // }
  }
  if (
    (rg && (rg.length > 9 || rg.length < 7))
  ) {
    return "RG precisa ter entre 7 e 9 digitos";
  }

  if (telefone && telefone.length !== 11) {
    return "Contato precisa ter 11 digitos";
  }
  return null;
};

export const stringVerifier = (array: string[], strings: string[]) => {
  return strings.every(string => array.includes(string)) || array.some(e => e === "manager");
};
