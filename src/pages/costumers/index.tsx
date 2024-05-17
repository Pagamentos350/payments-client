import Loading from "@/components/UI/Loading";
import { Meta } from "@/layout/meta";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const LazyColaborators = dynamic(
    () => import("@/components/Layouts/ColaboratorsLayout"),
    { suspense: true },
  );

const Colaborators = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Meta
        title={"Gerenciamento Dev - Colaboradores"}
        description={"Veja todos os colaboradores da empresa aqui"}
      />
      <LazyColaborators />
    </Suspense>
  );
};

export default Colaborators
