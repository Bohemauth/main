"use client";

import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { Loader2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import useProduct from "@/hooks/useProduct";
import { useParams, use } from "next/navigation";
import QRCodeGenerator from "@/components/ui/QrCodeGenerator";
import QrCodeWithLogo from "qrcode-with-logos";

export default function CreateListingButton({
  className,
  size,
  product,
  handleListing,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isListing, setIsListing] = useState(false);
  const { createListing } = useProduct();
  const params = useParams();
  const id = params.id;
  const [step, setStep] = useState(1);
  const [payload, setPayload] = useState(null);

  const handleCreateListing = async () => {
    try {
      const payload = await createListing(id, setIsListing);
      setPayload(payload);
      console.log(
        `${window.location.origin}/redeem?listingId=${payload?.listing?.id}&proof=${payload?.proof}`
      );
      setStep(2);
      await handleListing();
    } catch (error) {
      console.error("Create listing error:", error);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setPayload(null);
    }
  }, [isOpen]);

  return (
    <>
      <Button
        className={`w-full rounded-none p-7 bg-white text-black mt-4 ${className}`}
        onPress={() => {
          setIsOpen(true);
        }}
        size={size}
      >
        <Plus className="h-4 w-4" />
        Create Listing
      </Button>

      <Modal
        isOpen={isOpen}
        onOpenChange={() => setIsOpen(false)}
        className="font-inter border border-[var(--foreground)] rounded-none"
        onClose={() => setIsOpen(false)}
        closeButton={<div></div>}
        isDismissable={!isListing}
        isKeyboardDismissDisabled={isListing}
        hideCloseButton={isListing}
      >
        <ModalContent>
          {step === 1 && (
            <>
              <ModalHeader>
                <h3 className="text-2xl font-bold">Create Listing</h3>
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-2">
                  <p className="text-muted-foreground mb-5">
                    Are you sure you want to create this listing? This will be
                    used to verify and claim the product.
                  </p>

                  <Image
                    src={product.image}
                    alt="Product Image"
                    width={350}
                    height={240}
                    className="w-full h-[240px] rounded-none object-contain border border-white/40"
                  />
                  <div className="flex flex-col mt-2">
                    <h3 className="text-lg font-bold">{product.name}</h3>
                    <p className="text-muted-foreground">
                      {product.description}
                    </p>
                  </div>
                </div>
              </ModalBody>

              <ModalFooter>
                <Button
                  className="rounded-none  border-white border text-white w-fit mb-2"
                  onPress={() => setIsOpen(false)}
                  isDisabled={isListing}
                >
                  Cancel
                </Button>
                <Button
                  className="rounded-none  bg-white text-black w-fit"
                  onPress={() => {
                    handleCreateListing();
                  }}
                  isDisabled={isListing}
                >
                  {isListing ? <Loader2 className="animate-spin" /> : "Create"}
                </Button>
              </ModalFooter>
            </>
          )}

          {step === 2 && (
            <>
              <ModalHeader>
                <h3 className="text-2xl font-bold">New Listing</h3>
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-2">
                  <p className="text-muted-foreground mb-3">
                    This QR code will be used to verify and claim the product.
                    It will be shown only once, download it now.
                  </p>

                  <QRCodeGenerator
                    value={`${window.location.origin}/redeem?listingId=${payload?.listing?.id}&proofId=${payload?.proofId}`}
                    size={500}
                  />
                </div>
              </ModalBody>

              <ModalFooter>
                <Button
                  className="rounded-none  border-white border text-white w-fit mb-2"
                  onPress={() => setIsOpen(false)}
                  isDisabled={isListing}
                >
                  Close
                </Button>
                <Button
                  className="rounded-none  bg-white text-black w-fit"
                  onPress={() => {
                    const qrcode = new QrCodeWithLogo({
                      content: `${window.location.origin}/redeem?listingId=${payload?.listing?.id}&proofId=${payload?.proofId}`,
                      width: 500,
                      dotsOptions: {
                        color: "#000",
                        type: "dot-small",
                      },
                      cornersOptions: {
                        type: "circle-rounded",
                        color: "#000",
                      },
                    });

                    qrcode.downloadImage("qrcode.png");
                  }}
                  isDisabled={isListing}
                >
                  Download
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
