import Loading from "@/components/UI/Loading";
import { useProjects } from "@/context/ProjectsContext";
import { Meta } from "@/layout/meta";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { Suspense } from "react";

const LazyProjectDetailsLayout = dynamic(
  () => import("@/components/Layouts/ProjectDetailsLayout"),
  { suspense: true },
);

const ProjectDetails = () => {
  const router = useRouter();
  const slug = router.query.id;
  const { allProjects } = useProjects();
  const selectedProject = allProjects.find(e => e.debt_id === slug);

  return (
    <Suspense fallback={<Loading />}>
      <Meta title={`Gerenciamento Dev`} description={``} />
      <LazyProjectDetailsLayout project={selectedProject} />
    </Suspense>
  );
};

export default ProjectDetails;
