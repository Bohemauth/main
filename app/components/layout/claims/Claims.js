"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@heroui/react";
import { Search } from "lucide-react";

export default function Claims({ claims, search, setSearch }) {
  const [filteredClaims, setFilteredClaims] = useState([]);

  useEffect(() => {
    const filtered = claims.filter((claim) => {
      return claim.Product.name.toLowerCase().includes(search.toLowerCase());
    });
    setFilteredClaims(filtered);
  }, [search, claims]);

  return (
    <>
      {filteredClaims.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {filteredClaims.map((claim) => {
            return (
              <div
                key={claim.id}
                className="border border-[var(--foreground)] relative flex flex-col"
              >
                <div className="absolute -top-1 right-0">
                  <span className="bg-[var(--foreground)] text-xs text-black px-2 py-1">
                    {claim.nftId}
                  </span>
                </div>
                <Image
                  src={claim.Product.image}
                  alt={claim.Product.name}
                  width={500}
                  height={500}
                  className="w-full h-52 object-contain"
                />

                <div className="flex flex-1 flex-col justify-between">
                  <div className="p-4">
                    <h3 className="text-lg font-bold">{claim.Product.name}</h3>
                    <p className="text-gray-200 mt-1">
                      {claim.Product.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between p-4 pt-0">
                    <Button
                      className="rounded-none  bg-white text-black w-fit"
                      onPress={() => {
                        window.open(
                          window.location.origin +
                            `/redeem?listingId=${claim.listingId}`
                        );
                      }}
                    >
                      View Listing
                    </Button>

                    <Button
                      className="rounded-none  bg-white text-black w-fit"
                      onPress={() => {
                        window.open(
                          `https://coston2-explorer.flare.network/token/0x95F1Adb21c4eF3E9a81FEEE6188A6afA727389f7/instance/${claim.nftId}`,
                          "_blank"
                        );
                      }}
                    >
                      View On Chain
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {filteredClaims.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="border border-[var(--foreground)] p-4 mb-4">
            <Search className="h-10 w-10" />
          </div>
          <h3 className="text-lg font-medium">No claims found</h3>
          <p className="text-muted-foreground mt-2">
            We couldn't find any claims matching "{search}"
          </p>
          <Button
            className="rounded-none bg-white text-black w-fit mt-5"
            onPress={() => setSearch("")}
          >
            Clear search
          </Button>
        </div>
      )}
    </>
  );
}
