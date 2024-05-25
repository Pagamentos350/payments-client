import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

import { useAuth } from "@/context/AuthContext";
import {
  ILoginType,
  IProjectDataType,
  IRestrictedDataType,
  ISignupType,
  IUserDataType,
} from "@/@types";
import firebase from "firebase/compat/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signOut,
} from "firebase/auth";
import { ENVS } from "@/utils/constants";
import axios from "axios";

interface IUsersProvider {
  children: ReactNode;
}

interface UsersContextProps {
  allUsers: IUserDataType[];
  loading: boolean;
  error: any | undefined;
  // updateUsersProjects: (newProject: IProjectDataType) => Promise<void>;
  // removingUsersProjects: (oldProject: IProjectDataType) => Promise<void>;
  setUpdate: Dispatch<SetStateAction<boolean>>;
  findUser: (uid: string) => IUserDataType | undefined;
  getRestrictedData: (uid: string) => Promise<IRestrictedDataType | undefined>;
  createUser: (user: Partial<IUserDataType>) => Promise<void>;
  deleteUser: (uid: string) => Promise<void>;
  updateUser: (
    user: Partial<IUserDataType & ISignupType>,
    restricted?: boolean,
  ) => Promise<void>;
  verifyUniqueField: (
    uniqueValue: string,
    uniqueField: "email" | "cpf" | "rg",
  ) => boolean;
  addDebtToUser: (costumer_id: string, debt: Partial<IProjectDataType>) => void;
  deleteProject: (debt_id: string) => Promise<void>;
  update: boolean;
}

export const UsersContext = createContext({} as UsersContextProps);

export const UsersProvider = ({ children }: IUsersProvider) => {
  const { user, getAuthToken } = useAuth();
  const [allUsers, setAllUsers] = useState<IUserDataType[]>([]);
  const [error, setError] = useState<any | undefined>();
  const [loading, setLoading] = useState<boolean>(true);
  const [update, setUpdate] = useState<boolean>(true);

  const deleteProject = async (debt_id: string) => {
    try {
      const authToken = getAuthToken();
      await axios.post(
        `${ENVS.apiUrl}/debts/remove`,
        { debt_id },
        {
          headers: { Authorization: "Bearer " + authToken },
        },
      );
    } catch (error) {
      setError(error);
      console.error(error);
    }
    setUpdate(e => !e);
  };

  const updateUser = async (
    userPart: Partial<IUserDataType & ISignupType>,
    restricted: boolean = false,
  ) => {
    try {
      const authToken = getAuthToken();
      await axios.post(`${ENVS.apiUrl}/costumers/update`, userPart, {
        headers: { Authorization: "Bearer " + authToken },
      });
    } catch (error) {
      setError(error);
      console.error(error);
    }
    setUpdate(e => !e);
  };

  const createUser = async (user: Partial<IUserDataType>) => {
    try {
      const authToken = getAuthToken();
      await axios.post(`${ENVS.apiUrl}/costumers/add`, user, {
        headers: { Authorization: "Bearer " + authToken },
      });
    } catch (error) {
      console.error(error);
      setError(error);
    }
    setUpdate(e => !e);
  };

  const getAllUsers = async () => {
    try {
      const authToken = getAuthToken();
      const res = await axios.get(`${ENVS.apiUrl}/costumers`, {
        headers: { Authorization: "Bearer " + authToken },
      });
      return res.data.result;
    } catch (error) {
      console.error(error);
    }
  };

  const findUser = (uid: string) => {
    return allUsers.find(e => e.costumer_id === uid);
  };

  const deleteUser = async (uid: string) => {
    try {
      const authToken = getAuthToken();
      await axios.post(
        `${ENVS.apiUrl}/costumers/remove`,
        { costumer_id: uid },
        {
          headers: { Authorization: "Bearer " + authToken },
        },
      );
    } catch (error) {
      console.error(error);
    }
    setUpdate(e => !e);
  };

  useEffect(() => {
    setLoading(true);
    console.log("UPDATING", { update, user });
    if (user) {
      console.log("UPDATING", { update });

      const fetcher = async () => {
        setAllUsers((await getAllUsers()) as IUserDataType[]);
      };
      fetcher();
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, update]);

  const getRestrictedData = async (uid: string) => {
    try {
      const authToken = getAuthToken();
      const res = await axios.get(`${ENVS.apiUrl}/debts?costumer_id=${uid}`, {
        headers: { Authorization: "Bearer " + authToken },
      });
      console.log({ res });
      return res.data.result;
    } catch (error) {
      console.error(error);
    }
  };
  const verifyUniqueField = (
    uniqueValue: string,
    uniqueField: "email" | "cpf" | "rg",
  ) => {
    try {
      const user = allUsers.find(user => user?.[uniqueField] === uniqueValue);

      return Boolean(user);
    } catch (error) {
      console.error(error);
    }
    return false;
  };

  const addDebtToUser = async (
    costumer_id: string,
    debt: Partial<IProjectDataType>,
  ) => {
    setError(null);
    const newDebt = {
      costumer_id: costumer_id,
      value: debt.value,
      initial_value: debt.initial_value,
      payment_method: debt.payment_method,
      fee: debt.fee,
      initial_date: debt.initial_date,
      due_dates: debt.due_dates,
      payed: debt.payed,
      late_fee: debt.late_fee,
      callings: debt.callings,
      description: debt.description,
    };

    const doc = debt?.doc?.[0];

    const fd = new FormData();
    console.log({ doc });
    fd.append("file", doc as File);

    fd.append("data", JSON.stringify(newDebt));

    try {
      const authToken = getAuthToken();
      const res = await axios.postForm(`${ENVS.apiUrl}/debts/add`, fd, {
        headers: {
          Authorization: "Bearer " + authToken,
          "Content-Type": "multipart/form-data",
        },
      });
      // const resUpload = await axios.postForm(`${ENVS.apiUrl}/debts/post`, fd, {
      //   headers: {
      //     Authorization: "Bearer " + authToken,
      //     "Content-Type": "multipart/form-data",
      //   },
      // });
      setUpdate(e => !e);
    } catch (err) {
      console.log({ err });
      setError(err);
    }
    setUpdate(e => !e);
  };

  return (
    <UsersContext.Provider
      value={{
        allUsers,
        loading,
        error,
        addDebtToUser,
        // updateUsersProjects,
        // removingUsersProjects,
        setUpdate,
        findUser,
        getRestrictedData,
        createUser,
        deleteUser,
        updateUser,
        verifyUniqueField,
        update,
        deleteProject,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(UsersContext);

  return context;
};
