"use client";

import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";

export default function MainBlock() {
  const router = useRouter();
  return (
    <div className="border border-[var(--foreground)] rounded-lg p-5 flex flex-col z-10 w-[350px]">
      <div className="flex flex-col mb-2">
        <h1 className="text-5xl font-bold">BohemAuth</h1>
        <p className="text-xl">/bəˈhiːməθ/</p>
      </div>

      <p className="text-2xl">Authentic Products.</p>
      <p className="text-2xl">Verified Truths. </p>

      <p className="mt-2 mb-4">
        Bohemauth uses Flare's Data Connector and zero-knowledge proofs to
        verify product authenticity without compromising privacy.
      </p>

      <div className="flex items-center justify-end gap-2">
        <Button
          variant="outline"
          className="bg-white text-black rounded-none"
          size="sm"
          onPress={() => router.push("/dashboard")}
        >
          Launch
        </Button>
      </div>
    </div>
  );
}
