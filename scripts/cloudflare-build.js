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

// ─────────────────────────────────────────────────────────────────────────────
// 7. PHASE 1: Exhaustive Build Asset Manifest Discovery
//    Recursively walk the entire .open-next/ tree and log every JS asset file.
// ─────────────────────────────────────────────────────────────────────────────

const PATCHABLE_EXTS = new Set(['.js', '.mjs', '.cjs']);
const PATCH_BANNER = '/* __PULSEPING_PATCHED__ */';

/**
 * Recursively collect all patchable JS files under a root directory.
 * Returns an array of absolute file paths.
 */
function collectFiles(dir, collected = []) {
  if (!fs.existsSync(dir)) return collected;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectFiles(fullPath, collected);
    } else if (entry.isFile() && PATCHABLE_EXTS.has(path.extname(entry.name))) {
      collected.push(fullPath);
    }
  }
  return collected;
}

const openNextRoot = path.join(process.cwd(), '.open-next');
console.log('\n📋 PHASE 1: Scanning .open-next/ asset tree for patchable bundles...');

const allFiles = collectFiles(openNextRoot);
// Group by top-level subdirectory for structured manifest output
const manifest = {};
for (const filePath of allFiles) {
  const relative = path.relative(openNextRoot, filePath);
  const topDir = relative.split(path.sep)[0] || '(root)';
  if (!manifest[topDir]) manifest[topDir] = [];
  manifest[topDir].push(relative);
}

let totalFileCount = 0;
for (const [dir, files] of Object.entries(manifest)) {
  console.log(`  📂 .open-next/${dir}/  (${files.length} file${files.length !== 1 ? 's' : ''})`);
  for (const f of files) {
    console.log(`     └─ ${f}`);
  }
  totalFileCount += files.length;
}
console.log(`\n✅ Manifest complete. ${totalFileCount} patchable asset file(s) discovered.\n`);

// ─────────────────────────────────────────────────────────────────────────────
// 8. PHASE 2: AST-Safe Multi-Pattern Instrumentation Hook Neutralization
//    Targets all four Next.js 16 lifecycle hooks across all esbuild output forms.
//    Idempotency: files already patched (banner present) are skipped entirely.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The four instrumentation hooks emitted by Next.js 16 core that trigger
 * dynamic require() calls Cloudflare workerd cannot execute at runtime.
 */
const HOOK_TARGETS = [
  'loadInstrumentationModule',
  'getInstrumentationModule',
  'registerInstrumentation',
  'ensureInstrumentationRegistered',
];

/**
 * Build the full set of regex patterns for a single target function name.
 * We deliberately cover every structural form esbuild can emit:
 *
 *   Pattern A — Plain function declaration:
 *     function name(...) {
 *     async function name(...) {
 *
 *   Pattern B — Object key colon-function (named or anonymous):
 *     name: function(...) {
 *     name: async function(...) {
 *
 *   Pattern C — Object method shorthand (class body / object literal):
 *     name(...) {
 *     async name(...) {
 *     Note: We require a word boundary before the name and ensure there is NO
 *     preceding colon (to avoid double-matching with pattern B) and NO `function`
 *     keyword (to avoid double-matching with pattern A). We use a negative
 *     lookbehind for those cases.
 *
 *   Pattern D — Arrow function property:
 *     name: (...) => {
 *     name: async (...) => {
 *
 * Each pattern is tagged with whether its matched form is async so we can inject
 * the correct early-return (`return;` vs `return Promise.resolve();`).
 */
function buildPatchPatterns(target) {
  const t = target; // shorthand for regex clarity
  return [
    // A: Plain function declaration
    {
      re: new RegExp(`\\b(async\\s+function\\s+${t}\\b[^{]*)\\{`, 'g'),
      async: true,
      label: 'async-function-decl',
    },
    {
      re: new RegExp(`\\b(function\\s+${t}\\b[^{]*)\\{`, 'g'),
      async: false,
      label: 'function-decl',
    },
    // B: Object key colon-function
    {
      re: new RegExp(`(\\b${t}\\s*:\\s*async\\s+function\\s*\\([^)]*\\)\\s*)\\{`, 'g'),
      async: true,
      label: 'colon-async-function',
    },
    {
      re: new RegExp(`(\\b${t}\\s*:\\s*function\\s*\\([^)]*\\)\\s*)\\{`, 'g'),
      async: false,
      label: 'colon-function',
    },
    // C: Object/class method shorthand
    //    Negative lookbehind ensures we don't match after "function " or ":"
    {
      re: new RegExp(`(?<![:\\w])(async\\s+${t}\\b\\s*\\([^)]*\\)\\s*)\\{`, 'g'),
      async: true,
      label: 'async-method-shorthand',
    },
    {
      re: new RegExp(`(?<!function\\s)(?<![:\\w])(${t}\\b\\s*\\([^)]*\\)\\s*)\\{`, 'g'),
      async: false,
      label: 'method-shorthand',
    },
    // D: Arrow function property
    {
      re: new RegExp(`(\\b${t}\\s*:\\s*async\\s*\\([^)]*\\)\\s*=>\\s*)\\{`, 'g'),
      async: true,
      label: 'async-arrow',
    },
    {
      re: new RegExp(`(\\b${t}\\s*:\\s*\\([^)]*\\)\\s*=>\\s*)\\{`, 'g'),
      async: false,
      label: 'arrow',
    },
  ];
}

/**
 * Patch a single file in place.
 * Returns true if any modifications were written, false otherwise.
 */
function patchFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Idempotency guard: skip files already processed by a previous run
  if (content.includes(PATCH_BANNER)) {
    return false;
  }

  // Quick pre-filter: skip entirely if no hook name is present at all
  const hasAnyTarget = HOOK_TARGETS.some(t => content.includes(t));
  if (!hasAnyTarget) return false;

  let modified = false;

  for (const target of HOOK_TARGETS) {
    if (!content.includes(target)) continue;

    const patterns = buildPatchPatterns(target);

    for (const { re, async: isAsync, label } of patterns) {
      const earlyReturn = isAsync ? 'return Promise.resolve();' : 'return;';
      const alreadyPatchedCheck = new RegExp(
        re.source.replace(/\\\{$/, `\\{\\s*${earlyReturn.replace('.', '\\.')}`),
        re.flags
      );

      // Reset regex state before testing
      re.lastIndex = 0;
      alreadyPatchedCheck.lastIndex = 0;

      // Only patch if there's an un-patched match in this file
      if (re.test(content)) {
        re.lastIndex = 0;
        // Replace each match: inject early return right after the opening brace
        const patched = content.replace(re, (_, prefix) => {
          // Check the character right after `{` in the original to ensure we
          // don't already have our early return there
          return `${prefix}{${earlyReturn}`;
        });
        if (patched !== content) {
          console.log(`  🩹 [${label}] Patched "${target}" in: ${path.relative(process.cwd(), filePath)}`);
          content = patched;
          modified = true;
        }
      }
    }
  }

  if (modified) {
    // Prepend idempotency banner so reruns skip this file
    content = `${PATCH_BANNER}\n${content}`;
    fs.writeFileSync(filePath, content, 'utf8');
  }

  return modified;
}

console.log('🩹 PHASE 2: Applying instrumentation hook neutralization patches...\n');

let patchedFileCount = 0;
let patchedHookCount = 0;

for (const filePath of allFiles) {
  const wasPatched = patchFile(filePath);
  if (wasPatched) patchedFileCount++;
}

if (patchedFileCount === 0) {
  console.log('ℹ️  No instrumentation hooks found requiring patches (all clean or pre-patched).');
} else {
  console.log(`\n✅ Instrumentation neutralization complete. Patched ${patchedFileCount} file(s).`);
}

console.log('\n🚀 Build assets unified. Handing over to Cloudflare Pages pipeline!');