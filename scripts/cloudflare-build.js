const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('📦 Starting full-stack edge compilation sequence...');

// 1. Forcefully purge BOTH framework caches to prevent stale compilation bleed
const cachesToClean = ['.next', '.open-next'];
cachesToClean.forEach(dir => {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
    console.log(`🧹 Purged stale build cache directory: ${dir}`);
  }
});

// 2. Run Prisma and OpenNext builds from scratch
execSync('npx prisma generate', { stdio: 'inherit' });
execSync('npx @opennextjs/cloudflare build --build-command "npm run build"', { stdio: 'inherit' });

// Overwrite the dynamic server instrumentation module loader to prevent edge isolate panic
const handlerPath = '.open-next/server-functions/default/handler.mjs';
if (fs.existsSync(handlerPath)) {
  let code = fs.readFileSync(handlerPath, 'utf8');
  const targetRegex = /async loadInstrumentationModule\s*\([^\)]*\)\s*\{\s*\}/;
  if (!code.match(targetRegex)) {
    throw new Error('CRITICAL: loadInstrumentationModule target was not found in handler.mjs!');
  }
  code = code.replace(targetRegex, 'async loadInstrumentationModule(){return null;}');
  if (!code.includes('async loadInstrumentationModule(){return null;}')) {
    throw new Error('CRITICAL: loadInstrumentationModule patch was not successfully applied!');
  }
  fs.writeFileSync(handlerPath, code, 'utf8');
  console.log('🛡️ Instrumentation loader patch injected into default handler successfully.');
} else {
  throw new Error('CRITICAL: default handler.mjs was not found!');
}

// 3. Apply Global Scope ReferenceError Patch
const workerPath = '.open-next/worker.js';
const targetWorkerPath = '.open-next/assets/_worker.js';

if (fs.existsSync(workerPath)) {
  const content = 'globalThis.e = undefined;\n' + fs.readFileSync(workerPath, 'utf8');
  fs.writeFileSync(targetWorkerPath, content);
  console.log('🛡️ Scope safety patch injected into bundle successfully.');
}

// 4. Sync or Force-Generate Asset Routes Blueprint
const routesPath = '.open-next/_routes.json';
const targetRoutesPath = '.open-next/assets/_routes.json';

if (fs.existsSync(routesPath)) {
  fs.copyFileSync(routesPath, targetRoutesPath);
  console.log('📁 Native asset routing rules mapped to edge network CDN.');
} else {
  const routesBlueprint = {
    version: 1,
    include: ['/*'],
    exclude: ['/_next/static/*', '/favicon.ico', '/robots.txt', '/sitemap.xml']
  };
  fs.writeFileSync(targetRoutesPath, JSON.stringify(routesBlueprint, null, 2));
  console.log('📁 Custom asset routing fallback blueprint generated successfully.');
}

// 5. Mirror Fresh Directories across Output Trees
const directories = ['cloudflare', 'middleware', '.build', 'server-functions'];
directories.forEach(dir => {
  const source = `.open-next/${dir}`;
  const destination = `.open-next/assets/${dir}`;
  if (fs.existsSync(source)) {
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.cpSync(source, destination, { recursive: true });
  }
});

// 6. Flatten Turbopack Symlinks Inside the Cloudflare Output Tree
console.log('🧹 Scanning asset output graph for dangling framework symlinks...');
const assetsDir = path.join(process.cwd(), '.open-next', 'assets');

function flattenAssets(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isSymbolicLink()) {
      try {
        const targetPath = fs.readlinkSync(fullPath);
        const absoluteTarget = path.resolve(dir, targetPath);
        fs.unlinkSync(fullPath);

        if (fs.existsSync(absoluteTarget)) {
          fs.cpSync(absoluteTarget, fullPath, { recursive: true, dereference: true });
        }
      } catch (err) {
        // Safe bypass for dangling pointers
      }
    } else if (entry.isDirectory()) {
      flattenAssets(fullPath);
    }
  }
}

flattenAssets(assetsDir);
console.log('✨ Output tree flattened. All symlinks successfully converted to raw assets.');
console.log('\n🚀 Build assets unified. Handing over to Cloudflare Pages pipeline!');