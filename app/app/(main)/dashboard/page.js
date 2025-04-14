import Navbar from "@/components/layout/dashboard/Navbar";
import Products from "@/components/layout/dashboard/Products";

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Products />
    </div>
  );
}
