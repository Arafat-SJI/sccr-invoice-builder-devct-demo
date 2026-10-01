'use client';

import * as React from 'react';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { SidebarProvider, useSidebar } from '@/components/layout/sidebar-provider';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Menu } from '@/components/icons';

function MobileSidebar() {
  const { openMobile, setOpenMobile } = useSidebar();

  return (
    <>
      {openMobile && (
        <div className="fixed inset-0 z-50 lg:hidden" aria-hidden={!openMobile}>
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpenMobile(false)}
            aria-hidden
          />
          <div
            role="dialog"
            aria-modal="true"
            className="absolute inset-y-0 left-0 z-50 w-80 max-w-[85%] border-r bg-background shadow-xl"
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b px-3 py-3">
                <span className="text-sm font-medium">Menu</span>
                <Button variant="ghost" size="sm" onClick={() => setOpenMobile(false)} aria-label="Close menu">
                  Close
                </Button>
              </div>
              <AppSidebar />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {/* Desktop sidebar */}
        <div className="sticky top-0 hidden h-svh shrink-0 lg:block">
          <AppSidebar />
        </div>

        {/* Main */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* In-shell top bar (replaces marketing Header) */}
          <div className="sticky top-0 z-40 flex h-14 items-center gap-2 border-b bg-background/95 px-3 backdrop-blur supports-[backdrop-filter]:bg-background/75 sm:px-4">
            <div className="lg:hidden">
              <SidebarTrigger label="Open menu" className="h-9 w-9" />
            </div>
            <div className="lg:hidden">
              {/* Fallback trigger also toggles via provider in case SidebarTrigger is overridden */}
              <MobileMenuAltButton />
            </div>
            <div className="ml-auto" />
          </div>

          <main className="min-h-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        </div>

        {/* Mobile drawer */}
        <MobileSidebar />
      </div>
    </SidebarProvider>
  );
}

function MobileMenuAltButton() {
  const { setOpenMobile } = useSidebar();
  return (
    <Button variant="ghost" size="icon" className="h-9 w-9 lg:hidden" onClick={() => setOpenMobile(true)} aria-label="Open menu (alt)">
      <Menu className="h-5 w-5" />
    </Button>
  );
}
