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
import axios from "axios";

export default function useRedeem() {
  const { sendCode, loginWithCode } = useLoginWithEmail();
  const { refreshUser, user } = usePrivyUser();
  const { createWallet } = useCreateWallet();
  const { signTypedData } = useSignTypedData();
  const router = useRouter();
  const { logout } = useLogout();

  const requestLogin = async (email, setStep, setIsRequestingLogin) => {
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
      setStep(2);
      setIsRequestingLogin(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to send OTP");
      setIsRequestingLogin(false);
    }
  };

  const verifyAndClaim = async (otp, setIsVerifying, setStep) => {
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
        await createWallet();
      }

      setStep(3);
    } catch (error) {
      console.log(error);
      toast.error("Failed to Claim Product");
    } finally {
      setIsVerifying(false);
    }
  };

  const claimProduct = async (listingId, proofId, setIsClaiming, setIsOpen) => {
    try {
      setIsClaiming(true);
      const domain = {
        name: "bohemauth",
        version: "1",
      };

      const types = {
        RedeemListing: [
          { name: "listingId", type: "string" },
          { name: "proofId", type: "string" },
        ],
      };

      const message = {
        listingId,
        proofId,
      };

      const signature = await signTypedData(
        {
          domain,
          types,
          primaryType: "RedeemListing",
          message,
        },
        {
          address: user.wallet.address,
        }
      );

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/listing/redeem`,
        {
          listingId,
          proofId,
          signature: signature.signature,
          address: user.wallet.address,
        }
      );

      if (!response.data.success) {
        throw new Error("Failed to redeem listing");
      }

      toast.success("Claimed successfully");
      router.push(`/claims`);
    } catch (error) {
      console.log(error);
      toast.error("Failed to Claim Product");
      setIsClaiming(false);
      setIsOpen(false);
    }
  };

  return {
    requestLogin,
    verifyAndClaim,
    claimProduct,
  };
}
