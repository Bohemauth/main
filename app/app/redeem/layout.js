import Image from "next/image";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col w-full">
      {children}
      <div className="flex items-center justify-center pb-2">
        <span>Powered by</span>
        <Image
          src="/logo/bohemauth-logo-white.svg"
          alt="Logo"
          width={50}
          height={50}
          className="invert"
        />
        <span className="font-bold inline-block text-base">BohemAuth</span>
      </div>
    </div>
  );
}
