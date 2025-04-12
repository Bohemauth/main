"use client";

import useOnboard from "@/hooks/useOnboard";
import {
  Input,
  Textarea,
  RadioGroup,
  useRadio,
  VisuallyHidden,
  cn,
  Button,
} from "@heroui/react";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export const CustomRadio = (props) => {
  const {
    Component,
    children,
    description,
    getBaseProps,
    getWrapperProps,
    getInputProps,
    getLabelProps,
    getLabelWrapperProps,
    getControlProps,
  } = useRadio(props);

  return (
    <Component
      {...getBaseProps()}
      className={cn(
        "group inline-flex items-center hover:opacity-70 active:opacity-50 justify-between flex-row-reverse tap-highlight-transparent",
        "cursor-pointer border-2 border-default rounded-none gap-4 p-4",
        "data-[selected=true]:border-[var(--foreground)]"
      )}
    >
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <span {...getWrapperProps()}>
        <span {...getControlProps()} />
      </span>
      <div className="text-white" {...getLabelWrapperProps()}>
        {children && <span {...getLabelProps()}>{children}</span>}
        {description && (
          <span className="text-small text-white opacity-70">
            {description}
          </span>
        )}
      </div>
    </Component>
  );
};

export default function SignupForm() {
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [role, setRole] = useState("");
  const [step, setStep] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  const { createUser } = useOnboard();

  if (step === 1) {
    return (
      <>
        <p className="mt-5 text-sm">Enter your Company Name</p>

        <Input
          type="text"
          placeholder="Company Name"
          className="border border-white/40 rounded-none mt-3 shadow-none"
          size="lg"
          variant="outline"
          isClearable
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <p className="mt-5 text-sm">Add Description</p>

        <Textarea
          placeholder="Enter your description"
          className="border border-white/40 rounded-none mt-3 shadow-none"
          size="lg"
          variant="outline"
          isClearable
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="mt-4 flex w-full gap-2">
          <Button
            className="w-full rounded-none p-7 bg-white text-black"
            onPress={() => {
              setStep(2);
            }}
            isDisabled={username === "" || description === ""}
          >
            Next
          </Button>
        </div>
      </>
    );
  } else if (step === 2) {
    return (
      <>
        <div className="mt-5">
          <RadioGroup
            label="Select your role"
            value={role}
            color="default"
            onValueChange={setRole}
          >
            <CustomRadio
              description="For those who want to list their products"
              value="MANUFACTURER"
            >
              Manufacturer
            </CustomRadio>
            <CustomRadio
              description="For those who want to sell their products"
              value="DISTRIBUTOR"
            >
              Distributor
            </CustomRadio>
          </RadioGroup>
        </div>

        <div className="mt-4 flex w-full gap-2">
          <Button
            className="w-full rounded-none p-7 bg-white text-black"
            onPress={() => {
              createUser(username, description, role, setIsCreating);
            }}
            isDisabled={!role || isCreating}
          >
            {isCreating ? <Loader2 className="animate-spin" /> : "Create"}
          </Button>
          <Button
            className="w-full rounded-none p-7 border border-white/40 "
            variant="outline"
            onPress={() => {
              setStep(1);
            }}
            isDisabled={isCreating}
          >
            Back
          </Button>
        </div>
      </>
    );
  }
}
