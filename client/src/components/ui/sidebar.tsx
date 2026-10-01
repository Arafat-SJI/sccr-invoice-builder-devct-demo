"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type SidebarContextType = {
  isDesktop: boolean
  collapsed: boolean
  setCollapsed: (v: boolean) => void
  mobileOpen: boolean
  setMobileOpen: (v: boolean) => void
}

const SidebarContext = React.createContext<SidebarContextType | null>(null)

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = React.useState(false)
  React.useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)")
    const update = () => setIsDesktop(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])
  return isDesktop
}

function SidebarProvider({ children }: { children: React.ReactNode }) {
  const isDesktop = useIsDesktop()
  const [collapsed, setCollapsed] = React.useState(false)
  const [mobileOpen, setMobileOpen] = React.useState(false)

  // Close the mobile drawer when switching to desktop
  React.useEffect(() => {
    if (isDesktop && mobileOpen) setMobileOpen(false)
  }, [isDesktop, mobileOpen])

  const value = React.useMemo(
    () => ({ isDesktop, collapsed, setCollapsed, mobileOpen, setMobileOpen }),
    [isDesktop, collapsed, mobileOpen]
  )

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
}

function useSidebar() {
  const ctx = React.useContext(SidebarContext)
  if (!ctx) throw new Error("useSidebar must be used within <SidebarProvider>")
  return ctx
}

function Sidebar({ className, children }: React.HTMLAttributes<HTMLElement>) {
  const { collapsed } = useSidebar()
  return (
    <aside
      className={cn(
        "hidden border-r bg-card text-card-foreground lg:block",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      {children}
    </aside>
  )
}

function SidebarHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-4", className)} {...props} />
}

function SidebarContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-2", className)} {...props} />
}

function SidebarFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-3 border-t", className)} {...props} />
}

function SidebarGroup({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("py-2", className)} {...props} />
}

function SidebarGroupContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-1", className)} {...props} />
}

function SidebarMenu({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) {
  return <ul className={cn("flex flex-col gap-1", className)} {...props} />
}

function SidebarMenuItem({ className, ...props }: React.LiHTMLAttributes<HTMLLIElement>) {
  return <li className={cn("list-none", className)} {...props} />
}

type SidebarMenuButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  isActive?: boolean
  asChild?: boolean
}

function SidebarMenuButton({ className, isActive, ...props }: SidebarMenuButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-foreground/80 hover:bg-accent hover:text-foreground",
        className
      )}
      {...props}
    />
  )
}

function SidebarTrigger({ className, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { isDesktop, collapsed, setCollapsed, mobileOpen, setMobileOpen } = useSidebar()

  return (
    <button
      aria-label="Toggle navigation"
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-md border bg-background text-foreground hover:bg-accent",
        className
      )}
      onClick={(e) => {
        if (isDesktop) {
          setCollapsed(!collapsed)
        } else {
          setMobileOpen(!mobileOpen)
        }
        props.onClick?.(e)
      }}
      {...props}
    >
      {children}
    </button>
  )
}

function SidebarInset({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex-1", className)} {...props} />
}

function SidebarRail() {
  // Decorative rail is not needed for this simplified version
  return null
}

export {
  SidebarProvider,
  useSidebar,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
  SidebarRail,
}
