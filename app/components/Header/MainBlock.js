"use client";

import { Button } from "@heroui/react";

export default function MainBlock() {
  return (
    <div className="border border-[var(--foreground)] rounded-lg p-5 flex flex-col z-10 w-[350px]">
      <div className="flex flex-col mb-2">
        <h1 className="text-5xl font-bold">BohemAuth</h1>
        <p className="text-xl">/bəˈhiːməθ/</p>
      </div>

      <p className="text-2xl">Authentic Products.</p>
      <p className="text-2xl">Verified Truths. </p>

      <p className="mt-2 mb-4">
        Bohemauth uses zero-knowledge proofs and Flare's Data Connector to
        verify product authenticity without compromising privacy.
      </p>

      <div className="flex items-center justify-end gap-2">
        <Button
          variant="outline"
          className="bg-white text-black rounded-none"
          size="sm"
        >
          Launch
        </Button>
      </div>
    </div>
  );
}
