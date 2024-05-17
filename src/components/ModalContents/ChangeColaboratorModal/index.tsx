import {
  IFormFieldType,
  IRestrictedDataType,
  ISignupType,
  IUserDataType,
} from "@/@types";
import AuthForm from "@/components/Auth/AuthForm";
import Loading from "@/components/UI/Loading";
import { useAuth } from "@/context/AuthContext";
import { useModals } from "@/context/ModalsContext";
import { useUsers } from "@/context/UsersContext";
import { milissecondsInAYear } from "@/utils/constants";
import { Timestamp } from "firebase/firestore";
import router, { useRouter } from "next/router";
import { useState } from "react";

const ChangeColaboratorModal = () => {
  const { user } = useAuth();
  const { loading, updateUser, error } = useUsers();
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState<string>("");
  const router = useRouter();
  const { setModalIsOpen } = useModals();

  const onSubmit = async (data: any) => {
    console.log({ data });
    // setSubmitted(true);
    // if (data.senha) {
    //   if (data.senha !== data.password_confirm) {
    //     return setSubmitted(true);
    //   }
    //   await changeUserPassword(data.senha);
    // }
    // if (data.email) {
    //   await changeUserEmail(data.email);
    //   const newUser = { uid: user.uid, email: user.email };
    //   if (newUser.uid && newUser.email) {
    //     // updateUser(newUser as { uid: string; email: string });
    //   }
    // }
    // router.push(`/colaborator/${user.uid}`);

    // setModalIsOpen(false);
  };

  const formFields: IFormFieldType = {
    email: {
      required: "Email é necessário, caso não queira trocar repita o em uso",
      fieldType: "email",
    },
    senha: {
      required: "Senha é necessária",
      fieldType: "password",
    },
    password_confirm: {
      required: "Confirme sua senha",
      fieldType: "password",
      fieldLabel: "Confirmar Senha",
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
          <div>{error ? error : message}</div>
        </div>
      );

    return (
      <AuthForm
        className="w-full flex justify-center items-center flex-col h-full md:items-start "
        handleOnSubmit={onSubmit}
        submitBtn={submitBtn}
        formFields={formFields}
        disabled={loading}
      />
    );
  };

  return (
    <div className="container mx-auto min-w-[250px] md:-w-[800px] w-[300px] lg:min-w-[1000px]">
      <h2 className="px-12 mt-8 text-center text-2xl font-semibold text-blue-900 dark:text-white">
        Gerenciar Credenciais
      </h2>
      <div className="max-h-[80vh] overflow-y-scroll md:overflow-y-auto md:min-h-[60vh] flex  flex-col justify-center items-start">
        <div className="flex justify-center items-center mx-auto">
          {renderFormContent()}
        </div>
      </div>
    </div>
  );
};

export default ChangeColaboratorModal;
