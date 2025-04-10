"use client";

import { toast } from "sonner";
import { z } from "zod";
import { useLoginWithEmail } from "@privy-io/react-auth";

export default function useOnboard() {
  const { sendCode } = useLoginWithEmail();

  const requestLogin = async (
    email,
    setIsOTPWindow,
    setIsRequestingLogin,
    setIsSignUp
  ) => {
    try {
      setIsRequestingLogin(true);

      const emailSchema = z.string().email();
      const result = emailSchema.safeParse(email);

      if (!result.success) {
        toast("Please enter a valid email");
        setIsRequestingLogin(false);
        return;
      }

      await sendCode({ email });
      setIsOTPWindow(true);
      setIsRequestingLogin(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to send OTP");
      setIsRequestingLogin(false);
    }
  };

  return { requestLogin };
}
