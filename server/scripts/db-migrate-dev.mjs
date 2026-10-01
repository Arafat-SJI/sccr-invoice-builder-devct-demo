import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverRoot = path.resolve(__dirname, '..');
const rootEnv = path.resolve(serverRoot, '../.env');
dotenv.config({ path: rootEnv });

const prismaBin = (subcommand, extraArgs = []) =>
  spawnSync('npx', ['prisma', subcommand, ...extraArgs], {
    cwd: serverRoot,
    env: process.env,
    shell: true,
    encoding: 'utf8',
  });

function isSupabasePooler(url) {
  return typeof url === 'string' && url.includes('pooler.supabase.com');
}

function parseMigrationName(argv) {
  const nameIdx = argv.indexOf('--name');
  if (nameIdx !== -1 && argv[nameIdx + 1]) return argv[nameIdx + 1];
  const positional = argv.find((a) => !a.startsWith('-'));
  return positional ?? null;
}

function timestampFolderName(suffix) {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const stamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  const safe = suffix.replace(/[^a-zA-Z0-9_]+/g, '_').replace(/^_|_$/g, '') || 'migration';
  return `${stamp}_${safe}`;
}

const argv = process.argv.slice(2);
const databaseUrl = process.env.DATABASE_URL ?? '';

if (!isSupabasePooler(databaseUrl)) {
  const result = spawnSync('npx', ['prisma', 'migrate', 'dev', ...argv], {
    stdio: 'inherit',
    env: process.env,
    shell: true,
    cwd: serverRoot,
  });
  process.exit(result.status ?? 1);
}

const migrationName = parseMigrationName(argv);
if (!migrationName) {
  console.error(
    'Supabase pooler does not support `prisma migrate dev` (shadow database).\n' +
      'Pass a migration name, e.g. npm run db:migrate:dev -- --name add_business_profile',
  );
  process.exit(1);
}

console.log(
  'Using Supabase-safe migrate flow (diff → new migration → migrate deploy; no shadow DB).\n',
);

const diff = prismaBin('migrate', [
  'diff',
  '--from-schema-datasource',
  'prisma/schema.prisma',
  '--to-schema-datamodel',
  'prisma/schema.prisma',
  '--script',
]);

if (diff.status !== 0) {
  process.stderr.write(diff.stderr ?? '');
  process.exit(diff.status ?? 1);
}

const sql = (diff.stdout ?? '').trim();
if (!sql) {
  console.log('Database schema is already up to date with prisma/schema.prisma.');
  process.exit(0);
}

const acceptDataLoss = argv.includes('--accept-data-loss');
if (!acceptDataLoss && /\bDROP\b/i.test(sql)) {
  console.error(
    'Generated SQL would DROP objects (often tables Prisma does not model).\n' +
      'Review the diff, then re-run with --accept-data-loss if intentional:\n\n' +
      `${sql}\n`,
  );
  process.exit(1);
}

const migrationsDir = path.join(serverRoot, 'prisma', 'migrations');
const folder = path.join(migrationsDir, timestampFolderName(migrationName));
fs.mkdirSync(folder, { recursive: true });
fs.writeFileSync(path.join(folder, 'migration.sql'), `${sql}\n`, 'utf8');
console.log(`Wrote ${path.relative(serverRoot, folder)}/migration.sql`);

const deploy = spawnSync('npx', ['prisma', 'migrate', 'deploy'], {
  stdio: 'inherit',
  env: process.env,
  shell: true,
  cwd: serverRoot,
});

process.exit(deploy.status ?? 1);
