"use client";

import useProduct from "@/hooks/useProduct";
import { Button, Divider } from "@heroui/react";
import { FilePlus, Plus, Loader2 } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import CreateListingButton from "./CreateListingButton";

export default function ListProduct() {
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { getProduct, getAllListings } = useProduct();
  const params = useParams();
  const router = useRouter();
  const id = params.id;
  const [listings, setListings] = useState([]);
  const [isLoadingListings, setIsLoadingListings] = useState(false);

  const handleListing = async () => {
    setIsLoadingListings(true);
    try {
      const listings = await getAllListings(id);
      setListings(listings);
    } catch (error) {
      console.error("Failed to get listings:", error);
      toast.error("Failed to get listings");
    } finally {
      setIsLoadingListings(false);
    }
  };

  const handleInitialize = async () => {
    setIsLoading(true);
    try {
      const product = await getProduct(id);
      if (product) {
        setProduct(product);
        if (product.status !== "LAUNCHED") {
          router.push(`/dashboard`);
          toast.error("Product is not launched");
        }
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
    if (!id) return;
    handleInitialize();
    handleListing();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex-1 items-center justify-center flex w-full">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    product && (
      <main className="mx-auto py-7">
        <div className="flex w-full mt-5 flex-col gap-10">
          <div className="flex justify-center sm:flex-row items-center sm:items-start flex-col gap-10">
            <div className="flex flex-col max-w-[350px]">
              <Image
                src={product?.image}
                alt={product?.name}
                width={350}
                height={240}
                className=" h-[240px] rounded-none object-contain border border-white/40"
              />

              <h1 className="text-3xl font-bold mt-5 mb-2">{product?.name}</h1>
              <p className="text-gray-200 mt-1">{product?.description}</p>
            </div>

            <div className="flex flex-col max-w-[350px]">
              <div className="flex flex-col gap-5 w-full">
                <h1 className="text-3xl font-bold mb-2">Create Listing</h1>

                <p className="text-sm">
                  Create a listing for your product, so that customers can
                  verify and claim it
                </p>
                <CreateListingButton className="w-full" product={product} />
              </div>
            </div>
          </div>
          <Divider />

          <div className="flex flex-col gap-5 w-full">
            <h1 className="text-2xl font-bold">Your Listings</h1>

            {isLoadingListings && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="animate-spin" />
              </div>
            )}

            {listings.length === 0 && !isLoadingListings && (
              <>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="border border-[var(--foreground)] p-4 mb-4">
                    <FilePlus className="h-10 w-10" />
                  </div>
                  <h3 className="text-lg font-medium">No listings yet</h3>
                  <p className="text-muted-foreground mt-2 max-w-md">
                    You have not created any listings for this product.
                  </p>

                  <CreateListingButton
                    className="w-fit p-4"
                    product={product}
                  />
                </div>
              </>
            )}

            {listings.length > 0 && !isLoadingListings && (
              <div className="flex flex-col gap-5 w-full">
                {listings.map((listing) => (
                  <div
                    key={listing.id}
                    className="flex justify-between items-center gap-5 w-full p-3 border border-[var(--foreground)]"
                  >
                    <h1 className="text-sm ">{listing.id}</h1>
                    {!listing.isClaimed && (
                      <div className="text-xs p-2 border border-[var(--foreground)]">
                        Not Claimed
                      </div>
                    )}
                    {listing.isClaimed && (
                      <div className="text-xs p-2 bg-[var(--foreground)] text-background">
                        Claimed
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    )
  );
}
