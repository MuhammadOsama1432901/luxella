"use client";

import { usePathname } from "next/navigation";
import BottomNavigation from "./BottomNavigation";

export default function MobileAppWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Exclude admin from the mobile bottom nav
  const isAdmin = pathname.startsWith("/admin");

  return (
    <div className="w-full min-h-screen bg-[var(--bg-base)]">
      {children}
      {/* Only show bottom navigation on mobile screens */}
      {!isAdmin && <BottomNavigation />}
    </div>
  );
}
