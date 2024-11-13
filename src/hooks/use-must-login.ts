import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { usePocketBase } from "../lib/pocketbase";
import { useInvalidateQueryCurrentUser, useQueryCurrentUser } from "./api/user/useQueryCurrentUser";

export const useMustLogin = () => {
  const pb = usePocketBase();
  const router = useRouter();
  const { data: user, isPending } = useQueryCurrentUser();
  const invalidateCurrentUser = useInvalidateQueryCurrentUser()
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const unsubscribe = pb.authStore.onChange(() => {
      if (!pb.authStore.isValid) {
        router.push('/login');
        return;
      }
    }, true);

    return unsubscribe;
  }, [pb.authStore, router]);


  const handleSignOut = async () => {
    invalidateCurrentUser();
    pb?.authStore.clear();
  };

  return {
    user,
    isCheckingAuth: !isMounted || isPending || !user,
    handleSignOut
  }
}