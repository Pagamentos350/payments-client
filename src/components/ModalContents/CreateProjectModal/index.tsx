import { IFormFieldType, IProjectDataType } from "@/@types";
import AuthForm from "@/components/Auth/AuthForm";
import CompanyLogo from "@/components/UI/CompanyLogo";
import Loading from "@/components/UI/Loading";
import { useAuth } from "@/context/AuthContext";
import { useModals } from "@/context/ModalsContext";
import { useProjects } from "@/context/ProjectsContext";
import { useUsers } from "@/context/UsersContext";
import { formatItem, translateItemKeys } from "@/services/format";
import { Timestamp } from "firebase/firestore";
import { useRouter } from "next/router";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const CreateProjectModal = () => {
  const {
    sendNewProject,
    loading: projectsLoading,
    error: projectsError,
    setUpdate: setUpdateProjects,
  } = useProjects();
  const { addDebtToUser } = useUsers();

  const [submitted, setSubmitted] = useState(false);
  const [dueDates, setDueDates] = useState<Date[]>([]);
  const [confirmation, setConfirmation] = useState<boolean>(false);
  const [debtData, setDebtData] = useState<Partial<IProjectDataType>>({});

  const onSubmit = async (data: any) => {
    console.log({ data });
    data.value = data.initial_value * (1 + data.fee / 100);
    setDebtData(data);
    setConfirmation(true);
  };

  const formFields: IFormFieldType = {
    initial_value: {
      required: "Valor inicial é necessário",
      fieldLabel: "Valor Inicial (R$)",
      fieldType: "text",
      divClassName: "col-start-1 col-end-3",
      defaultValue: String(debtData?.initial_value || 0),
    },
    description: {
      fieldType: "textarea",
      fieldLabel: "Descrição",
      divClassName: "col-start-1 col-end-4 row-start-2 row-end-6",
      inputClassName: "max-h-32",
      defaultValue: String(debtData?.description || ""),
    },
    fee: {
      required: "Taxa é necessário",
      fieldLabel: "Taxa (%)",
      fieldType: "number",
      defaultValue: String(debtData?.fee || 0),
      min: "0",
      step: "0.01",
    },
    initial_date: {
      required: "Data de Inicio é necessário",
      fieldType: "date",
      fieldLabel: "Data de Inicio",
      defaultValue:
        (debtData?.initial_date as unknown as string) ||
        new Date(Date.now()).toISOString(),
    },
    due_dates: {
      required: "Prazos é necessário",
      fieldType: "date",
      fieldLabel: "Prazos",
      defaultValue: String(debtData?.due_dates || ""),
    },
    payed: {
      fieldLabel: "Pago adiatado (R$)",
      fieldType: "number",
      defaultValue: String(debtData?.payed || 0),
    },
    late_fee: {
      fieldLabel: "Multa por atraso (R$)",
      required: "Multa por Atraso é necessario",
      fieldType: "number",
      step: "0.01",
      defaultValue: String(debtData?.late_fee || 0),
    },
    callings: {
      fieldLabel: "Cobranças",
      required: "Cobraças é necessario",
      fieldType: "number",
      defaultValue: String(debtData?.callings || 0),
    },
    payment_debt: {
      fieldLabel: "Método de Pagamento",
      fieldType: "string",
      defaultValue: String(debtData?.payment_method || ""),
    },
  };

  const submitBtn = () => {
    if (projectsLoading) {
      return (
        <div className="loading-circle !h-[30px] after:!h-[10px] !border-[6px] !border-white !border-t-[transparent] after:hidden"></div>
      );
    }
    return "Submit";
  };

  if (confirmation) {
    return (
      <div className="flex flex-col h-full justify-center items-center md:mx-auto text-[26px] dark:text-white">
        <div>
          <h4 className="text-center">Confirme os dados</h4>
        </div>
        <div className="md:grid md:grid-cols-2 grid-flow-row gap-4 my-4  overflow-y-auto">
          {Object.entries(debtData).map(([objEntry, objValue], i) => {
            return (
              <div key={i}>
                <div className="flex flex-col md:flex-row">
                  <span>{translateItemKeys(objEntry)}:</span>{" "}
                  <span className="!font-light">
                    {formatItem(String(objValue), objEntry as any)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex gap-3">
          <button
            className="btn !bg-transparent"
            onClick={() => setConfirmation(false)}
          >
            Cancel
          </button>
          <button className="btn">Confirm</button>
        </div>
      </div>
    );
  }

  const renderFormContent = () => {
    if (projectsLoading) return <Loading />;

    if (submitted)
      return (
        <div className="flex flex-col h-full justify-center items-center mx-auto text-[26px]">
          <div>
            {projectsError ? projectsError : "Projeto Criado com Sucesso"}
          </div>
        </div>
      );

    return (
      <AuthForm
        className="w-full flex justify-center items-start flex-col h-full md:items-start md:grid md:grid-cols-3 md:gap-x-4"
        handleOnSubmit={onSubmit}
        submitBtn={submitBtn}
        formFields={formFields}
      />
    );
  };

  return (
    <div className="container mx-auto min-w-[250px] md:-w-[800px] w-[300px] lg:min-w-[1000px]">
      <h2 className="px-12 mt-8 text-center text-2xl font-semibold text-blue-900 dark:text-white">
        Novo Débito
      </h2>
      <div className="max-h-[80vh] overflow-y-scroll md:overflow-y-auto md:min-h-[60vh] flex justify-center items-start">
        {renderFormContent()}
      </div>
    </div>
  );
};

export default CreateProjectModal;
