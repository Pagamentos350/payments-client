import { Dispatch, SetStateAction } from "react";
import { RegisterOptions } from "react-hook-form";

type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> &
      Partial<Record<Exclude<Keys, K>, undefined>>;
  }[Keys];

type ObtainKeys<Obj, Type> = {
  [Prop in keyof Obj]: Obj[Prop] extends Type ? Prop : never;
}[keyof Obj];

interface INavData {
  displayName: string;
  path?: string;
  subpaths?: Omit<INavData, "subpaths">[];
}

interface INavActionsData {
  displayName: string;
  action?: string;
  subActions?: Omit<INavActionsData, "subpaths">[];
}

export type INavLinksItem = RequireOnlyOne<INavData, "path" | "subpaths">;
export type INavLinks = INavLinksItem[];
export type INavActionsItem = RequireOnlyOne<
  INavActionsData,
  "action" | "subActions"
>;
export type INavActions = INavActionsItem[];

export interface IImageHiperlink {
  id: string;
  path: string;
  src: string;
  alt: string;
}
export interface IUserType {
  email: string | null;
  uid: string | null;
  permission: number | null;
}

export interface IRestrictedDataType {
  uid: string;
  workType: string;
  telefone: string;
  rg: string;
  cpf: string;
}

export interface ILoginType {
  email: string;
  password: string;
}

export interface ISignupType extends ILoginType {
  password_confirm: string;
}

export type IFormRegisterType = Partial<{
  [key: string]: string;
}> &
  ILoginType &
  ISignupType;

type formStatesAction = [any | any[], Dispatch<SetStateAction<any | any[]>>];

export type IFormFieldOptions = RegisterOptions & {
  fieldType: string;
  fieldLabel?: string;
  labelClassName?: string;
  errorClassName?: string;
  inputClassName?: string;
  divClassName?: string;
  placeholder?: string;
  defaultValue?: string;
  step?: string | number;
  _formStates?: formStatesAction;
  options?: string[],
};

export interface IFormFieldType {
  [formName: string]: IFormFieldOptions;
}
export interface IComments {
  date: Date;
  text: string;
  user_id: string;
}
export interface IDateObj {
  seconds: number;
  nanoseconds: number;
}
export type IProjectDataType = {
  costumer_id: string;
  callings: number;
  debt_id: string;
  value: number;
  initial_value: number;
  payment_method: string;
  fee: number;
  initial_date: Date;
  due_dates: Date[];
  payed: number;
  late_fee: number;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};

export type IUserDataType = { email: string } & IUserType & {
    costumer_id: string;
    debts_ids: string[];
    name: string;
    last_name: string;
    phone: string;
    adress: string;
    cep: string;
    cpf: string;
    rg: string;
    details: string;
    createdAt: Date;
    updatedAt: Date;
  };

export type OmittedTS = "id" | "uid" | "createdAt" | "updatedAt";

type IFilterKeys =
  | ObtainKeys<
      Omit<IProjectDataType, OmittedTS>,
      string | IDateObj | Array<string> | number | Date
    >
  | ObtainKeys<
      Omit<IUserDataType, OmittedTS>,
      string | IDateObj | Array<string> | null
    >;

export type IFilterKeyOption = IFilterKeys;

export type IFilterOptions = {
  [key in IFilterKeyOption | "age"]?: string | { ASC: boolean | null };
};

type IDataItems = IProjectDataType & IUserDataType;

type ItemsUniqueType = {
  [K in keyof IDataItems]: IDataItems[K];
}[keyof IDataItems];

export type IFormatItem = ItemsUniqueType;
