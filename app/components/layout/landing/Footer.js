"use client";

import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { Button } from "@heroui/react";

export default function Footer() {
  const router = useRouter();
  return (
    <div className="mt-28 bg-[var(--block)] py-28">
      <div className="flex flex-col gap-10 sm:flex-row sm:items-center w-full justify-between container lg:px-32">
        <div className="flex flex-col">
          <h1 className="text-5xl font-bold">BohemAuth</h1>
          <p className="text-xl">Authentic Products.</p>
          <p className="text-xl mb-5">Verified Truths. </p>

          <p className="text-base">
            "Join the platform that's revolutionizing product <br />
            authenticity verification"
          </p>
        </div>
        <div className="flex flex-col items-start sm:items-end text-xl">
          <div className="flex items-center gap-2 text-xl">
            Made with{" "}
            <span className="text-[var(--foreground)] animate-pulse">
              <Heart size={20} />
            </span>
            during
          </div>{" "}
          Encode X Flare Hackathon
          <Button
            variant="outline"
            className=" text-base text-[var(--foreground)] border border-[var(--foreground)] rounded-none mt-7"
            size="sm"
            onPress={() => router.push("/dashboard")}
          >
            Launch
          </Button>
        </div>
      </div>
    </div>
  );
}
