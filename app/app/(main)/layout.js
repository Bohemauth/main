import UserProvider from "@/providers/UserProvider";

export default function MainLayout({ children }) {
  return <UserProvider>{children}</UserProvider>;
}
