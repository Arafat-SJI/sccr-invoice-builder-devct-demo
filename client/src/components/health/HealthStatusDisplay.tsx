import { Activity, AlertTriangle, CheckCircle2, Cloud, Database as DatabaseIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { HealthStatus } from '@/lib/api/health';

type Props = {
  data: HealthStatus;
};

function formatDuration(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const days = Math.floor(s / 86400);
  const hours = Math.floor((s % 86400) / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const seconds = s % 60;
  const parts: string[] = [];
  if (days) parts.push(`${days}d`);
  if (hours) parts.push(`${hours}h`);
  if (minutes) parts.push(`${minutes}m`);
  parts.push(`${seconds}s`);
  return parts.join(' ');
}

export function HealthStatusDisplay({ data }: Props) {
  const overallOk = data.status === 'OK';
  const overallDegraded = data.status === 'DEGRADED';

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-3">
        <CardHeader className="flex flex-row items-start gap-4 border-b pb-6">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Activity className="h-6 w-6" aria-hidden />
          </div>
          <div className="min-w-0 space-y-1.5">
            <CardTitle className="text-xl">Monorepo Health</CardTitle>
            <CardDescription>Backend service, database connectivity, and uptime.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-4 pt-6">
          <div className="inline-flex items-center gap-2">
            {overallOk ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-hidden />
            ) : (
              <AlertTriangle className="h-5 w-5 text-amber-600" aria-hidden />
            )}
            <span className="text-sm text-muted-foreground">Overall</span>
            <Badge variant={overallOk ? 'default' : 'destructive'} className={overallOk ? 'bg-emerald-600 hover:bg-emerald-700' : ''}>
              {data.status}
            </Badge>
          </div>
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Uptime:</span>
            <span>{formatDuration(data.uptime)}</span>
          </div>
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Checked at:</span>
            <time dateTime={data.timestamp}>{new Date(data.timestamp).toLocaleString()}</time>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="space-y-2 border-b pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/15 text-primary">
            <DatabaseIcon className="h-5 w-5" aria-hidden />
          </div>
          <CardTitle className="text-base">Database</CardTitle>
          <CardDescription>Prisma → PostgreSQL</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex items-center gap-2">
            {data.database.connected ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden />
            ) : (
              <AlertTriangle className="h-4 w-4 text-amber-600" aria-hidden />
            )}
            <span className="text-sm">{data.database.connected ? 'Connected' : 'Unavailable'}</span>
          </div>
          {!data.database.connected && data.database.error && (
            <p className="mt-2 text-xs text-muted-foreground">{data.database.error}</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="space-y-2 border-b pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/15 text-primary">
            <Cloud className="h-5 w-5" aria-hidden />
          </div>
          <CardTitle className="text-base">Supabase</CardTitle>
          <CardDescription>Edge + Storage</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex items-center gap-2">
            {data.supabase.connected ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden />
            ) : (
              <AlertTriangle className="h-4 w-4 text-amber-600" aria-hidden />
            )}
            <span className="text-sm">{data.supabase.connected ? 'Connected' : 'Unavailable'}</span>
          </div>
          {!data.supabase.connected && data.supabase.error && (
            <p className="mt-2 text-xs text-muted-foreground">{data.supabase.error}</p>
          )}
        </CardContent>
      </Card>

      {/* Spacer to keep grid balanced if needed */}
      <div className="hidden lg:block" />
    </div>
  );
}

export default HealthStatusDisplay;
