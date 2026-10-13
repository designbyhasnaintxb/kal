/* Netlify build: copies the static site (this folder) into ./dist.
 * Works from the repo root (via ../build.js) or from this folder; no dependencies. */
const fs = require('fs');
const path = require('path');

const src = __dirname;
const out = path.join(process.cwd(), 'dist');
const SKIP = new Set(['dist', 'build.js', 'netlify.toml', 'node_modules', '.git']);

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
for (const name of fs.readdirSync(src)) {
  if (SKIP.has(name)) continue;
  fs.cpSync(path.join(src, name), path.join(out, name), { recursive: true });
}

if (!fs.existsSync(path.join(out, 'index.html'))) throw new Error('build: index.html missing from ' + out);
console.log('build: copied ' + src + ' -> ' + out);
