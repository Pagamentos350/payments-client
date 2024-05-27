import { IProjectDataType, IUserDataType } from "@/@types";
import Loading from "@/components/UI/Loading";
import { useUsers } from "@/context/UsersContext";
import { Meta } from "@/layout/meta";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { Suspense, useEffect, useState } from "react";

const LazyColaboratorDetails = dynamic(
  () => import("@/components/Layouts/ColaboratorDetailsLayout"),
  { suspense: true },
);

const ColaboratorDetails = () => {
  const router = useRouter();
  const slug = router.query.id;
  const { allUsers } = useUsers();

  const [selectedUser, setSelectedUser] = useState<IUserDataType | undefined>();

  useEffect(() => {
    console.log({ allUsers });
    setSelectedUser(allUsers.find(e => e.costumer_id === slug));
  }, [allUsers, slug]);

  return (
    <Suspense fallback={<Loading />}>
      <Meta
        title={`Gerenciamento Dev - ${selectedUser?.name}`}
        description={`Perfil do colaborador ${selectedUser?.name}`}
      />
      <LazyColaboratorDetails user={selectedUser} />
    </Suspense>
  );
};

export default ColaboratorDetails;
