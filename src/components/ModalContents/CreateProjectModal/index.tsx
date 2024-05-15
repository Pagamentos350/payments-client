import { IFormFieldType } from "@/@types";
import AuthForm from "@/components/Auth/AuthForm";
import CompanyLogo from "@/components/UI/CompanyLogo";
import Loading from "@/components/UI/Loading";
import { useAuth } from "@/context/AuthContext";
import { useModals } from "@/context/ModalsContext";
import { useProjects } from "@/context/ProjectsContext";
import { useUsers } from "@/context/UsersContext";
import { Timestamp } from "firebase/firestore";
import { useRouter } from "next/router";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const CreateProjectModal = () => {
  const {
    sendNewProject,
    loading: projectsLoading,
    error: projectsError,
    setUpdate: setUpdateProjects,
  } = useProjects();
  const { updateUsersProjects } = useUsers();
  const { activeUserData } = useAuth();
  const { setModalIsOpen } = useModals();
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [stack, setStack] = useState<string[]>([]);
  const [teamUids, setTeamUids] = useState<string[]>([]);

  const onSubmit = async (data: any) => {
    const newProject = JSON.parse(JSON.stringify(data));
    newProject.id = uuidv4();
    newProject.startDate = Timestamp.fromDate(new Date(newProject.startDate));
    newProject.deadline = Timestamp.fromDate(new Date(newProject.deadline));
    newProject.comments = [
      {
        user_id: activeUserData?.uid,
        text: `Projeto criado por ${activeUserData?.name}`,
        date: Timestamp.fromDate(new Date()),
      },
    ];
    newProject.stack = stack;
    newProject.teamUids = teamUids;
    setSubmitted(true);
    try {
      await sendNewProject(newProject);
      await updateUsersProjects(newProject);
      if (router.pathname !== "projects") {
        router.push("/projects");
      }
      setUpdateProjects(e => !e);
    } catch (error) {
      console.error(error);
    }
    return setModalIsOpen(false);
  };

  const formFields: IFormFieldType = {
    name: {
      required: "Nome é necessário",
      fieldType: "text",
      divClassName: "col-start-1 col-end-3",
    },
    description: {
      fieldType: "textarea",
      fieldLabel: "Descrição",
      divClassName: "col-start-1 col-end-4 row-start-2 row-end-6",
      inputClassName: "max-h-32",
    },
    startDate: {
      required: "Dia de Inicio é necessário",
      fieldType: "date",
      fieldLabel: "Dia de Inicio",
      defaultValue: new Date(Date.now()).toISOString().split("T")[0],
    },
    deadline: {
      required: "Prazo é necessário",
      fieldType: "date",
      fieldLabel: "Prazo",
    },
    stack: {
      required: "Selecionar tecnologias",
      fieldType: "selection",
      fieldLabel: "Tecnologias",
      _formStates: [stack, setStack],
    },
    teamUids: {
      required: "Time é necessario",
      fieldType: "selection",
      fieldLabel: "Time",
      _formStates: [teamUids, setTeamUids],
    },
  };

  const submitBtn = () => {
    if (projectsLoading) {
      return (
        <div className="loading-circle !h-[30px] after:!h-[10px] !border-[6px] !border-white !border-t-[transparent] after:hidden"></div>
      );
    }
    return "Submit";
  };

  const renderFormContent = () => {
    if (projectsLoading) return <Loading />;

    if (submitted)
      return (
        <div className="flex flex-col h-full justify-center items-center mx-auto text-[26px]">
          <div>
            {projectsError ? projectsError : "Projeto Criado com Sucesso"}
          </div>
        </div>
      );

    return (
      <AuthForm
        className="w-full flex justify-center items-start flex-col h-full md:items-start md:grid md:grid-cols-3 md:gap-x-4"
        handleOnSubmit={onSubmit}
        submitBtn={submitBtn}
        formFields={formFields}
      />
    );
  };

  return (
    <div className="container mx-auto min-w-[250px] md:-w-[800px] w-[300px] lg:min-w-[1000px]">
      <h2 className="px-12 mt-8 text-center text-2xl font-semibold text-blue-900 dark:text-white">
        Novo Projeto
      </h2>
      <div className="max-h-[80vh] overflow-y-scroll md:overflow-y-auto md:min-h-[60vh] flex justify-center items-start">
        {renderFormContent()}
      </div>
    </div>
  );
};

export default CreateProjectModal;
