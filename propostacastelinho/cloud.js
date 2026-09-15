(() => {
  'use strict';
  const metaKey = 'delumo.castelinho.cloud.v1';
  const fingerprint = data => JSON.stringify({values:data.values,selectedMission:data.selectedMission});
  let meta = {}, ready = false, dirty = false, busy = false, timer, conflict = false;
  let remoteCandidate = null;
  try {meta = JSON.parse(localStorage.getItem(metaKey) || '{}');} catch {}
  let baseline = meta.fingerprint || '';
  let revision = Number.isSafeInteger(meta.revision) ? meta.revision : 0;
  const status = (text, synced = false) => {
    $('cloud-status').textContent = text;
    $('save-status').textContent = text;
    $('budget-save-status').textContent = text;
    $('cloud-status').dataset.synced = String(synced);
  };
  const remember = data => {
    baseline = fingerprint(data);
    try {localStorage.setItem(metaKey,JSON.stringify({revision,fingerprint:baseline}));} catch {}
  };
  async function request(method = 'GET', data, action = 'project') {
    const response = await fetch('/api/castelinho?action='+action, {method,credentials:'omit',cache:'no-store',headers:data ? {'Content-Type':'application/json'} : {},body:data ? JSON.stringify(data) : undefined,signal:AbortSignal.timeout(15000)});
    const result = await response.json();
    if (!response.ok) {const error = Error(result.error || 'Falha ao sincronizar.');error.status=response.status;throw error;}
    return result;
  }
  function showConflict(remote) {
    conflict = true;remoteCandidate = remote;
    $('cloud-conflict').hidden = false;
    $('cloud-version').textContent = `Versão online ${remote.revision} · salva em ${new Date(remote.savedAt).toLocaleString('pt-BR')}. Seus campos continuam na tela.`;
    status('Há versões diferentes. Escolha qual continuar abaixo; o envio automático está pausado.');
  }
  function applyRemote(remote) {
    applySaved(remote.data);
    // Persist without dispatching an edit event or marking restored data as new.
    try {localStorage.setItem(storageKey,JSON.stringify(snapshot()));} catch {storageHealthy=false;}
    revision=remote.revision;remember(remote.data);
    capacity();budget();
    status('Dados online restaurados · versão '+revision, true);
  }
  async function load() {
    if (busy) return;
    ready=false;
    try {
      const before=fingerprint(snapshot());
      const remote=await request();
      conflict=false;remoteCandidate=null;$('cloud-conflict').hidden=true;
      if (remote.data) {
        validateSaved(remote.data);
        const current=fingerprint(snapshot());
        const hasLocal=Boolean(localStorage.getItem(storageKey));
        if (current === fingerprint(remote.data)) {revision=remote.revision;remember(remote.data);status('Dados sincronizados · versão '+revision,true);}
        else if (current !== before || (hasLocal && current !== baseline)) showConflict(remote);
        else applyRemote(remote);
      } else {revision=0;status('Banco conectado. Clique em Salvar para guardar o primeiro preenchimento.');}
      ready=true;
      if (dirty && !conflict && fingerprint(snapshot()) !== baseline) timer=setTimeout(sync,900);
    } catch {status('Não foi possível carregar o banco. Cópia local preservada; use Reconectar.');}
  }
  async function sync() {
    clearTimeout(timer);
    if (!ready) {status('Reconecte ao banco antes de salvar online. Cópia local mantida.');return;}
    if (busy || conflict) return;
    if (fingerprint(snapshot()) === baseline) {status('Dados sincronizados · versão '+revision,true);return;}
    const data=snapshot();busy=true;
    status('Salvando no banco…');
    try {
      const saved=await request('PUT',{revision,data});
      revision=saved.revision;remember(data);
      status('Salvo online · '+new Date(saved.savedAt).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}),true);
      if (fingerprint(snapshot()) !== baseline) timer=setTimeout(sync,900);
    } catch (error) {
      if (error.status === 409) {
        conflict=true;
        try {showConflict(await request());} catch {status('Versão online mudou. Reconecte para comparar; cópia local preservada.');}
      } else status('Pendente de envio: cópia local mantida. Clique em Salvar para tentar novamente.');
    } finally {busy=false;}
  }
  window.addEventListener('castelinho:save', event => {
    dirty=true;
    status('Cópia local salva · aguardando envio ao banco');
    clearTimeout(timer);
    if (event.detail.manual) sync();else timer=setTimeout(sync,900);
  });
  $('cloud-reconnect').addEventListener('click',load);
  $('cloud-use-remote').addEventListener('click',() => {
    if (!remoteCandidate) return;
    download(JSON.stringify(snapshot(),null,2),'castelinho-antes-de-carregar-online.json','application/json');
    applyRemote(remoteCandidate);conflict=false;$('cloud-conflict').hidden=true;
  });
  $('cloud-use-local').addEventListener('click',() => {
    if (!remoteCandidate) return;
    revision=remoteCandidate.revision;conflict=false;$('cloud-conflict').hidden=true;
    sync();
  });
  window.addEventListener('online',() => {if (ready && !conflict) sync();else if (!ready) load();});
  window.addEventListener('beforeunload', event => {
    if (dirty && fingerprint(snapshot()) !== baseline) {event.preventDefault();event.returnValue='';}
  });
  load();
})();
