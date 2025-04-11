"use client";

import { toast } from "sonner";
import { z } from "zod";
import { useLoginWithEmail } from "@privy-io/react-auth";

export default function useOnboard() {
  const { sendCode, loginWithCode } = useLoginWithEmail();

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

  return { requestLogin, verifyLogin, resend };
}
