import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

export async function generateNarration({key,voiceId,voiceLabel='Tatu-bola',root,fetchImpl=fetch,page=0}) {
  if(!key || !voiceId || !/^[a-zA-Z0-9_-]{10,80}$/.test(voiceId)) throw new Error('Configure a chave privada e um Voice ID nativo válido antes de gerar.');
  const folder=path.join(root,'longines');
  const texts=JSON.parse(await readFile(path.join(folder,'narration-texts.json'),'utf8'));
  if(!Number.isInteger(page)||page<0)throw new Error('Página inválida.');
  const indexes=page?[page-1]:texts.map((_,i)=>i);
  if(indexes.some(i=>!Number.isInteger(i)||i<0||i>=texts.length))throw new Error('Página inválida.');
  const manifest=JSON.parse(await readFile(path.join(folder,'narration.json'),'utf8'));
  const tracks=page&&manifest.voiceId===voiceId?[...manifest.tracks]:[];
  await mkdir(path.join(folder,'assets/narration'),{recursive:true});
  for(const i of indexes){
    const response=await fetchImpl(`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}?output_format=mp3_44100_128`,{
      method:'POST',headers:{'xi-api-key':key,'content-type':'application/json'},
      body:JSON.stringify({text:texts[i],model_id:'eleven_multilingual_v2',voice_settings:{stability:.5,similarity_boost:.75,use_speaker_boost:true}}),
      signal:AbortSignal.timeout(120000)
    });
    if(!response.ok)throw new Error(`Geração não concluída na página ${i+1}: HTTP ${response.status}.`);
    if(!(response.headers.get('content-type')||'').startsWith('audio/'))throw new Error('O serviço não retornou um áudio válido.');
    const data=Buffer.from(await response.arrayBuffer());if(data.length<500)throw new Error('Áudio incompleto.');
    const file=`assets/narration/pagina-${String(i+1).padStart(2,'0')}.mp3`;
    await writeFile(path.join(folder,file),data);tracks[i]=file;
  }
  await writeFile(path.join(folder,'narration.json'),JSON.stringify({voiceLabel,voiceId,tracks},null,2)+'\n');
  return indexes.length;
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const root=fileURLToPath(new URL('../',import.meta.url));
  const pageArg=process.argv.find(arg=>arg.startsWith('--page='));
  generateNarration({key:process.env.ELEVENLABS_API_KEY,voiceId:process.env.LONGINES_VOICE_ID,voiceLabel:process.env.LONGINES_VOICE_LABEL||'Tatu-bola',root,page:pageArg?Number(pageArg.split('=')[1]):0})
    .then(count=>console.log(`${count} narrações geradas. A chave não foi salva nos arquivos.`))
    .catch(error=>{console.error(error.message);process.exitCode=1;});
}
