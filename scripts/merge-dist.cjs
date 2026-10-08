const fs = require('node:fs');
const path = require('node:path');

const distDir = path.resolve(__dirname, '..', 'dist');
const bundleDir = path.resolve(__dirname, '..', 'dist', 'bundle');
const declarationsDir = path.resolve(__dirname, '..', 'dist');

// Vite lib build outputs only the rolled-up bundle into dist/bundle.
// TypeScript declaration emit (run earlier by `build:declarations`) already wrote
// .d.ts/.d.ts.map and the original source .js/.js.map files into dist/.
// This merge step moves the bundled entry files into dist/ and removes the temporary
// bundle folder so the published artifact contains both declarations and the bundle.
if (!fs.existsSync(bundleDir)) {
  throw new Error('dist/bundle directory does not exist; run build:bundle first');
}

const bundleEntries = fs.readdirSync(bundleDir);
for (const entry of bundleEntries) {
  const src = path.resolve(bundleDir, entry);
  const dest = path.resolve(distDir, entry);
  fs.copyFileSync(src, dest);
  fs.chmodSync(dest, fs.statSync(src).mode);
}

fs.rmSync(bundleDir, { recursive: true, force: true });
console.log('Merged bundle into dist/ and removed dist/bundle');

// Remove per-module tsc .js outputs — the bundle (index.js) is the only
// runtime entry; per-module .d.ts files are kept for types.
function cleanStrayJs(dir, isRoot = false) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.resolve(dir, entry.name);
    if (entry.isDirectory()) {
      cleanStrayJs(full, false);
    } else if (
      (entry.name.endsWith('.js') || entry.name.endsWith('.js.map')) &&
      !(isRoot && (entry.name === 'index.js' || entry.name === 'index.js.map'))
    ) {
      fs.rmSync(full, { force: true });
    }
  }
}
cleanStrayJs(distDir, true);
console.log('dist entries after merge:', fs.readdirSync(distDir).join(', '));
