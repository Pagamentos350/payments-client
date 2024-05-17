import { IProjectDataType, IUserDataType } from "@/@types";
import DeleteButton from "@/components/Auth/DeleteButton";
import EditButton from "@/components/Auth/EditButton";
import EdittableListItems from "@/components/UI/Items/EdittableListItems";
import TinyItem from "@/components/UI/Items/TinyItem";
import { useAuth } from "@/context/AuthContext";
import { useModals } from "@/context/ModalsContext";
import { useProjects } from "@/context/ProjectsContext";
import { useUsers } from "@/context/UsersContext";
import { formatItem, translateItemKeys } from "@/services/format";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { GiConfirmed } from "react-icons/gi";
import { ImCancelCircle } from "react-icons/im";

interface Props {
  user: IUserDataType;
}

const ColaboratorListsFrame = ({ user }: Props) => {
  const { deleteUser, updateUser } = useUsers();
  const { setModalContentKey, setModalIsOpen } = useModals();
  const router = useRouter();

  const onDeleteColaborator = async () => {
    setModalContentKey("deletecolaborator");
    setModalIsOpen(true);
    // await deleteUser(user.costumer_id);
    // router.push("/costumers");
  };

  const [edittables, setEdittables] = useState<Partial<IUserDataType>>({});

  const handleChangeEdittables = (
    key: keyof IUserDataType,
    value: string | undefined,
  ) => {
    console.log({ key, value });
    setEdittables(prevState => {
      const newState = JSON.parse(JSON.stringify(prevState));
      newState[key] = value;
      return newState;
    });
  };

  const submitEdittable = async (key: keyof IUserDataType) => {
    const obj: any = { costumer_id: user.costumer_id };
    obj[key] = edittables[key];
    await updateUser(obj);
    handleChangeEdittables(key, undefined);
  };

  useEffect(() => {
    console.log({ edittables });
  }, [edittables]);

  return (
    <div className="frame-container">
      <div className="grid md:grid-cols-1 grid-cols-1 justify-evenly gap-4 w-full">
        {Object.entries({
          details: user.details,
        }).map(([objKey, objValue], index) => {
          const typeKey: keyof IUserDataType = objKey as keyof IUserDataType;

          return (
            <div
              key={`${user.costumer_id.slice(
                0,
                12,
              )}-${objKey}-${objValue}-${index}`}
            >
              <span className="text-[21px] font-semibold mr-2">
                {translateItemKeys(objKey as any)}:
              </span>

              {!edittables?.[typeKey as keyof IUserDataType] && (
                <div className="text-[21px] w-[40%] relative">
                  <div className="flex flex-wrap">
                    {formatItem(objValue, objKey as any)}
                  </div>
                  <div className="absolute -top-8 -right-8">
                    <EditButton
                      fn={() =>
                        handleChangeEdittables(
                          typeKey,
                          objValue || "Escreva e confirme para atualizar",
                        )
                      }
                    />
                  </div>
                </div>
              )}
              {edittables?.[typeKey] && (
                <div className="relative w-[60%]">
                  <input
                    className="text-[21px] w-full bg-transparent"
                    type={typeKey}
                    value={
                      (edittables?.[typeKey] || (user?.[typeKey] ?? "")) as any
                    }
                    onChange={evt =>
                      handleChangeEdittables(typeKey, evt.target.value)
                    }
                  />
                  <div className="absolute flex top-1 gap-2 -right-20 ">
                    <GiConfirmed
                      className="w-8 h-8 cursor-pointer"
                      onClick={() => submitEdittable(typeKey)}
                    />
                    <ImCancelCircle
                      className="w-8 h-8 cursor-pointer"
                      onClick={() => handleChangeEdittables(typeKey, undefined)}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <DeleteButton
        userPermission={`${user.permission}`}
        fn={onDeleteColaborator}
      />
    </div>
  );
};

export default ColaboratorListsFrame;
