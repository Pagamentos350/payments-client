import { IDateObj, IProjectDataType, IUserDataType } from "@/@types";
import DeleteButton from "@/components/Auth/DeleteButton";
import { useAuth } from "@/context/AuthContext";
import { useModals } from "@/context/ModalsContext";
import { useProjects } from "@/context/ProjectsContext";
import { useUsers } from "@/context/UsersContext";
import { useRouter } from "next/router";
import { useState } from "react";

interface Props {
  project: IProjectDataType;
}

const ProjectListsFrame = ({ project }: Props) => {
  const { deleteProject } = useUsers();
  const { setModalContentKey, setModalIsOpen } = useModals();

  const onDeleteProject = async () => {
    setModalContentKey("deletedebt");
    setModalIsOpen(true);
  };
  const onEdit = async () => {
    setModalContentKey("editProj");
    setModalIsOpen(true);
  };

  return (
    <div className="frame-container">
      {project?.doc && (
        <div className="relative overflow-hidden">
          <embed
            src={project.doc as unknown as string}
            className="w-full max-h-[500px] overflow-hidden"
          />
          <div className="w-full h-full  z-10 bg-[#00000084] absolute inset-0">
            <div
              onClick={() => {
                open(project?.doc as unknown as string);
              }}
              className="w-full text-white dark:text-white h-[30%] bg-[#000000aa] px-4 cursor-pointer bottom-0 absolute z-10"
            >
              Clique para abrir
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col md:flex-row w-full justify-end mt-4 border-t-gray-300 border-t pt-4 gap-4">
        <button onClick={onEdit} className="btn !max-w-[200px] text-white">
          Renegociamento
        </button>
        <DeleteButton fn={onDeleteProject} />
      </div>
    </div>
  );
};

export default ProjectListsFrame;
