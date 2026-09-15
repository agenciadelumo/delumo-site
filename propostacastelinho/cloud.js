(() => {
  'use strict';
  const metaKey = 'delumo.castelinho.cloud.v1';
  const fingerprint = data => JSON.stringify({values:data.values,selectedMission:data.selectedMission});
  let meta = {}, ready = false, authenticated = false, busy = false, timer, conflict = false;
  let remoteCandidate = null;
  try {meta = JSON.parse(localStorage.getItem(metaKey) || '{}');} catch {}
  let baseline = meta.fingerprint || '';
  let revision = Number.isSafeInteger(meta.revision) ? meta.revision : 0;
  const status = (text, synced = false) => {
    $('cloud-status').textContent = text;
    if (authenticated) {
      $('save-status').textContent = text;
      $('budget-save-status').textContent = text;
    }
    $('cloud-status').dataset.synced = String(synced);
  };
  const remember = data => {
    baseline = fingerprint(data);
    try {localStorage.setItem(metaKey,JSON.stringify({revision,fingerprint:baseline}));} catch {}
  };
  async function request(method = 'GET', data, action = 'project') {
    const response = await fetch('/api/castelinho?action='+action, {method,credentials:'same-origin',cache:'no-store',headers:data ? {'Content-Type':'application/json'} : {},body:data ? JSON.stringify(data) : undefined,signal:AbortSignal.timeout(15000)});
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
    } catch {status('Não foi possível carregar o banco. Cópia local preservada; use Reconectar.');}
  }
  async function sync() {
    clearTimeout(timer);
    if (!authenticated) return;
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
      } else if (error.status === 401) {
        authenticated=false;ready=false;
        $('cloud-login').hidden=false;$('cloud-connected').hidden=true;
        status('A sessão expirou. Entre novamente; suas alterações locais foram mantidas.');
        $('save-status').textContent='Cópia local salva · acesso online expirado';
      } else status('Pendente de envio: cópia local mantida. Clique em Salvar para tentar novamente.');
    } finally {busy=false;}
  }
  window.addEventListener('castelinho:save', event => {
    if (!authenticated) return;
    status('Cópia local salva · aguardando envio ao banco');
    clearTimeout(timer);
    if (event.detail.manual) sync();else timer=setTimeout(sync,900);
  });
  $('cloud-login').addEventListener('submit',async event => {
    event.preventDefault();
    const button=$('cloud-enter');button.disabled=true;
    try {
      await request('POST',{key:$('cloud-key').value},'login');
      $('cloud-key').value='';authenticated=true;
      $('cloud-login').hidden=true;$('cloud-connected').hidden=false;
      await load();
    } catch (error) {status(error.message || 'Não foi possível entrar.');}
    finally {button.disabled=false;}
  });
  $('cloud-reconnect').addEventListener('click',load);
  $('cloud-logout').addEventListener('click',async () => {
    clearTimeout(timer);
    if (busy) {status('Aguarde o salvamento terminar antes de sair.');return;}
    try {
      await request('DELETE',undefined,'login');
      authenticated=false;ready=false;
      $('cloud-login').hidden=false;$('cloud-connected').hidden=true;$('cloud-conflict').hidden=true;
      status('Acesso online encerrado. A cópia deste navegador foi mantida.');
      $('save-status').textContent='Cópia local disponível · acesso online encerrado';
      $('budget-save-status').textContent='Cópia local disponível · acesso online encerrado';
    } catch {status('Não foi possível encerrar a sessão; tente novamente.');}
  });
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
  window.addEventListener('online',() => {if (authenticated && ready && !conflict) sync();});
  window.addEventListener('beforeunload', event => {
    if (authenticated && fingerprint(snapshot()) !== baseline) {event.preventDefault();event.returnValue='';}
  });
  (async () => {
    try {
      const state=await request('GET',undefined,'status');
      if (!state.configured) {status('Salvamento online aguardando a conexão do banco. Os campos continuam salvos neste navegador.');return;}
      authenticated=state.authenticated;
      $('cloud-login').hidden=authenticated;$('cloud-connected').hidden=!authenticated;
      if (authenticated) await load();else status('Entre para carregar e salvar a mesma proposta em diferentes aparelhos.');
    } catch {status('Salvamento online indisponível agora. A cópia local continua funcionando.');}
  })();
})();
