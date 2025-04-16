"use client";

import { Button } from "@heroui/react";
import { FilePlus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export default function ProductEmpty() {
  const user = useSelector((state) => state.user.user);
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="border border-[var(--foreground)] p-4 mb-4">
        <FilePlus className="h-10 w-10" />
      </div>
      <h3 className="text-lg font-medium">No products yet</h3>
      <p className="text-muted-foreground mt-2 max-w-md">
        {user?.role !== "MANUFACTURER"
          ? "Ask your manufacturer to add products to your account."
          : "Create your first product to start selling authentic and verified products."}
      </p>
      {user?.role === "MANUFACTURER" && (
        <Button
          className="rounded-none bg-white text-black w-fit mt-5"
          onPress={() => {
            router.push("/create");
          }}
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      )}
    </div>
  );
}
