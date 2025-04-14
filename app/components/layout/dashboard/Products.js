"use client";

import { Input, Button } from "@heroui/react";
import { Plus, Search } from "lucide-react";
import ProductEmpty from "./ProductEmpty";
import { useSelector } from "react-redux";

export default function Products() {
  const user = useSelector((state) => state.user.user);
  return (
    <main className="container mx-auto py-7">
      <div className="flex w-full justify-between">
        <Input
          variant="outline"
          placeholder="Search Products"
          className="w-[350px] shadow-none border-[var(--foreground)] border rounded-none"
          startContent={<Search className="h-4 w-4 opacity-50" />}
        />

        <Button
          className="rounded-none  bg-white text-black w-fit"
          onPress={() => {}}
          isDisabled={user?.role !== "MANUFACTURER"}
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      <ProductEmpty />
    </main>
  );
}
