import { IDateObj, IFilterKeyOption, IProjectDataType } from "@/@types";
import EditButton from "@/components/Auth/EditButton";
import { useProjects } from "@/context/ProjectsContext";
import { formatItem, translateItemKeys } from "@/services/format";
import { useState } from "react";
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

  const submitEdittable = async (key: keyof IProjectDataType) => {
    const obj: any = { id: project.id };
    obj[key] = edittables[key];
    await updateProjects(obj);
    handleChangeEdittables(key, undefined)
  };

  return (
    <div className="frame-container">
      <div className="w-[80%]">
        <div className="flex justify-start items-center">
          <AiOutlineProject className="h-24 w-24" />
          {!edittables?.name && (
            <h3 className="font-bold text-[26px] w-[60%] relative">
              {edittables?.name || project?.name}{" "}
              <div className="absolute top-1 -right-8">
                <EditButton fn={() => setEdittables({ name: project.name })} />
              </div>
            </h3>
          )}
          {edittables?.name && (
            <div className="relative w-[60%]">
              <input
                className="font-bold text-[26px] w-full bg-transparent"
                type="text"
                value={edittables?.name || project.name}
                onChange={evt => setEdittables({ name: evt.target.value })}
              />
              <div className="absolute flex top-1 gap-2 -right-20 ">
                <GiConfirmed
                  className="w-8 h-8 cursor-pointer"
                  onClick={() => submitEdittable("name")}
                />
                <ImCancelCircle
                  className="w-8 h-8 cursor-pointer"
                  onClick={() => setEdittables({ name: undefined })}
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
        <div className="flex flex-col md:flex-row gap-24 border-t-gray-300 border-t mt-4">
          {Object.entries({
            startDate: project.startDate,
            deadline: project.deadline,
          }).map(([objKey, objValue], index) => {
            return (
              <div key={index} className="text-[20px]">
                <span className="font-semibold mr-2">
                  {translateItemKeys(objKey as any)}:
                </span>

                {!edittables?.[objKey as "startDate" | "deadline"] && (
                  <div className="relative w-[150px] h-[32px]">
                    {formatItem(objValue, objKey as any)}
                    <div className="absolute top-1 -right-8">
                      <EditButton
                        fn={() =>
                          handleChangeEdittables(
                            objKey as "startDate" | "deadline",
                            objValue,
                          )
                        }
                      />
                    </div>
                  </div>
                )}
                {edittables?.[objKey as "startDate" | "deadline"] && (
                  <div className="relative w-[150px] h-[32px]">
                    <input
                      className="text-[20px]  w-full bg-transparent"
                      type="date"
                      value={
                        formatItem(
                          edittables?.[objKey as "startDate" | "deadline"] ||
                            objValue,
                          objKey as any,
                        )
                          ?.split("/")
                          ?.reverse()
                          ?.join("-") as string
                      }
                      onChange={evt =>
                        handleChangeEdittables(
                          objKey as "startDate" | "deadline",
                          evt.target.value,
                        )
                      }
                    />
                    <div className="absolute flex top-1 gap-2 -right-20 ">
                      <GiConfirmed
                        className="w-8 h-8 cursor-pointer"
                        onClick={() =>
                          submitEdittable(objKey as "startDate" | "deadline")
                        }
                      />
                      <ImCancelCircle
                        className="w-8 h-8 cursor-pointer"
                        onClick={() =>
                          handleChangeEdittables(
                            objKey as "startDate" | "deadline",
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
