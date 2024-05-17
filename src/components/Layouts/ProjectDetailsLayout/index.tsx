import { IProjectDataType } from "@/@types";
import ProjectDetailsHeaderFrame from "@/components/Frames/Project/ProjectDetailsHeaderFrame";
import BackButton from "@/components/UI/BackButton";
import ProjectListsFrame from "@/components/Frames/Project/ProjectListsFrame";
import FadeIn from "@/components/UI/Animations/FadeIn";
import { Transition } from "@headlessui/react";
import { useState, useEffect } from "react";

interface Props {
  project?: IProjectDataType;
}

const ProjectDetailsLayout = ({ project }: Props) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!project) {
    return <div className="dark:text-white">Projeto não encontrado</div>;
  }
  return (
    <section className="flex relative justify-start gap-4 items-center flex-col px-12 shadow-lg min-h-[75vh] dark:text-white">
      <Transition.Root show={mounted} className={"w-full"}>
        <BackButton path={`/costumers/${project.costumer_id}`} />
        <FadeIn delay="delay-[300ms]">
          <ProjectDetailsHeaderFrame project={project} />
        </FadeIn>
        <FadeIn delay="delay-[300ms]">
          <ProjectListsFrame project={project} />
        </FadeIn>
      </Transition.Root>
    </section>
  );
};

export default ProjectDetailsLayout;
