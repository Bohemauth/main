"use client";

import { Input, Textarea, Button } from "@heroui/react";
import { useState } from "react";
import ImageUploader from "./ImageUploader";
import useProduct from "@/hooks/useProduct";
import { Loader2 } from "lucide-react";

export default function CreateProduct() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { createProduct } = useProduct();
  const [isCreating, setIsCreating] = useState(false);

  const handleImageChange = (file) => {
    setUploadedFile(file);
  };

  return (
    <main className="container mx-auto py-7">
      <div className="flex w-full mt-5 justify-center sm:flex-row items-center flex-col gap-10">
        <div className="w-[350px] flex flex-col">
          <h1 className="text-3xl font-bold mb-5">Create Product</h1>

          <ImageUploader
            onImageChange={handleImageChange}
            className="w-full h-[240px] rounded-none"
            placeholderText="Click to select an image"
          />
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
          />

          <Button
            className="w-full rounded-none p-7 bg-white text-black mt-4"
            onPress={() => {
              createProduct(uploadedFile, name, description, setIsCreating);
            }}
            isDisabled={
              name.length === 0 ||
              description.length === 0 ||
              !uploadedFile ||
              isCreating
            }
          >
            {isCreating ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Create Product"
            )}
          </Button>
        </div>
      </div>
    </main>
  );
}
