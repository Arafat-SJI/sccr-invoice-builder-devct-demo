'use client'

import Link from 'next/link'
import { FileText, LayoutDashboard, Users } from 'lucide-react'
import { useAuth } from '@/lib/auth/auth-hooks'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="mx-auto w-full max-w-5xl">
      <header className="mb-8 w-full space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back{user?.name ? `, ${user.name}` : ''}. Your workspace is ready.
        </p>
      </header>

      <div className="grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="sm:col-span-2 lg:col-span-3">
          <CardHeader className="flex flex-row items-start gap-4 border-b pb-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <LayoutDashboard className="h-6 w-6" aria-hidden />
            </div>
            <div className="min-w-0 space-y-1.5">
              <CardTitle className="text-xl">You are signed in</CardTitle>
              <CardDescription>
                Invoice and customer modules will appear here as you build them out.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3 pt-6">
            <Button asChild>
              <Link href="/">Back to home</Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link href="/">View docs</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-3 border-b pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/15 text-primary">
              <FileText className="h-5 w-5" aria-hidden />
            </div>
            <CardTitle className="text-base">Invoices</CardTitle>
            <CardDescription>Coming soon — create and send invoices.</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <Button variant="secondary" className="w-full" disabled>
              Open invoices
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-3 border-b pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/15 text-primary">
              <Users className="h-5 w-5" aria-hidden />
            </div>
            <CardTitle className="text-base">Customers</CardTitle>
            <CardDescription>Coming soon — manage your client list.</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <Button variant="secondary" className="w-full" disabled>
              Open customers
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
