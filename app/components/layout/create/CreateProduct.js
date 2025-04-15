"use client";

import { Input, Textarea, Button } from "@heroui/react";
import { useState } from "react";
import ImageUploader from "./ImageUploader";

export default function CreateProduct() {
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleImageChange = (file) => {
    setUploadedFile(file);
  };

  return (
    <main className="container mx-auto py-7">
      <div className="flex w-full mt-5 justify-center gap-10">
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
          />

          <p className="mt-5 text-sm">Add Product Details</p>

          <Textarea
            placeholder="Enter your Product Details"
            className="border border-white/40 rounded-none mt-3 shadow-none"
            size="lg"
            variant="outline"
            isClearable
          />

          <Button
            className="w-full rounded-none p-7 bg-white text-black mt-4"
            onPress={() => {}}
          >
            Create Product
          </Button>
        </div>
      </div>
    </main>
  );
}
