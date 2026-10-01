import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/config/theme";
import { AuthProvider } from "@/lib/auth/auth-context";
import { RootBody } from "@/components/layout/RootBody";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Invoice Builder",
  description: "A modern invoice management application.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <RootBody>{children}</RootBody>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
