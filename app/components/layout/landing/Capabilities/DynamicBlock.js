"use client";

import { useState, useEffect } from "react";

// Updated DynamicBlock Component
export default function DynamicBlock({ title, description, icon, index }) {
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    // Function to check if screen is large (lg breakpoint)
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    // Set initial value
    checkScreenSize();

    // Add event listener
    window.addEventListener("resize", checkScreenSize);

    // Clean up
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Determine border radius classes based on index and screen size
  const getBorderRadiusClass = () => {
    if (!isLargeScreen) return "rounded-lg"; // Simple rounded corners on mobile

    if (index === 0) return "rounded-tl-lg";
    if (index === 2) return "rounded-tr-lg";
    if (index === 3) return "rounded-bl-lg";
    if (index === 5) return "rounded-br-lg";
    return "";
  };

  // Determine border classes based on index and screen size
  const getBorderClasses = () => {
    if (!isLargeScreen) return "border border-[var(--foreground)]";

    const classes = [];

    // Top border for first row
    if (index < 3) classes.push("border-t");

    // Left border for leftmost column
    if (index === 0 || index === 3) classes.push("border-l");

    // Right border for rightmost column
    if (index === 2 || index === 5) classes.push("border-r");

    // Bottom border for all
    classes.push("border-b");

    // Add border for middle columns
    if (index === 1 || index === 4) {
      classes.push("border-l border-r");
    }

    return classes.join(" ");
  };

  return (
    <div
      className={`flex flex-col gap-2 p-5 py-8 bg-[var(--block)] ${getBorderRadiusClass()} ${getBorderClasses()} border-[var(--foreground)] border-opacity-70`}
    >
      <div className="flex items-center gap-2 mb-8">{icon}</div>
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-base">{description}</p>
    </div>
  );
}
