import { useUsers } from "@/context/UsersContext";
import UserDataItem from "@/components/UI/Items/PrimaryDataItem";
import { IFilterOptions } from "@/@types";
import { useEffect, useState } from "react";
import FilterOptionsPanel from "@/components/UI/FilterOptionsPanel";
import RenderItems from "@/components/UI/RenderItems";
import { Transition } from "@headlessui/react";
import FadeIn from "@/components/UI/Animations/FadeIn";

const ColaboratorsLayout = () => {
  const { allUsers, loading, error } = useUsers();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [filterOptions, setFilterOptions] = useState<IFilterOptions>({
    name: "",
    last_name: "",
    cpf: "",
    email: "",
    phone: { ASC: null },
    rg: "",
    // adress: { ASC: null },
  });

  return (
    <section className="flex items-center flex-col dark:text-white shadow-2xl min-h-[80vh] m-4">
      <h3>Colaboradores</h3>
      <Transition.Root show={mounted}>
        <FadeIn delay="delay-[300ms]">
          <div className="w-full flex flex-col justify-center mt-12">
            <div className="">
              <FilterOptionsPanel
                filterOptions={filterOptions}
                setFilterOptions={setFilterOptions}
              />
            </div>
            <div className="w-full flex flex-col justify-center">
              <RenderItems
                type={"costumers"}
                arrayItems={allUsers}
                error={error}
                loading={loading}
                filterOptions={filterOptions}
              />
            </div>
          </div>
        </FadeIn>
      </Transition.Root>
    </section>
  );
};

export default ColaboratorsLayout;
