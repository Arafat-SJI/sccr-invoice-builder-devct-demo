"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Users, LogOut, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/lib/auth/auth-hooks";
import { Button } from "@/components/ui/button";

export function AppSidebar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout, isLoading } = useAuth();

  const items = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      disabled: false,
    },
    {
      title: "Invoices",
      href: "/invoices",
      icon: FileText,
      disabled: true,
    },
    {
      title: "Customers",
      // changed to the dashboard path group and enabled so the new UI is reachable
      href: "/dashboard/customers",
      icon: Users,
      disabled: false,
    },
    {
      title: "Business Profile",
      href: "/dashboard/settings/profile",
      icon: Building2,
      disabled: false,
    },
  ];

  const activeHref =
    items
      .filter((item) => !item.disabled)
      .filter(
        (item) =>
          pathname === item.href ||
          (pathname?.startsWith(item.href + "/") ?? false)
      )
      .sort((a, b) => b.href.length - a.href.length)[0]?.href ?? null;

  return (
    <Sidebar className="bg-background">
      <SidebarHeader>
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <FileText className="h-5 w-5" aria-hidden />
          </span>
          <span className="truncate">Invoice Builder</span>
        </Link>
      </SidebarHeader>
      <Separator />
      <SidebarContent className="py-2">
        <ScrollArea className="h-[calc(100vh-9rem)] pr-2">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.href === activeHref;
                  return (
                    <SidebarMenuItem key={item.title}>
                      {item.disabled ? (
                        <div
                          className={cn(
                            "inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground/70",
                            "cursor-not-allowed"
                          )}
                          aria-disabled
                          title="Coming soon"
                        >
                          <Icon className="h-4 w-4" aria-hidden />
                          <span className="flex-1 text-left">{item.title}</span>
                          <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                            Coming soon
                          </span>
                        </div>
                      ) : (
                        <Link
                          href={item.href}
                          className={cn(
                            "inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                            isActive
                              ? "bg-primary/10 text-primary"
                              : "text-foreground/80 hover:bg-accent hover:text-foreground"
                          )}
                        >
                          <Icon className="h-4 w-4" aria-hidden />
                          <span className="flex-1 text-left">{item.title}</span>
                        </Link>
                      )}
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </ScrollArea>
      </SidebarContent>
      <Separator />
      <SidebarFooter>
        {isAuthenticated ? (
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{user?.name || user?.email}</p>
              {user?.name && (
                <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
              )}
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 px-2"
              onClick={() => logout()}
              disabled={isLoading}
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Logout</span>
            </Button>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">Not signed in</div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
