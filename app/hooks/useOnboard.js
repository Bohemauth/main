"use client";

import { toast } from "sonner";
import { z } from "zod";
import {
  useLoginWithEmail,
  useCreateWallet,
  useSignTypedData,
  useLogout,
  useUser as usePrivyUser,
} from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import useUser from "@/hooks/useUser";

export default function useOnboard() {
  const { sendCode, loginWithCode } = useLoginWithEmail();
  const router = useRouter();
  const { refreshUser } = usePrivyUser();
  const { getUser, createUser: createDbUser } = useUser();
  const { createWallet } = useCreateWallet();
  const { signTypedData } = useSignTypedData();
  const { logout } = useLogout();

  const requestLogin = async (email, setIsOTPWindow, setIsRequestingLogin) => {
    try {
      setIsRequestingLogin(true);

      const emailSchema = z.string().email();
      const result = emailSchema.safeParse(email);

      if (!result.success) {
        toast("Please enter a valid email");
        setIsRequestingLogin(false);
        return;
      }

      await logout();

      await sendCode({ email });
      setIsOTPWindow(true);
      setIsRequestingLogin(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to send OTP");
      setIsRequestingLogin(false);
    }
  };

  const verifyLogin = async (email, otp, setIsVerifying) => {
    try {
      setIsVerifying(true);

      if (otp.length !== 6) {
        toast("Please enter a valid OTP");
        setIsVerifying(false);
        return;
      }

      await loginWithCode({ code: otp });

      let loggedInUser = await refreshUser();

      if (!loggedInUser.wallet) {
        const wallet = await createWallet();
        loggedInUser = await refreshUser();
      }

      const dbUser = await getUser(loggedInUser.wallet.address);

      if (!dbUser) {
        router.push("/signup");
        return;
      } else {
        router.push("/dashboard");
      }

      toast.success("Login successful");
    } catch (error) {
      console.log(error);
      toast.error("Failed to verify OTP");
    } finally {
      setIsVerifying(false);
    }
  };

  const resend = async (email, setIsResending, setTimeout) => {
    try {
      setIsResending(true);
      await sendCode({ email });
      setTimeout(60);
    } catch (error) {
      console.log(error);
      toast.error("Failed to resend OTP");
    } finally {
      setIsResending(false);
    }
  };

  const createUser = async (name, description, role, setIsCreating) => {
    try {
      setIsCreating(true);

      const user = await refreshUser();

      const domain = {
        name: "bohemauth",
        version: "1",
      };

      const types = {
        NewUser: [
          { name: "name", type: "string" },
          { name: "description", type: "string" },
          { name: "role", type: "string" },
        ],
      };

      const message = {
        name,
        description,
        role,
      };

      const signature = await signTypedData(
        {
          domain,
          types,
          primaryType: "NewUser",
          message,
        },
        {
          address: user.wallet.address,
        }
      );

      await createDbUser(
        user.wallet.address,
        name,
        description,
        role,
        signature.signature
      );

      toast.success("User created successfully");
      router.push("/dashboard");
    } catch (error) {
      console.log(error);
      toast.error("Failed to create user");
    } finally {
      setIsCreating(false);
    }
  };

  return { requestLogin, verifyLogin, resend, createUser };
}
