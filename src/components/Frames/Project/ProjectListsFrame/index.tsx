import { IDateObj, IProjectDataType, IUserDataType } from "@/@types";
import DeleteButton from "@/components/Auth/DeleteButton";
import DocumentDisplay from "@/components/UI/DocumentDisplay";
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
        <DocumentDisplay doc={project.doc as unknown as string} />
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
