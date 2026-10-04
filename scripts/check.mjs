import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../public/', import.meta.url));
const config = JSON.parse(await readFile(path.join(root, 'staticwebapp.config.json'), 'utf8'));
async function filesAt(dir) {
  const result = [];
  for (const item of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, item.name);
    if (item.isDirectory()) result.push(...await filesAt(file));
    else result.push(file);
  }
  return result;
}
async function resolveURL(url) {
  const mapped = config.routes.find(route => route.route === url)?.rewrite || url;
  let file = path.resolve(root, `.${mapped}`);
  if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html');
  await stat(file);
  return file;
}
let checked = 0;
for (const file of (await filesAt(root)).filter(file => file.endsWith('.html'))) {
  const html = await readFile(file, 'utf8');
  assert.match(html, /<html lang="en">/);
  assert.match(html, /<title>.+<\/title>/);
  assert.match(html, /name="viewport"/);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, `Duplicate IDs in ${file}`);
  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const url = match[1];
    if (url.startsWith('https://') || url.startsWith('mailto:')) continue;
    const [pathname, fragment] = url.split('#');
    const target = pathname ? await resolveURL(pathname) : file;
    if (fragment) {
      const targetHTML = await readFile(target, 'utf8');
      assert.ok(targetHTML.includes(`id="${fragment}"`), `Missing anchor: ${url}`);
    }
    checked++;
  }
}
for (const route of config.routes) await resolveURL(route.route);
assert.equal(config.navigationFallback, undefined, 'Missing pages should return 404, not the homepage');
console.log(`Site checks passed: ${checked} local references and ${config.routes.length} Azure route mappings.`);
