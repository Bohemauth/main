import { Tinos } from "next/font/google";

import "./globals.css";

import UiProvider from "@/providers/UiProvider";
import { Toaster } from "sonner";
import PrivyProviders from "@/providers/PrivyProvider";
import ReduxProvider from "@/providers/ReduxProvider";

const tino = Tinos({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata = {
  title: "BohemAuth",
  description: "BohemAuth - Authentic Products. Verified Truths.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${tino.className} antialiased overflow-x-hidden`}
        suppressHydrationWarning
      >
        <ReduxProvider>
          <PrivyProviders>
            <UiProvider>
              <Toaster
                position="bottom-center"
                richColors
                toastOptions={{
                  className: `flex items-center justify-center text-center border rounded-none ${tino.className}`,
                  style: {
                    color: "white",
                    backgroundColor: "var(--background)",
                    borderColor: "white",
                    borderRadius: "0",
                  },
                }}
              />
              {children}
            </UiProvider>
          </PrivyProviders>
        </ReduxProvider>
      </body>
    </html>
  );
}
