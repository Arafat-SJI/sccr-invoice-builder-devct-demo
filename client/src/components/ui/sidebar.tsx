'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { PanelLeft } from '@/components/icons';
import { useSidebar } from '@/components/layout/sidebar-provider';

export type SidebarProps = React.HTMLAttributes<HTMLElement> & {
  collapsed?: boolean;
};

export function Sidebar({ className, collapsed = false, ...props }: SidebarProps) {
  return (
    <aside
      className={cn(
        'app-sidebar flex h-full flex-col border-r bg-background text-foreground',
        collapsed ? 'app-sidebar-collapsed' : 'app-sidebar-expanded',
        className,
      )}
      {...props}
    />
  );
}

export function SidebarHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 border-b px-3 py-3 sm:px-4 sm:py-4',
        className,
      )}
      {...props}
    />
  );
}

export function SidebarContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex min-h-0 flex-1 flex-col overflow-y-auto px-2 py-2 sm:px-3 sm:py-3', className)}
      {...props}
    />
  );
}

export function SidebarFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('border-t px-3 py-3 sm:px-4 sm:py-4', className)} {...props} />
  );
}

export function SidebarSectionTitle({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'px-3 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground',
        className,
      )}
      {...props}
    />
  );
}

export function SidebarNav({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <nav className={cn('grid gap-1 px-1', className)} {...props} />;
}

export type SidebarNavLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  active?: boolean;
  disabled?: boolean;
};

export function SidebarNavLink({
  className,
  active = false,
  disabled = false,
  children,
  ...props
}: SidebarNavLinkProps) {
  return (
    <a
      aria-current={active ? 'page' : undefined}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : 0}
      className={cn(
        'flex items-center gap-2 rounded-md px-2 py-2 text-sm outline-none transition',
        active
          ? 'bg-muted text-foreground'
          : 'text-muted-foreground hover:bg-accent hover:text-foreground',
        disabled && 'pointer-events-none opacity-50',
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
}

export function SidebarTrigger({
  className,
  label = 'Open sidebar',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { label?: string }) {
  const { openMobile, setOpenMobile } = useSidebar();
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={openMobile}
      onClick={() => setOpenMobile(true)}
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center rounded-md border bg-background text-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
        className,
      )}
      {...props}
    >
      <PanelLeft className="h-4 w-4" aria-hidden />
    </button>
  );
}
