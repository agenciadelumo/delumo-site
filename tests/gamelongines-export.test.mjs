import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';

const root=new URL('../',import.meta.url);
test('game assets resolve at the requested URL with or without a trailing slash',async()=>{
 const html=await readFile(new URL('dist/gamelongines/index.html',root),'utf8');
 const base=html.match(/<base href="([^"]+)"/)[1];
 for(const requested of ['https://www.delumo.com.br/gamelongines','https://www.delumo.com.br/gamelongines/']){
  assert.equal(new URL('Build/Web.wasm',new URL(base,requested)).href,'https://www.delumo.com.br/gamelongines/Build/Web.wasm');
 }
 for(const file of ['Build/Web.wasm','Build/Web.data','Build/Web.framework.js','Build/Web.loader.js','game-assets/longines-logo-com-slogan.svg','game-assets/titulo.ttf','game-assets/delumo-branco.svg']){
  assert.deepEqual(await readFile(new URL('dist/gamelongines/'+file,root)),await readFile(new URL('gamelongines/'+file,root)),file);
 }
 const binary=await readFile(new URL('dist/gamelongines/Build/Web.wasm',root));
 assert.deepEqual([...binary.subarray(0,4)],[0,97,115,109]);
});
test('Windows package and proposal link remain available beside the web game',async()=>{
 const zip=await stat(new URL('dist/gamelongines/downloads/Longines-Windows.zip',root));
 assert.ok(zip.size>80_000_000&&zip.size<100_000_000);
 const game=await readFile(new URL('dist/gamelongines/index.html',root),'utf8');
 const book=await readFile(new URL('dist/longines/index.html',root),'utf8');
 assert.ok(game.includes('downloads/Longines-Windows.zip'));
 assert.ok(game.includes('https://www.delumo.com.br/longines/#pagina-1'));
 assert.ok(book.includes('href="/gamelongines"'));
 const config=JSON.parse(await readFile(new URL('vercel.json',root),'utf8'));
 assert.ok(config.headers.some(rule=>rule.source.includes('.wasm')&&rule.headers.some(h=>h.key==='Content-Type'&&h.value==='application/wasm')));
});
