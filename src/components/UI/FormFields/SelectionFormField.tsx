import {
  minimumOccupationsToProjects,
  possibleOccupations,
  possiblesStacks,
  possiblesWorkTypes,
} from "@/utils/constants";
import TinyItem from "../Items/TinyItem";
import { Dispatch, Fragment, SetStateAction, useEffect, useState } from "react";
import { AiOutlineClose, AiOutlineSearch } from "react-icons/ai";
import { useUsers } from "@/context/UsersContext";
import { stringVerifier } from "@/services/errorHandler";
import { Transition } from "@headlessui/react";
import { useProjects } from "@/context/ProjectsContext";

interface Props {
  type: string;
  states: [
    string[] | { uid: string; name: string; occupation: string[] }[],
    Dispatch<SetStateAction<any | any[]>>,
  ];
  setError: Dispatch<SetStateAction<string | null>>;
}

const SelectionFormField = ({ type, states, setError }: Props) => {
  const [searchStr, setSearchStr] = useState<string>("");
  const [showSelection, setShowSelection] = useState<boolean>(false);
  const { allUsers, findUser } = useUsers();
  const { allProjects, findProject } = useProjects();

  useEffect(() => {
    if (type === "teamUids") {

      if (states[0].length === 0) {
        return setError("Selecione pelo menos uma pessoa para o time");
      }
    } else {
      if (states[0].length === 0) {
        if (type === "projects") {
          return;
        }
        return setError(
          `Selecione pelo menos um${
            {
              teamUids: "a pessoa para o time",
              stack: "a tecnologia",
              workType: " regime de trabalho",
              occupation: "a area de atuação",
            }?.[type] || "a tecnologia"
          }`,
        );
      }
    }

    if (
      type === "teamUids" &&
      !stringVerifier(
        states[0].flatMap((e: any) => e.occupation),
        minimumOccupationsToProjects,
      )
    ) {
      return setError(
        `Um projeto precisa ter no mínimo um ${minimumOccupationsToProjects.join(
          " um ",
        )}`,
      );
    }
    setError(null);
  }, [setError, showSelection, states, type]);

  const renderInputBox = (type: string) => {
    if (type === "teamUids") {
      return states[0].map((e: any, index: number) => {
        const value =
          e?.name?.split(" ")?.[0] || findUser(e)?.name?.split(" ")?.[0] || e;
        return (
          <div
            key={index}
            onClick={() =>
              handleUserSelection({
                name: e.name,
                uid: e.uid,
                occupation: e.occupation,
              })
            }
          >
            <TinyItem value={value} />
          </div>
        );
      });
    }
    if (type === "projects") {
      return states[0].map((e: any, index: number) => {
        const value =
          e?.name?.split(" ")?.[0] ||
          findProject(e)?.name?.split(" ")?.[0] ||
          e;
        return (
          <div
            key={index}
            onClick={() =>
              handleProjectSelection({
                name: e.name,
                id: e.id,
              })
            }
          >
            <TinyItem value={value} />
          </div>
        );
      });
    }

    if (type === "stack" || type === "workType" || type === "occupation") {
      return states[0].map((e: any, index: number) => (
        <div key={index} onClick={() => handleSelection(e)}>
          <TinyItem
            value={
              type === "occupation" || type === "workType" ? e.toUpperCase() : e
            }
          />
        </div>
      ));
    }

    return;
  };

  const renderItems = (type: string) => {
    if (type === "teamUids") {
      return (
        <div className="mb-10 flex flex-col gap-6">
          Selecionados
          <div className="flex gap-4 flex-wrap">
            {states[0].map((e: any, index: number) => (
              <div
                key={index}
                className="w-full border-solid border-b border-b-gray-400 ml-2 pb-2"
                onClick={() =>
                  handleUserSelection({
                    name: e.name,
                    uid: e.uid,
                    occupation: e.occupation,
                  })
                }
              >
                {e.name}
                <br />
                <div>
                  {e?.occupation?.map((e: any, index: number) => (
                    <TinyItem key={index} value={e} />
                  ))}
                </div>
              </div>
            ))}
          </div>
          Opções
          <div className="flex gap-4 flex-wrap">
            {allUsers
              .filter(item => {
                return (
                  (searchStr !== ""
                    ? item.name.toLowerCase().startsWith(searchStr)
                    : true) &&
                  !states[0]?.map((e: any) => e.uid).includes(item.uid)
                );
              })
              .map((e, index) => (
                <div
                  key={index}
                  className="w-full border-solid border-b border-b-gray-400 ml-2 pb-2"
                  onClick={() =>
                    handleUserSelection({
                      name: e.name,
                      uid: e.uid,
                      occupation: e.occupation,
                    })
                  }
                >
                  {e.name}
                  <br />
                  <div>
                    {e.occupation.map((e, index) => (
                      <TinyItem key={index} value={e} />
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      );
    }
    if (type === "projects") {
      return (
        <div className="mb-10 flex flex-col gap-6">
          Selecionados
          <div className="flex gap-4 flex-wrap">
            {states[0].map((e: any, index: number) => (
              <div
                key={index}
                className="w-full border-solid border-b border-b-gray-400 ml-2 pb-2"
                onClick={() =>
                  handleProjectSelection({
                    name: e.name,
                    id: e.id,
                  })
                }
              >
                {e?.name}
              </div>
            ))}
          </div>
          Opções
          <div className="flex gap-4 flex-wrap">
            {allProjects
              .filter(item => {
                return (
                  (searchStr !== ""
                    ? item.name.toLowerCase().startsWith(searchStr)
                    : true) && !states[0]?.map((e: any) => e).includes(item.id)
                );
              })
              .map((e, index) => (
                <div
                  key={index}
                  className="w-full border-solid border-b border-b-gray-400 ml-2 pb-2"
                  onClick={() =>
                    handleProjectSelection({
                      name: e.name,
                      id: e.id,
                    })
                  }
                >
                  {e?.name}
                </div>
              ))}
          </div>
        </div>
      );
    }

    if (type === "stack" || type === "workType" || type === "occupation") {
      return (
        <div className="mb-10 flex flex-col gap-6">
          Selecionados
          <div className="flex gap-4 flex-wrap">
            {states[0].map((e: any, index: number) => (
              <div key={index} onClick={() => handleSelection(e)}>
                <TinyItem
                  value={
                    type === "occupation" || type === "workType"
                      ? e.toUpperCase()
                      : e
                  }
                />
              </div>
            ))}
          </div>
          Opções
          <div className="flex gap-4 flex-wrap">
            {Object.keys(
              {
                stack: possiblesStacks,
                workType: possiblesWorkTypes,
                occupation: possibleOccupations,
              }?.[type] || possiblesStacks,
            )
              .filter(item => {
                return (
                  (searchStr !== ""
                    ? item.toLowerCase().startsWith(searchStr)
                    : true) && !(states[0] as string[]).includes(item)
                );
              })
              .map((e, index) => (
                <div key={index} onClick={() => handleSelection(e)}>
                  <TinyItem
                    value={
                      type === "occupation" || type === "workType"
                        ? e.toUpperCase()
                        : e
                    }
                  />
                </div>
              ))}
          </div>
        </div>
      );
    }

    return null;
  };

  const handleSelection = (element: string) => {
    states[1]((prevState: any) => {
      const newState = JSON.parse(JSON.stringify(prevState));
      const index = newState.indexOf(element);

      if (index !== -1) {
        newState.splice(index, 1);
      } else {
        if (type === "workType") {
          return [element];
        }
        newState.push(element);
      }
      if (states) {
        states[1](newState);
      }

      return newState;
    });
  };
  const handleUserSelection = (element: {
    name: string;
    uid: string;
    occupation: string[];
  }) => {
    console.log({ element });

    states[1]((prevState: any) => {
      const newState = JSON.parse(JSON.stringify(prevState));
      const index = newState.map((e: any) => e.uid).indexOf(element.uid);

      if (index !== -1) {
        newState.splice(index, 1);
      } else {
        newState.push(element);
      }

      if (states) {
        states[1](
          newState.map(
            (e: { uid: string; name: string; occupation: string }) => e.uid,
          ),
        );
      }
      return newState;
    });
  };
  const handleProjectSelection = (element: { name: string; id: string }) => {
    console.log({ element });

    states[1]((prevState: any) => {
      const newState = JSON.parse(JSON.stringify(prevState));
      const index = newState.map((e: any) => e.id).indexOf(element.id);

      if (index !== -1) {
        newState.splice(index, 1);
      } else {
        newState.push(element);
      }

      if (states) {
        states[1](newState.map((e: { id: string; name: string }) => e.id));
      }
      return newState;
    });
  };

  return (
    <div className="relative min-w-[200px] w-full ">
      <Transition.Root show={showSelection}>
        <Transition.Child
          as={Fragment}
          enter="transition-all ease duration-500"
          enterFrom={"h-0"}
          enterTo={"h-[400%]"}
          leave="transition-all ease duration-500"
          leaveFrom={"h-[400%]"}
          leaveTo={"h-0"}
        >
          <div className="absolute flex flex-col bg-gray-200 pt-12 p-4 w-full min-w-[200px] h-[400%] bottom-[-5px] overflow-x-hidden z-10 rounded-lg overflow-y-scroll">
            <div
              onClick={() => setShowSelection(false)}
              className="absolute left-2 top-2 text-3xl text-black dark:text-white"
            >
              <AiOutlineClose />
            </div>
            <div className="h-8 relative flex justify-end mb-4">
              <input
                type="text"
                value={searchStr}
                onChange={evt => setSearchStr(evt.target.value)}
                className="h-8 mb-2 pr-[40px] w-[150px] bg-transparent border-b border-b-blue-900 dark:border-b-white focus:outline-none"
              />
              <div className="absolute top-[20%] right-3 text-blue-900 dark:text-white">
                <AiOutlineSearch className=" w-[24px] h-[24px] " />
              </div>
            </div>
            {renderItems(type)}
          </div>
        </Transition.Child>
      </Transition.Root>
      <div
        onClick={() => setShowSelection(true)}
        className={`${
          showSelection ? "z-20" : ""
        } md:z-20 cursor-pointer relative border border-solid bg-white rounded-lg ring:0 focus:ring-0 focus:outline-none border-gray-400 text-gray-500 text-normal py-3 h-12 px-6 text-lg w-full flex items-center overflow-hidden`}
      >
        {renderInputBox(type)}
      </div>
    </div>
  );
};

export default SelectionFormField;
