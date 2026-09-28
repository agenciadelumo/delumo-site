(() => {
  "use strict";
  const metaKey = "delumo.castelinho.orcamento.cloud.v1";
  const fingerprint = (data) =>
    JSON.stringify({
      values: Object.fromEntries(
        Object.keys(data.values)
          .sort()
          .map((key) => [key, data.values[key]]),
      ),
      selectedMission: data.selectedMission,
    });
  let meta = {};
  try {
    meta = JSON.parse(localStorage.getItem(metaKey) || "{}");
  } catch {}
  let revision = Number.isSafeInteger(meta.revision) ? meta.revision : 0;
  let baseline = meta.fingerprint || "";
  let ready = false;
  let dirty = false;
  let busy = false;
  let timer;

  function status(text, synced = false) {
    setText("save-status", text);
    setText("budget-save-status", text);
    const saveStatus = $("save-status");
    if (saveStatus) saveStatus.dataset.synced = String(synced);
  }

  function remember(data) {
    baseline = fingerprint(data);
    try {
      localStorage.setItem(
        metaKey,
        JSON.stringify({ revision, fingerprint: baseline }),
      );
    } catch {}
  }

  async function request(method = "GET", data) {
    const response = await fetch("/api/castelinho?action=budget", {
      method,
      credentials: "omit",
      cache: "no-store",
      headers: data ? { "Content-Type": "application/json" } : {},
      body: data ? JSON.stringify(data) : undefined,
      signal: AbortSignal.timeout(15000),
    });
    const result = await response.json();
    if (!response.ok) {
      const error = Error(result.error || "Falha ao sincronizar.");
      error.status = response.status;
      throw error;
    }
    return result;
  }

  function applyRemote(remote) {
    applySaved(remote.data);
    try {
      localStorage.setItem(storageKey, JSON.stringify(snapshot()));
    } catch {
      storageHealthy = false;
    }
    revision = remote.revision;
    remember(snapshot());
    status(`Dados online restaurados · versão ${revision}`, true);
  }

  async function load() {
    if (busy) return;
    try {
      const before = fingerprint(snapshot());
      const remote = await request();
      revision = remote.revision;
      if (remote.data && !dirty && fingerprint(snapshot()) === before)
        applyRemote(remote);
      else if (remote.data) {
        const checked = validateSaved(remote.data);
        baseline = fingerprint(checked);
        status("Há alterações locais prontas para salvar online.");
      } else {
        baseline = "";
        status("Pronto para salvar online, sem necessidade de login.");
      }
      ready = true;
      if (dirty && fingerprint(snapshot()) !== baseline) sync();
    } catch {
      status("Sem conexão com o banco. A cópia local continua disponível.");
    }
  }

  async function sync(attempt = 0) {
    clearTimeout(timer);
    if (!ready) {
      status("Conectando para salvar online…");
      await load();
      return;
    }
    if (busy) return;
    const data = snapshot();
    if (fingerprint(data) === baseline) {
      dirty = false;
      status(`Dados sincronizados · versão ${revision}`, true);
      return;
    }
    busy = true;
    status("Salvando online…");
    try {
      const saved = await request("PUT", { revision, data });
      revision = saved.revision;
      remember(data);
      dirty = fingerprint(snapshot()) !== baseline;
      status(
        `Salvo online · ${new Date(saved.savedAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`,
        true,
      );
      if (dirty) timer = setTimeout(sync, 700);
    } catch (error) {
      if (error.status === 409 && attempt < 1) {
        try {
          const latest = await request();
          revision = latest.revision;
          if (latest.data) baseline = fingerprint(validateSaved(latest.data));
          busy = false;
          await sync(attempt + 1);
          return;
        } catch {}
      }
      status(
        "Envio pendente. A cópia local foi mantida; clique em Salvar para tentar novamente.",
      );
    } finally {
      busy = false;
    }
  }

  window.addEventListener("castelinho:save", (event) => {
    dirty = true;
    status("Cópia local salva · aguardando envio online");
    clearTimeout(timer);
    if (event.detail.manual) sync();
    else timer = setTimeout(sync, 700);
  });
  window.addEventListener("online", () => sync());
  window.addEventListener("beforeunload", (event) => {
    if (dirty && fingerprint(snapshot()) !== baseline) {
      event.preventDefault();
      event.returnValue = "";
    }
  });
  load();
})();
