import { IProjectDataType, IUserDataType } from "@/@types";
import EditButton from "@/components/Auth/EditButton";
import { translateItemKeys } from "@/services/format";
import { GiConfirmed } from "react-icons/gi";
import { ImCancelCircle } from "react-icons/im";
import SelectionFormField from "../../FormFields/SelectionFormField";
import TinyItem from "../TinyItem";
import { useUsers } from "@/context/UsersContext";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useProjects } from "@/context/ProjectsContext";

interface Props {
  state: any | any[];
  setState: Dispatch<SetStateAction<any | any[]>>;
  objEntries: [string, string[]];
  submit: () => Promise<void>;
}

const EdittableListItems = ({ state, setState, objEntries, submit }: Props) => {
  const { findUser } = useUsers();
  const { findProject } = useProjects();

  const [objKey, objValue] = objEntries;
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      <span className="font-semibold mr-2 relative text-[20px]">
        {translateItemKeys(objKey as any)}:
        {!state && (
          <div className="absolute -top-1 -right-8 z-50">
            <EditButton
              fn={() => {
                let arr = objValue;
                if (objKey === "teamUids") {
                  (arr as any[]) = arr.map((e: any) => findUser(e));
                }
                if (objKey === "projects") {
                  (arr as any[]) = arr.map((e: any) => findProject(e));
                }
                setState(arr);
              }}
            />
          </div>
        )}
        {state && (
          <div className="absolute flex -top-1 gap-2 -right-20 ">
            <GiConfirmed
              className="w-8 h-8 cursor-pointer"
              onClick={() => {
                if (!error) submit();
              }}
            />
            <ImCancelCircle
              className="w-8 h-8 cursor-pointer"
              onClick={() => setState(undefined)}
            />
          </div>
        )}
      </span>

      {!state && (
        <div
          className={` ${
            ["projects", "teamUids"].includes(objKey) ? "flex-col" : ""
          } flex flex-wrap relative mt-8`}
        >
          {Array.isArray(objValue) &&
            (objValue as string[]).map((e, index) => {
              let value: string | IUserDataType | IProjectDataType = e;
              if (objKey === "teamUids") {
                value = findUser(e) || e;
              }
              if (objKey === "projects") {
                value = findProject(e) || e;
              }
              if (typeof value === "string") {
                return <TinyItem key={index} value={value} />;
              }
              return (
                <div key={index}>
                  <div>
                    {value.name}
                    {(value as IUserDataType)?.occupation && (
                      <div className="flex flex-wrap">
                        {(value as IUserDataType)?.occupation.map(
                          (e, index2) => {
                            return <TinyItem key={index2} value={e} />;
                          },
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      )}
      {state !== undefined && (
        <SelectionFormField
          type={objKey}
          states={[state, setState]}
          setError={setError}
        />
      )}
      {error && state && <div>{error}</div>}
    </div>
  );
};

export default EdittableListItems;
