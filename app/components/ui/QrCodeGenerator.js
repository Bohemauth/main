"use client";

import React, { useEffect } from "react";
import QrCodeWithLogo from "qrcode-with-logos";
import { Loader2 } from "lucide-react";

const QRCodeGenerator = ({
  value = "https://github.com/zxpsuper",
  size = 500,
}) => {
  const [src, setSrc] = React.useState("");

  useEffect(() => {
    const qrcode = new QrCodeWithLogo(
      {
        content: value,
        width: size,
        dotsOptions: {
          color: "#000",
          type: "dot-small",
        },
        cornersOptions: {
          type: "circle-rounded",
          color: "#000",
        },
      },
      [value, size]
    );

    const getImage = async () => {
      const src = (await qrcode.getCanvas()).toDataURL();
      setSrc(src);
    };

    getImage();
  }, [value, size]);

  return (
    (src && (
      <img
        src={src}
        alt="QR Code with Logo"
        style={{}}
        className="rounded-none w-full h-full"
      />
    )) || (
      <div className="flex items-center justify-center w-full h-full">
        <Loader2 className="animate-spin" size={50} />
      </div>
    )
  );
};

export default QRCodeGenerator;
