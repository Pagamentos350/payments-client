import { IUserDataType } from "@/@types";
import ColaboratorDetailsHeaderFrame from "@/components/Frames/Colaborator/ColaboratorDetailsHeaderFrame";
import ColaboratorListsFrame from "@/components/Frames/Colaborator/ColaboratorListsFrame";
import ColaboratorRestrictedFrame from "@/components/Frames/Colaborator/ColaboratorRestrictedFrame";
import FadeIn from "@/components/UI/Animations/FadeIn";
import BackButton from "@/components/UI/BackButton";
import { useAuth } from "@/context/AuthContext";
import { Transition } from "@headlessui/react";
import { useState, useEffect } from "react";

interface Props {
  user?: IUserDataType;
}

const ColaboratorDetailsLayout = ({ user }: Props) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!user) {
    return (
      <div className="dark:text-white m-auto justify-center items-center h-full w-full">
        <h1 className="m-auto text-center">Cliente não encontrado</h1>
      </div>
    );
  }
  return (
    <section className="flex relative justify-start gap-4 items-center flex-col px-12 shadow-lg min-h-[75vh] dark:text-white">
      <Transition.Root show={mounted} className="w-full">
        <BackButton path={"/costumers"} />
        <FadeIn delay="delay-[300ms] flex items-center">
          <ColaboratorDetailsHeaderFrame user={user} />
        </FadeIn>

        <FadeIn delay="delay-[600ms]">
          <ColaboratorRestrictedFrame user={user} />
        </FadeIn>

        <FadeIn delay="delay-[600ms]">
          <ColaboratorListsFrame user={user} />
        </FadeIn>
      </Transition.Root>
    </section>
  );
};

export default ColaboratorDetailsLayout;
