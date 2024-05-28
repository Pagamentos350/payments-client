import Link from "next/link";
import { manageNav, navigationLinks, restrictedNav } from "./data";
import { useRouter } from "next/router";
import CompanyLogo from "@/components/UI/CompanyLogo";
import { ThemeSwitch } from "@/components/UI/ThemeSwitch";
import NavItem from "@/components/UI/Items/NavItem";
import { useModals } from "@/context/ModalsContext";
import { useAuth } from "@/context/AuthContext";

const SideMenu = () => {
  const { setModalIsOpen, setModalContentKey } = useModals();

  const handleModalAction = (key: string): void => {
    setModalContentKey(key);
    setModalIsOpen(true);
  };

  return (
    <div
      id="main-side-menu"
      className="bg-white h-screen w-full block mt-[100px] lg:mt-0 shadow-lg"
    >
      <CompanyLogo />
      <nav className={``}>
        <ul className="text-lg inline-block">
          <>
            {navigationLinks.map((item, index) => (
              <li
                key={index}
                className="my-3 lg:my-0 items-center mr-4 lg:inline-block block w-full "
              >
                {item.path ? (
                  <NavItem key={index} item={item} />
                ) : (
                  <div className="flex flex-col ml-4 ">
                    <span className="font-semibold text-gray-500 uppercase">
                      {item.displayName}
                    </span>
                    {item.subpaths?.map((item: any, index: number) => (
                      <NavItem key={index} item={item} />
                    ))}
                  </div>
                )}
              </li>
            ))}
          </>
        </ul>
        <ul className="text-lg inline-block">
          <>
            {[...manageNav, ...restrictedNav].map((item, index) => (
              <li
                key={index}
                className="my-3 lg:my-0 items-center mr-4 lg:inline-block block w-full "
              >
                {item?.action ? (
                  <span
                    key={index}
                    className={`cursor-pointer rounded-[15px] w-[80%] p-2 pl-8 ml-4 my-1 lg:my-0 items-center mr-4 lg:inline-block block`}
                  >
                    <span
                      onClick={() => handleModalAction(item?.action as string)}
                      className={"underline-animation-event"}
                    >
                      {item?.displayName}
                    </span>
                  </span>
                ) : (
                  <div className="flex flex-col ml-4 ">
                    <span className="font-semibold text-gray-500 uppercase">
                      {item.displayName}
                    </span>
                    {item?.subActions?.map((item: any, index: number) => (
                      <span
                        key={index}
                        className={`cursor-pointer rounded-[15px] w-[80%] p-2 pl-2 ml-2 my-1 lg:my-0 items-center mr-4 lg:inline-block block whitespace-nowrap`}
                      >
                        <span
                          onClick={() =>
                            handleModalAction(item?.action as string)
                          }
                          className={"underline-animation-event"}
                        >
                          {item?.displayName}
                        </span>
                      </span>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </>
        </ul>
      </nav>
      <div className="block lg:hidden ml-4">
        <ThemeSwitch />
      </div>
    </div>
  );
};

export default SideMenu;
