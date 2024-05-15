import { Transition } from "@headlessui/react";
import { Dialog } from "@headlessui/react";
import { AiOutlineClose } from "react-icons/ai";
import { SetStateAction, Dispatch, ReactElement } from "react";
import BackgroundLayer from "@/components/UI/Animations/BackgroundLayer";
import { useModals } from "@/context/ModalsContext";

interface ModalProps {
  children?: ReactElement;
  scroll?: boolean;
}

const Modal = ({ children, scroll = false }: ModalProps) => {
  const { modalIsOpen, setModalIsOpen } = useModals();

  return (
    <Transition.Root show={modalIsOpen}>
      <div>
        <div
          className="fixed inset-0 z-[350] bg-[#0f0f0f] opacity-80 blur-3xl"
          aria-hidden="true"
        />

        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
        <BackgroundLayer onClick={() => setModalIsOpen(false)} />

          <div className="fixed z-[201] md:min-w-[500px]">
            <div
              className={`bg-white dark:bg-[#333333] relative mt-8 flex h-full w-[350px] flex-col justify-center rounded-[20px] border-[2px] border-black/75 p-5 md:w-[100%] md:p-8 ${
                scroll ? "!h-[90vh] overflow-y-auto" : ""
              } `}
            >
              <button
                onClick={() => setModalIsOpen(false)}
                className="absolute right-2 top-2 text-3xl text-black dark:text-white"
              >
                <AiOutlineClose />
              </button>
              {children}
            </div>
          </div>
        </div>
      </div>
    </Transition.Root>
  );
};

export default Modal;
