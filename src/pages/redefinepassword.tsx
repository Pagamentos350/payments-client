import { IFormFieldType, ILoginType } from "@/@types";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import AuthForm from "@/components/Auth/AuthForm";
import CompanyLogo from "@/components/UI/CompanyLogo";
import { Meta } from "@/layout/meta";

const RedefinePasswordLayout = () => {
  const router = useRouter();
  const { tokenValidation, loading: userLoading, updatePassword } = useAuth();
  const [forgetResponse, setForgotResponse] = useState<Boolean | null>(null);
  const [tokenIsValid, setTokenIsValid] = useState(false);
  const token = router.asPath.split("?token=").pop();

  useEffect(() => {
    const handler = async () => {
      if (token) {
        const result = await tokenValidation(token);
        setTokenIsValid(result);
      }
    };

    handler();
  }, [token]);

  const onSubmit = async (data: any) => {
    try {
      if (data.password === data.confirm_password) {
        const forgotRes = await updatePassword(token || "", data.password);

        setForgotResponse(forgotRes);
        return;
      }

      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  const formFields: IFormFieldType = {
    password: {
      required: "Senha é necessário",
      fieldType: "password",
      fieldLabel: "Senha",
    },
    confirm_password: {
      required: "Senhas precisam ser iguais",
      fieldType: "password",
      fieldLabel: "Repita a Senha",
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

  if (!tokenIsValid) {
    return (
      <div className="container mx-auto w-[300px] md:w-[380px] border-2 border-gray-400">
        <CompanyLogo className="justify-center" />
        <h2 className="px-12 mt-8 text-center text-2xl font-semibold text-blue-900">
          Redefinição de Senha
        </h2>

        <div>
          <p className="text-center text-black dark:text-white p-4">
            Token inválido ou expirado
          </p>
          <p
            className="text-center text-black dark:text-white p-4 cursor-pointer hover:underline"
            onClick={() => {
              router.push("/");
            }}
          >
            Clique aqui para retorna para a página de login
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto w-[300px] md:w-[380px] border-2 border-gray-400">
      <CompanyLogo className="justify-center" />
      <h2 className="px-12 mt-8 text-center text-2xl font-semibold text-blue-900">
        Redefinição de Senha
      </h2>
      {forgetResponse === null ? (
        <AuthForm
          handleOnSubmit={onSubmit}
          submitBtn={submitBtn}
          formFields={formFields}
        />
      ) : forgetResponse ? (
        <div>
          <p className="text-center text-black dark:text-white p-4">
            Senha Redefinida com Sucesso
          </p>
          <p
            className="text-center text-black dark:text-white p-4 cursor-pointer hover:underline"
            onClick={() => {
              router.push("/");
            }}
          >
            Clique aqui para retorna para a página de login
          </p>
        </div>
      ) : (
        <div>
          <p className="text-center text-black dark:text-white p-4">
            Tivemos um problema. Tente novamente mais tarde
          </p>
        </div>
      )}
    </div>
  );
};

const RedefinePassword = () => {
  return (
    <>
      <Meta
        title={"Gerenciamento Dev - Login"}
        description={"Bem-vindo ao App de Gerenciamento de Desenvolvedores"}
      />
      <RedefinePasswordLayout />
    </>
  );
};

export default RedefinePassword;
