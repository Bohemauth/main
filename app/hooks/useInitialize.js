"use client";

import { useUser as usePrivyUser } from "@privy-io/react-auth";
import useUser from "./useUser";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slice/UserSlice";

export default function useInitialize() {
  const { user: loadedPrivyUser } = usePrivyUser();
  const { getUser } = useUser();
  const router = useRouter();
  const dispatch = useDispatch();

  const initialize = async () => {
    try {
      if (!loadedPrivyUser) {
        router.push("/login");
        return;
      }

      if (!loadedPrivyUser.wallet) {
        router.push("/login");
        return;
      }

      const user = await getUser(loadedPrivyUser.wallet?.address);

      if (!user) {
        router.push("/login");
        return;
      }

      dispatch(setUser(user));
    } catch (error) {
      console.log(error);
    }
  };

  return {
    initialize,
  };
}
