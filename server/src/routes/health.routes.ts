import { Router } from 'express';
import { checkDatabaseConnection } from '../lib/databaseHealth';
import { checkSupabaseConnection } from '../lib/supabase';

const router = Router();

router.get('/', async (_req, res) => {
  const [supabase, database] = await Promise.all([
    checkSupabaseConnection(),
    checkDatabaseConnection(),
  ]);

  const ok = supabase.ok && database.ok;

  res.status(ok ? 200 : 503).json({
    status: ok ? 'OK' : 'DEGRADED',
    supabase: { connected: supabase.ok, ...(supabase.message && { error: supabase.message }) },
    database: { connected: database.ok, ...(database.message && { error: database.message }) },
  });
});

export default router;
