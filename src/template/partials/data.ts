import { INavActions, INavLinks } from "@/@types";

export const navigationLinks: INavLinks = [
  // {
  //   displayName: "Resumo",
  //   subpaths: [{ displayName: "Painel", path: "/dashboard" }],
  // },
  {
    displayName: "Detalhes",
    subpaths: [
      { displayName: "Clientes", path: "/colaborators" },
      // { displayName: "Projetos", path: "/projects" },
    ],
  },
];

export const restrictedNav: INavActions = [
  {
    displayName: "Gerenciamento",
    subActions: [
      { displayName: "Adicionar Cliente", action: "addcolaborator" },
      // { displayName: "Criar Projeto", action: "createprojects" },
    ],
  },
];
export const manageNav: INavActions = [
  // {
  //   displayName: "Configurações",
  //   subActions: [
  //     { displayName: "Gerenciar Credenciais", action: "changecolaborator" },
  //   ],
  // },
];
