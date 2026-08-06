const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

const cwd = __dirname;
const envPath = path.resolve(cwd, '.env');
const envLocalPath = path.resolve(cwd, '.env.local');

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath, override: true });
}

if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath, override: true });
}

const standaloneDir = path.resolve(cwd, '.next/standalone');

if (fs.existsSync(standaloneDir)) {
  // 1. Copy env files to standalone runtime
  if (fs.existsSync(envPath)) fs.copyFileSync(envPath, path.resolve(standaloneDir, '.env'));
  if (fs.existsSync(envLocalPath)) fs.copyFileSync(envLocalPath, path.resolve(standaloneDir, '.env.local'));

  // 2. Auto-copy static CSS/JS chunks & public folder (Fixes unstyled raw HTML)
  const staticSrc = path.resolve(cwd, '.next/static');
  const staticDest = path.resolve(standaloneDir, '.next/static');
  const publicSrc = path.resolve(cwd, 'public');
  const publicDest = path.resolve(standaloneDir, 'public');

  if (fs.existsSync(staticSrc)) {
    fs.cpSync(staticSrc, staticDest, { recursive: true, force: true });
  }

  if (fs.existsSync(publicSrc)) {
    fs.cpSync(publicSrc, publicDest, { recursive: true, force: true });
  }
}

process.env.PORT = process.env.PORT || '3000';
process.env.NODE_ENV = 'production';

console.log('⚡ [PulsePing] Syncing static assets and pre-loading environment...');
console.log(`🔑 DATABASE_URL Status: ${process.env.DATABASE_URL ? 'AVAILABLE ✅' : 'MISSING ❌'}`);

// Launch Next.js standalone server
require('./.next/standalone/server.js');