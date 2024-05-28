import { IFormFieldType, ILoginType } from "@/@types";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import AuthForm from "@/components/Auth/AuthForm";
import CompanyLogo from "@/components/UI/CompanyLogo";

const HomeLayout = () => {
  const router = useRouter();
  const { logIn, loading: userLoading, forgotPassEmailSender } = useAuth();
  const [forgotPass, setForgotPass] = useState(false);
  const [cacheEmail, setCacheEmail] = useState<string>("");
  const [forgetResponse, setForgotResponse] = useState<Boolean | null>(null);

  const onSubmit = async (data: ILoginType) => {
    try {
      if (forgotPass) {
        const forgotRes = await forgotPassEmailSender(data.email);

        setForgotResponse(forgotRes);
        return;
      }

      await logIn(data.email, data.password);
      router.push("/costumers");
    } catch (error) {
      console.error(error);
    }
  };

  const formFields: IFormFieldType = {
    email: {
      required: "Email é necessário",
      fieldType: "email",
      _formStates: [cacheEmail, setCacheEmail],
    },
    password: {
      required: "Senha é necessário",
      fieldType: "password",
      fieldLabel: "Senha",
    },
  };

  const forgotPassFields: IFormFieldType = {
    email: {
      required: "Email é necessário",
      fieldType: "email",
      _formStates: [cacheEmail, setCacheEmail],
    },
  };

  const submitBtn = () => {
    if (userLoading) {
      return (
        <div className="loading-circle !h-[30px] after:!h-[10px] !border-[6px] !border-white !border-t-[transparent] after:hidden"></div>
      );
    }
    return "Submit";
  };

  const handleForgotPass = () => {
    setForgotPass(e => !e);
    setForgotResponse(null);
  };

  return (
    <div className="container mx-auto w-[300px] md:w-[380px] border-2 border-gray-400">
      <CompanyLogo className="justify-center" />
      <h2 className="px-12 mt-8 text-center text-2xl font-semibold text-blue-900">
        Login
      </h2>
      {forgetResponse === null ? (
        <AuthForm
          handleOnSubmit={onSubmit}
          submitBtn={submitBtn}
          formFields={forgotPass ? forgotPassFields : formFields}
          type={"login"}
        />
      ) : forgetResponse ? (
        <div>
          <p className="text-center text-black dark:text-white p-4">
            Um email com o link de recuperação de senha foi enviado para o email
            cadastrado
          </p>
        </div>
      ) : (
        <div>
          <p className="text-center text-black dark:text-white p-4">
            Infelizmente, não foi possivel encontrar esse e-mail no banco de
            dados, porfavor entre em contato com o suporte
          </p>
        </div>
      )}

      <div className="flex justify-center items-center mt-4 mb-8">
        <small
          className="text-center m-auto text-black dark:text-white cursor-pointer hover:underline"
          onClick={handleForgotPass}
        >
          {!forgotPass ? "Esqueci minha senha" : "Entrar com email e senha"}
        </small>
      </div>
    </div>
  );
};

export default HomeLayout;
