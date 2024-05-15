import {
  IFilterOptions,
  IRestrictedDataType,
  IUserDataType,
  OmittedTS,
} from "@/@types";
import EditButton from "@/components/Auth/EditButton";
import FilterOptionsPanel from "@/components/UI/FilterOptionsPanel";
import EdittableListItems from "@/components/UI/Items/EdittableListItems";
import TinyItem from "@/components/UI/Items/TinyItem";
import RenderItems from "@/components/UI/RenderItems";
import { useUsers } from "@/context/UsersContext";
import { formErrorsHandler } from "@/services/errorHandler";
import { translateItemKeys, formatItem } from "@/services/format";
import { useEffect, useState } from "react";
import { GiConfirmed } from "react-icons/gi";
import { ImCancelCircle } from "react-icons/im";

interface Props {
  user: IUserDataType;
}

const ColaboratorRestrictedFrame = ({ user }: Props) => {
  const { getRestrictedData, loading } = useUsers();
  const [data, setData] = useState<IRestrictedDataType>();
  const [error, setError] = useState<string | null>();
  const [filterOptions, setFilterOptions] = useState<IFilterOptions>({
    callings: "",
    fee: "",
    initial_date: "",
    initial_value: "",
    late_fee: { ASC: null },
    payed: "",
    payment_method: "",
    value: "",
    // adress: { ASC: null },
  });

  useEffect(() => {
    const fetcher = async () => {
      const data = await getRestrictedData(user.costumer_id);
      console.log({ data });
      setData(data);
    };
    fetcher();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { updateUser } = useUsers();

  return (
    <div className="frame-container">
      <div className="w-full flex flex-col justify-center mt-12">
        <div className="">
          <FilterOptionsPanel
            filterOptions={filterOptions}
            setFilterOptions={setFilterOptions}
            hideSearch
          />
        </div>
        <div className="w-full flex flex-col justify-center">
          {Array.isArray(data) && (
            <RenderItems
              type={"debt"}
              arrayItems={data}
              error={error}
              loading={loading}
              filterOptions={filterOptions}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ColaboratorRestrictedFrame;
