import {
  Binoculars,
  Blocks,
  BrainIcon,
  ChartColumnDecreasing,
  CpuIcon,
  Search,
} from "lucide-react";
import DynamicBlock from "./Capabilities/DynamicBlock";

export default function Capabilities() {
  const capabilities = [
    {
      title: "For Manufacturers",
      description:
        "Protect your brand from counterfeits, Maintain control over product information",
      icon: <Search />,
    },
    {
      title: "For Retailers",
      description:
        "Ensure inventory authenticity, Differentiate with verified product listings",
      icon: <ChartColumnDecreasing />,
    },
    {
      title: "For Consumers",
      description:
        "Shop with confidence knowing products are authentic, Protect yourself from counterfeit goods",
      icon: <Blocks />,
    },
    {
      title: "Technical Innovation",
      description:
        "Zero-knowledge proofs ensure privacy while verifying authenticity, Scalable verification system",
      icon: <CpuIcon />,
    },
    {
      title: "Flare's Data Connector",
      description:
        "Provides real-time verification against trusted sources, Enables secure, transparent product verification",
      icon: <Binoculars />,
    },
    {
      title: "Immutable Record",
      description:
        "Immutable record of product authenticity and provenance, Seamless integration",
      icon: <BrainIcon />,
    },
  ];

  return (
    <div className="container lg:mt-20 mt-0 ">
      <h2 className="text-5xl font-bold mb-3 lg:text-center">
        Benefits for All Parties
      </h2>
      <p className="text-xl mb-10 lg:text-center">
        Bohemauth creates value for manufacturers, retailers, and consumers
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-0">
        {capabilities.map((capability, index) => (
          <DynamicBlock
            key={index}
            title={capability.title}
            description={capability.description}
            icon={capability.icon}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
