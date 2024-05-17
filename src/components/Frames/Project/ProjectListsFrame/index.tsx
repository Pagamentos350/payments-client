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
  const router = useRouter();

  const { deleteProject } = useUsers();
  const { setModalContentKey, setModalIsOpen } = useModals();

  const stack = useState<string[]>();
  const teamUids = useState<string[]>();

  const edittables = { stack, teamUids };

  const onDeleteProject = async () => {
    setModalContentKey("deletedebt");
    setModalIsOpen(true);
  };

  return (
    <div className="frame-container">
      <DeleteButton fn={onDeleteProject} />
    </div>
  );
};

export default ProjectListsFrame;
