import Block from "./Header/Block";
import MainBlock from "./Header/MainBlock";

export default function Header() {
  return (
    <div className="h-screen w-screen flex items-center justify-center relative overflow-x-hidden ">
      <div className="flex gap-5 overflow-hidden h-full items-center justify-center relative">
        <div
          className="w-full h-full absolute z-10"
          style={{
            background:
              "radial-gradient(ellipse 60% 60% at center, transparent 0%, #18171b 80%)",
          }}
        ></div>
        <div className="flex flex-col gap-5">
          <Block
            title="Fine Wines & Spirits"
            image="/items/Wine.png"
            size={120}
            description="Wineries can prove the provenance of their bottles while collectors can verify vintage authenticity through Flare's Data Connector."
            decision="Verified Authentic"
            opacity={0.6}
          />
          <Block
            title="Pharmaceuticals"
            image="/items/Medicine.png"
            description="Pharmaceutical companies can protect patients from counterfeit medications by verifying each package against manufacturer databases."
            decision="Verified Authentic"
            opacity={0.6}
          />
          <Block
            title="Fine Wines & Spirits"
            image="/items/Wine.png"
            size={120}
            description="Wineries can prove the provenance of their bottles while collectors can verify vintage authenticity through Flare's Data Connector."
            decision="Verified Authentic"
            opacity={0.6}
          />
        </div>
        <div className="flex flex-col gap-5">
          <Block
            title="Designer Apparel"
            image="/items/Shirt.png"
            description="The fashion industry loses billions to counterfeits annually. Bohemauth allows designers to create verifiable digital certificates for each garment."
            decision="Verified Authentic"
            opacity={0.6}
          />
          <Block
            title="Fine Wines & Spirits"
            image="/items/Wine.png"
            size={120}
            description="Wineries can prove the provenance of their bottles while collectors can verify vintage authenticity through Flare's Data Connector."
            decision="Verified Authentic"
            opacity={0.6}
          />
          <Block
            title="Limited Edition Footwear"
            image="/items/Shoe.png"
            description="Sneaker collectors can verify the authenticity of limited releases with Bohemauth's zero-knowledge verification system."
            decision="Verified Authentic"
            opacity={0.6}
          />
        </div>
        <div className="flex flex-col gap-5 -mt-20">
          <Block
            title="Limited Edition Footwear"
            image="/items/Shoe.png"
            description="Sneaker collectors can verify the authenticity of limited releases with Bohemauth's zero-knowledge verification system."
            decision="Verified Authentic"
            opacity={0.6}
          />

          <MainBlock />

          <Block
            title="Designer Apparel"
            image="/items/Shirt.png"
            description="The fashion industry loses billions to counterfeits annually. Bohemauth allows designers to create verifiable digital certificates for each garment."
            decision="Verified Authentic"
            opacity={0.6}
          />
        </div>
        <div className="flex flex-col gap-5">
          <Block
            title="Fine Wines & Spirits"
            image="/items/Wine.png"
            size={120}
            description="Wineries can prove the provenance of their bottles while collectors can verify vintage authenticity through Flare's Data Connector."
            decision="Verified Authentic"
            opacity={0.6}
          />
          <Block
            title="Pharmaceuticals"
            image="/items/Medicine.png"
            description="Pharmaceutical companies can protect patients from counterfeit medications by verifying each package against manufacturer databases."
            decision="Verified Authentic"
            opacity={0.6}
          />
          <Block
            title="Fine Wines & Spirits"
            image="/items/Wine.png"
            size={120}
            description="Wineries can prove the provenance of their bottles while collectors can verify vintage authenticity through Flare's Data Connector."
            decision="Verified Authentic"
            opacity={0.6}
          />
        </div>
        <div className="flex flex-col gap-5">
          <Block
            title="Designer Apparel"
            image="/items/Shirt.png"
            description="The fashion industry loses billions to counterfeits annually. Bohemauth allows designers to create verifiable digital certificates for each garment."
            decision="Verified Authentic"
            opacity={0.6}
          />
          <Block
            title="Fine Wines & Spirits"
            image="/items/Wine.png"
            size={120}
            description="Wineries can prove the provenance of their bottles while collectors can verify vintage authenticity through Flare's Data Connector."
            decision="Verified Authentic"
            opacity={0.6}
          />
          <Block
            title="Limited Edition Footwear"
            image="/items/Shoe.png"
            description="Sneaker collectors can verify the authenticity of limited releases with Bohemauth's zero-knowledge verification system."
            decision="Verified Authentic"
            opacity={0.6}
          />
        </div>
      </div>
    </div>
  );
}
