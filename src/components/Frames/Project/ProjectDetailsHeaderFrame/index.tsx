import { IDateObj, IFilterKeyOption, IProjectDataType } from "@/@types";
import EditButton from "@/components/Auth/EditButton";
import { useProjects } from "@/context/ProjectsContext";
import { formatItem, translateItemKeys } from "@/services/format";
import { useEffect, useState } from "react";
import { AiOutlineProject } from "react-icons/ai";
import { ImCancelCircle } from "react-icons/im";
import { GiConfirmed } from "react-icons/gi";

interface Props {
  project: IProjectDataType;
}

const ProjectDetailsHeaderFrame = ({ project }: Props) => {
  const { updateProjects } = useProjects();

  const [edittables, setEdittables] = useState<Partial<IProjectDataType>>({});

  const handleChangeEdittables = (
    key: keyof IProjectDataType,
    value: string | IDateObj | undefined,
  ) => {
    setEdittables(prevState => {
      const newState = JSON.parse(JSON.stringify(prevState));
      newState[key] = value;
      return newState;
    });
  };

  const handleInputType = (key: keyof IProjectDataType) => {
    if (["initial_date", "due_dates"].includes(key)) {
      return "date";
    }
    if (
      [
        "value",
        "fee",
        "initial_value",
        "payed",
        "callings",
        "late_fee",
      ].includes(key)
    ) {
      return "number";
    }
    return "text";
  };

  const submitEdittable = async (key: keyof IProjectDataType) => {
    const obj: any = { debt_id: project.debt_id };
    obj[key] = edittables[key];

    if (key === "initial_value") {
      obj.value = Number(obj[key]) * (1 + Number(project.fee) / 100);
    }

    console.log(edittables);
    await updateProjects(obj);
    // handleChangeEdittables(key, undefined);
  };

  return (
    <div className="frame-container">
      <div className="w-[80%]">
        <div className="flex justify-start items-center">
          <AiOutlineProject className="h-24 w-24" />
          {!edittables?.value && (
            <h3 className="font-bold text-[26px] w-[60%] relative">
              {edittables?.value || project?.value}{" "}
            </h3>
          )}
          {edittables?.value && (
            <div className="relative w-[60%]">
              <input
                className="font-bold text-[26px] w-full bg-transparent"
                type="text"
                value={edittables?.value || project.value}
                onChange={evt =>
                  setEdittables({ value: parseFloat(evt.target.value) })
                }
              />
              <div className="absolute flex top-1 gap-2 -right-20 ">
                <GiConfirmed
                  className="w-8 h-8 cursor-pointer"
                  onClick={() => submitEdittable("value")}
                />
                <ImCancelCircle
                  className="w-8 h-8 cursor-pointer"
                  onClick={() => setEdittables({ value: undefined })}
                />
              </div>
            </div>
          )}
        </div>

        <div>
          {!edittables?.description && (
            <p className="relative ">
              {project?.description}
              <span className="absolute top-1 -right-8">
                <EditButton
                  fn={() =>
                    handleChangeEdittables("description", project.description)
                  }
                />
              </span>
            </p>
          )}
          {edittables?.description && (
            <div className="relative">
              <textarea
                className="w-full text-xl bg-transparent"
                value={edittables?.description || project.description}
                onChange={evt =>
                  handleChangeEdittables("description", evt.target.value)
                }
              />
              <div className="absolute flex top-1 gap-2 -right-20 ">
                <GiConfirmed
                  className="w-8 h-8 cursor-pointer"
                  onClick={() => submitEdittable("description")}
                />
                <ImCancelCircle
                  className="w-8 h-8 cursor-pointer"
                  onClick={() =>
                    handleChangeEdittables("description", undefined)
                  }
                />
              </div>
            </div>
          )}
        </div>
        <div className="grid md:grid-cols-2 grid-cols-1 justify-evenly gap-4  border-t-gray-300 border-t mt-4">
          {Object.entries({
            initial_date: project.initial_date,
            due_dates: project?.due_dates?.[0],
            initial_value: project?.initial_value,
            fee: project.fee,
            late_fee: project.late_fee,
            payed: project.payed,
            callings: project.callings,
            payment_method: project.payment_method,
          }).map(([objKey, objValue], index) => {
            return (
              <div key={index} className="text-[20px]">
                <span className="font-semibold mr-2">
                  {translateItemKeys(objKey as keyof IProjectDataType)}:
                </span>
                {!edittables?.[objKey as keyof IProjectDataType] && (
                  <div className="relative w-[150px] h-[32px]">
                    {formatItem(objValue, objKey as any)}
                    <div className="absolute top-1 -right-8">
                      <EditButton
                        fn={() =>
                          handleChangeEdittables(
                            objKey as keyof IProjectDataType,
                            String(objValue),
                          )
                        }
                      />
                    </div>
                  </div>
                )}
                {edittables?.[objKey as keyof IProjectDataType] && (
                  <div className="relative w-[150px] h-[32px]">
                    <input
                      className="text-[20px]  w-full bg-transparent"
                      type={handleInputType(objKey as keyof IProjectDataType)}
                      value={
                        objKey.indexOf("date") !== -1
                          ? (formatItem(
                              edittables?.[objKey as keyof IProjectDataType] ||
                                objValue,
                              objKey as any,
                            ) as string)
                          : (edittables?.[objKey as keyof IProjectDataType] as
                              | string
                              | number)
                      }
                      step={0.01}
                      onChange={evt =>
                        handleChangeEdittables(
                          objKey as "initial_date" | "due_dates",
                          evt.target.value,
                        )
                      }
                    />
                    <div className="absolute flex top-1 gap-2 -right-20 ">
                      <GiConfirmed
                        className="w-8 h-8 cursor-pointer"
                        onClick={() =>
                          submitEdittable(
                            objKey as "initial_date" | "due_dates",
                          )
                        }
                      />
                      <ImCancelCircle
                        className="w-8 h-8 cursor-pointer"
                        onClick={() =>
                          handleChangeEdittables(
                            objKey as "initial_date" | "due_dates",
                            undefined,
                          )
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsHeaderFrame;
