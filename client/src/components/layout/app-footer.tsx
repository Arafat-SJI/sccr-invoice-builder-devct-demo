"use client";

import Link from "next/link";

export function AppFooter() {
  return (
    <footer className="bg-muted/50 border-t text-muted-foreground text-sm p-4 sm:p-6 mt-auto">
      <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
        <span>Product name: Developer Control Tower</span>
        <span>© 2026 SJ Innovation</span>
        <Link href="/docs" className="text-primary hover:underline">
          Docs
        </Link>
      </div>
    </footer>
  );
}
