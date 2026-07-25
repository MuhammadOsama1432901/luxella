"use client";

import { usePathname } from "next/navigation";
import BottomNavigation from "./BottomNavigation";

export default function MobileAppWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Exclude admin dashboard and API routes from the mobile app container wrapper
  const isAdmin = pathname.startsWith("/admin");
  const isApi = pathname.startsWith("/api");

  if (isAdmin || isApi) {
    return <>{children}</>;
  }

  return (
    <div className="w-full bg-[#050506] min-h-screen flex justify-center items-stretch overflow-x-hidden">
      {/* 
        World-class mobile-first container:
        Centers the e-commerce layout on desktop monitors with a luxury shadow frame.
        Occupies full viewport width naturally on mobile screens (max-w 430px).
      */}
      <div className="w-full max-w-[430px] min-h-screen bg-[#0B0B0C] border-x border-stone-900/50 shadow-2xl relative flex flex-col pb-24 overflow-x-hidden">
        {children}
        <BottomNavigation />
      </div>
    </div>
  );
}
