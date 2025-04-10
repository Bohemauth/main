"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import { Input, InputOtp } from "@heroui/react";
import { Loader2, Mail } from "lucide-react";
import { toast } from "sonner";
import useOnboard from "@/hooks/useOnboard";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [isRequestingLogin, setIsRequestingLogin] = useState(false);
  const [isRequestingSignUp, setIsRequestingSignUp] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isOTPWindow, setIsOTPWindow] = useState(false);
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timeout, setTimeout] = useState(0);
  const { requestLogin } = useOnboard();

  if (isOTPWindow) {
    return (
      <>
        <p className="mt-5 text-sm">We sent a code to {email}</p>

        <InputOtp
          className="rounded-none mt-1 shadow-none text-white items-center mb-1"
          size="lg"
          variant="bordered"
          length={"6"}
          color="black"
          errorMessage="Enter a valid code"
          fullWidth
          classNames={{
            segmentWrapper: "gap-x-3",
            segment: [
              "relative",
              "h-10",
              "w-10",
              "border-y",
              "border-l",
              "border-r",
              "rounded-none",
              "border-default-200",
              "data-[active=true]:border",
              "data-[active=true]:border-white",
              "data-[active=true]:z-20",
              "data-[active=true]:ring-2",
              "data-[active=true]:ring-offset-2",
              "data-[active=true]:ring-offset-background",
              "data-[active=true]:ring-foreground",
              "data-[active=true]:ring-white/40",
            ],
          }}
          radius="lg"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <div className="mt-1 flex w-full gap-2">
          <Button
            className="w-full rounded-none p-7 bg-white text-black"
            onPress={() => {}}
            isDisabled={isVerifying || isResending}
          >
            {isVerifying ? <Loader2 className="animate-spin" /> : "Verify"}
          </Button>
          <Button
            className="w-full rounded-none p-7 border border-white/40 "
            variant="outline"
            onPress={() => {
              resend(email, setIsResending, isSignUp, setTimeout);
            }}
            isDisabled={isResending || isVerifying || timeout > 0}
          >
            {timeout > 0 ? (
              `Resend in ${timeout}`
            ) : isResending ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Resend"
            )}
          </Button>
        </div>

        <div
          className="mt-3 ml-1 flex w-full text-white/60 hover:text-white/80 hover:underline cursor-pointer text-xs"
          onClick={() => {
            if (isVerifying || isResending) return;

            setIsOTPWindow(false);
          }}
        >
          Not you?
        </div>
      </>
    );
  } else {
    return (
      <>
        <p className="mt-5 text-sm">Enter your email to access your account</p>

        <Input
          type="text"
          placeholder="Enter your email"
          className="border border-white/40 rounded-none mt-3 shadow-none"
          size="lg"
          variant="outline"
          startContent={<Mail className="text-white/40" />}
          isClearable
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="mt-4 flex w-full gap-2">
          <Button
            className="w-full rounded-none p-7 bg-white text-black"
            onPress={() => {
              requestLogin(
                email,
                setIsOTPWindow,
                setIsRequestingLogin,
                setIsSignUp
              );
            }}
            isDisabled={isRequestingSignUp || isRequestingLogin}
          >
            {isRequestingLogin ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Continue"
            )}
          </Button>
        </div>
      </>
    );
  }
}
