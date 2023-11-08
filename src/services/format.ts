import {
  IDateObj,
  IFilterKeyOption,
  IFormatItem,
  IRestrictedDataType,
} from "@/@types";

export const capitalize = (str: string) => {
  if (str === "") return "";

  const strCapitalize = str?.charAt(0)?.toUpperCase() + str?.slice(1);
  return strCapitalize;
};

export const getAge = (strDate: string): string | number => {
  return (
    parseInt(new Date(Date.now()).toISOString().split("T")[0].split("-")[0]) -
    +strDate.split("/")[2]
  );
};

export const formatItem = (
  value: IFormatItem,
  key?: IFilterKeyOption | keyof IRestrictedDataType | "age",
): string | null => {
  if (key) {
    if (
      key === "birthday" ||
      key === "deadline" ||
      key === "startDate" ||
      key === "comments"
    ) {
      return (
        new Date((value as IDateObj)?.seconds * 1000)
          ?.toISOString()
          ?.split("T")[0]
          ?.split("-")
          ?.reverse()
          ?.join("/") || ""
      );
    }
    if (key === "age") {
      return getAge(
        new Date((value as IDateObj)?.seconds * 1000)
          .toISOString()
          .split("T")[0]
          .split("-")
          .reverse()
          .join("/"),
      ).toString();
    }
    if (key === "projects" || key === "teamUids") {
      return (value as string[])?.length.toString();
    }
    if (key === "cpf") {
      return formatCPF(value as string);
    }
    if (key === "telefone") {
      return formatPhone(value as string);
    }
    if (key === "workType") {
      return (value as string).toUpperCase();
    }
  }

  if (typeof value === "string") {
    return value;
  }

  return null;
};

export const parseCamelCase = (camelStr: string): string => {
  return capitalize(camelStr.split(/(?=[A-Z])/).join(" "));
};

export const translateItemKeys = (
  itemKey: IFilterKeyOption | "age",
): string | undefined => {
  return (
    {
      email: "Email",
      name: "Nome",
      deadline: "Prazo",
      description: "Descrição",
      stack: "Tecnologias",
      teamUids: "Time",
      startDate: "Data de Inicio",
      permissionLevel: "Nivel de Permissões",
      occupation: "Área de Atuação",
      projects: "Projetos",
      birthday: "Data de Nascimento",
      age: "Idade",
      comments: "Comentarios",
      workType: "Regime de Trabalho",
      cpf: "CPF",
      rg: "RG",
      telefone: "Contato",
    }?.[itemKey] || itemKey
  );
};

export const sortItemsData = (data: any) => {
  const dataCopy = JSON.parse(JSON.stringify(data));
  const dataEntries = Object.entries(dataCopy);

  const name = dataEntries.filter(e => e[0] === "name");
  const others = dataEntries.filter(e => e[0] !== "name");

  others.sort();

  return [...name, ...others];
};

const formatCPF = (cpf: string): string => {
  cpf = cpf.replace(/[^\d]/g, "");

  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};
const formatPhone = (phone: string): string => {
  if (/^\d{11}$/.test(phone)) {
    const ddd = phone.substring(0, 2);
    const parte1 = phone.substring(2, 3);
    const parte2 = phone.substring(3, 7);
    const parte3 = phone.substring(7);

    // Formata o número de telefone
    const formatedPhone = `(${ddd}) ${parte1} ${parte2}-${parte3}`;
    return formatedPhone;
  }
  return phone;
};

export const formatInvalidMessage = (invalidMessage: string[]) => {
  return invalidMessage.join(" já cadastrado \n\r");
};
