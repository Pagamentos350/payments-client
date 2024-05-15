import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

const PrivatePage = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { user, loadingUserCache } = useAuth();

  useEffect(() => {
    if (!user.uid && !loadingUserCache) {
      router.push("/");
    }
  }, [loadingUserCache, router, user]);
  return <div>{user.uid ? children : null}</div>;
};

export default PrivatePage;
