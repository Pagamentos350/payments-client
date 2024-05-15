import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

import { db, projectsCollection } from "@/config/firebase";
import {
  getDocs,
  collection,
  addDoc,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { IProjectDataType, IUserDataType } from "@/@types";

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
  const { user, activeUserData } = useAuth();
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [error, setError] = useState<any | undefined>();
  const [loading, setLoading] = useState<boolean>(true);
  const [update, setUpdate] = useState<boolean>(false);

  const findProject = (id: string) => {
    return allProjects.find(e => e.id === id);
  };

  const updateProjects = async (projectPart: Partial<IProjectDataType>) => {
    const adminPermission =
      parseInt(activeUserData?.permissionLevel || "0") > 1;
    const commentsException =
      Object.keys(projectPart).length === 2 &&
      "id" in projectPart &&
      "comments" in projectPart;
    console.log({ projectPart, adminPermission, commentsException });
    if (adminPermission || commentsException) {
      try {
        const q = query(
          collection(db, projectsCollection),
          where("id", "==", projectPart.id),
        );
        const querySnapshot = await getDocs(q);
        const docId: string[] = [];
        querySnapshot.forEach(e => docId.push(e.id));
        const projectRef = doc(db, projectsCollection, docId[0]);
        await updateDoc(projectRef, projectPart);
        setUpdate(e => !e);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const deleteProject = async (id: string) => {
    const q = query(collection(db, projectsCollection), where("id", "==", id));
    const docId: any[] = [];
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(doc => docId.push(doc.id));
    await deleteDoc(doc(db, projectsCollection, docId[0]));
    setUpdate(e => !e);
  };

  const sendNewProject = async (newProject: IProjectDataType) => {
    setLoading(true);
    try {
      await addDoc(collection(db, projectsCollection), newProject);
      setUpdate(prevState => !prevState);
    } catch (error) {
      console.error(error);
      setError(error);
    }
    setLoading(false);
  };

  const getAllProjects = async () => {
    try {
      const projectArray: IProjectDataType[] = [];
      const querySnapshot = await getDocs(collection(db, projectsCollection));
      querySnapshot.forEach(doc => {
        projectArray.push(doc.data() as IProjectDataType);
      });
      return projectArray;
    } catch (error) {
      console.error(error);
      setError(error);
    }
  };

  const addUsersToProjects = async (user: IUserDataType) => {
    try {
      const q = query(
        collection(db, projectsCollection),
        where("teamUids", "array-contains", user?.uid),
      );
      const querySnapshot = await getDocs(q);
      const docs: any = {};
      querySnapshot.forEach(doc => (docs[doc.id] = doc.data()));
      Object.entries(docs).forEach(async ([docKey, docValue]) => {
        const docRef = doc(db, projectsCollection, docKey);
        const teamCopy = JSON.parse(JSON.stringify((docValue as any).teamUids));
        teamCopy.splice(user.uid, 1);
        console.log({ docRef, teamCopy, docValue });
        await updateDoc(docRef, {
          teamUids: teamCopy,
        });
      });
      setUpdate(e => !e);
    } catch (error) {
      console.error(error);
    }
  };

  const removingUserFromProjects = async (user: IUserDataType) => {
    try {
      if (user?.uid) {
        const q = query(
          collection(db, projectsCollection),
          where("teamUids", "array-contains", user?.uid),
        );
        const querySnapshot = await getDocs(q);
        const docs: any = {};
        querySnapshot.forEach(doc => (docs[doc.id] = doc.data()));
        Object.entries(docs).forEach(async ([docKey, docValue]) => {
          const docRef = doc(db, projectsCollection, docKey);
          const teamCopy = JSON.parse(
            JSON.stringify((docValue as any).teamUids),
          );
          teamCopy.splice(user.uid, 1);
          console.log({ docRef, teamCopy, docValue });
          await updateDoc(docRef, {
            teamUids: teamCopy,
          });
        });
      }
      setUpdate(e => !e);
    } catch (error) {
      console.error(error);
    }
  };

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
