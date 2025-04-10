import Capabilities from "@/components/layout/landing/Capabilities";
import Footer from "@/components/layout/landing/Footer";
import Header from "@/components/layout/landing/Header";
import Philosophy from "@/components/layout/landing/Philosophy";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <Header />
        <Philosophy />
        <Capabilities />
        <Footer />
      </main>
    </div>
  );
}
