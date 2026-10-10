'use strict';
(() => {
  const $=id=>document.getElementById(id),music=$('forestMusic'),voice=$('mascotVoice');
  let page=Math.max(0,Number(location.hash.match(/pagina-(\d+)/)?.[1]||1)-1),voiceOn=false,manifest={tracks:[]},narrationVersion=0;
  const volume=()=>Number($('musicVolume').value)/100;
  const adjustMusic=()=>{music.volume=volume()*(!voice.paused && !voice.ended ? 0.35 : 1);};
  const update=()=>{
    const playing=!music.paused;
    $('musicToggle').textContent=playing?'Pausar trilha':'Ouvir a trilha';
    $('musicToggle').setAttribute('aria-pressed',String(playing));
    $('soundButton').classList.toggle('is-playing',playing||voiceOn);
  };
  async function narrate(){
    const version=++narrationVersion;
    voice.pause();voice.currentTime=0;adjustMusic();
    const file=manifest.tracks[page];if(!voiceOn||!file)return;
    const url=new URL(file,document.baseURI);
    if(url.origin!==location.origin||!url.pathname.startsWith('/longines/assets/'))return;
    voice.src=url.href;voice.volume=.85;
    try{await voice.play();if(version===narrationVersion)$('soundStatus').textContent='Sua companheira está contando esta descoberta.';}
    catch(_){if(version!==narrationVersion)return;$('soundStatus').textContent='Toque em Ouvir a tatu-bola para iniciar a narração.';voiceOn=false;$('narrationToggle').setAttribute('aria-pressed','false');$('narrationToggle').textContent='Ouvir a tatu-bola';update();}
  }
  $('soundButton').addEventListener('click',()=>{$('soundDialog').showModal();});
  $('musicToggle').addEventListener('click',async()=>{
    if(!music.paused){music.pause();$('soundStatus').textContent='Trilha pausada. Continue explorando no seu ritmo.';}
    else{adjustMusic();try{await music.play();$('soundStatus').textContent='Trilha da aventura ativada em volume suave.';}catch(_){$('soundStatus').textContent='Não foi possível iniciar o som. Toque novamente para tentar.';}}
    update();
  });
  $('musicVolume').addEventListener('input',()=>{$('volumeValue').textContent=$('musicVolume').value+'%';adjustMusic();});
  $('narrationToggle').addEventListener('click',()=>{voiceOn=!voiceOn;$('narrationToggle').setAttribute('aria-pressed',String(voiceOn));$('narrationToggle').textContent=voiceOn?'Pausar a tatu-bola':'Ouvir a tatu-bola';narrate();update();});
  window.addEventListener('longines:page',event=>{page=event.detail.index;narrate();});
  ['playing','pause','ended'].forEach(event=>voice.addEventListener(event,adjustMusic));
  ['playing','pause','ended'].forEach(event=>music.addEventListener(event,update));
  music.addEventListener('error',()=>{$('soundStatus').textContent='A trilha não pôde ser carregada. Você pode continuar a leitura.';update();});
  fetch('narration.json').then(response=>response.ok?response.json():Promise.reject()).then(data=>{
    if(Array.isArray(data.tracks)&&data.tracks.some(file=>typeof file==='string'&&file.startsWith('assets/'))){manifest=data;$('narrationControls').hidden=false;}
  }).catch(()=>{});
  adjustMusic();
})();
