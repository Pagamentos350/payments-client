import { IFormFieldType, ILoginType } from "@/@types";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import AuthForm from "@/components/Auth/AuthForm";
import CompanyLogo from "@/components/UI/CompanyLogo";

const HomeLayout = () => {
  const router = useRouter();
  const { logIn, loading: userLoading, activeUserToken } = useAuth();

  const onSubmit = async (data: ILoginType) => {
    try {
      await logIn(data.email, data.password);
    } catch (error) {
      console.error(error);
    }
    router.push("/colaborators");
  };

  const formFields: IFormFieldType = {
    email: { required: "Email é necessário", fieldType: "email" },
    password: {
      required: "Senha é necessário",
      fieldType: "password",
      fieldLabel: "Senha",
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

  useEffect(() => {
    if (activeUserToken !== null) {
      console.log(activeUserToken);
    }
  }, [activeUserToken]);

  return (
    <div className="container mx-auto w-[300px] md:w-[380px] border-2 border-gray-400">
      <CompanyLogo className="justify-center" />
      <h2 className="px-12 mt-8 text-center text-2xl font-semibold text-blue-900">
        Login
      </h2>
      <AuthForm
        handleOnSubmit={onSubmit}
        submitBtn={submitBtn}
        formFields={formFields}
      />
      <div className="flex justify-center items-center mt-4 mb-8">
        <small className="text-center m-auto text-white">
          Em caso de perda das credenciais entre em contato com um gestor
        </small>
      </div>
    </div>
  );
};

export default HomeLayout;
