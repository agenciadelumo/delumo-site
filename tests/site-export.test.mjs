import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { solutions } from '../web/src/data/content.ts';

const exported = new URL('../dist/', import.meta.url);
const html = path => readFile(new URL(path, exported), 'utf8');

test('all six solutions have detail pages and a contextual contact path', async () => {
  assert.equal(solutions.length, 6);
  assert.equal(new Set(solutions.map(item => item.slug)).size, 6);
  for (const solution of solutions) {
    const page = await html(`solucoes/${solution.slug}.html`);
    assert.ok(page.includes(solution.name));
    assert.ok(page.includes(`href="/contato?solucao=${solution.slug}"`));
    assert.ok(page.includes('id="aplicacoes"'));
    assert.ok(page.includes('id="entregas"'));
    assert.ok(page.includes('Soluções relacionadas'));
  }
});

test('homepage keeps the covers, RH, platform and protected demonstrations', async () => {
  const page = await html('index.html');
  for (const text of ['hero-carousel', 'immersive-team.webp', 'Soluções para RH', 'Integração com ERP e RH', 'Metodologias de aprendizagem', 'Exemplos de treinamentos com avatares', 'demo-dialog-title']) {
    assert.ok(page.includes(text), `Missing ${text}`);
  }
  for (const label of ['Conveniência', 'Bar A/B', 'Bar C/D', 'Padaria', 'Adega', 'Mercado']) assert.ok(page.includes(label));
  assert.ok(!page.includes('class="field-gallery"'));
  assert.ok(!page.includes('class="about-teaser"'));
  for (const excluded of ['TreinaGente', 'incubadora', 'PRÊMIO ASSIDUIDADE']) assert.ok(!page.includes(excluded));
});

test('complete project media stays available on the projects page', async () => {
  const page = await html('projetos.html');
  assert.ok(page.includes('class="field-gallery"'));
  for (const id of ['conquistahnk', 'avante-hotzone', 'metatrade', 'videos-treinamento', 'sites']) assert.ok(page.includes(`id="${id}"`));
});

test('main pages and shared training image exist', async () => {
  for (const path of ['index.html', 'contato.html', 'sobre.html', 'privacidade.html', 'projetos.html']) assert.ok((await html(path)).includes('<main'));
  assert.ok((await stat(new URL('media/immersive-team.webp', exported))).size < 200_000);
});

test('standalone proposal, tour and training routes remain unchanged', async () => {
  for (const route of ['propostadayro/index.html', 'erechim/index.html', 'treinador/index.html']) {
    const source = await readFile(new URL(`../${route}`, import.meta.url));
    const output = await readFile(new URL(route, exported));
    assert.deepEqual(output, source, route);
  }
});

test('portrait, refreshed case previews and footer branding are exported', async () => {
  const about = await html('sobre.html');
  assert.ok(about.includes('Antônio Augusto da Luz'));
  assert.ok(about.includes('about-portrait'));
  assert.ok(about.includes('/media/antonio-augusto-da-luz.png'));
  const original = await readFile(new URL('../web/public/media/antonio-augusto-da-luz.png', import.meta.url));
  assert.deepEqual(await readFile(new URL('media/antonio-augusto-da-luz.png', exported)), original);
  for (const route of ['index.html', 'projetos.html']) {
    const page = await html(route);
    assert.ok(page.includes('website-browser-bar'));
    assert.ok(page.includes('powered-logo-fill'));
    assert.ok(page.includes('Treinar. Jogar. Evoluir.'));
    assert.ok(!page.includes('De Erechim para novas possibilidades.'));
  }
});
