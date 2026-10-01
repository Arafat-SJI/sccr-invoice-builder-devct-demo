'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

type SidebarContextValue = {
  open: boolean
  setOpen: (v: boolean) => void
  collapsed: boolean
  setCollapsed: (v: boolean) => void
}

const SidebarContext = React.createContext<SidebarContextValue | null>(null)

export function useSidebar() {
  const ctx = React.useContext(SidebarContext)
  if (!ctx) throw new Error('useSidebar must be used within <SidebarProvider>')
  return ctx
}

export function SidebarProvider({ children, defaultOpen = false, defaultCollapsed = false }: {
  children: React.ReactNode
  defaultOpen?: boolean
  defaultCollapsed?: boolean
}) {
  const [open, setOpen] = React.useState(defaultOpen)
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed)

  React.useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const handler = () => {
      // On desktop ensure sheet is closed; desktop shows permanent sidebar
      if (mq.matches) setOpen(false)
    }
    handler()
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const value = React.useMemo(() => ({ open, setOpen, collapsed, setCollapsed }), [open, collapsed])
  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
}

export function SidebarContainer({ children, className }: { children: React.ReactNode; className?: string }) {
  return <aside className={cn('h-full border-r bg-card text-card-foreground', className)}>{children}</aside>
}

export function SidebarSection({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('px-3 py-2', className)}>{children}</div>
}

export function SidebarSeparator({ className }: { className?: string }) {
  return <div className={cn('my-2 h-px w-full bg-border', className)} />
}
