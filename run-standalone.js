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

// Copy env files to standalone directory so Next.js @next/env detects them on boot
const standaloneDir = path.resolve(cwd, '.next/standalone');
if (fs.existsSync(standaloneDir)) {
  if (fs.existsSync(envPath)) fs.copyFileSync(envPath, path.resolve(standaloneDir, '.env'));
  if (fs.existsSync(envLocalPath)) fs.copyFileSync(envLocalPath, path.resolve(standaloneDir, '.env.local'));
}

process.env.PORT = process.env.PORT || '3000';
process.env.NODE_ENV = 'production';

console.log('⚡ [PulsePing] Pre-loading environment into standalone process runtime...');
console.log(`🔑 DATABASE_URL Status: ${process.env.DATABASE_URL ? 'AVAILABLE ✅' : 'MISSING ❌'}`);

// Launch Next.js standalone server
require('./.next/standalone/server.js');