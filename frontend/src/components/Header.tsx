"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import NeonButton from "./NeonButton";
import Link from "next/link";
import { useAuthStore } from "@/stores/userStore";
import { useMutation } from "@tanstack/react-query";
import { handleLogout } from "@/apis/authApi";
import toast from "react-hot-toast";
import { usePathname, useRouter } from "next/navigation";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { accessToken, user, logout } = useAuthStore();
  const pathname = usePathname();
  const isPublicPage = pathname?.startsWith("/public-page");
  const router = useRouter();

  const logoutMutation = useMutation({
    mutationFn: () => handleLogout(),
    onSuccess: () => {
      toast.success("Logged out successfully.");
      logout();
      router.replace("/");
      setMenuOpen(false);
    },

    onError: () => {
      toast.error("Logout failed. Please try again.");
    },
  });

  const handleLogoutClick = () => {
    logoutMutation.mutate();
  };
  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-black/10 border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-white tracking-tight">
          Link{" "}
          <span
            className={`${
              isPublicPage ? "text-emerald-400" : "text-fuchsia-400"
            }`}
          >
            Hive
          </span>
        </Link>

        {/* Desktop Buttons */}
        <div className="hidden md:flex gap-4">
          {accessToken && user ? (
            <div className="flex gap-4">
              <NeonButton
                onClick={handleLogoutClick}
                text="Log Out"
                color={isPublicPage ? "emerald" : "fuchsia"}
                full
              />
              <Link href="/dashboard">
                <NeonButton
                  text="Dashboard"
                  color={isPublicPage ? "emerald" : "fuchsia"}
                  full
                />
              </Link>
            </div>
          ) : (
            <>
              <Link href="/auth/login">
                <NeonButton text="Log In" color="emerald" full />
              </Link>
              <Link href="/auth/signup">
                <NeonButton text="Sign Up" color="fuchsia" full />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-6 pt-3 flex flex-col items-center gap-4 bg-black/40 backdrop-blur-sm border-t border-white/10 z-20 ">
          {accessToken && user ? (
            <div className="flex flex-col gap-3 w-full">
              <Link href="/dashboard">
                <NeonButton
                  text="Dashboard"
                  color={isPublicPage ? "emerald" : "fuchsia"}
                  full
                />
              </Link>
              <NeonButton
                onClick={handleLogoutClick}
                text="Log Out"
                color={isPublicPage ? "emerald" : "fuchsia"}
                full
              />
            </div>
          ) : (
            <>
              <Link href="/auth/login" className="w-full">
                <NeonButton text="Log In" color="emerald" full />
              </Link>
              <Link href="/auth/signup" className="w-full">
                <NeonButton text="Sign Up" color="fuchsia" full />
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
