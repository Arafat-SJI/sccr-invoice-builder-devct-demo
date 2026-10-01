import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootEnv = path.join(__dirname, '..', '..', '.env');
dotenv.config({ path: rootEnv });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

async function checkSupabaseApi() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.log('Supabase API: SKIP (SUPABASE_URL or SUPABASE_ANON_KEY missing)');
    return false;
  }
  const res = await fetch(`${supabaseUrl}/auth/v1/settings`, {
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
    },
  });
  if (res.ok) {
    console.log('Supabase API: OK');
    return true;
  }
  console.log('Supabase API: FAIL', res.status, (await res.text()).slice(0, 120));
  return false;
}

async function checkPostgres(label, databaseUrl) {
  if (!databaseUrl) {
    console.log(`${label}: SKIP (no URL)`);
    return false;
  }
  const prisma = new PrismaClient({ datasources: { db: { url: databaseUrl } } });
  try {
    await prisma.$queryRaw`SELECT 1 AS ok`;
    console.log(`${label}: OK`);
    return true;
  } catch (e) {
    console.log(`${label}: FAIL`, e.message.split('\n').slice(-2).join(' '));
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

function supabaseDirectUrlFromEnv() {
  const ref = supabaseUrl?.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
  const pw = process.env.DATABASE_URL?.match(/:\/\/[^:]+:([^@]+)@/)?.[1];
  if (!ref || !pw) return null;
  const user = 'postgres';
  const host = `db.${ref}.supabase.co`;
  return `postgresql://${user}:${encodeURIComponent(pw)}@${host}:5432/postgres?schema=public&sslmode=require`;
}

const apiOk = await checkSupabaseApi();
const localOk = await checkPostgres('Postgres (DATABASE_URL)', process.env.DATABASE_URL);

let supabaseDbOk = false;
if (!localOk && process.env.DATABASE_URL?.includes('localhost')) {
  const direct = process.env.SUPABASE_DATABASE_URL ?? supabaseDirectUrlFromEnv();
  if (direct) {
    supabaseDbOk = await checkPostgres('Postgres (Supabase direct)', direct);
  }
}

const ok = apiOk && (localOk || supabaseDbOk);
if (!localOk && apiOk && !supabaseDbOk) {
  console.log('');
  console.log(
    'Tip: Point DATABASE_URL at Supabase (Settings → Database → Connection string, URI) or set SUPABASE_DATABASE_URL.',
  );
}
process.exit(ok ? 0 : 1);
