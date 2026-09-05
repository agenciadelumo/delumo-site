import { cp, mkdir, readFile, readdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(fileURLToPath(new URL('../', import.meta.url)));
const output = path.join(root, 'dist');
if (path.dirname(output) !== root || path.basename(output) !== 'dist') throw new Error('Invalid output directory');
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
// Retain published standalone proposals, tours and applications at their existing URLs.
const legacyDirectories = ['assets', 'blog', 'bora', 'cases', 'erechim', 'gestor', 'propostadayro', 'propostaerbs', 'propostav3t', 'propostavandanamotos', 'servicos', 'treinador', 'aratiba_taverna'];
const existing = new Set((await readdir(root, { withFileTypes: true })).map(item => item.name));
for (const name of legacyDirectories) {
  if (existing.has(name)) await cp(path.join(root, name), path.join(output, name), { recursive: true });
}
for (const name of ['robots.txt', 'sitemap.xml']) {
  if (existing.has(name)) await cp(path.join(root, name), path.join(output, name));
}
await cp(path.join(root, 'web/out'), output, { recursive: true });
for (const route of ['propostadayro/index.html', 'propostaerbs/index.html', 'erechim/index.html', 'index.html']) {
  const html = await readFile(path.join(output, route), 'utf8');
  if (!html.includes('<html')) throw new Error(`Missing published route: ${route}`);
}
console.log('Next.js site assembled with all existing static routes.');
