'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FileText, Users, LogOut, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { SidebarContainer, SidebarSection, SidebarSeparator, useSidebar } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth/auth-hooks'
import * as React from 'react'

export function AppSidebar() {
  const pathname = usePathname()
  const { collapsed, setCollapsed, setOpen } = useSidebar()
  const { user, logout, isLoading } = useAuth()

  const nav = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, disabled: false },
    { label: 'Invoices', href: '#', icon: FileText, disabled: true },
    { label: 'Customers', href: '#', icon: Users, disabled: true },
  ]

  function NavItem({ label, href, icon: Icon, disabled }: any) {
    const active = href !== '#' && pathname.startsWith(href)
    const Comp = disabled ? 'button' : Link
    const common = cn(
      'group inline-flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-sm transition-colors',
      active ? 'bg-primary/10 text-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
      disabled && 'cursor-not-allowed opacity-50'
    )

    const content = (
      <>
        <Icon className={cn('h-4 w-4 shrink-0', collapsed ? 'mx-auto' : '')} aria-hidden />
        {!collapsed && <span className="truncate">{label}</span>}
      </>
    )

    if (disabled) {
      return (
        <button type="button" aria-disabled className={common} title="Coming soon">
          {content}
        </button>
      )
    }

    return (
      <Link
        href={href}
        className={common}
        onClick={() => {
          // Close mobile sheet when navigating
          setOpen(false)
        }}
      >
        {content}
      </Link>
    )
  }

  return (
    <div className="relative h-full">
      {/* Desktop sidebar */}
      <div
        className={cn(
          'hidden h-full md:block',
          collapsed ? 'w-[72px]' : 'w-64'
        )}
      >
        <SidebarContainer className="flex h-full flex-col">
          <SidebarSection className="flex items-center justify-between gap-2 border-b py-3">
            <div className={cn('flex items-center gap-2', collapsed && 'justify-center w-full')}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-semibold">
                IB
              </span>
              {!collapsed && <span className="text-sm font-medium">Invoice Builder</span>}
            </div>
            <Button
              variant="ghost"
              size="icon"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              onClick={() => setCollapsed(!collapsed)}
              className={cn('h-8 w-8', collapsed && 'mx-auto hidden')}
            >
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </SidebarSection>

          <ScrollArea className="flex-1">
            <SidebarSection className="space-y-1">
              {nav.map((item) => (
                <NavItem key={item.label} {...item} />
              ))}
            </SidebarSection>
          </ScrollArea>

          <SidebarSeparator />

          <SidebarSection className={cn('flex items-center gap-2 py-3', collapsed && 'justify-center') }>
            <div className={cn('min-w-0 flex-1', collapsed && 'hidden')}>
              <p className="truncate text-sm font-medium">{user?.name || user?.email || 'Account'}</p>
              {user?.email && <p className="truncate text-xs text-muted-foreground">{user.email}</p>}
            </div>
            <Button
              variant="ghost"
              size="icon"
              title="Logout"
              aria-label="Logout"
              onClick={() => logout()}
              disabled={isLoading}
              className={cn(collapsed ? '' : 'ml-auto')}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </SidebarSection>
        </SidebarContainer>
      </div>
    </div>
  )
}
