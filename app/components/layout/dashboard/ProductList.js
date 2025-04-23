"use client";

import { Button } from "@heroui/react";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import LaunchButton from "./LaunchButton";

export default function ProductList({ products, search, setSearch }) {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const filtered = products.filter((product) => {
      return product.name.toLowerCase().includes(search.toLowerCase());
    });
    setFilteredProducts(filtered);
  }, [search, products]);

  return (
    <>
      {filteredProducts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {filteredProducts.map((product) => {
            return (
              <div
                key={product.id}
                className="border border-[var(--foreground)] relative flex flex-col"
              >
                <div className="absolute -top-1 right-0">
                  <span className="bg-[var(--foreground)] text-xs text-black px-2 py-1">
                    {product.status}
                  </span>
                </div>
                <Image
                  src={product.image}
                  alt={product.name}
                  width={500}
                  height={500}
                  className="w-full h-52 object-contain"
                />

                <div className="flex flex-1 flex-col justify-between">
                  <div className="p-4">
                    <h3 className="text-lg font-bold">{product.name}</h3>
                    <p className="text-gray-200 mt-1">{product.description}</p>
                  </div>

                  <div className="flex items-center justify-between p-4 pt-0">
                    {product.status === "DRAFT" && (
                      <Button
                        className="rounded-none  bg-white text-black w-fit"
                        onPress={() => {
                          router.push(`/edit/${product.id}`);
                        }}
                      >
                        Edit Product
                      </Button>
                    )}

                    {product.status === "LAUNCHED" && (
                      <Button
                        className="rounded-none  bg-white text-black w-fit"
                        onPress={() => {
                          router.push(`/listing/${product.id}`);
                        }}
                      >
                        Create Listing
                      </Button>
                    )}

                    <LaunchButton product={product} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {filteredProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="border border-[var(--foreground)] p-4 mb-4">
            <Search className="h-10 w-10" />
          </div>
          <h3 className="text-lg font-medium">No products found</h3>
          <p className="text-muted-foreground mt-2">
            We couldn't find any products matching "{search}"
          </p>
          <Button
            className="rounded-none bg-white text-black w-fit mt-5"
            onPress={() => setSearch("")}
          >
            Clear search
          </Button>
        </div>
      )}
    </>
  );
}
