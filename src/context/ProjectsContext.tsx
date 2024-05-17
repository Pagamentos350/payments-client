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

interface IProjectsProvider {
  children: ReactNode;
}

interface ProjectsContextProps {
  allProjects: IProjectDataType[];
  loading: boolean;
  error: any | undefined;
  sendNewProject: (newProject: IProjectDataType) => Promise<void>;
  updateProjects: (projectPart: Partial<IProjectDataType>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  setUpdate: Dispatch<SetStateAction<boolean>>;
  removingUserFromProjects: (user: IUserDataType) => Promise<void>;
  addUsersToProjects: (user: IUserDataType) => Promise<void>;
  findProject: (ui: string) => IProjectDataType | undefined;
}

export const ProjectsContext = createContext({} as ProjectsContextProps);

export const ProjectsProvider = ({ children }: IProjectsProvider) => {
  const { user, getAuthToken } = useAuth();
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [error, setError] = useState<any | undefined>();
  const [loading, setLoading] = useState<boolean>(true);
  const [update, setUpdate] = useState<boolean>(false);

  const findProject = (id: string) => {
    return allProjects.find(e => e.id === id);
  };

  const updateProjects = async (projectPart: Partial<IProjectDataType>) => {
    setLoading(true);
    try {
      const authToken = getAuthToken();
      await axios.post(`${ENVS.apiUrl}/debts/update`, projectPart, {
        headers: { Authorization: "Bearer " + authToken },
      });
    } catch (error) {
      setError(error);
      console.error(error);
    }
    setLoading(false);
    setUpdate(e => !e);
  };

  const deleteProject = async (id: string) => {};

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

  const addUsersToProjects = async (user: IUserDataType) => {};

  const removingUserFromProjects = async (user: IUserDataType) => {};

  useEffect(() => {
    setLoading(true);

    if (user) {
      const fetcher = async () => {
        setAllProjects((await getAllProjects()) as IProjectDataType[]);
      };
      if (user) {
        fetcher();
      }
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, update]);
  return (
    <ProjectsContext.Provider
      value={{
        allProjects,
        error,
        loading,
        sendNewProject,
        setUpdate,
        updateProjects,
        deleteProject,
        removingUserFromProjects,
        addUsersToProjects,
        findProject,
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
