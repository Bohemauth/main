import Navbar from "@/components/layout/dashboard/Navbar";
import UserProvider from "@/providers/UserProvider";

export default function MainLayout({ children }) {
  return (
    <UserProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        {children}
      </div>
    </UserProvider>
  );
}
