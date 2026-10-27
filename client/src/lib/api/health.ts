import http from '@/lib/api/client';

export type HealthStatus = {
  status: 'OK' | 'DEGRADED' | 'ERROR';
  uptime: number; // seconds
  timestamp: string; // ISO string
  supabase: { connected: boolean; error?: string };
  database: { connected: boolean; error?: string };
  responseTimeMs?: number;
  error?: string;
  details?: string;
};

export async function getHealth(): Promise<HealthStatus> {
  const { data } = await http.get<HealthStatus>('/health');
  return data;
}
