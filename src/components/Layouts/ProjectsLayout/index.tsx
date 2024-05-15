import { IFilterOptions } from "@/@types";
import FadeIn from "@/components/UI/Animations/FadeIn";
import FilterOptionsPanel from "@/components/UI/FilterOptionsPanel";
import RenderItems from "@/components/UI/RenderItems";
import { useProjects } from "@/context/ProjectsContext";
import { Transition } from "@headlessui/react";
import { useEffect, useState } from "react";

const ProjectsLayout = () => {
  const { allProjects, error, loading } = useProjects();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [filterOptions, setFilterOptions] = useState<IFilterOptions>({
    name: "",
    deadline: { ASC: null },
    stack: "",
    startDate: { ASC: null },
    teamUids: { ASC: null },
  });

  return (
    <section className="flex items-center flex-col dark:text-white shadow-2xl min-h-[80vh] m-4">
      <h3>Projetos</h3>
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
                type={"projects"}
                arrayItems={allProjects}
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

export default ProjectsLayout;
