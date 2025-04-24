"use client";

import { Check, FileWarning, Loader2, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import useProduct from "@/hooks/useProduct";
import Image from "next/image";
import ClaimButton from "./ClaimButton";

export default function RedeemProduct() {
  const searchParams = useSearchParams();
  const listingId = searchParams.get("listingId");
  const proofId = searchParams.get("proofId");
  const [listing, setListing] = useState(null);
  const [valid, setValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const { validateProduct } = useProduct();

  const handleValidate = async () => {
    try {
      setLoading(true);
      const payload = await validateProduct(listingId, proofId);
      setListing(payload.listing);
      setValid(payload.isValid);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (listingId && proofId) {
      handleValidate();
    }
  }, [listingId, proofId]);

  if (!listingId || !proofId) {
    return (
      <div className="flex flex-col gap-5">
        <div className="border border-[var(--foreground)] w-fit p-5">
          <FileWarning className="text-2xl" size={50} />
        </div>
        <p className="text-2xl">
          Invalid listing or proof, Make sure you have opened the correct url
        </p>
      </div>
    );
  }

  if (loading) {
    return <Loader2 className="text-2xl animate-spin" size={50} />;
  }

  if (!listing && !loading) {
    return (
      <div className="flex flex-col gap-5 max-w-[350px]">
        <div className="border border-[var(--foreground)] w-fit p-5">
          <FileWarning className="text-2xl" size={50} />
        </div>
        <p className="text-2xl">
          Invalid listing, Make sure you have opened the correct url
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 max-w-[350px]">
      <Image
        src={listing?.Product?.image}
        alt={listing?.Product?.name}
        width={350}
        height={240}
        className=" h-[240px] rounded-none object-contain border border-white/40"
      />

      <h1 className="text-3xl font-bold mt-5 mb-2">{listing?.Product?.name}</h1>
      <p className="text-gray-200 -mt-3">{listing?.Product?.description}</p>

      <div className="flex items-center gap-4 mt-5">
        <div className="border border-[var(--foreground)] p-2">
          <Check size={15} />
        </div>
        <p className="text-xl">Valid Listing</p>
      </div>
      <div className="flex items-center gap-4 mt-2">
        <div className="border border-[var(--foreground)] p-2">
          {valid ? <Check size={15} /> : <X size={15} />}
        </div>
        <p className="text-xl">{valid ? "Valid Proof" : "Invalid Proof"}</p>
      </div>
      <div className="flex items-center gap-4 mt-2">
        <div className="border border-[var(--foreground)] p-2">
          {listing?.isClaimed ? <Check size={15} /> : <X size={15} />}
        </div>
        <p className="text-xl">
          {listing?.isClaimed ? "Claimed" : "Not Claimed"}
        </p>
      </div>

      {listing?.isClaimed || !valid ? null : (
        <ClaimButton className="mt-7" listingId={listingId} proofId={proofId} />
      )}
    </div>
  );
}
