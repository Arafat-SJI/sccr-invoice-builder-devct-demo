"use client";

import Link from "next/link";
import * as React from "react";

export function Footer() {
  return (
    <footer className="w-full p-4 sm:p-6 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
        <div>Product name: Developer Control Tower</div>
        <div>© 2026 SJ Innovation</div>
        <Link href="/docs" className="hover:underline">
          Docs
        </Link>
      </div>
    </footer>
  );
}
