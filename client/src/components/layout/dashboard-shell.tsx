"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { PanelLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
  useSidebar,
} from "@/components/ui/sidebar";

function MobileSidebar() {
  const { mobileOpen, setMobileOpen } = useSidebar();
  return (
    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
      <SheetContent side="left" className="p-0">
        <AppSidebar />
      </SheetContent>
    </Sheet>
  );
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {/* Desktop sidebar */}
        <AppSidebar />

        {/* Mobile drawer */}
        <MobileSidebar />

        {/* Main content area */}
        <SidebarInset className="flex min-h-screen flex-1 flex-col">
          {/* In-shell top bar */}
          <div className="sticky top-0 z-40 flex h-14 items-center gap-2 border-b bg-background/95 px-3 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:px-4">
            <SidebarTrigger aria-label="Open navigation">
              <PanelLeft className="h-4 w-4" />
            </SidebarTrigger>
            <div className="flex-1 truncate text-sm text-muted-foreground">
              {pathname}
            </div>
          </div>

          <main className={cn("flex-1 p-4 sm:p-6")}>{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
