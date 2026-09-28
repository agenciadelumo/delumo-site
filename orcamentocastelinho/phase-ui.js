'use strict';
const phaseEscape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const phaseLink = ([label,url]) => `<a href="${phaseEscape(url)}" target="_blank" rel="noopener">${phaseEscape(label)} ↗</a>`;
const productionGuide = `
<h3>Como produzir esta fase</h3>
<p><strong>Proposta base:</strong> 3DVista em primeira pessoa, com cenas do Blender e vídeos curtos gerados no Seedance 2.5. Primeiro validar uma sala, uma escolha e o controle real. Unity passa a ser a opção quando a equipe decidir por caminhada contínua, inventário, personagens ou regras que exijam programação.</p>
<ol class="production-steps">
<li><strong>SketchUp → Blender.</strong> Conferir o GLB exportado: escala em metros, faces, UVs, texturas e posição dos pavimentos. Separar portas e objetos interativos. Simplificar a geometria e preparar materiais; exportar GLB/glTF para o 3DVista. O arquivo não traz automaticamente missões, colisões ou a lógica dos botões.</li>
<li><strong>Base espacial.</strong> Manter a arquitetura no modelo. Para cenas guiadas, renderizar panoramas ou vídeos equiretangulares de 360° × 180° no Blender. No 3DVista, o GLB permite navegar no espaço; no vídeo 360°, o observador olha ao redor de uma câmera previamente definida. São experiências diferentes.</li>
<li><strong>Seedance 2.5.</strong> Gerar tomadas curtas a partir de imagens e movimentos de câmera aprovados. A documentação anuncia até 30 s por geração; este roteiro propõe 8–18 s para facilitar revisão e montagem. Confirmar limites disponíveis na conta. Um vídeo convencional não vira 360° correto apenas por ser esticado: usar como janela, superfície de vídeo ou composição no ambiente renderizado. Costuras, perspectiva e continuidade do 360° precisam de teste.</li>
<li><strong>Montagem e interatividade.</strong> Separar vídeo, locução, legendas e sons. No 3DVista, configurar pontos de interação, mudanças de mídia e perguntas; em Unity, programar estados equivalentes e reproduzir os clipes em superfícies ou tela. Não contar com migração automática das interações de uma plataforma para a outra. A importação do modelo no Unity precisa de um fluxo compatível com a versão escolhida.</li>
<li><strong>Teste no estande.</strong> Quatro computadores e quatro sessões independentes, uma por tela. O modelo de controle Bluetooth deve ser testado no Windows e no aplicativo exportado: pareamento não garante mapeamento de botões. No 3DVista, prever adaptação aos comandos suportados ou navegação por cursor; no Unity, configurar Input System e validar se o dispositivo é reconhecido como gamepad ou joystick.</li>
</ol>
<h3>Comandos, tempo e participação</h3>
<p>Proposta de comandos: direcional para selecionar ou olhar; botão principal para confirmar; botão secundário para voltar. Caminhar e controlar a câmera ao mesmo tempo só entram após teste do controle. A versão guiada por pontos fixos é a alternativa prevista. Legendas, instruções faladas, foco visível e participação sentada devem fazer parte do protótipo.</p>
<p>Cada grupo tem cinco pessoas: uma conduz e quatro acompanham as escolhas. Meta de quatro minutos por fase, incluindo vídeos, leitura e decisões; não são quatro minutos de vídeo contínuo. Os tempos são de ensaio, não duração comprovada. Iniciar uma rodada apenas quando o grupo estiver pronto. Após 10 s sem ação, mostrar pista; após mais 10 s, oferecer “Continuar com ajuda”. O mediador decide quando encerrar ou reiniciar; não avançar silenciosamente nem cortar a locução.</p>
<p>Cada fase entrega um carimbo. Para a estreia, propõe-se validação dos quatro carimbos pela equipe em passaporte físico; um passaporte digital entre máquinas exige identificação voluntária e integração própria. O Neon desta proposta salva orçamento e decisões, não registra automaticamente progresso do futuro jogo. O título Guardião depende das quatro fases, que podem ser visitadas em rodadas diferentes.</p>
<p>Exportar e testar execução local, arquivos de vídeo, áudio e fontes nos quatro computadores, sem depender de internet na feira. Prever reinício da sessão, volume por estação e versão assistida. Cada parede mostra seu próprio enquadramento, sem formar um único filme contínuo entre paredes.</p>
<h3>Pacote de produção e aceite</h3>
<p>Entregar projeto editável da plataforma escolhida, arquivo Blender, GLB otimizado, vídeos, locução, legendas, lista de fontes e autorizações, versão executável e instrução de operação. Os prompts abaixo são instruções de produção; os vídeos ainda não foram gerados. Antes da gravação final: aprovar roteiro e acervo, validar o modelo com a equipe técnica e ensaiar uma rodada completa com cinco participantes.</p>
<p class="phase-source-links">Base técnica: ${[
['3DVista · GLB/GLTF e modos de câmera','https://www.3dvista.com/en/'],
['3DVista · primeira pessoa, objetos e perguntas','https://www.3dvista.com/en/blog/update-2023-1-first-person-for-3d-models-new-options-for-objects-collidable-cast-and-receive-shadows/'],
['Blender · câmera panorâmica','https://docs.blender.org/manual/en/3.0/render/cycles/object_settings/cameras.html'],
['Blender · exportação glTF','https://docs.blender.org/manual/en/4.0/addons/import_export/scene_gltf2.html'],
['Seedance 2.5 · documentação oficial','https://seed.bytedance.com/en/seedance2_5'],
['Unity · controles no Input System','https://docs.unity3d.com/Packages/com.unity.inputsystem@1.17/manual/Gamepad.html']
].map(phaseLink).join(' · ')}</p>`;

function phaseMarkup(phase,index,print=false) {
  const e=phaseEscape, suffix=print?'print-':'phase-', overview=phaseOverviews[index];
  return `<article class="phase-script" aria-labelledby="${suffix}title-${index}">
    <header class="phase-hero"><span class="eyebrow">${e(phase.location)} · roteiro para aprovação</span><h2 id="${suffix}title-${index}">${e(phase.name)}<span>${e(overview.question)}</span></h2><p class="lead">${e(overview.goal)}</p><div class="phase-tags"><span>Primeira pessoa</span><span>Meta: 4 minutos</span><span>1 conduz + 4 participam</span></div></header>
    <section class="journey-overview" aria-label="As quatro fases"><h3>A história em quatro fases</h3><ol class="journey-strip">${phaseOverviews.map((item,n)=>`<li ${n===index?'aria-current="step"':''}><span class="journey-number">${n+1}</span><strong>${e(phaseScripts[n].name)}</strong><small>${e(item.question)}</small></li>`).join('')}</ol><p class="small">Ordem das telas: esquerda → fundo esquerdo → fundo direito → direita. As fases funcionam independentemente; esta é a sequência sugerida da história.</p></section>
    <section class="phase-quick"><h3><span class="section-step">1</span> O que acontece nesta fase</h3><p><strong>O visitante faz:</strong> ${e(overview.action)}</p><p><strong>Ao concluir:</strong> ${e(overview.result)}</p></section>
    <section class="phase-route"><h3><span class="section-step">2</span> Percurso do visitante</h3><p class="small">Siga as setas. Toque em uma etapa para abrir sua cena detalhada.</p><ol class="route-flow">${overview.steps.map(([title,action],n)=>`<li><button class="route-node" type="button" data-scene-jump="${n}" aria-controls="${suffix}scene-${index}-${n}"><span class="route-number">${n+1}</span><strong>${e(title)}</strong><small>${e(action)}</small><span class="route-time">${e(phase.scenes[n].time)}</span></button></li>`).join('')}</ol><div class="choice-rule"><strong>Como a escolha funciona</strong><span>Escolher uma opção → assistir à cena correspondente → voltar ao percurso → continuar.</span><small>As alternativas se reencontram. O grupo não precisa assistir a todos os caminhos para concluir a fase.</small></div></section>
    <details class="phase-detail scene-script-group" ${print?'open':''}><summary><span class="section-step">3</span> Roteiro detalhado · cenas e locução</summary><p class="small">Cada cena segue a mesma ordem: o que aparece → o que o narrador diz → o que o grupo faz → como o jogo responde. Tempos estimados, incluindo leitura e interação.</p>
    <div class="phase-scenes">${phase.scenes.map((scene,n)=>`<details class="phase-scene" id="${suffix}scene-${index}-${n}" ${print?'open':''}><summary class="scene-heading"><span>${e(scene.id)} · ${e(scene.time)}</span><strong>${n+1}. ${e(scene.title)}</strong></summary><p><strong>Imagem e som</strong>${e(scene.visual)}</p><blockquote><span>Locução proposta</span>${e(scene.voice)}</blockquote><div class="scene-interaction"><p><strong>Ação do grupo</strong>${e(scene.interaction)}</p><p><strong>Resposta do jogo</strong>${e(scene.feedback)}</p></div><p class="scene-production"><strong>Produção</strong>${e(scene.production)}</p></details>`).join('')}</div></details>
    ${phase.environments?`<details class="phase-detail phase-environments" ${print?'open':''}><summary>Ambientes futuros · onde cada atividade acontece</summary><p>Visita ao programa previsto na revista, com priorização dos ambientes culturais no percurso de quatro minutos.</p><dl>${phase.environments.map(([name,description])=>`<dt>${e(name)}</dt><dd>${e(description)}</dd>`).join('')}</dl></details>`:''}
    <details class="phase-detail" ${print?'open':''}><summary><span class="section-step">4</span> Produção · materiais e montagem</summary><p>${e(phase.implementation)}</p><ul>${phase.assets.map(asset=>`<li>${e(asset)}</li>`).join('')}</ul></details>
    <details class="phase-detail" ${print?'open':''}><summary><span class="section-step">5</span> Prompts para gerar os vídeos</summary><p>Aplicar somente após aprovação das referências. Gerar planos separados; montar a fase com locução e legendas externas. Conferir arquitetura, mãos, movimentos e continuidade a cada tomada. As durações abaixo são metas de produção.</p>${phase.prompts.map(([name,prompt])=>`<section class="phase-prompt"><h4>${e(name)}</h4><p>${e(prompt)}</p></section>`).join('')}</details>
    <details class="phase-detail" ${print?'open':''}><summary><span class="section-step">6</span> Guia técnico · plataformas e operação</summary>${productionGuide}</details>
    <details class="phase-detail" ${print?'open':''}><summary><span class="section-step">7</span> Validação histórica e fontes</summary><p>${e(phase.review)}</p><p>${e(phase.pages)}</p><p>Fontes consultadas em 16/09/2026. Conteúdo narrativo e escolhas são propostas criativas; citações literais de entrevistados não foram usadas como falas de personagens.</p><ul class="phase-source-links">${phase.sources.map(source=>`<li>${phaseLink(source)}</li>`).join('')}</ul></details>
  </article>`;
}

const phaseDialog=$('phase-dialog');
const phaseContent=$('phase-content');
let phaseOpener=null;
let openPhaseIndex=0;
function openPhase(index) {
  if (!phaseScripts[index]) return;
  openPhaseIndex=index;
  phaseOpener=document.querySelector(`[data-mission="${index}"]`);
  phaseContent.innerHTML=phaseMarkup(phaseScripts[index],index);
  phaseDialog.setAttribute('aria-labelledby',`phase-title-${index}`);
  if (!phaseDialog.open) phaseDialog.showModal();
  phaseDialog.scrollTop=0;
  $('phase-action-status').textContent='';
  document.body.classList.add('phase-modal-open');
  $('phase-close').focus();
}
phaseContent.addEventListener('click',event=>{
  const button=event.target.closest('[data-scene-jump]');
  if (!button) return;
  const target=document.getElementById(button.getAttribute('aria-controls'));
  if (!target) return;
  phaseContent.querySelector('.scene-script-group').open=true;
  phaseContent.querySelectorAll('.phase-scene').forEach(scene=>{scene.open=scene===target;});
  target.scrollIntoView({block:'start',behavior:'instant'});
  target.querySelector('summary').focus({preventScroll:true});
});
$('phase-close').addEventListener('click',()=>phaseDialog.close());
phaseDialog.addEventListener('close',()=>{document.body.classList.remove('phase-modal-open');phaseOpener?.focus();});
phaseDialog.addEventListener('click',event=>{if(event.target===phaseDialog){const r=phaseDialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)phaseDialog.close();}});
$('phase-download').addEventListener('click',()=>{
  const phase=phaseScripts[openPhaseIndex];
  const copy=document.createElement('div');copy.innerHTML=phaseMarkup(phase,openPhaseIndex,true);
  copy.querySelectorAll('a').forEach(a=>a.textContent+=' ('+a.getAttribute('href')+')');
  copy.querySelectorAll('h2,h3,h4,p,li,dt,dd,blockquote,summary').forEach(node=>node.append('\n\n'));
  download('\ufeff'+copy.textContent,`castelinho-roteiro-tela-${openPhaseIndex+1}.txt`,'text/plain;charset=utf-8');
  $('phase-action-status').textContent='Roteiro preparado para download.';
});
window.addEventListener('beforeprint',()=>{$('phase-print').innerHTML=phaseScripts.map((phase,index)=>phaseMarkup(phase,index,true)).join('');});
window.addEventListener('afterprint',()=>{$('phase-print').replaceChildren();});
