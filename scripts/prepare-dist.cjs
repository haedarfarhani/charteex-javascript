const fs = require('node:fs');
const path = require('node:path');

const distDir = path.resolve(__dirname, '..', 'dist');
const pkgRaw = fs.readFileSync(path.resolve(__dirname, '..', 'package.json'), 'utf8');
const pkg = JSON.parse(pkgRaw);

if (!fs.existsSync(distDir)) {
  throw new Error('dist directory does not exist yet');
}

// Publishable artifacts start after TypeScript declaration emit and Vite bundling.
// This helper only adds the package.json that Node ESM loaders and npm pack expect
// inside the dist folder; it does not generate or copy implementation files.
const distPackage = {
  name: pkg.name,
  version: pkg.version,
  description: pkg.description,
  type: pkg.type,
  main: pkg.main,
  module: pkg.module,
  types: pkg.types,
  exports: pkg.exports,
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

const declarationFiles = entries.filter((name) => name.endsWith('.d.ts'));
if (declarationFiles.length === 0) {
  console.warn('WARNING: no .d.ts files were found in dist/. Honest publish artifacts should include TypeScript declarations.');
} else {
  console.log('declaration files in dist/: ' + declarationFiles.join(', '));
}
