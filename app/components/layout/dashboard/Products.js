"use client";

import { Input, Button } from "@heroui/react";
import { Plus, Search } from "lucide-react";
import ProductEmpty from "./ProductEmpty";
import { useSelector } from "react-redux";
import ProductList from "./ProductList";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Products() {
  const user = useSelector((state) => state.user.user);
  const products = useSelector((state) => state.user.products);
  const router = useRouter();
  const [search, setSearch] = useState("");

  return (
    <main className="container mx-auto py-7">
      <div className="flex w-full justify-between gap-2">
        <Input
          variant="outline"
          placeholder="Search Products"
          className="w-[350px] shadow-none border-[var(--foreground)] border rounded-none"
          startContent={<Search className="h-4 w-4 opacity-50" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Button
          className="rounded-none  bg-white text-black w-fit"
          onPress={() => {
            router.push("/create");
          }}
          isDisabled={user?.role !== "MANUFACTURER"}
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {products.length === 0 && <ProductEmpty />}
      {products.length > 0 && (
        <ProductList
          products={products}
          search={search}
          setSearch={setSearch}
        />
      )}
    </main>
  );
}
