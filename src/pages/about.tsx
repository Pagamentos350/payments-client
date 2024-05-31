import { IFormFieldType, ILoginType } from "@/@types";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import AuthForm from "@/components/Auth/AuthForm";
import CompanyLogo from "@/components/UI/CompanyLogo";
import { Meta } from "@/layout/meta";

const AboutLayout = () => {
  return (
    <div className="container mx-auto w-[300px] md:w-[380px] border-2 border-gray-400">
      <CompanyLogo className="justify-center" />
      <h2 className="px-12 mt-8 text-center text-2xl font-semibold text-blue-900">
        Sobre nós
      </h2>

      <div>
        <p className="text-center text-black dark:text-white p-4">
          Somos uma empresa de gerenciamento de pagamenos
        </p>
        <p className="text-center text-black dark:text-white p-4">
          Cadastre suas dívidas e o sistema calculará juros lembrará você nas
          datas de vencimento
        </p>
        <p className="text-center text-black dark:text-white p-4">
          contato: pagamentos350@gmail.com
        </p>
      </div>
      <div className="flex justify-center items-center mb-5">
        <button className="btn !text-white">Comece já</button>
      </div>
    </div>
  );
};

const About = () => {
  return (
    <>
      <Meta
        title={"Pagamentos 350- Sobre Nós"}
        description={"Bem-vindo ao App de Gerenciamento de Pagamentos"}
      />
      <AboutLayout />
    </>
  );
};

export default About;
