import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const source = new URL('longines/', root);
const output = new URL('dist/longines/', root);
const context = { window: {} };
vm.runInNewContext(await readFile(new URL('pages.js', source), 'utf8'), context);
const pages = context.window.LONGINES_PAGES;

test('all 15 published pages keep their illustrations, readable content and working destinations', async () => {
  assert.equal(pages.length, 15);
  for (const page of pages) {
    assert.ok(page.text.length > 50, page.title);
    for (const asset of [page.image, page.fallback, page.thumbnail]) {
      const original = await readFile(new URL(asset, source));
      assert.deepEqual(await readFile(new URL(asset, output)), original, asset);
    }
    const svg = await readFile(new URL(page.image, output), 'utf8');
    assert.ok(svg.includes('<svg'), page.image);
    for (const match of svg.matchAll(/(?:xlink:)?href="([^"#]+)"/g)) {
      if (!match[1].startsWith('data:')) assert.ok((await stat(new URL('assets/' + match[1], output))).size > 0, match[1]);
    }
    for (const link of page.links) {
      if (link.url) assert.ok(link.url.startsWith('https://'));
      else assert.ok(Number.isInteger(link.page) && link.page >= 0 && link.page < pages.length);
    }
  }
});

test('the public folder contains the reader, logo, typeface and downloadable proposal', async () => {
  for (const file of ['index.html','book.js','book.css','pages.js','assets/longines-logo.svg','assets/titulo.ttf','Longines_Uma_Aventura_na_Natureza.pdf']) {
    assert.deepEqual(await readFile(new URL(file, output)), await readFile(new URL(file, source)), file);
  }
  const html = await readFile(new URL('index.html', output), 'utf8');
  assert.ok(html.includes('<base href="/longines/">'));
  assert.ok(html.includes('Brincar, explorar e aprender com a natureza'));
});
