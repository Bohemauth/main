"use client";

import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  InputOtp,
} from "@heroui/react";
import { useState, useEffect } from "react";
import { Loader2, Mail } from "lucide-react";
import useRedeem from "@/hooks/useRedeem";

export default function ClaimButton({ className, size, listingId, proofId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [isClaiming, setIsClaiming] = useState(false);
  const [email, setEmail] = useState("");
  const [isRequestingLogin, setIsRequestingLogin] = useState(false);
  const { requestLogin, verifyAndClaim, claimProduct } = useRedeem();
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setStep(1);
    }
  }, [isOpen]);

  useEffect(() => {
    if (step === 3) {
      claimProduct(listingId, proofId, setIsClaiming, setIsOpen);
    }
  }, [step]);

  return (
    <>
      <Button
        className={`w-full rounded-none p-7 bg-white text-black mt-4 ${className}`}
        onPress={() => {
          setIsOpen(true);
        }}
        isDisabled={isClaiming || isRequestingLogin || isVerifying}
        size={size}
      >
        {isClaiming || isRequestingLogin || isVerifying ? (
          <Loader2 className="animate-spin" />
        ) : (
          "Claim"
        )}
      </Button>

      <Modal
        isOpen={isOpen}
        className="font-inter border border-[var(--foreground)] rounded-none"
        onClose={() => setIsOpen(false)}
        closeButton={<div></div>}
        isDismissable={!isClaiming || !isRequestingLogin || !isVerifying}
        isKeyboardDismissDisabled={
          isClaiming || isRequestingLogin || isVerifying
        }
        hideCloseButton={isClaiming || isRequestingLogin || isVerifying}
      >
        <ModalContent>
          {step === 1 && (
            <>
              <ModalHeader>
                <h3 className="text-2xl font-bold">Claim Listing</h3>
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-2">
                  <p className="text-muted-foreground  mb-2">
                    Claim this product, this will be added as an NFT in your
                    account. No one else will be able to claim this product.
                  </p>

                  <Input
                    type="text"
                    placeholder="Enter your email"
                    className="border border-white/40 rounded-none shadow-none mb-2"
                    size="lg"
                    variant="outline"
                    startContent={<Mail className="text-white/40" />}
                    isClearable
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    isDisabled={isRequestingLogin}
                  />
                </div>
              </ModalBody>

              <ModalFooter>
                <Button
                  className="rounded-none  border-white border text-white w-fit mb-2"
                  onPress={() => setIsOpen(false)}
                  isDisabled={isRequestingLogin}
                >
                  Cancel
                </Button>
                <Button
                  className="rounded-none  bg-white text-black w-fit"
                  onPress={() => {
                    requestLogin(email, setStep, setIsRequestingLogin);
                  }}
                  isDisabled={isRequestingLogin}
                >
                  {isRequestingLogin ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Next"
                  )}
                </Button>
              </ModalFooter>
            </>
          )}

          {step === 2 && (
            <>
              <ModalHeader>
                <h3 className="text-2xl font-bold">Claim Listing</h3>
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-2">
                  <p className="text-muted-foreground  mb-2">
                    We sent a code to {email}, check your email and enter the
                    code here.
                  </p>

                  <InputOtp
                    className="rounded-none mt-1 shadow-none text-white items-center mb-1"
                    size="lg"
                    variant="bordered"
                    length={"6"}
                    color="black"
                    errorMessage="Enter a valid code"
                    fullWidth
                    classNames={{
                      segmentWrapper: "gap-x-3",
                      segment: [
                        "relative",
                        "h-10",
                        "w-10",
                        "border-y",
                        "border-l",
                        "border-r",
                        "rounded-none",
                        "border-default-200",
                        "data-[active=true]:border",
                        "data-[active=true]:border-white",
                        "data-[active=true]:z-20",
                        "data-[active=true]:ring-2",
                        "data-[active=true]:ring-offset-2",
                        "data-[active=true]:ring-offset-background",
                        "data-[active=true]:ring-foreground",
                        "data-[active=true]:ring-white/40",
                      ],
                    }}
                    radius="lg"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    isDisabled={isVerifying}
                  />
                </div>
              </ModalBody>

              <ModalFooter>
                <Button
                  className="rounded-none  border-white border text-white w-fit mb-2"
                  onPress={() => setIsOpen(false)}
                  isDisabled={isVerifying}
                >
                  Cancel
                </Button>
                <Button
                  className="rounded-none  bg-white text-black w-fit"
                  onPress={() => {
                    verifyAndClaim(otp, setIsVerifying, setStep);
                  }}
                  isDisabled={isVerifying}
                >
                  {isVerifying ? <Loader2 className="animate-spin" /> : "Claim"}
                </Button>
              </ModalFooter>
            </>
          )}

          {step === 3 && (
            <>
              <ModalHeader>
                <h3 className="text-2xl font-bold">Claiming Product</h3>
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-2">
                  <p className="text-muted-foreground mb-3">
                    Hold Tight while we process your claim and mint you a shiny
                    new NFT for this claim.
                  </p>

                  <div className="flex items-center justify-center mb-10">
                    <Loader2 className="animate-spin" size={50} />
                  </div>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
