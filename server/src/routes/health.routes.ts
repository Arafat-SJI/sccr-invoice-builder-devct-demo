import { Router } from 'express';
import { checkDatabaseConnection } from '../lib/databaseHealth';
import { checkSupabaseConnection } from '../lib/supabase';

const router = Router();

router.get('/', async (_req, res) => {
  const startedAt = Date.now();
  try {
    const [supabase, database] = await Promise.all([
      checkSupabaseConnection(),
      checkDatabaseConnection(),
    ]);

    const ok = supabase.ok && database.ok;

    res.status(ok ? 200 : 503).json({
      status: ok ? 'OK' : 'DEGRADED',
      uptime: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
      supabase: { connected: supabase.ok, ...(supabase.message && { error: supabase.message }) },
      database: { connected: database.ok, ...(database.message && { error: database.message }) },
      responseTimeMs: Date.now() - startedAt,
    });
  } catch (err: any) {
    res.status(500).json({
      status: 'ERROR',
      uptime: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
      error: 'Health check failed unexpectedly',
      details: err?.message ?? String(err),
      responseTimeMs: Date.now() - startedAt,
    });
  }
});

export default router;
