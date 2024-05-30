import { IDateObj, IUserDataType } from "@/@types";
import EditButton from "@/components/Auth/EditButton";
import TinyItem from "@/components/UI/Items/TinyItem";
import { useAuth } from "@/context/AuthContext";
import { useUsers } from "@/context/UsersContext";
import { translateItemKeys, formatItem } from "@/services/format";
import { useEffect, useState } from "react";
import { FaUserAlt } from "react-icons/fa";
import { GiConfirmed } from "react-icons/gi";
import { ImCancelCircle } from "react-icons/im";

interface Props {
  user: IUserDataType;
}

const ColaboratorDetailsHeaderFrame = ({ user }: Props) => {
  const { updateUser, sendNotify } = useUsers();
  const { user: activeUser } = useAuth();

  const [edittables, setEdittables] = useState<Partial<IUserDataType>>({});
  const [result, setResult] = useState<string | null>("Cobrança enviada");

  useEffect(() => {
    setTimeout(() => setResult(null), 5000);
  }, [result]);

  const handleChangeEdittables = (
    key: keyof IUserDataType,
    value: string | IDateObj | undefined,
  ) => {
    setEdittables(prevState => {
      const newState = JSON.parse(JSON.stringify(prevState));
      newState[key] = value;
      return newState;
    });
  };

  const submitEdittable = async () => {
    let obj: any = { costumer_id: user.costumer_id };
    obj = { ...obj, edittables };
    await updateUser(obj);
    setEdittables({
      email: undefined,
      phone: undefined,
      adress: undefined,
      cep: undefined,
    });
  };

  console.log({ user });

  return (
    <div className="frame-container">
      <div className="w-full">
        <div className="flex gap-4 items-center">
          <FaUserAlt className=" h-24 w-24" />
          {!edittables?.name && !edittables?.last_name && (
            <h3 className="font-bold text-[32px] w-[60%] relative">
              <div>{edittables?.name || user?.name} </div>
              <div>{edittables?.last_name || user?.last_name} </div>
            </h3>
          )}
          {edittables?.name && (
            <div className="relative w-[60%]">
              <input
                className="font-bold text-[32px] w-full bg-transparent border-b border-solid border-white"
                type="text"
                value={edittables?.name || user.name}
                onChange={evt => setEdittables({ name: evt.target.value })}
              />
            </div>
          )}
          {edittables?.last_name && (
            <div className="relative w-[60%]">
              <input
                className="font-bold text-[32px] w-full bg-transparent border-b border-solid border-white"
                type="text"
                value={edittables?.last_name || user.last_name}
                onChange={evt => setEdittables({ last_name: evt.target.value })}
              />
            </div>
          )}
        </div>
        <div className="grid md:grid-cols-2 grid-cols-1 justify-evenly gap-4 w-full border-t-gray-300 border-t mt-4">
          {Object.entries({
            email: user.email,
            phone: user.phone,
            adress: user.adress,
            cep: user.cep,
            RG: user.rg,
            CPF: user.cpf,
          }).map(([objKey, objValue], index) => {
            const typeKey: keyof Partial<IUserDataType> =
              objKey as keyof Partial<IUserDataType>;

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

                {!edittables?.[typeKey] && (
                  <div className="text-[21px] w-[70%] relative p-2">
                    <div className="flex flex-wrap">
                      {formatItem(objValue, objKey as any)}
                    </div>
                  </div>
                )}
                {edittables?.[typeKey] && (
                  <div className="relative w-[70%]">
                    <input
                      className="text-[21px] w-full bg-transparent border border-solid border-white p-2"
                      type={typeKey}
                      value={
                        (edittables?.[typeKey] ||
                          (user?.[typeKey] ?? "")) as any
                      }
                      onChange={evt =>
                        handleChangeEdittables(typeKey, evt.target.value)
                      }
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div>
        {Number(activeUser?.permission) > 2 && (
          <div className="mt-8 flex gap-2 relative">
            <span className="absolute -bottom-8 left-14 text-red-600 text-bold z-30 text-center">
              {result}
            </span>
            <button
              className="btn"
              onClick={async () => {
                const res: any = await sendNotify(user.costumer_id);
                setResult(
                  res?.result ? "Cobranças Enviadas" : "Algo deu errado",
                );
                // console.log("notify", { res });
              }}
            >
              Cobrar
            </button>
            {!edittables?.email ? (
              <button
                className="btn"
                onClick={() =>
                  setEdittables({
                    email: user.email,
                    phone: user.phone,
                    adress: user.adress,
                    cep: user.cep,
                    name: user.name,
                    last_name: user.last_name,
                  })
                }
              >
                Editar
              </button>
            ) : (
              <div className=" flex gap-2 ">
                <button className="btn " onClick={() => submitEdittable()}>
                  Confirmar
                </button>
                <button
                  className="btn !bg-transparent"
                  onClick={() =>
                    setEdittables({
                      email: undefined,
                      phone: undefined,
                      adress: undefined,
                      cep: undefined,
                      name: undefined,
                      last_name: undefined,
                    })
                  }
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ColaboratorDetailsHeaderFrame;
