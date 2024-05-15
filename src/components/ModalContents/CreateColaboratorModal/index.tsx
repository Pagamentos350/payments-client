import {
  IFormFieldType,
  IRestrictedDataType,
  ISignupType,
  IUserDataType,
} from "@/@types";
import AuthForm from "@/components/Auth/AuthForm";
import Loading from "@/components/UI/Loading";
import { useModals } from "@/context/ModalsContext";
import { useUsers } from "@/context/UsersContext";
import { milissecondsInAYear } from "@/utils/constants";
import { Timestamp } from "firebase/firestore";
import router, { useRouter } from "next/router";
import { useState } from "react";

const CreateColaboratorModal = () => {
  const { loading, createUser, error } = useUsers();
  const [occupation, setOccupation] = useState<string[]>([]);
  const [workType, setWorkType] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();
  const { setModalIsOpen } = useModals();

  const onSubmit = async (
    data: Partial<
      IUserDataType &
        ISignupType &
        IRestrictedDataType & {
          registroGeral: string;
          cadastroDePessoaFisica: string;
          senha: string;
          contato: string;
        }
    >,
  ) => {
    setSubmitted(true);
    const {
      name,
      contato: telefone,
      birthday,
      registroGeral: rg,
      cadastroDePessoaFisica: cpf,
      email,
      senha: password,
    } = data;
    const newUser: any = {
      name,
      telefone,
      birthday,
      rg,
      cpf,
      email,
      password,
    };
    newUser.birthday = Timestamp.fromDate(new Date(newUser.birthday));
    newUser.occupation = occupation;
    newUser.workType = workType[0];
    newUser.projects = [];
    try {
      await createUser(newUser);
      if (router.pathname !== "/colaborators") {
        router.push("/colaborators");
      }
    } catch (error) {
      console.error(error);
    }
    return setModalIsOpen(false);
  };

  const formFields: IFormFieldType = {
    name: {
      required: "Nome é necessário",
      fieldType: "text",
    },
    contato: {
      fieldType: "number",
      fieldLabel: "Telefone com DDD",
      minLength: 11,
      maxLength: 11,
      required: "Telefone é necessário",
    },
    birthday: {
      required: "Dia da Nascimento o é necessário",
      fieldType: "date",
      fieldLabel: "Dia de Nascimento",
      defaultValue: new Date(Date.now() - 18 * milissecondsInAYear)
        .toISOString()
        .split("T")[0],
    },

    occupation: {
      required: "Selecionar Area de Atuação",
      fieldType: "selection",
      fieldLabel: "Área de Atuação",
      _formStates: [occupation, setOccupation],
      divClassName: "row-start-2 row-end-3",
    },
    workType: {
      required: "Regime de Trabalho",
      fieldType: "selection",
      fieldLabel: "Regime de Trabalho",
      _formStates: [workType, setWorkType],
      divClassName: "row-start-2 row-end-3",
    },
    registroGeral: {
      required: "RG é necessário",
      fieldType: "number",
      fieldLabel: "RG",
      minLength: 7,
      maxLength: 9,
    },
    cadastroDePessoaFisica: {
      required: "CPF é necessário",
      fieldType: "number",
      fieldLabel: "CPF",
      minLength: 11,
      maxLength: 11,
    },
    email: {
      required: "Email é necessária",
      fieldType: "email",
    },
    senha: {
      required: "Senha é necessária",
      fieldType: "password",
      fieldLabel: "Senha",
      minLength: 6,
      maxLength: 32,
    },
    password_confirm: {
      required: "Senhas não são iguais",
      fieldType: "password",
      fieldLabel: "Confirmar Senha",
      minLength: 6,
      maxLength: 32,
    },
  };

  const submitBtn = () => {
    if (loading) {
      return (
        <div className="loading-circle !h-[30px] after:!h-[10px] !border-[6px] !border-white !border-t-[transparent] after:hidden"></div>
      );
    }
    return "Submit";
  };

  const renderFormContent = () => {
    if (loading) return <Loading />;

    if (submitted)
      return (
        <div className="flex flex-col w-full h-full justify-center items-center mx-auto text-[26px]">
          <div>{error ? error : "Usuário Criado com Sucesso"}</div>
        </div>
      );

    return (
      <AuthForm
        className="w-full flex justify-center items-start flex-col h-full md:items-start md:grid md:grid-cols-4 md:gap-x-4"
        handleOnSubmit={onSubmit as any}
        submitBtn={submitBtn}
        formFields={formFields}
        disabled={loading}
      />
    );
  };

  return (
    <div className="container mx-auto min-w-[250px] md:-w-[800px] w-[300px] lg:min-w-[1000px]">
      <h2 className="px-12 mt-8 text-center text-2xl font-semibold text-blue-900 dark:text-white">
        Adicionar Colaborador
      </h2>
      <div className="max-h-[80vh] overflow-y-scroll md:overflow-y-auto md:min-h-[60vh] flex justify-center items-start">
        {renderFormContent()}
      </div>
    </div>
  );
};

export default CreateColaboratorModal;
