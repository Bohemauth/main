"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { useState } from "react";
import Image from "next/image";
import useProduct from "@/hooks/useProduct";
import { Loader2 } from "lucide-react";

export default function LaunchButton({ product }) {
  const [isOpen, setIsOpen] = useState(false);
  const { launchProduct } = useProduct();
  const [isLaunching, setIsLaunching] = useState(false);
  return (
    <>
      <Button
        className="rounded-none  bg-white text-black w-fit"
        onPress={() => {
          setIsOpen(true);
        }}
        isDisabled={product.status !== "DRAFT"}
      >
        {product.status === "DRAFT"
          ? "Launch"
          : product.status === "QUEUED"
          ? "Queued"
          : "Launched"}
      </Button>

      <Modal
        isOpen={isOpen}
        onOpenChange={() => setIsOpen(false)}
        className="font-inter border border-[var(--foreground)] rounded-none"
        onClose={() => setIsOpen(false)}
        closeButton={<div></div>}
        isDismissable={!isLaunching}
        isKeyboardDismissDisabled={isLaunching}
        hideCloseButton={isLaunching}
      >
        <ModalContent>
          <ModalHeader>
            <h3 className="text-2xl font-bold">Launch Product</h3>
          </ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-2">
              <p className="text-muted-foreground mb-5">
                Are you sure you want to launch this product? You cannot undo
                this action and your product cannot be edited after launch.
              </p>

              <Image
                src={product.image}
                alt="Product Image"
                width={350}
                height={240}
                className="w-full h-[240px] rounded-none object-contain border border-white/40"
              />
              <div className="flex flex-col">
                <h3 className="text-lg font-bold">{product.name}</h3>
                <p className="text-muted-foreground">{product.description}</p>
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button
              className="rounded-none  border-white border text-white w-fit mb-2"
              onPress={() => setIsOpen(false)}
              isDisabled={isLaunching}
            >
              Cancel
            </Button>
            <Button
              className="rounded-none  bg-white text-black w-fit"
              onPress={() => {
                launchProduct(product.id, setIsLaunching, setIsOpen);
              }}
              isDisabled={isLaunching}
            >
              {isLaunching ? <Loader2 className="animate-spin" /> : "Launch"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
