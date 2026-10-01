"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";

export function RootBody({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showMarketingHeader = !pathname?.startsWith("/dashboard");
  return (
    <div className="relative flex min-h-screen flex-col">
      {showMarketingHeader ? <Header /> : null}
      {children}
    </div>
  );
}
