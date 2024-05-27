import { IProjectDataType } from "@/@types";
import Loading from "@/components/UI/Loading";
import { useProjects } from "@/context/ProjectsContext";
import { Meta } from "@/layout/meta";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { Suspense, useEffect, useState } from "react";

const LazyProjectDetailsLayout = dynamic(
  () => import("@/components/Layouts/ProjectDetailsLayout"),
  { suspense: true },
);

const ProjectDetails = () => {
  const router = useRouter();
  const slug = router.query.id;
  const { allProjects } = useProjects();
  const [selectedProject, setSelectedProject] = useState<
    IProjectDataType | undefined
  >();

  useEffect(() => {
    console.log({ allProjects });
    setSelectedProject(allProjects?.find(e => e.debt_id === slug));
  }, [allProjects, slug]);

  return (
    <Suspense fallback={<Loading />}>
      <Meta title={`Gerenciamento Dev`} description={``} />
      <LazyProjectDetailsLayout project={selectedProject} />
    </Suspense>
  );
};

export default ProjectDetails;
