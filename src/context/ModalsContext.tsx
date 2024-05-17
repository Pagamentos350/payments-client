import ChangeColaboratorModal from "@/components/ModalContents/ChangeColaboratorModal";
import CreateColaboratorModal from "@/components/ModalContents/CreateColaboratorModal";
import CreateProjectModal from "@/components/ModalContents/CreateProjectModal";
import DeleteColaboratorModal from "@/components/ModalContents/DeleteColaboratorModal";
import {
  ReactNode,
  Dispatch,
  SetStateAction,
  createContext,
  useState,
  useContext,
} from "react";

interface IModalProvider {
  children: ReactNode;
}

interface ModalContextProps {
  modalIsOpen: boolean;
  setModalIsOpen: Dispatch<SetStateAction<boolean>>;
  modalContent:
    | (() => React.JSX.Element)
    | (() => React.JSX.Element)
    | (() => React.JSX.Element)
    | undefined;
  setModalContentKey: Dispatch<SetStateAction<string>>;
}

export const ModalContext = createContext({} as ModalContextProps);

export const ModalProvider = ({ children }: IModalProvider) => {
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [modalContentKey, setModalContentKey] = useState<string>("default");

  const modalContent = {
    default: () => <></>,
    addcolaborator: () => <CreateColaboratorModal />,
    createprojects: () => <CreateProjectModal />,
    changecolaborator: () => <ChangeColaboratorModal />,
    deletecolaborator: () => <DeleteColaboratorModal type={"costumer"} />,
    deletedebt: () => <DeleteColaboratorModal type={"debt"} />,
  }[modalContentKey];

  return (
    <ModalContext.Provider
      value={{ modalIsOpen, setModalIsOpen, setModalContentKey, modalContent }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModals = () => {
  const context = useContext(ModalContext);

  return context;
};
