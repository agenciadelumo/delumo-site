import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {generateNarration} from '../scripts/generate-longines-narration.mjs';

test('narration requires private credentials and a native voice identifier before contacting the provider',async()=>{
  let calls=0;
  for(const credentials of [{},{key:'private-test-key',voiceId:'611'}]){
    await assert.rejects(generateNarration({...credentials,root:'unused',fetchImpl:()=>{calls++;}}),/chave privada/);
  }
  assert.equal(calls,0);
});

test('a preview publishes only audio and its manifest, without the private key',async t=>{
  const root=await mkdtemp(path.join(tmpdir(),'longines-audio-'));
  t.after(()=>rm(root,{recursive:true,force:true}));
  const folder=path.join(root,'longines');await mkdir(folder);
  await writeFile(path.join(folder,'narration-texts.json'),JSON.stringify(['Oi, vamos explorar!','Mais descobertas.']));
  const original=JSON.stringify({voiceLabel:'',tracks:[]});
  await writeFile(path.join(folder,'narration.json'),original);
  const key='private-test-key';let calls=0;
  const fetchImpl=async(url,request)=>{
    calls++;assert.match(url,/text-to-speech\/nativeVoice123/);
    assert.equal(request.headers['xi-api-key'],key);
    assert.equal(JSON.parse(request.body).text,'Oi, vamos explorar!');
    return new Response(new Uint8Array(1000),{headers:{'content-type':'audio/mpeg'}});
  };
  await assert.rejects(generateNarration({root,key,voiceId:'nativeVoice123',fetchImpl,page:NaN}),/Página inválida/);
  assert.equal(calls,0);
  assert.equal(await generateNarration({root,key,voiceId:'nativeVoice123',fetchImpl,page:1}),1);
  const manifest=await readFile(path.join(folder,'narration.json'),'utf8');
  assert.ok(!manifest.includes(key));
  assert.deepEqual(JSON.parse(manifest).tracks,['assets/narration/pagina-01.mp3']);
  assert.equal((await readFile(path.join(folder,'assets/narration/pagina-01.mp3'))).length,1000);
  await assert.rejects(generateNarration({root,key,voiceId:'nativeVoice123',page:2,fetchImpl:async()=>new Response('failure',{status:403})}),/HTTP 403/);
  assert.equal(await readFile(path.join(folder,'narration.json'),'utf8'),manifest);
});
