const fs = require('node:fs');
const path = require('node:path');

const distDir = path.resolve(__dirname, '..', 'dist');
const pkgRaw = fs.readFileSync(path.resolve(__dirname, '..', 'package.json'), 'utf8');
const pkg = JSON.parse(pkgRaw);

if (!fs.existsSync(distDir)) {
  throw new Error('dist directory does not exist yet');
}

// Publishable artifacts should contain the bundled entry plus TypeScript declarations.
// This helper only writes the package.json that Node ESM loaders and npm pack expect inside
// the dist folder; it does not generate or copy implementation files.
// NOTE: paths here are relative to dist/ itself (./index.js), while the root
// package.json keeps ./dist/index.js paths for normal `npm publish` from root.
const distPackage = {
  name: pkg.name,
  version: pkg.version,
  description: pkg.description,
  type: pkg.type || 'module',
  main: './index.js',
  module: './index.js',
  types: './index.d.ts',
  exports: {
    '.': {
      types: './index.d.ts',
      import: './index.js',
      default: './index.js'
    }
  },
  sideEffects: pkg.sideEffects,
  keywords: pkg.keywords,
  author: pkg.author,
  license: pkg.license,
  repository: pkg.repository
};

fs.writeFileSync(
  path.resolve(distDir, 'package.json'),
  JSON.stringify(distPackage, null, 2) + '\n',
  'utf8'
);

const entries = fs.readdirSync(distDir);
console.log('Wrote dist/package.json');
console.log('dist entries:', entries.join(', '));

const entryFiles = ['index.js', 'index.js.map'].filter((name) => entries.includes(name));
const declarationFiles = entries.filter((name) => name.endsWith('.d.ts'));

if (entryFiles.length === 0) {
  console.warn('WARNING: expected bundled entry files (index.js) were not found in dist/.');
} else {
  console.log('entry files in dist/: ' + entryFiles.join(', '));
}

if (declarationFiles.length === 0) {
  console.warn('WARNING: no .d.ts files were found in dist/. The published package should include TypeScript declarations.');
} else {
  console.log('declaration files in dist/: ' + declarationFiles.slice(0, 5).join(', ') + (declarationFiles.length > 5 ? ', ...' : ''));
}

// Keep a standalone charteex.js at the project root for static demos and GitHub Pages
const distIndex = path.resolve(distDir, 'index.js');
if (fs.existsSync(distIndex)) {
  fs.copyFileSync(distIndex, path.resolve(__dirname, '..', 'charteex.js'));
  console.log('Synced charteex.js for standalone static hosting');
}

