'use strict';
const missionNames = ["Imigração", "Comissão de Terras", "A Cidade", "Castelinho"];
const missions = [
  {title:'Muitas histórias formam uma cidade',text:'Conheça pessoas e trajetórias que participaram da formação de Erechim. O roteiro contextualiza também o território e seus habitantes anteriores ao período apresentado.',place:'Exposição temporária / sala multimídia · revista, pp. 15 e 18.',action:'Ouvir narrativas curtas e associar objetos às histórias documentadas.',learning:'Compreender a diversidade cultural, com curadoria e fontes identificadas.'},
  {title:'O mapa que conta uma história',text:'Encontre um documento, observe seus detalhes e descubra sua relação com o território de Erechim.',place:'Memorial e exposição permanente · revista, p. 15.',action:'Examinar o documento e relacionar uma pista ao mapa.',learning:'Compreender a atuação da Comissão de Terras a partir de fontes históricas.'},
  {title:'Veja Erechim se transformar',text:'Uma fotografia antiga abre uma janela para outro tempo. O jogador reconhece um lugar e acompanha suas transformações.',place:'Ático tecnológico · revista, p. 19.',action:'Comparar imagens e escolher pontos de uma linha do tempo.',learning:'Relacionar a paisagem urbana atual aos processos históricos da cidade.'},
  {title:'Por que preservar?',text:'Encontre registros da restauração e compare passado, intervenção e futuro projetado. Ao final, a história continua com o visitante.',place:'Percurso de restauro e Janela do Tempo · revista, pp. 6 e 19.',action:'Associar um cuidado de preservação ao elemento correspondente.',learning:'Compreender a preservação como responsabilidade coletiva, sem simular uma intervenção técnica real.'}
];

const $ = id => document.getElementById(id);
const storageKey = 'delumo.castelinho.proposta.v2';
const fields = [...document.querySelectorAll('[data-save]')];
const money = new Intl.NumberFormat('pt-BR', {style:'currency', currency:'BRL'});
const count = new Intl.NumberFormat('pt-BR', {maximumFractionDigits:1});
let selectedMission = 0;
let storageHealthy = true;

function selectMission(index) {
  const mission = missions[index];
  if (!mission) return;
  selectedMission = index;
  document.querySelectorAll('[data-mission]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.mission) === index)));
  $('mission-num').textContent = `TELA ${String(index+1).padStart(2,'0')} / 04 · ${missionNames[index].toUpperCase()}`;
  for (const key of ['title','text','place','action','learning']) $('mission-'+key).textContent = mission[key];
}

function capacity() {
  const inputs = [...document.querySelectorAll('[data-capacity]')];
  const valid = inputs.every(input => input.value !== '' && input.validity.valid);
  inputs.forEach(input => input.setAttribute('aria-invalid',String(!input.value || !input.validity.valid)));
  $('capacity-error').textContent = valid ? '' : 'Preencha a duração, troca, horas, dias e fator dentro dos limites indicados.';
  if (!valid) {
    for (const id of ['per-hour','per-day','per-event']) $(id).textContent = '—';
    $('round-result').textContent = 'A estimativa será atualizada com os campos válidos.';
    $('navigator-result').textContent = '';
    return;
  }
  const roundsHour = 60 / (+$('play-time').value + +$('change-time').value) * +$('efficiency').value / 100;
  const roundsDay = Math.floor(roundsHour * +$('hours').value + 1e-8);
  $('per-hour').textContent = count.format(roundsHour * 20);
  $('per-day').textContent = count.format(roundsDay * 20);
  $('per-event').textContent = count.format(roundsDay * 20 * +$('days').value);
  $('navigator-result').textContent = `${count.format(roundsDay*4)} sessões de navegação por dia · ${count.format(roundsDay*16)} participações de acompanhantes.`;
  $('round-result').textContent = `${count.format(roundsDay)} rodadas completas por dia, com 20 pessoas por rodada.`;
}

function budget() {
  const inputs = [...document.querySelectorAll('[data-cost]')];
  let total = 0, filled = 0, invalid = false;
  inputs.forEach(input => {
    const bad = !input.validity.valid;
    input.setAttribute('aria-invalid', String(bad));
    invalid ||= bad;
    if (input.value !== '' && !bad) { total += Number(input.value); filled++; }
  });
  $('budget-error').textContent = invalid ? 'Revise os valores destacados: use valores positivos ou zero, com até duas casas decimais.' : '';
  $('budget-total').textContent = invalid ? 'Revisar campos' : filled ? money.format(total) : 'Nenhum valor informado';
  $('budget-pending').textContent = inputs.length === filled && !invalid ? 'Todos os itens preenchidos · inclui projetores' : `${inputs.length-filled} itens a cotar · soma inclui os projetores preenchidos`;
}

function snapshot() {
  const values = {};
  fields.forEach(input => { values[input.id] = input.type === 'checkbox' ? input.checked : input.value; });
  return {project:'castelinho-vivo', version:4, savedAt:new Date().toISOString(), selectedMission, values};
}

function save(manual = false) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(snapshot()));
    storageHealthy = true;
    $('save-status').textContent = 'Salvo neste navegador · ' + new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});
    $('budget-save-status').textContent = 'Valores e fornecedores salvos neste navegador · ' + new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});
    if (manual) $('action-status').textContent = 'Dados salvos neste navegador. Use “Baixar dados preenchidos” para guardar uma cópia ou abrir em outro aparelho.';
    window.dispatchEvent(new CustomEvent('castelinho:save',{detail:{manual}}));
    return true;
  } catch {
    storageHealthy = false;
    $('save-status').textContent = 'Não foi possível salvar aqui. Baixe uma cópia.';
    $('budget-save-status').textContent = 'Não foi possível salvar neste navegador. Use “Baixar dados preenchidos” para guardar uma cópia.';
    $('action-status').textContent = 'O navegador não permitiu o salvamento. Seus campos continuam na tela: use “Baixar dados preenchidos” para preservá-los.';
    window.dispatchEvent(new CustomEvent('castelinho:save',{detail:{manual}}));
    return false;
  }
}

function validateSaved(data) {
  if (!data || data.project !== 'castelinho-vivo' || ![2,3,4].includes(data.version) || !data.values || typeof data.values !== 'object' || Array.isArray(data.values)) throw Error('Este arquivo não é uma cópia compatível da proposta Castelinho Vivo.');
  const clean = {};
  fields.forEach(input => {
    if (!Object.hasOwn(data.values,input.id)) {
      // Retain surviving legacy fields; newly added budget fields start empty.
      if (data.version === 2 && (input.id === 'cost-projectors' || input.id.startsWith('supplier-'))) {
        clean[input.id] = ''; return;
      }
      throw Error('Arquivo incompleto: faltam campos da proposta.');
    }
    const value = data.values[input.id];
    if (input.type === 'checkbox') {
      if (typeof value !== 'boolean') throw Error('Arquivo com marcação inválida.');
    } else {
      if (typeof value !== 'string' || value.length > (input.maxLength > 0 ? input.maxLength : 100)) throw Error('Arquivo com campo inválido ou muito longo.');
      if (value && (input.type === 'date' || input.type === 'datetime-local')) {
        if (!(input.type === 'date' ? /^\d{4}-\d{2}-\d{2}$/ : /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/).test(value)) throw Error('Arquivo com data inválida.');
      }
      if (value && input.type === 'number' && (!Number.isFinite(Number(value)) || Math.abs(Number(value))>1e15)) throw Error('Arquivo com número inválido.');
      if (value && ['date','datetime-local'].includes(input.type)) {
        const probe = document.createElement('input');
        probe.type = input.type; probe.value = value;
        if (probe.value !== value) throw Error('Arquivo com data inválida.');
      }
    }
    clean[input.id] = value;
  });
  return {values:clean,selectedMission:data.version < 4 ? ({0:1,3:0,4:2,6:3}[data.selectedMission] ?? 0) : Number.isInteger(data.selectedMission) && data.selectedMission >= 0 && data.selectedMission < missions.length ? data.selectedMission : 0};
}

function applySaved(data) {
  const checked = validateSaved(data);
  fields.forEach(input => {
    if (input.type === 'checkbox') input.checked = checked.values[input.id];
    else input.value = checked.values[input.id];
  });
  selectMission(checked.selectedMission);
  capacity(); budget();
}

function download(text, filename, type) {
  const url = URL.createObjectURL(new Blob([text],{type}));
  const link = document.createElement('a');
  link.href = url; link.download = filename;
  document.body.append(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

fields.forEach(input => {
  const update = () => { capacity(); budget(); save(); };
  input.addEventListener('input',update);
  input.addEventListener('change',update);
});
document.querySelectorAll('[data-mission]').forEach(button => button.addEventListener('click',() => {selectMission(Number(button.dataset.mission));save();}));
for (const id of ['save-top','save-bottom']) $(id).addEventListener('click',() => save(true));
$('save-budget').addEventListener('click',() => save(true));
for (const id of ['print','print-bottom']) $(id).addEventListener('click',() => window.print());
$('section-nav').addEventListener('change',event => {
  const target = $(event.target.value);
  if (target) { target.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}); history.replaceState(null,'','#'+target.id); }
});
$('export-data').addEventListener('click',() => {
  download(JSON.stringify(snapshot(),null,2),'castelinho-vivo-dados.json','application/json;charset=utf-8');
  $('action-status').textContent = 'Cópia preparada para download. Guarde o arquivo e use “Abrir dados salvos” para continuar em outro aparelho.';
});
$('import-data').addEventListener('change',async event => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    if (file.size > 100000) throw Error('Arquivo maior que o esperado. Selecione a cópia JSON baixada nesta proposta.');
    const data = JSON.parse(await file.text());
    applySaved(data);
    if (save()) $('action-status').textContent = 'Dados abertos e salvos neste navegador. Datas, valores, observações e marcações foram restaurados.';
  } catch (error) {
    $('action-status').textContent = error instanceof SyntaxError ? 'O arquivo não é um JSON válido. Os campos atuais foram preservados.' : error.message + ' Os campos atuais foram preservados.';
  }
  event.target.value = '';
});
$('download-summary').addEventListener('click',() => {
  const lines = ['CASTELINHO VIVO · FRINAPE 2026','Estande: 8 × 4 m · quatro projeções de 3 × 2 m','Telas da esquerda para a direita: 1. Imigração; 2. Comissão de Terras; 3. A Cidade; 4. Castelinho','Quatro grupos de cinco pessoas; um navegador por grupo.','Evento: 12 a 22 de novembro de 2026',''];
  fields.forEach(input => {
    const label = input.getAttribute('aria-label') || [...(input.labels || [])].map(label => label.textContent.trim()).join(' ') || input.id;
    const row = input.closest('.schedule-row');
    const prefix = row ? row.querySelector('h3').textContent + ' · ' : '';
    lines.push(prefix+label+': '+(input.type === 'checkbox' ? input.checked?'Sim':'Não' : input.value || 'A definir'));
  });
  lines.push('', 'Subtotal dos valores preenchidos: '+$('budget-total').textContent, $('budget-pending').textContent, '', 'ESTIMATIVA DE ATENDIMENTO', $('round-result').textContent,$('navigator-result').textContent,'Participações no período: '+$('per-event').textContent,'','Registro de preparação. Não constitui assinatura ou aprovação institucional.');
  download('\ufeff'+lines.join('\n'),'castelinho-vivo-resumo.txt','text/plain;charset=utf-8');
  $('action-status').textContent = 'Resumo preparado para download com os dados atuais.';
});

// Read a single versioned draft; unrelated site storage remains untouched.
try {
  const saved = localStorage.getItem(storageKey);
  if (saved) {
    applySaved(JSON.parse(saved));
    $('save-status').textContent = 'Dados salvos restaurados neste navegador';
    $('budget-save-status').textContent = 'Orçamento salvo restaurado neste navegador.';
  }
} catch {
  $('save-status').textContent = 'Não foi possível recuperar a cópia local. Use seu arquivo salvo.';
}
selectMission(selectedMission);capacity();budget();
function preparePrint() {
  document.querySelectorAll('.print-value').forEach(element => element.remove());
  fields.forEach(input => {
    if (input.type === 'checkbox') return;
    const value = document.createElement('div');
    value.className = 'print-value';
    value.textContent = input.value || 'A definir';
    input.insertAdjacentElement('afterend',value);
  });
}
window.addEventListener('beforeprint',preparePrint);
window.addEventListener('afterprint',() => document.querySelectorAll('.print-value').forEach(element => element.remove()));
// Edits are persisted immediately; pagehide must not mark an untouched draft as edited.
window.addEventListener('beforeunload',event => {
  if (!storageHealthy) {event.preventDefault();event.returnValue='';}
});
