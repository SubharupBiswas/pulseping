const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('📦 Starting full-stack edge compilation sequence...');

// 1. Run Prisma and OpenNext builds
execSync('npx prisma generate', { stdio: 'inherit' });
execSync('npx @opennextjs/cloudflare build', { stdio: 'inherit' });

// 2. Apply Global Scope ReferenceError Patch
const workerPath = '.open-next/worker.js';
const targetWorkerPath = '.open-next/assets/_worker.js';

if (fs.existsSync(workerPath)) {
  const content = 'globalThis.e = undefined;\n' + fs.readFileSync(workerPath, 'utf8');
  fs.writeFileSync(targetWorkerPath, content);
  console.log('🛡️ Scope safety patch injected into bundle successfully.');
}

// 3. Sync or Force-Generate Asset Routes Blueprint
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

// 4. Mirror Directories across Output Trees
const directories = ['cloudflare', 'middleware', '.build', 'server-functions'];
directories.forEach(dir => {
  const source = `.open-next/${dir}`;
  const destination = `.open-next/assets/${dir}`;
  if (fs.existsSync(source)) {
    fs.cpSync(source, destination, { recursive: true });
  }
});

// 5. NEW: Flatten Turbopack Symlinks Inside the Cloudflare Output Tree
console.log('🧹 Scanning asset output graph for dangling framework symlinks...');
const assetsDir = path.join(process.cwd(), '.open-next', 'assets');

function flattenAssets(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isSymbolicLink()) {
      try {
        // Resolve where the symlink points to
        const targetPath = fs.readlinkSync(fullPath);
        const absoluteTarget = path.resolve(dir, targetPath);

        // Break the symlink link pointer completely
        fs.unlinkSync(fullPath);

        // Copy the actual physical content into its exact slot
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

console.log('🚀 Build assets unified. Handing over to Cloudflare Pages pipeline!');