import {
  ReactNode,
  Dispatch,
  SetStateAction,
  createContext,
  useState,
  useContext,
  useEffect,
} from "react";

interface IThemeProvider {
  children: ReactNode;
}

interface ThemeContextProps {
  theme: string;
  setTheme: Dispatch<SetStateAction<"dark" | "light">>;
}

export const ThemeContext = createContext({} as ThemeContextProps);

export const ThemeProvider = ({ children }: IThemeProvider) => {
  const [theme, setTheme] = useState<"dark" | "light">("light");

  useEffect(() => {
    const preferedTheme: string =
      localStorage?.getItem("theme-prefered") || "light";
    setTheme(preferedTheme as "dark" | "light");
  }, []);
  useEffect(() => {
    localStorage?.setItem("theme-prefered", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  return context;
};
