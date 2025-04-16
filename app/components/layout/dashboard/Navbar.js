"use client";

import { useSelector } from "react-redux";
import Image from "next/image";
import { LogOut, User } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { useLogout } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
  const user = useSelector((state) => state.user.user);
  const { logout } = useLogout();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-10 border-b border-[var(--foreground)] bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2 -ml-2">
          <Image
            src="/logo/bohemauth-logo-white.svg"
            alt="Logo"
            width={50}
            height={50}
            className="invert"
          />
          <span className="font-bold inline-block text-2xl">BohemAuth</span>
        </div>

        <nav className="flex items-center gap-6 -ml-24">
          <Link href="/dashboard" className="text-sm font-medium">
            Products
          </Link>
          <Link
            href="/claims"
            className="text-sm font-medium text-muted-foreground"
          >
            Claims
          </Link>
        </nav>

        <div className="hidden items-center gap-2 sm:flex">
          <Popover placement="bottom-end">
            <PopoverTrigger>
              <div className="flex items-center justify-center p-2 border-[var(--foreground)] border cursor-pointer">
                <User size={20} />
              </div>
            </PopoverTrigger>
            <PopoverContent className="rounded-none border border-[var(--foreground)]">
              <div className="px-1 py-2 flex flex-col gap-0.5 items">
                <div className="flex items-center justify-center p-2 border-b border-[var(--foreground)] ">
                  <div className="text-xs text-center">{user?.role}</div>
                </div>

                <div className="text-small font-bold mt-2">{user?.name}</div>

                <div className="text-tiny">{user?.description}</div>
              </div>
            </PopoverContent>
          </Popover>

          <div
            className="flex items-center justify-center p-2 border-[var(--foreground)] border cursor-pointer hover:text-red-400"
            onClick={handleLogout}
          >
            <LogOut size={20} />
          </div>
        </div>
      </div>
    </header>
  );
}
