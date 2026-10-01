'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Users, LogOut } from '@/components/icons';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarNav, SidebarNavLink, SidebarSectionTitle } from '@/components/ui/sidebar';
import { useAuth } from '@/lib/auth/auth-hooks';
import { Button } from '@/components/ui/button';

export function AppSidebar() {
  const pathname = usePathname();
  const { user, logout, isLoading } = useAuth();

  const nav = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, disabled: false },
    { href: '#invoices', label: 'Invoices', icon: FileText, disabled: true },
    { href: '#customers', label: 'Customers', icon: Users, disabled: true },
  ];

  return (
    <Sidebar className="w-[var(--sidebar-width)]">
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">IB</span>
          <span className="hidden text-sm sm:inline">Invoice Builder</span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarSectionTitle>Navigation</SidebarSectionTitle>
        <SidebarNav>
          {nav.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return item.disabled ? (
              <SidebarNavLink key={item.label} href={item.href} disabled>
                <Icon className="h-4 w-4" aria-hidden />
                <span>{item.label}</span>
                <span className="ml-auto text-xs text-muted-foreground">Soon</span>
              </SidebarNavLink>
            ) : (
              <SidebarNavLink key={item.label} href={item.href} active={active}>
                <Icon className="h-4 w-4" aria-hidden />
                <span>{item.label}</span>
              </SidebarNavLink>
            );
          })}
        </SidebarNav>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{user?.name || user?.email || 'Signed in'}</p>
            <p className="truncate text-xs text-muted-foreground">Workspace</p>
          </div>
          <Button variant="secondary" size="sm" onClick={() => logout()} disabled={isLoading} aria-label="Logout">
            <LogOut className="mr-1.5 h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
