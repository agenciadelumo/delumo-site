import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { clientBrands, primarySolutions, solutions } from '../web/src/data/content.ts';
import { academyCourses, trainingSectors, demoQuestions } from '../web/src/data/learning.ts';

const exported = new URL('../dist/', import.meta.url);
const html = path => readFile(new URL(path, exported), 'utf8');

test('immersion navigation and platform examples include the public client tools', async () => {
  const home = await html('index.html');
  assert.ok(home.includes('href="/solucoes/imersao">Imersão</a>'));
  const page = await html('solucoes/plataformas.html');
  for (const text of ['Allmac360', 'Allmac Academy', 'Allmac Protect', 'AcademiaESB', 'Central de agentes', 'Rafael', 'Helena', 'Alberto']) assert.ok(page.includes(text));
  for (const href of ['https://allmac360.com', 'https://esblight.com.br', 'https://www.esblight.com.br/agentes']) assert.ok(page.includes(`href="${href}"`));
  assert.ok(page.includes('src="/media/esblight-agentes.webp"'));
  assert.ok((await stat(new URL('media/esblight-agentes.webp', exported))).size < 200_000);
});

test('all ten client logos retain their assets and open the requested destinations', async () => {
  const page = await html('index.html');
  assert.equal(clientBrands.length, 10);
  assert.deepEqual(clientBrands.map(({ href }) => href), [
    'https://avantehotzone.com.br', 'https://conquistahnk.com.br',
    'https://www.comercialincerti.com.br', 'https://www.comercialincerti.com.br',
    'https://www.comercialincerti.com.br', 'https://meutour360.com/tour-360/bar-ab-correto',
    'https://supremelub.com.br', 'https://allmac360.com', 'https://esblight.com.br', 'https://erbs.com.br',
  ]);
  for (const brand of clientBrands) {
    assert.ok(page.includes(`href="${brand.href}" target="_blank" rel="noopener noreferrer" aria-label="${brand.name}: abrir site em nova aba"`));
    assert.ok(page.includes(`src="/assets/img/logos/${brand.file}.png"`));
    assert.ok((await stat(new URL(`assets/img/logos/${brand.file}.png`, exported))).size > 0);
  }
});

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

test('homepage keeps the covers, RH, platform and protected demonstrations without training examples', async () => {
  const page = await html('index.html');
  for (const text of ['hero-carousel', 'immersive-team.webp', 'Soluções para RH', 'Integração com ERP e RH', 'Metodologias de aprendizagem', 'Ver exemplos e formatos de treinamento', 'demo-dialog-title']) {
    assert.ok(page.includes(text), `Missing ${text}`);
  }
  for (const videoId of ['XFXbMmj8w0E', 'OYASF7Wgz-s']) assert.ok(!page.includes(videoId));
  for (const label of ['Conveniência', 'Bar A/B', 'Bar C/D', 'Padaria', 'Adega', 'Mercado']) assert.ok(page.includes(label));
  assert.ok(!page.includes('class="field-gallery"'));
  assert.ok(!page.includes('class="about-teaser"'));
  for (const excluded of ['TreinaGente', 'incubadora', 'PRÊMIO ASSIDUIDADE']) assert.ok(!page.includes(excluded));
});

test('gamification projects keep their media without duplicating training examples', async () => {
  const page = await html('projetos.html');
  assert.ok(page.includes('class="field-gallery"'));
  for (const id of ['conquistahnk', 'avante-hotzone', 'metatrade', 'sites']) assert.ok(page.includes(`id="${id}"`));
  assert.ok(!page.includes('id="videos-treinamento"'));
  for (const videoId of ['XFXbMmj8w0E', 'OYASF7Wgz-s']) assert.ok(!page.includes(videoId));
  assert.ok(page.includes('width="500" height="479"'));
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
  assert.ok(about.includes('Guto da Luz'));
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

test('service families are consolidated while existing detail URLs remain available', async () => {
  assert.deepEqual(primarySolutions.map(item => item.slug), ['treinamentos', 'gamificacao', 'plataformas', 'imersao']);
  const home = await html('index.html');
  assert.equal((home.match(/class="ds-service-item tp_fade_anim"/g) || []).length, 4);
  assert.ok(home.includes('rh-banner-title'));
  assert.ok(home.includes('href="/solucoes/treinamentos#rh"'));
  const legacy = await html('solucoes/projetos-3d.html');
  assert.ok(legacy.includes('immersive-showreel'));
  assert.ok(legacy.includes('Vídeo de capa MetaTrade'));
  const immersion = await html('solucoes/imersao.html');
  for (const text of ['immersive-video-hero', 'autoplay=1', 'mute=1', 'loop=1', 'Assistir vídeo completo com som']) assert.ok(immersion.includes(text));
});

test('training case contains the complete supplied curriculum and sector applications', async () => {
  assert.equal(academyCourses.length, 3);
  assert.equal(academyCourses.reduce((count, course) => count + course.modules.length + Number(!!course.intro) + Number(!!course.supplement), 0), 34);
  const page = await html('solucoes/treinamentos.html');
  for (const course of academyCourses) {
    assert.ok(page.includes(course.title));
    for (const module of course.modules) assert.ok(page.includes(module));
  }
  for (const sector of trainingSectors) assert.ok(page.includes(sector.title));
  for (const text of ['NR-1', '26 de maio de 2026', 'Integrações sob medida', 'Pesquisa e diagnóstico', 'Acesso e acompanhamento individual', 'Planejamento da Trilha de Aprendizagem', 'dgGcgAeHu8Y', 'AVbWgESs2co', 'trilha-video.webp', 'quiz-video.webp', 'EXEMPLOS DE TREINAMENTOS', 'XFXbMmj8w0E', 'OYASF7Wgz-s']) assert.ok(page.includes(text));
  assert.ok(!page.includes('Conheça a AcademiaESB'));
  assert.ok(!page.includes('p85htFZYfu8'));
  assert.ok(!page.includes('Quiz demonstrativo'));
  for (const asset of ['trilha-video.webp', 'quiz-video.webp']) assert.ok((await stat(new URL(`media/${asset}`, exported))).size > 0);
  assert.ok(!page.includes('treinamento-metatrade.jpg'));
  assert.ok(page.indexOf('AVALIAÇÃO E FEEDBACK') < page.indexOf('EXEMPLOS DE TREINAMENTOS'));
  assert.ok(!page.includes('Aprendizagem de adultos, microlearning'));
  assert.ok(page.includes('Avatar semi-realista Pixar'));
  assert.ok(page.includes('plataforma-ead.webp'));
  const avatarLabels = ['Avatar para Baterias VRLA','Avatar para Baterias Brutus','Avatar para Treinamentos Administrativos','Avatar para Baterias de Carrinhos de Golf','Avatar para Garantia de Baterias','Avatar para Baterias de Motos','Avatar para Baterias Náuticas','Avatar para Baterias Estacionárias','Avatar para Baterias Pesadas Agrícolas','Avatar para Baterias Pesadas para Caminhão','Avatar para Baterias Tracionárias'];
  assert.equal((page.match(/<img[^>]+src="\/media\/avatares\/avatar-para-/g) || []).length, avatarLabels.length);
  for (const label of avatarLabels) assert.ok(page.includes(label));
  for (const file of ['plataforma-ead.webp','avatares/avatar-para-baterias-vrla.webp','avatares/avatar-para-baterias-brutus.webp','avatares/avatar-para-treinamentos-administrativos.webp']) assert.ok((await stat(new URL(`media/${file}`, exported))).size > 0);
  for (const question of demoQuestions) assert.ok(question.answer >= 0 && question.answer < question.options.length);
});

test('founder profile preserves a single portrait and omits private resume details', async () => {
  const page = await html('sobre.html');
  assert.equal((page.match(/<img[^>]+src="\/media\/antonio-augusto-da-luz.png"/g) || []).length, 1);
  for (const text of ['Guto da Luz', 'TIME DELUMO', 'Engenharia de software', 'Design 3D', 'Arquitetura e espaços', 'Desenvolvimento de games']) assert.ok(page.includes(text));
  for (const text of ['Antônio Augusto da Luz', '29/07/1983', 'antonioaugustodaluz83', 'Incerti', 'Hidroluz', 'Vitano']) assert.ok(!page.includes(text));
});
