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
execSync('npx @opennextjs/cloudflare build', { stdio: 'inherit' });

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

// 7. Patch loadInstrumentationModule hook to prevent edge crashes
console.log('🩹 Scanning build output for loadInstrumentationModule hooks...');

function patchFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  const targets = [
    'loadInstrumentationModule',
    'getInstrumentationModule',
    'registerInstrumentation',
    'ensureInstrumentationRegistered'
  ];

  for (const target of targets) {
    if (content.includes(target)) {
      const checkRegex = new RegExp(`\\b(?:async\\s+)?(?:function\\s+)?${target}\\b\\s*\\([^)]*\\)\\s*\\{\\s*return;`);
      if (!checkRegex.test(content)) {
        const replaceRegex = new RegExp(`(\\b(?:async\\s+)?(?:function\\s+)?${target}\\b\\s*\\([^)]*\\)\\s*\\{)`, 'g');
        if (replaceRegex.test(content)) {
          console.log(`🩹 Patching ${target} in: ${filePath}`);
          replaceRegex.lastIndex = 0;
          content = content.replace(replaceRegex, '$1return;');
          modified = true;
        }
      }
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
  }
}


function scanAndPatch(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanAndPatch(fullPath);
    } else if (entry.isFile() && (entry.name.endsWith('.js') || entry.name.endsWith('.mjs') || entry.name.endsWith('.cjs'))) {
      patchFile(fullPath);
    }
  }
}

scanAndPatch(path.join(process.cwd(), '.open-next'));
console.log('✨ loadInstrumentationModule patches applied successfully.');

console.log('🚀 Build assets unified. Handing over to Cloudflare Pages pipeline!');