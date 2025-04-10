import { Tinos } from "next/font/google";

import "./globals.css";

import UiProvider from "@/providers/UiProvider";

const tino = Tinos({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata = {
  title: "Melra",
  description: "The Sovereign Delegate",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${tino.className} antialiased overflow-x-hidden`}
        suppressHydrationWarning
      >
        <UiProvider>{children}</UiProvider>
      </body>
    </html>
  );
}
