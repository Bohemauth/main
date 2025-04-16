"use client";

import { Input, Textarea, Button } from "@heroui/react";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import useProduct from "@/hooks/useProduct";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect } from "react";

export default function EditProduct() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const { getProduct, editProduct } = useProduct();
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const handleInitialize = async () => {
    setIsLoading(true);
    try {
      const product = await getProduct(id);
      if (product) {
        setName(product.name);
        setDescription(product.description);
        setProduct(product);
      } else {
        toast.error("Product not found");
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Failed to initialize product:", error);
      toast.error("Failed to initialize product");
      router.push("/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleInitialize();
  }, [id]);

  return (
    <main className="container mx-auto py-7">
      <div className="flex w-full mt-5 justify-center sm:flex-row items-center flex-col gap-10">
        <div className="w-[350px] flex flex-col">
          <h1 className="text-3xl font-bold mb-5">Update Product</h1>

          {isLoading ? (
            <div className="flex h-[240px] w-full">
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            product && (
              <Image
                src={product.image}
                alt="Product Image"
                width={350}
                height={240}
                className="w-full h-[240px] rounded-none object-contain border border-white/40"
              />
            )
          )}
        </div>

        <div className="w-[350px] flex flex-col">
          <p className="text-sm">Enter your Product Name</p>

          <Input
            type="text"
            placeholder="Enter your Product Name"
            className="border border-white/40 rounded-none mt-3 shadow-none"
            size="lg"
            variant="outline"
            isClearable
            value={name}
            onChange={(e) => setName(e.target.value)}
            isDisabled={isLoading || !product || isUpdating}
          />

          <p className="mt-5 text-sm">Add Product Details</p>

          <Textarea
            placeholder="Enter your Product Details"
            className="border border-white/40 rounded-none mt-3 shadow-none"
            size="lg"
            variant="outline"
            isClearable
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            isDisabled={isLoading || !product || isUpdating}
          />

          <Button
            className="w-full rounded-none p-7 bg-white text-black mt-4"
            onPress={() => {
              editProduct(id, name, description, setIsUpdating);
            }}
            isDisabled={
              name.length === 0 ||
              description.length === 0 ||
              isUpdating ||
              !product ||
              isLoading
            }
          >
            {isUpdating ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Update Product"
            )}
          </Button>
        </div>
      </div>
    </main>
  );
}
