import { FaUserAlt, FaUserTie } from "react-icons/fa";
import { AiOutlineProject } from "react-icons/ai";
import { useContext } from "react";
import { useProjects } from "@/context/ProjectsContext";
import { useUsers } from "@/context/UsersContext";

const MainNumbersFrame = () => {
  const { allUsers } = useUsers();
  const { allProjects } = useProjects();

  return (
    <div className="flex flex-col md:flex-row mx-auto w-[90%] justify-center items-center shadow-lg">
      {[
        {
          icon: ({ className }: any) => <FaUserAlt className={className} />,
          title: "Colaboradores",
          number: allUsers.length,
        },
        {
          icon: ({ className }: any) => <FaUserTie className={className} />,
          title: "Gestores",
          number: allUsers.filter(e => +e.permissionLevel > 1).length,
        },
        {
          icon: ({ className }: any) => (
            <AiOutlineProject className={className} />
          ),
          title: "Projetos",
          number: allProjects.length,
        },
      ].map((item, index) => {
        return (
          <div
            key={index}
            className="w-[300px] h-[300px] flex flex-col justify-center items-center"
          >
            <div className="w-36 h-36 border border-black dark:border-white rounded-full flex justify-center items-center">
              {item.icon({ className: "w-24 h-24" })}
            </div>
            <div className="flex flex-col justify-center items-center mt-4">
              <div className="text-[26px]">{item.title}</div>
              <div className="text-[32px]">{item.number}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MainNumbersFrame;
