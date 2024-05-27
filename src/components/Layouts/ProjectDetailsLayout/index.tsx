import { IProjectDataType } from "@/@types";
import ProjectDetailsHeaderFrame from "@/components/Frames/Project/ProjectDetailsHeaderFrame";
import BackButton from "@/components/UI/BackButton";
import ProjectListsFrame from "@/components/Frames/Project/ProjectListsFrame";
import FadeIn from "@/components/UI/Animations/FadeIn";
import { Transition } from "@headlessui/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
interface Props {
  project?: IProjectDataType;
}

const ProjectDetailsLayout = ({ project }: Props) => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const query = router.asPath.split("/").pop();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!project) {
    return (
      <div className="flex relative justify-start gap-4 items-center flex-col px-12 shadow-lg min-h-[75vh] dark:text-white">
        <h4 className="text-center "> Error 404: Projeto não encontrado</h4>
        <div className="flex md:flex-row flex-col gap-4">
          <button
            onClick={() => router.push(`/costumers`)}
            className="btn !bg-transparent"
          >
            Voltar
          </button>
          <button
            className="btn !text-white"
            onClick={() => location.reload()}
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
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
