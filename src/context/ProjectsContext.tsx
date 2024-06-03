import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

import axios from "axios";

import { useAuth } from "@/context/AuthContext";
import { IProjectDataType, IUserDataType } from "@/@types";
import { ENVS } from "@/utils/constants";
import { useUsers } from "./UsersContext";
import { getClosestDate, getDaysLate } from "@/utils/messager";

interface IProjectsProvider {
  children: ReactNode;
}

interface ProjectsContextProps {
  allProjects: IProjectDataType[];
  loading: boolean;
  error: any | undefined;
  sendNewProject: (newProject: IProjectDataType) => Promise<void>;
  updateProjects: (projectPart: Partial<IProjectDataType>) => Promise<void>;
  setUpdate: Dispatch<SetStateAction<boolean>>;
  findProject: (ui: string) => IProjectDataType | undefined;
  lateMessages: {
    value: number;
    costumer: string;
    costumer_cpf: number;
    due_date: Date;
    daysLate: number;
    debt_id: string;
    costumer_id: string;
  }[];
}

export const ProjectsContext = createContext({} as ProjectsContextProps);

export const ProjectsProvider = ({ children }: IProjectsProvider) => {
  const { user, getAuthToken } = useAuth();
  const { update: usersUpdate, allUsers } = useUsers();
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [error, setError] = useState<any | undefined>();
  const [loading, setLoading] = useState<boolean>(true);
  const [update, setUpdate] = useState<boolean>(false);

  const [lateMessages, setLateMessages] = useState<any[]>([]);

  const getLateMessages = (allProjects: IProjectDataType[]) => {
    const copyArr: IProjectDataType[] = JSON.parse(JSON.stringify(allProjects));
    const lateCopyArr: any = [];
    const messages: any = [];
    copyArr.forEach(debt => {
      const checkClosestDate = getClosestDate(debt.due_dates);
      const daysLate = checkClosestDate?.data
        ? getDaysLate(new Date(checkClosestDate?.data))
        : 999;
      const daysLateCheck = checkClosestDate?.data ? daysLate <= 3 : false;

      if (daysLateCheck) {
        lateCopyArr.push(debt);
        const costumerinDebt: IUserDataType | undefined = allUsers.find(
          user => user.costumer_id === debt.costumer_id,
        );

        if (costumerinDebt && checkClosestDate)
          messages.push({
            value: debt.value,
            costumer: costumerinDebt.name + " " + costumerinDebt.last_name,
            costumer_cpf: costumerinDebt.cpf,
            due_date: new Date(checkClosestDate?.data),
            daysLate: daysLate,
            debt_id: debt.debt_id,
            costumer_id: costumerinDebt.costumer_id,
          });
      }
    });

    setLateMessages(messages);

    return lateCopyArr;
  };

  useEffect(() => {
    if (allProjects) getLateMessages(allProjects);
  }, [allProjects]);

  const findProject = (id: string) => {
    return allProjects.find(e => e.id === id);
  };

  const updateProjects = async (debt: Partial<IProjectDataType>) => {
    setError(null);

    const doc = debt?.doc?.[0];
    const fd = new FormData();
    console.log({ doc });
    if (doc) fd.append("file", doc as File);

    fd.append("data", JSON.stringify(debt));

    try {
      const authToken = getAuthToken();
      await axios.postForm(`${ENVS.apiUrl}/debts/update`, fd, {
        headers: {
          Authorization: "Bearer " + authToken,
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      setError(error);
      console.error(error);
    }
    setUpdate(e => !e);
  };

  const sendNewProject = async (newProject: IProjectDataType) => {};

  const getAllProjects = async () => {
    try {
      const authToken = getAuthToken();
      const res = await axios.get(`${ENVS.apiUrl}/debts`, {
        headers: { Authorization: "Bearer " + authToken },
      });
      return res.data.result;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setLoading(true);

    if (user) {
      const fetcher = async () => {
        console.log("DEBTS UPDATE");
        setAllProjects((await getAllProjects()) as IProjectDataType[]);
      };
      if (user) {
        fetcher();
        setTimeout(() => fetcher(), 1000);
      }
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, update, usersUpdate]);
  return (
    <ProjectsContext.Provider
      value={{
        allProjects,
        error,
        loading,
        sendNewProject,
        setUpdate,
        updateProjects,
        findProject,
        lateMessages,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectsContext);

  return context;
};
