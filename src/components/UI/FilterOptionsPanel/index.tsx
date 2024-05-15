import { IFilterKeyOption, IFilterOptions } from "@/@types";
import AddButton from "@/components/Auth/AddButton";
import { useModals } from "@/context/ModalsContext";
import {
  formatItem,
  sortItemsData,
  translateItemKeys,
} from "@/services/format";
import { Dispatch, SetStateAction } from "react";
import { AiOutlineSearch } from "react-icons/ai";

interface Props {
  filterOptions: IFilterOptions;
  setFilterOptions: Dispatch<SetStateAction<IFilterOptions>>;
}

const FilterOptionsPanel = ({ filterOptions, setFilterOptions }: Props) => {
  const sortedData = sortItemsData(filterOptions);
  const { setModalIsOpen, setModalContentKey } = useModals();

  const handleChangeFilter = (key: string, value: string) => {
    setFilterOptions(prevState => {
      const newState: any = { ...prevState };
      newState[key] = value;
      return newState;
    });
  };

  return (
    <>
      <div className="w-[90%] md:justify-between rounded-full dark:border-b-0 dark:border-l-0 dark:border-r-0 md:rounded-none md:mb-0 mb-4 shadow-lg bg-white dark:bg-[#333333] dark:border dark:border-grey-200  md:bg-gray-200 h-[50px] mx-auto flex flex-row justify-center items-center px-4">
        <AddButton
          fn={() => {
            setModalContentKey(
              filterOptions?.email !== undefined
                ? "addcolaborator"
                : "createprojects",
            );
            setModalIsOpen(true);
          }}
        />
        <div className="h-[75%] relative">
          <input
            value={filterOptions.name as string}
            onChange={evt => handleChangeFilter("name", evt.target.value)}
            className="h-full bg-transparent border-b border-b-blue-900 dark:border-b-white focus:outline-none"
            placeholder="Procure por nome"
          />
          <div className="absolute top-[20%] right-3 text-blue-900 dark:text-white">
            <AiOutlineSearch className=" w-[24px] h-[24px] " />
          </div>
        </div>
      </div>
      <div className="hidden md:flex w-[90%] shadow-2xl md:shadow-none md:border-t-0 md:border-x-0 md:rounded-none border border-grey-200 md:!border-b md:!border-b-gray-300 rounded-[15px] flex-col md:flex-row justify-between text-lg mx-auto hover:dark:bg-gray-900">
        {sortedData.map(([objKey], index) => {
          if (["id", "uid"].includes(objKey)) {
            return null;
          }
          return (
            <div
              key={index}
              className=" border-r-gray-400 md:border-none md:border-r w-[150px] last:border-0 flex gap-2 justify-center items-center p-4 overflow-x-auto"
            >
              {translateItemKeys(objKey as IFilterKeyOption | "age")}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default FilterOptionsPanel;
