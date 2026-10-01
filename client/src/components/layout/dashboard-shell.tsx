'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { SidebarProvider, useSidebar } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { PanelLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

function ShellTopbar({ className }: { className?: string }) {
  const { setOpen } = useSidebar()
  return (
    <div className={cn('flex h-14 items-center gap-2 border-b bg-background px-3', className)}>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        aria-label="Open sidebar"
        onClick={() => setOpen(true)}
      >
        <PanelLeft className="h-5 w-5" />
      </Button>
      <div className="flex-1" />
    </div>
  )
}

function MobileSidebarOverlay() {
  const { open, setOpen } = useSidebar()
  return (
    <div
      className={cn(
        'fixed inset-0 z-40 bg-black/40 transition-opacity md:hidden',
        open ? 'opacity-100' : 'pointer-events-none opacity-0'
      )}
      onClick={() => setOpen(false)}
      aria-hidden
    />
  )
}

function MobileSidebarPanel() {
  const { open, setOpen } = useSidebar()
  return (
    <div
      className={cn(
        'fixed inset-y-0 left-0 z-50 w-72 -translate-x-full bg-card shadow-lg transition-transform md:hidden',
        open && 'translate-x-0'
      )}
      role="dialog"
      aria-modal="true"
      aria-label="Sidebar"
    >
      <div className="flex h-14 items-center justify-between border-b px-3">
        <span className="text-sm font-medium">Menu</span>
        <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
          Close
        </Button>
      </div>
      <AppSidebar />
    </div>
  )
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-[100dvh] w-full bg-background text-foreground">
        {/* Desktop sidebar */}
        <div className="hidden md:block">
          <AppSidebar />
        </div>

        {/* Content area */}
        <div className="flex min-h-[100dvh] flex-1 flex-col">
          <ShellTopbar />
          <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>

        {/* Mobile sidebar */}
        <MobileSidebarOverlay />
        <MobileSidebarPanel />
      </div>
    </SidebarProvider>
  )
}
