import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootEnv = path.resolve(__dirname, '../../.env');
dotenv.config({ path: rootEnv });

const prismaArgs = process.argv.slice(2);
const result = spawnSync('npx', ['prisma', ...prismaArgs], {
  stdio: 'inherit',
  env: process.env,
  shell: true,
  cwd: path.resolve(__dirname, '..'),
});

process.exit(result.status ?? 1);
