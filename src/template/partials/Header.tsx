import { ThemeSwitch } from "@/components/UI/ThemeSwitch";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import MobileMenu from "./MobileMenu";
import { FaBell } from "react-icons/fa";
import { useProjects } from "@/context/ProjectsContext";

const Header = () => {
  const { logOut, user } = useAuth();
  const { lateMessages, loading } = useProjects();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuIsOpen, setMobileMenuIsOpen] = useState<boolean>(false);
  const [notificationIsOpen, setNotificationIsOpen] = useState<boolean>(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logOut();
      router.push("/");
    } catch (error: any) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setMobileMenuIsOpen(false);
  }, [router]);

  if (!mounted) return null;
  return (
    <>
      <header
        id="main-header"
        className="flex flex-wrap container h-[100px] mx-auto max-w-full items-center p-6 justify-between bg-primary shadow-lg top-0 z-50"
      >
        <div>
          <div className="hidden lg:block">
            <ThemeSwitch />
          </div>
          <div
            className="block lg:hidden"
            onClick={() => setMobileMenuIsOpen(prevState => !prevState)}
          >
            <button className="flex items-center text-primary p-3">
              <svg
                className="block h-6 w-6 fill-current"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
              </svg>
            </button>
          </div>
        </div>
        <div className="flex relative gap-8">
          <div
            className="relative"
            onClick={() => setNotificationIsOpen(e => !e)}
          >
            <FaBell className="w-[32px] h-[32px] cursor-pointer" />
            {lateMessages && lateMessages.length > 0 && (
              <div className="right-0 bottom-0 absolute bg-red-500 w-3 h-3 rounded-full" />
            )}
          </div>
          {notificationIsOpen && (
            <div className="absolute top-[100%] bg-primary dark:bg-[#333333] rounded-lg hover:!bg-gray-400 w-[80%] min-h-[100px] max-h-[85vh] overflow-y-auto">
              {loading ? (
                <div className="loading-circle" />
              ) : lateMessages && lateMessages?.length > 0 ? (
                lateMessages?.map((e, i) => (
                  <div
                    className="px-2 py-4 border-b border-gray-400 last:border-b-0 "
                    key={i}
                  >
                    <p>{`${e.costumer} (${
                      e.costumer_cpf
                    }) possui dívida de R$${e.value.toFixed(2)} em atraso. ${
                      e.daysLate > 0 ? `${e.daysLate} dias atrasado.` : ``
                    } Dia do vencimento ${
                      e?.due_date?.toLocaleDateString("en-GB") || ""
                    }.`}</p>
                    <p
                      className="cursor-pointer underline text-center"
                      onClick={() => router.push(`/debts/${e.debt_id}`)}
                    >
                      Ver dívida
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-center m-auto p-6">Nenhuma notificação</p>
              )}
            </div>
          )}
          <div className="flex gap-2">
            Olá, {user?.email},{" "}
            <span
              className="underline-animation-event inline-block cursor-pointer"
              onClick={handleLogout}
            >
              sair
            </span>
          </div>
        </div>
      </header>
      <MobileMenu isOpen={mobileMenuIsOpen} setIsOpen={setMobileMenuIsOpen} />
    </>
  );
};

export default Header;
