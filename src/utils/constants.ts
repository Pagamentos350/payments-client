export const ENVS = {
  apiUrl: process.env.apiUrl as string,
};

export const publicRoutes = ["/", "/redefinepassword", "/about"];
export const privateRoutes = ["/costumers", "/debts", "/costumers/[id]", "/debts/[id]"];

export const defaultColor = "#a40100";

export const possiblesStacks = {
  Javascript: "#F7DF1E",
  Python: "#3776AB",
  Java: "#007396",
  "C#": "#178600",
  Ruby: "#CC342D",
  PHP: "#4F5D95",
  Typescript: "#3178C6",
  Swift: "#FFAC45",
  Kotlin: "#F88E2D",
  "C++": "#005395",
  Rust: "#000000",
  Go: "#00ADD8",
  Dart: "#00B4AB",
  Elixir: "#6E4A7E",
  Haskell: "#5D4F94",
  Scala: "#DC322F",
  Lua: "#000080",
  Perl: "#39457E",
  HTML: "#E34F26",
  CSS: "#1572B6",
  SQL: "#E34F26",
  R: "#276DC3",
  "Objective-C": "#000080",
  C: "#555555",
  VHDL: "#DA70D6",
  COBOL: "#000000",
  Fortran: "#4D220E",
  Erlang: "#B83998",
  Ada: "#02F88C",
  Pascal: "#E3F171",
  Firebase: "#FFA000",
  Node: "#8CC84B",
  Nextjs: "#CCCCCC",
};

export const possibleOccupations = {
  frontend: "#61DAFB",
  backend: "#FF6F61",
  engenheiro: "#40A9FF",
  gerente: "#FFD700",
  "ui/ux": "#7D3C98",
  qa: "#8BC34A",
  arquiteto: "#FFC107",
  analista: "#FF5722",
  scrum: "#009688",
  devops: "#FF9800",
  segurança: "#673AB7",
};

export const minimumOccupationsToProjects = ["gerente", "frontend", "backend"];

export const possiblesWorkTypes = {
  clt: "#61DAFB",
  pj: "#FF6F61",
};

export const milissecondsInAYear = 365 * 24 * 60 * 60 * 1000;
