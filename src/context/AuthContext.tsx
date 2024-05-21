import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { IUserType } from "@/@types";
import axios from "axios";
import { ENVS } from "@/utils/constants";
import { deleteCookie, getCookie, setCookie } from "@/utils/cookieHandler";
import { useRouter } from "next/router";

interface IAuthProvider {
  children: ReactNode;
}

interface AuthContextProps {
  user: IUserType;
  activeUserToken: string | null;
  loading: boolean;
  // signUp: (email: string, password: string) => Promise<any>;
  logIn: (email: string, password: string) => Promise<any>;
  logOut: () => Promise<void>;
  getAuthToken: () => string;
  loadingUserCache: boolean;
  // changeUserPassword: (newPassword: string) => Promise<void>;
  // changeUserEmail: (newEmail: string) => Promise<void>;
}

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({ children }: IAuthProvider) => {
  const [loadingUserCache, setLoadingUserCache] = useState(true);
  const [user, setUser] = useState<IUserType>({
    email: null,
    uid: null,
    permission: null,
  });
  const [activeUserToken, setActiveUserToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const checkToken = async (token: string) => {
    let response;
    try {
      const res = await axios.get(`${ENVS.apiUrl}/authping`, {
        headers: { Authorization: "Bearer " + token },
      });
      response = res.data;
    } catch (error) {
      console.log(error);
    }

    return response;
  };

  const logIn = async (email: string, password: string) => {
    setLoading(true);
    let error;

    await axios
      .post(
        `http://localhost:3333/api/v1/login`,
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
      .then((response: any) => {
        const res = response.data;
        const token = res.token;
        setCookie("_at", token, 1);
        setUser({ email: res.email, uid: res.uid, permission: res.permission });
      })
      .catch(err => {
        error = err;
        if (err.response) {
          console.log("Error response:", error.response);
        } else if (error.request) {
          console.log("Error request:", error.request);
        } else {
          console.log("Error message:", error.message);
        }
      })
      .finally(() => {
        setLoading(false);
      });

    console.log({ error });

    return error ? error : "Login Success";
  };

  const getAuthToken = () => {
    return getCookie("_at");
  };

  const logOut = async () => {
    deleteCookie("_at");
    setUser({ email: null, uid: null, permission: null });
    router.push("/");
  };

  useEffect(() => {
    setLoadingUserCache(true);
    const fetcher = async () => {
      const token = getAuthToken();
      if (token || token !== "undefined") {
        const check: any = await checkToken(token);
        console.log({ check });
        if (check?.result) {
          setUser({
            email: check.user.email,
            uid: check.user.uid,
            permission: check.user.permission,
          });
        } else {
          deleteCookie("_at");
        }
        setActiveUserToken(token);
      } else {
        deleteCookie("_at");
      }
      setLoadingUserCache(false);
    };

    fetcher();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        activeUserToken,
        loading,
        // signUp,
        logIn,
        logOut,
        getAuthToken,
        loadingUserCache,
        // changeUserPassword,
        // changeUserEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  return context;
};
