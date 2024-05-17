import {
  IFormFieldType,
  IProjectDataType,
  IRestrictedDataType,
  ISignupType,
  IUserDataType,
} from "@/@types";
import AuthForm from "@/components/Auth/AuthForm";
import Loading from "@/components/UI/Loading";
import { useModals } from "@/context/ModalsContext";
import { useProjects } from "@/context/ProjectsContext";
import { useUsers } from "@/context/UsersContext";
import { translateItemKeys, formatItem } from "@/services/format";
import { milissecondsInAYear } from "@/utils/constants";
import { Timestamp } from "firebase/firestore";
import router, { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface Props {
  type: "debt" | "costumer";
}

const DeleteColaboratorModal = ({ type }: Props) => {
  const { setModalIsOpen } = useModals();
  const { deleteUser, allUsers, loading, error, deleteProject } = useUsers();
  const { allProjects } = useProjects();
  const router = useRouter();
  const [checkError, setCheckError] = useState<string | null>();

  const [currentUser, setCurrentUser] = useState<any | undefined>();
  const [checkNameInput, setCheckNameInput] = useState<string>();

  useEffect(() => {
    const id = router?.asPath?.split("/").pop();
    if (id)
      setCurrentUser(
        (type === "costumer" ? allUsers : allProjects).find(
          (e: any) =>
            e?.[type === "costumer" ? "costumer_id" : "debt_id"] === id,
        ),
      );
  }, [allProjects, allUsers, router?.asPath, type]);

  const onDeleteColaborator = async () => {
    if (
      type !== "costumer" ||
      checkNameInput === currentUser?.name + " " + currentUser?.last_name
    ) {
      if (currentUser) {
        try {
          type === "costumer"
            ? await deleteUser(currentUser?.costumer_id)
            : await deleteProject(currentUser?.debt_id);
          setSubmitted(true);
          router.push("/costumers");
        } catch (err) {
          console.log({ err });
        }
      }
    } else {
      setCheckError("Nome na caixa de validação não bate");
    }
  };

  const [submitted, setSubmitted] = useState(false);

  const renderFormContent = () => {
    if (loading) return <Loading />;

    if (submitted)
      return (
        <div className="flex flex-col w-full h-full justify-center items-center mx-auto text-[26px] text-center dark:text-white">
          <div>
            {error
              ? error
              : type === "costumer"
              ? "Cliente Excluido com Sucesso"
              : "Débito Excluido com Sucesso"}
          </div>
        </div>
      );

    return (
      <div className="flex flex-col h-full justify-center items-center md:mx-auto text-[26px] dark:text-white">
        <div>
          <h4 className="px-12 mt-8 text-center text-2xl font-semibold text-blue-900 dark:text-white">
            Essa ação é irreversível
          </h4>
        </div>
        <div className="md:grid md:grid-cols-2 grid-flow-row gap-4 my-4  overflow-y-auto">
          {Object.entries(currentUser || {}).map(([objEntry, objValue], i) => {
            if (
              [
                "debt_id",
                "debts_ids",
                "_id",
                "__v",
                "createdAt",
                "updatedAt",
                "costumer_id",
              ].includes(objEntry)
            )
              return null;
            return (
              <div key={i}>
                <div className="flex flex-col md:flex-row gap-4 text-center max-w-full">
                  <span>{translateItemKeys(objEntry)}:</span>
                  <span
                    className="!font-light"
                    style={{ overflowWrap: "anywhere" }}
                  >
                    {formatItem(String(objValue), objEntry as any)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        {type === "costumer" && (
          <div className="text-center mb-4">
            <label className="text-sm flex- flex-col">
              Para confirmar escreva o nome completo do cliente aqui{" "}
              <strong>
                {currentUser?.name + " " + currentUser?.last_name}
              </strong>
              <br />
              <input
                type="text"
                className="text-black"
                value={checkNameInput}
                onChange={e => {
                  setCheckError(undefined);
                  setCheckNameInput(e.target.value);
                }}
              />
              <br />
              <small>{checkError}</small>
            </label>
          </div>
        )}
        <div className="flex gap-3 flex-col md:flex-row">
          <button
            className="btn !bg-transparent"
            onClick={() => setModalIsOpen(false)}
          >
            Cancel
          </button>
          <button className="btn" onClick={onDeleteColaborator}>
            Confirm
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto min-w-[250px] md:-w-[800px] w-[300px] lg:min-w-[1000px]">
      <h2 className="px-12 mt-8 text-center text-2xl font-semibold text-blue-900 dark:text-white">
        Excluir {type === "costumer" ? "Cliente" : "Débito"}
      </h2>

      <div className="max-h-[80vh] overflow-y-scroll md:overflow-y-auto md:min-h-[60vh] flex justify-center items-start">
        {renderFormContent()}
      </div>
    </div>
  );
};

export default DeleteColaboratorModal;
