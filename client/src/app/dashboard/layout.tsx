"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

  return (
    <DashboardShell>
      <div className="mb-4 flex flex-wrap items-center gap-3 text-sm">
        <Link href="/dashboard/invoices" className="text-primary hover:underline">Invoices</Link>
        <span className="text-muted-foreground">/</span>
        <Link href="/dashboard/invoices/create" className="text-primary hover:underline">Create</Link>
      </div>
      {children}
    </DashboardShell>
  );
}
