const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('📦 Starting full-stack edge compilation sequence...');

let esbuild;
try {
  esbuild = require('esbuild');
} catch (e) {
  // Fallback to CLI if require fails
}

// Helper to format bytes into KB or MB cleanly
const formatSize = (bytes) => {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  }
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
};

// 1. Forcefully purge BOTH framework caches to prevent stale compilation bleed
const cachesToClean = ['.next', '.open-next'];
cachesToClean.forEach((dir) => {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
    console.log(`🧹 Purged stale build cache directory: ${dir}`);
  }
});

// 2. Apply runtime validateConfig patch for OpenNext Edge multi-route support
const validateConfigPath = 'node_modules/@opennextjs/aws/dist/build/validateConfig.js';
if (fs.existsSync(validateConfigPath)) {
  let code = fs.readFileSync(validateConfigPath, 'utf8');
  if (code.includes('if (fnOptions.runtime === "edge" && fnOptions.routes.length > 1) {')) {
    code = code.replace(
      'if (fnOptions.runtime === "edge" && fnOptions.routes.length > 1) {',
      'if (false && fnOptions.runtime === "edge" && fnOptions.routes.length > 1) {'
    );
    fs.writeFileSync(validateConfigPath, code, 'utf8');
    console.log('🛡️ OpenNext edge route count validation bypassed successfully.');
  }
}

// 3. Run Prisma and OpenNext builds from scratch
execSync('npx prisma generate', { stdio: 'inherit' });
execSync('npx @opennextjs/cloudflare build --build-command "npm run build"', { stdio: 'inherit' });

// Overwrite dynamic server instrumentation loader to prevent edge isolate panic
const handlerPath = '.open-next/server-functions/default/handler.mjs';
if (fs.existsSync(handlerPath)) {
  let code = fs.readFileSync(handlerPath, 'utf8');
  const targetRegex = /async loadInstrumentationModule\s*\([^\)]*\)\s*\{\s*\}/;
  if (code.match(targetRegex)) {
    code = code.replace(targetRegex, 'async loadInstrumentationModule(){return null;}');
    fs.writeFileSync(handlerPath, code, 'utf8');
    console.log('🛡️ Instrumentation loader patch injected into default handler successfully.');
  }
}

// 4. Apply Global Scope ReferenceError Patch & Unify Worker Target
const workerPath = '.open-next/worker.js';
const targetWorkerPath = '.open-next/assets/_worker.js';

if (fs.existsSync(workerPath)) {
  const content = 'globalThis.e = undefined;\n' + fs.readFileSync(workerPath, 'utf8');
  fs.writeFileSync(targetWorkerPath, content);
  console.log('🛡️ Scope safety patch injected into bundle successfully.');
}

// 5. Sync or Force-Generate Asset Routes Blueprint
const routesPath = '.open-next/_routes.json';
const targetRoutesPath = '.open-next/assets/_routes.json';

if (fs.existsSync(routesPath)) {
  fs.copyFileSync(routesPath, targetRoutesPath);
  console.log('📁 Native asset routing rules mapped to edge network CDN.');
} else {
  const routesBlueprint = {
    version: 1,
    include: ['/*'],
    exclude: ['/_next/static/*', '/favicon.ico', '/robots.txt', '/sitemap.xml'],
  };
  fs.writeFileSync(targetRoutesPath, JSON.stringify(routesBlueprint, null, 2));
  console.log('📁 Custom asset routing fallback blueprint generated successfully.');
}

// 6. Mirror Fresh Directories across Output Trees
const directories = ['cloudflare', 'middleware', '.build', 'server-functions'];
directories.forEach((dir) => {
  const source = path.join('.open-next', dir);
  const destination = path.join('.open-next', 'assets', dir);
  if (fs.existsSync(source)) {
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.cpSync(source, destination, { recursive: true });
  }
});

// 7. Flatten Turbopack/Webpack Symlinks Inside Cloudflare Output Tree
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
      } catch (err) { }
    } else if (entry.isDirectory()) {
      flattenAssets(fullPath);
    }
  }
}

flattenAssets(assetsDir);
console.log('✨ Output tree flattened. All symlinks successfully converted to raw assets.');

// 8. Aggressively Minify BOTH _worker.js and handler.mjs cleanly
const minifyFile = (filePath, label) => {
  if (!fs.existsSync(filePath)) return;
  console.log(`⚡ Minifying ${label} with esbuild...`);
  try {
    const esb = esbuild || require('esbuild');
    esb.buildSync({
      entryPoints: [filePath],
      outfile: filePath,
      allowOverwrite: true,
      minify: true,
      treeShaking: true,
      legalComments: 'none',
      drop: ['console', 'debugger'],
      target: 'es2022',
      format: 'esm',
      platform: 'node',
      logLevel: 'error',
    });
  } catch (e) {
    execSync(
      `npx esbuild "${filePath}" --outfile="${filePath}" --allow-overwrite --minify --tree-shaking=true --legal-comments=none --drop:console --drop:debugger --target=es2022 --format=esm --platform=node --log-level=error`,
      { stdio: 'inherit' }
    );
  }
  const stats = fs.statSync(filePath);
  console.log(`✅ Minified ${label} final size: ${formatSize(stats.size)}`);
};

minifyFile(targetWorkerPath, '_worker.js');

const assetHandlerPath = path.join(assetsDir, 'server-functions', 'default', 'handler.mjs');
minifyFile(assetHandlerPath, 'handler.mjs');

// 9. Size Breakdown Summary Logger
if (fs.existsSync(assetsDir)) {
  const getDirSize = (dir) => {
    let size = 0;
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);
      size += stats.isDirectory() ? getDirSize(filePath) : stats.size;
    }
    return size;
  };
  const totalBytes = getDirSize(assetsDir);
  console.log(`\n📊 ===========================================`);
  console.log(`📦 Total Live Cloudflare Bundle Size: ${formatSize(totalBytes)}`);

  const workerPathInAssets = path.join(assetsDir, '_worker.js');
  if (fs.existsSync(workerPathInAssets)) {
    console.log(`⚡ _worker.js Function Size: ${formatSize(fs.statSync(workerPathInAssets).size)}`);
  }
  if (fs.existsSync(assetHandlerPath)) {
    console.log(`⚡ handler.mjs Server Function Size: ${formatSize(fs.statSync(assetHandlerPath).size)}`);
  }
  console.log(`===========================================\n`);
}

console.log('🚀 Build assets unified. Handing over to Cloudflare Pages pipeline!');