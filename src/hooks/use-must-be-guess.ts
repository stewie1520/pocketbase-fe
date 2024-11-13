import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { usePocketBase } from "../lib/pocketbase";

export const useMustBeGuess = () => {
  const pb = usePocketBase();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const unsubscribe = pb.authStore.onChange(() => {
      if (pb.authStore.isValid) {
        router.push('/');
        return;
      }

      setIsMounted(true);
    }, true);

    return unsubscribe;
  }, [pb.authStore, router]);

  return {
    isCheckingAuth: !isMounted,
  }
}