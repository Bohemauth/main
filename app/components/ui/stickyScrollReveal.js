"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import DetailBlock from "@/components/layout/landing/Philosophy/DetailBlock";
import { Blocks, Lock, ShieldAlert } from "lucide-react";

const StickyScrollSection = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end 65%"],
  });

  const items = [
    {
      icon: <Blocks />,
      title: "Flare Data Connector",
      description:
        "Verifies product information against external databases and manufacturer records in real-time",
    },
    {
      icon: <Lock />,
      title: "Zero-Knowledge Proofs",
      description:
        "Manufacturers create cryptographic proofs of authenticity without revealing sensitive information",
    },
    {
      icon: <ShieldAlert />,
      title: "Verified Listings",
      description:
        "Consumers can trust product authenticity with cryptographically verified information",
    },
  ];

  return (
    <div className=" relative">
      <div ref={containerRef} className="relative w-full">
        <div className="flex lg:flex-row flex-col 2xl:gap-20 items-start">
          {/* Sticky section - fixed position */}
          <div className="lg:sticky lg:top-20 lg:h-[450px] flex-1 pt-8">
            <div className="rounded-lg p-8 py-6 pl-0 h-full flex flex-col">
              <h2 className="text-5xl font-bold mb-6">How BohemAuth Works</h2>
              <p className="text-white text-2xl">
                Our platform connects manufacturers, retailers, and consumers
                with verified product information
              </p>
            </div>
          </div>

          {/* Scrolling section */}
          <div className="py-28 pt-5 flex-1">
            {items.map((item, index) => {
              const padding = -0.3; // Padding to delay the start
              const itemStart = padding + index / items.length;
              const itemEnd = padding + (index + 1) / items.length;
              const opacity = useTransform(
                scrollYProgress,
                [itemStart, itemEnd],
                [0, 1]
              );

              return (
                <motion.div
                  key={index}
                  style={{ opacity }}
                  className="rounded-lg py-8 lg:pl-32"
                >
                  <DetailBlock
                    title={item.title}
                    description={item.description}
                    icon={item.icon}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StickyScrollSection;
