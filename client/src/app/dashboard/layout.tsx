"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/auth-hooks";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  // Render the existing DashboardShell but add a small, accessible link to Invoices
  // This ensures users can navigate to Invoice creation even if the Sidebar doesn't include it yet.
  return (
    <>
      <div className="w-full bg-background border-b border-muted/10">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-4">
          <nav className="flex items-center gap-3">
            <Link href="/dashboard" className="text-sm font-medium text-muted-foreground">
              Dashboard
            </Link>
            <Link href="/dashboard/invoices/create" className="text-sm font-medium text-primary">
              Invoices
            </Link>
          </nav>
        </div>
      </div>
      <DashboardShell>{children}</DashboardShell>
    </>
  );
}
