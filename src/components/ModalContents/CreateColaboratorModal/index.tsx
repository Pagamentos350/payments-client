import {
  IFormFieldType,
  IProjectDataType,
  IRestrictedDataType,
  ISignupType,
  IUserDataType,
} from "@/@types";
import AuthForm from "@/components/Auth/AuthForm";
import Loading from "@/components/UI/Loading";
import { useModals } from "@/context/ModalsContext";
import { useUsers } from "@/context/UsersContext";
import { translateItemKeys, formatItem, capitalize } from "@/services/format";
import { milissecondsInAYear } from "@/utils/constants";
import { AxiosError } from "axios";
import { Timestamp } from "firebase/firestore";
import router, { useRouter } from "next/router";
import { useState } from "react";

const CreateColaboratorModal = () => {
  const {
    createUser,
    loading,
    error,
    setUpdate: setUpdateProjects,
  } = useUsers();

  const [submitted, setSubmitted] = useState(false);
  const [confirmation, setConfirmation] = useState<boolean>(false);
  const [costumerData, setcostumerData] = useState<Partial<IUserDataType>>({});

  const onSubmit = async (data: any) => {
    console.log({ data });
    data.name = capitalize(data.name);
    data.last_name = capitalize(data.last_name);

    setcostumerData(data);
    setConfirmation(true);
  };

  const sendUpdate = async () => {
    console.log({ costumerData });

    try {
      createUser(costumerData);

      setConfirmation(false);
      setSubmitted(true);
    } catch (err) {
      console.log(err);
    }
  };

  const formFields: IFormFieldType = {
    name: {
      required: "Nome é necessário",
      fieldType: "text",
      defaultValue: costumerData?.name || "",
    },
    last_name: {
      fieldType: "text",
      fieldLabel: "Sobrenome",
      required: "Sobrenome é necessário",
      defaultValue: costumerData?.last_name || "",
    },
    phone: {
      fieldType: "number",
      fieldLabel: "Celular (whatsapp)",
      min: 9999999999,
      max: 99999999999,
      required: "Celular é necessário",
      defaultValue: costumerData?.phone || "",
    },
    adress: {
      required: "Endereço",
      fieldType: "text",
      fieldLabel: "Endereço",
      divClassName: "row-start-2 row-end-3",
      defaultValue: costumerData?.adress || "",
    },
    cep: {
      required: "CEP é necessário",
      fieldType: "text",
      fieldLabel: "CEP",
      defaultValue: costumerData?.cep || "",
    },
    rg: {
      required: "RG é necessário",
      fieldType: "number",
      fieldLabel: "RG",
      minLength: 7,
      maxLength: 7,
      defaultValue: costumerData?.rg || "",
    },
    cpf: {
      required: "CPF é necessário",
      fieldType: "text",
      fieldLabel: "CPF",
      minLength: 11,
      maxLength: 11,
      defaultValue: costumerData?.cpf || "",
    },
    email: {
      required: "Email é necessária",
      fieldType: "email",
      defaultValue: costumerData?.email || "",
    },
    details: {
      fieldType: "textarea",
      fieldLabel: "Detalhes",
      divClassName: "col-start-1 col-end-5",
      defaultValue: costumerData?.details || "",
    },
    cpfDoc: {
      fieldType: "file",
      fieldLabel: "CPF",
    },
    rgDoc: {
      fieldType: "file",
      fieldLabel: "RG",
    },
    otherDoc: {
      fieldType: "file",
      fieldLabel: "Outros",
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

    if (confirmation) {
      return (
        <div className="flex flex-col h-full justify-center items-center md:mx-auto text-[26px] dark:text-white">
          <div>
            <h4 className="text-center">Confirme os dados</h4>
          </div>
          <div className="md:grid md:grid-cols-2 grid-flow-row gap-4 my-4  overflow-y-auto">
            {Object.entries(costumerData).map(([objEntry, objValue], i) => {
              return (
                <div key={i}>
                  <div className="flex flex-col md:flex-row gap-4">
                    <span>{translateItemKeys(objEntry)}:</span>
                    <span className="!font-light overflow-hidden text-ellipsis">
                      {formatItem(objValue, objEntry as any)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex gap-3 flex-col md:flex-row">
            <button
              className="btn !bg-transparent"
              onClick={() => setConfirmation(false)}
            >
              Cancel
            </button>
            <button className="btn" onClick={sendUpdate}>
              Confirm
            </button>
          </div>
        </div>
      );
    }

    if (submitted)
      return (
        <div className="flex flex-col w-full h-full justify-center items-center mx-auto text-[26px] dark:text-white">
          <div>
            {error
              ? (error as AxiosError).message
              : "Cliente Criado com Sucesso"}
          </div>
        </div>
      );

    return (
      <AuthForm
        className="w-full flex justify-center items-start flex-col h-full md:items-start md:grid md:grid-cols-4 md:gap-x-4"
        handleOnSubmit={onSubmit}
        submitBtn={submitBtn}
        formFields={formFields}
      />
    );
  };

  return (
    <div className="container mx-auto min-w-[250px] md:-w-[800px] w-[300px] lg:min-w-[1000px]">
      <h2 className="px-12 mt-8 text-center text-2xl font-semibold text-blue-900 dark:text-white">
        Adicionar Cliente
      </h2>
      <div className="max-h-[80vh] overflow-y-scroll md:overflow-y-auto md:min-h-[60vh] flex justify-center items-start">
        {renderFormContent()}
      </div>
    </div>
  );
};

export default CreateColaboratorModal;
