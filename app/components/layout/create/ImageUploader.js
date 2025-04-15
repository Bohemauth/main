"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "@heroui/react";

export default function ImageUploader({
  onImageChange,
  className = "",
  placeholderText = "Click to upload image",
}) {
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (selectedImage) {
        URL.revokeObjectURL(selectedImage);
      }
    };
  }, [selectedImage]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      onImageChange?.(file);
    }
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation(); // Prevent triggering the parent click handler
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onImageChange?.(null);
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 transition-all cursor-pointer hover:bg-muted/50 ${className}`}
      onClick={handleImageClick}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        accept="image/*"
        className="hidden"
        aria-label="Upload image"
      />

      {selectedImage ? (
        <div className="relative w-full h-full min-h-[200px]">
          <Image
            src={selectedImage || "/placeholder.svg"}
            alt="Selected image"
            fill
            className="object-contain rounded-md"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 rounded-full"
            onClick={handleRemoveImage}
            aria-label="Remove image"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-2 py-8">
          <div className="rounded-full bg-muted p-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" />
              <line x1="16" x2="22" y1="5" y2="5" />
              <line x1="19" x2="19" y1="2" y2="8" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
          </div>
          <p className="text-sm text-muted-foreground">{placeholderText}</p>
          <p className="text-xs text-muted-foreground">
            SVG, PNG, JPG or GIF (max. 800x400px)
          </p>
        </div>
      )}
    </div>
  );
}
