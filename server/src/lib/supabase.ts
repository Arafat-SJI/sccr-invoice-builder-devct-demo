import { config } from '../config/env';

export async function checkSupabaseConnection(): Promise<{
  ok: boolean;
  message?: string;
}> {
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = config;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return { ok: false, message: 'SUPABASE_URL or SUPABASE_ANON_KEY is not set' };
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/settings`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });

    if (!res.ok) {
      const body = await res.text();
      return { ok: false, message: `HTTP ${res.status}: ${body.slice(0, 200)}` };
    }

    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { ok: false, message };
  }
}
