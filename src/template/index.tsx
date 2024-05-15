import { ReactNode, SetStateAction, useEffect, useState } from "react";

import Header from "./partials/Header";
import SideMenu from "./partials/SideMenu";

interface Props {
  children: ReactNode;
}

import { Inter } from "next/font/google";
import PrivatePage from "@/components/Auth/PrivatePage";
import { useRouter } from "next/router";
import { publicRoutes } from "@/utils/constants";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import Modal from "./partials/Modal";
import { useModals } from "@/context/ModalsContext";
import dynamic from "next/dynamic";

const LazyModal = dynamic(() => import("./partials/Modal"), { suspense: true });

const inter = Inter({ subsets: ["latin"] });

export const MainTemplate = ({ children }: Props) => {
  const router = useRouter();
  const { theme } = useTheme();
  const { modalContent } = useModals();

  if (publicRoutes.includes(router.pathname)) {
    return (
      <div
        className={
          theme + " flex min-h-screen flex-col justify-center items-center"
        }
      >
        <div className={inter.className}>{children}</div>
      </div>
    );
  }
  return (
    <PrivatePage>
      <div className={theme + " lg:grid lg:grid-rows-1 lg:grid-cols-12 overflow-hidden h-screen"}>
        <div className="lg:col-start-1 lg:col-end-3 hidden lg:flex flex-col">
          <SideMenu />
        </div>
        <div className="flex flex-col justify-center items-center h-[calc(100vh)] col-start-0 lg:col-start-3 col-end-13">
          <Header />
          <div className="w-full items-center pt-12 flex min-h-[calc(100vh-100px)] flex-col h-auto overflow-y-scroll">
            <div className={inter.className + " w-full l"}>{children}</div>
          </div>
        </div>
        {modalContent && <LazyModal>{modalContent()}</LazyModal>}
      </div>
    </PrivatePage>
  );
};
