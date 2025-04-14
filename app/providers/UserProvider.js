"use client";

import StartContainer from "@/components/layout/login/StartContainer";
import { usePrivy } from "@privy-io/react-auth";
import Link from "next/link";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import useInitialize from "@/hooks/useInitialize";
import { useState, useEffect } from "react";

export default function UserProvider({ children }) {
  const { ready } = usePrivy();
  const { initialize } = useInitialize();

  const [isInitializing, setIsInitializing] = useState(true);

  const handleInitialize = async () => {
    try {
      await initialize();
      setIsInitializing(false);
    } catch (error) {
      console.log(error);
      setIsInitializing(false);
    }
  };

  useEffect(() => {
    if (ready) {
      handleInitialize();
    }
  }, [ready]);

  if (!ready || isInitializing) {
    return (
      <StartContainer>
        <div className="flex flex-col w-[350px] absolute -translate-x-1/2 -top-[220px]">
          <Link href="/" className="flex flex-col">
            <Image
              src="/logo/bohemauth-logo-white.svg"
              alt="Logo"
              width={100}
              height={100}
              className="invert -translate-x-4 translate-y-2"
            />
            <span className="font-bold inline-block text-4xl">BohemAuth</span>
          </Link>

          <div className="flex items-center gap-2 mt-5 opacity-70">
            <Loader2 className="animate-spin" size="30" />
            <span className="text-white text-xl">Initializing...</span>
          </div>
        </div>
      </StartContainer>
    );
  } else {
    return <>{children}</>;
  }
}
