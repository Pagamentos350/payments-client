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
  key?: Partial<IFilterKeyOption> | keyof Partial<IRestrictedDataType> | "age",
): string | number | null => {
  if (key) {
    if (key.toLowerCase().indexOf("date") !== -1) {
      return (
        (value as string)?.split("T")[0]?.split("-")?.reverse()?.join("/") || ""
      );
    }
    if (key === "age") {
      return null;
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
  if (typeof value === "number") {
    return value;
  }
  return null;
};

export const parseCamelCase = (camelStr: string): string => {
  return capitalize(camelStr.split(/(?=[A-Z])/).join(" "));
};

export const translateItemKeys = (
  itemKey: Partial<IFilterKeyOption> | "age" | string,
): string | undefined => {
  return (
    {
      email: "Email",
      name: "Nome",
      debt_ids: "Débitos",
      last_name: "Sobrenome",
      phone: "Celular",
      adress: "Endereço",
      cep: "CEP",
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
      callings: "Vezes cobradas",
      fee: "Taxa",
      initial_value: "Valor Inicial",
      late_fee: "Multa por Atraso",
      payed: "Valor Pago",
      payment_method: "Método",
      value: "Valor Atual",
      initial_date: "Data de Inicio",
    }?.[itemKey as string] || itemKey
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

    const formatedPhone = `(${ddd}) ${parte1} ${parte2}-${parte3}`;
    return formatedPhone;
  }
  return phone;
};

export const formatInvalidMessage = (invalidMessage: string[]) => {
  return invalidMessage.join(" já cadastrado \n\r");
};
