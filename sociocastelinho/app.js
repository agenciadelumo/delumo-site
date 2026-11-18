(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var DATA = window.CASTELINHO_FOTOS || { lista: [] };

  // Menu do celular e tablet
  var toggle = $(".menu-toggle"), menu = $("#menu");
  if (toggle && menu) {
    var setMenu = function (open) {
      menu.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    };
    toggle.addEventListener("click", function () { setMenu(!menu.classList.contains("open")); });
    $$("a", menu).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && menu.classList.contains("open")) { setMenu(false); toggle.focus(); } });
    document.addEventListener("click", function (e) { if (menu.classList.contains("open") && !menu.contains(e.target) && !toggle.contains(e.target)) setMenu(false); });
  }

  // Botão fixo do celular: some quando o formulário ou o topo já mostram a chamada
  var mcta = $(".mcta"), alvo = $("#seja-socio"), heroCta = $(".hero .cta-row");
  if (mcta && "IntersectionObserver" in window) {
    var vis = {};
    var mo = new IntersectionObserver(function (es) {
      es.forEach(function (e) { vis[e.target === alvo ? "form" : "hero"] = e.isIntersecting; });
      mcta.classList.toggle("off", !!(vis.form || vis.hero));
    });
    if (alvo) mo.observe(alvo);
    if (heroCta) mo.observe(heroCta);
  }

  // Revelar ao rolar
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    $$(".rv").forEach(function (el) { io.observe(el); });
  } else $$(".rv").forEach(function (el) { el.classList.add("in"); });

  // Abas que acompanham a rolagem
  var tabs = $$(".tabs a");
  if (tabs.length && "IntersectionObserver" in window) {
    var map = {};
    tabs.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
    var so = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        tabs.forEach(function (a) { a.classList.remove("on"); });
        var a = map[e.target.id];
        if (a) {
          a.classList.add("on");
          // Rola só a barra de abas na horizontal; nunca a página (scrollIntoView puxava a página de volta).
          var bar = a.parentNode, alvoX = a.offsetLeft - (bar.clientWidth - a.offsetWidth) / 2;
          if (Math.abs(bar.scrollLeft - alvoX) > 4) bar.scrollTo({ left: Math.max(0, alvoX), behavior: "auto" });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(map).forEach(function (id) { var s = document.getElementById(id); if (s) so.observe(s); });
  }

  // Progresso da obra (tempo decorrido do prazo de 24 meses)
  var inicio = new Date(2026, 4, 27), fim = new Date(2028, 4, 27), hoje = new Date();
  var pct = Math.max(0, Math.min(100, Math.round(((hoje - inicio) / (fim - inicio)) * 100)));
  var ring = $("#ring"), fill = $("#barFill");
  if (ring) {
    var go = function () {
      var t0 = null;
      var step = function (t) {
        t0 = t0 || t;
        var k = Math.min(1, (t - t0) / 1400), v = Math.round(pct * (1 - Math.pow(1 - k, 3)));
        ring.style.setProperty("--p", v);
        $("#ringPct").textContent = v + "%";
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      if (fill) fill.style.width = pct + "%";
    };
    if ("IntersectionObserver" in window) {
      var ro = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { go(); ro.disconnect(); } }, { threshold: 0.4 });
      ro.observe(ring);
    } else go();
    var today = $("#barToday");
    if (today) today.textContent = "Hoje · " + pct + "% do prazo";
  }

  // Janela do Tempo (1915 · 2026 · 2028)
  var janela = $("#janela");
  if (janela) {
    var jImgs = $$(".janela-vidro img", janela), jBtns = $$(".janela-anos button", janela), jTimer;
    var jShow = function (i) {
      jImgs.forEach(function (im, k) { im.classList.toggle("on", k === i); });
      jBtns.forEach(function (b, k) { b.setAttribute("aria-pressed", k === i ? "true" : "false"); });
      $("#janelaSelo").textContent = jImgs[i].getAttribute("data-selo");
      $("#janelaLeg").textContent = jImgs[i].getAttribute("data-leg");
    };
    jBtns.forEach(function (b, i) { b.addEventListener("click", function () { jParado = true; clearInterval(jTimer); jCur = i; jShow(i); }); });
    var jCur = 0, jParado = false;
    var jPlay = function () {
      clearInterval(jTimer);
      if (jParado || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      jTimer = setInterval(function () { jCur = (jCur + 1) % jImgs.length; jShow(jCur); }, 4200);
    };
    // Só troca as fotos enquanto a janela está na tela.
    if ("IntersectionObserver" in window)
      new IntersectionObserver(function (es) { if (es[0].isIntersecting) jPlay(); else clearInterval(jTimer); }, { threshold: 0.3 }).observe(janela);
    janela.addEventListener("pointerenter", function () { jParado = true; clearInterval(jTimer); });
  }

  // Lightbox
  var lb = $("#lb"), lbList = [], lbI = 0;
  function lbShow(i) {
    lbI = (i + lbList.length) % lbList.length;
    var it = lbList[lbI];
    $("img", lb).src = it.full;
    $("img", lb).alt = it.cap;
    $("p", lb).textContent = it.cap + "  ·  " + (lbI + 1) + "/" + lbList.length;
  }
  function lbOpen(list, i) {
    if (!lb) return;
    lbList = list; lbShow(i);
    lb.classList.add("open");
    document.body.style.overflow = "hidden";
    $(".x", lb).focus();
  }
  function lbClose() { lb.classList.remove("open"); document.body.style.overflow = ""; }
  if (lb) {
    $(".x", lb).onclick = lbClose;
    $(".p", lb).onclick = function () { lbShow(lbI - 1); };
    $(".n", lb).onclick = function () { lbShow(lbI + 1); };
    lb.addEventListener("click", function (e) { if (e.target === lb) lbClose(); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") lbClose();
      if (e.key === "ArrowLeft") lbShow(lbI - 1);
      if (e.key === "ArrowRight") lbShow(lbI + 1);
    });
  }
  // Figuras isoladas com data-lb
  var solos = $$("[data-lb]");
  var soloList = solos.map(function (f) { return { full: f.getAttribute("data-lb"), cap: f.getAttribute("data-cap") || "" }; });
  solos.forEach(function (f, i) {
    f.tabIndex = 0;
    f.setAttribute("role", "button");
    f.addEventListener("click", function () { lbOpen(soloList, i); });
    f.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); lbOpen(soloList, i); } });
  });

  // Galeria da página inicial (slider)
  var thumbs = $("#thumbs");
  if (thumbs) {
    var escolha = ["antes-03", "antes-01", "antes-04", "durante-01", "durante-02", "registros-01", "antes-12", "registros-09", "durante-05", "antes-06", "durante-03"];
    var fotos = escolha.map(function (id) { return DATA.lista.filter(function (f) { return f.id === id; })[0]; }).filter(Boolean);
    var cur = 0, img = $("#mediaImg"), cap = $("#mediaCap");
    fotos.forEach(function (f, i) {
      var b = document.createElement("button");
      b.type = "button"; b.setAttribute("role", "tab"); b.setAttribute("aria-label", f.cap);
      b.innerHTML = '<img src="' + f.thumb + '" alt="" loading="lazy">';
      b.onclick = function () { show(i); };
      thumbs.appendChild(b);
    });
    var show = function (i) {
      cur = (i + fotos.length) % fotos.length;
      var f = fotos[cur];
      img.style.opacity = 0.2;
      var pre = new Image();
      pre.onload = function () { img.src = f.full; img.alt = f.cap; img.style.opacity = 1; };
      pre.src = f.full;
      cap.textContent = f.cap + " · " + f.catNome;
      $$("button", thumbs).forEach(function (b, k) { b.classList.toggle("on", k === cur); b.setAttribute("aria-selected", k === cur); });
    };
    $(".media-nav.prev").onclick = function () { show(cur - 1); };
    $(".media-nav.next").onclick = function () { show(cur + 1); };
    img.style.cursor = "zoom-in";
    img.onclick = function () { lbOpen(fotos, cur); };
    show(0);
  }

  // Galeria completa (página Evolução da obra)
  var grid = $("#masonry"), filt = $("#filters");
  if (grid && filt) {
    var atual = "todas";
    var render = function () {
      var lista = DATA.lista.filter(function (f) { return atual === "todas" || f.cat === atual; });
      grid.innerHTML = "";
      lista.forEach(function (f, i) {
        var fig = document.createElement("figure");
        fig.tabIndex = 0; fig.setAttribute("role", "button"); fig.setAttribute("aria-label", "Ampliar: " + f.cap);
        fig.innerHTML = '<img src="' + f.thumb + '" width="' + f.w + '" height="' + f.h + '" alt="' + f.cap.replace(/"/g, "&quot;") + '" loading="lazy"><figcaption>' + f.catNome + "</figcaption>";
        fig.onclick = function () { lbOpen(lista, i); };
        fig.onkeydown = function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); lbOpen(lista, i); } };
        grid.appendChild(fig);
      });
    };
    var cats = [["todas", "Todas"]].concat(Object.keys(DATA.categorias).map(function (k) { return [k, DATA.categorias[k]]; }));
    cats.forEach(function (c) {
      var n = c[0] === "todas" ? DATA.lista.length : DATA.lista.filter(function (f) { return f.cat === c[0]; }).length;
      var b = document.createElement("button");
      b.type = "button"; b.setAttribute("aria-pressed", c[0] === atual);
      b.innerHTML = c[1] + "<small>" + n + "</small>";
      b.onclick = function () {
        atual = c[0];
        $$("button", filt).forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
        b.setAttribute("aria-pressed", "true");
        render();
      };
      filt.appendChild(b);
    });
    render();
  }

  // Formulário de captação
  var form = $("#leadForm");
  if (form) {
    var msg = $("#formMsg"), btn = $("#sendBtn");
    var whats = $("#f-whats");
    whats.addEventListener("input", function () {
      var d = whats.value.replace(/\D/g, "").slice(0, 11);
      if (d.length > 6) whats.value = "(" + d.slice(0, 2) + ") " + d.slice(2, d.length - 4) + "-" + d.slice(-4);
      else if (d.length > 2) whats.value = "(" + d.slice(0, 2) + ") " + d.slice(2);
      else whats.value = d;
    });
    // Pré-seleção vinda de links (?quero=voluntario)
    var q = new URLSearchParams(location.search).get("quero");
    if (q) $$('input[name="interesse"]', form).forEach(function (c) { c.checked = c.value === q; });

    var erro = function (texto, campo) {
      msg.className = "form-msg err"; msg.textContent = texto;
      if (campo) { campo.setAttribute("aria-invalid", "true"); campo.focus(); }
    };
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      $$("[aria-invalid]", form).forEach(function (x) { x.removeAttribute("aria-invalid"); });
      var dados = {
        nome: form.nome.value.trim(),
        whatsapp: form.whatsapp.value.trim(),
        email: form.email.value.trim(),
        cidade: form.cidade.value.trim(),
        mensagem: form.mensagem.value.trim(),
        website: form.website.value,
        interesse: $$('input[name="interesse"]:checked', form).map(function (c) { return c.value; }),
        consentimento: form.consentimento.checked,
        origem: (new URLSearchParams(location.search).get("utm_source") || document.referrer || "direto").slice(0, 120),
      };
      if (!dados.interesse.length) return erro("Escolha pelo menos uma forma de participar.");
      if (dados.nome.length < 3) return erro("Informe seu nome completo.", form.nome);
      if (dados.whatsapp.replace(/\D/g, "").length < 10) return erro("Informe um WhatsApp com DDD.", form.whatsapp);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(dados.email)) return erro("Informe um e-mail válido.", form.email);
      if (!dados.consentimento) return erro("Marque a autorização de contato para continuar.", form.consentimento);

      // WhatsApp da Associação: abre a conversa já com os dados preenchidos.
      var nomes = { socio: "sócio(a)", voluntario: "voluntário(a)", colaborar: "colaborador(a)" };
      var texto = "Olá! Quero fazer parte da Associação dos Amigos do Castelinho.\n" +
        "Nome: " + dados.nome + "\n" +
        "Como quero participar: " + dados.interesse.map(function (i) { return nomes[i]; }).join(", ") + "\n" +
        "WhatsApp: " + dados.whatsapp + "\n" +
        "E-mail: " + dados.email + (dados.cidade ? "\nCidade: " + dados.cidade : "") +
        (dados.mensagem ? "\nMensagem: " + dados.mensagem : "");
      var waUrl = "https://wa.me/555496747864?text=" + encodeURIComponent(texto);
      // A janela abre agora, no clique, para o navegador não bloquear; o endereço entra depois do envio.
      var waWin = window.open("", "_blank");
      var waAberto = false;
      var abrirWa = function () {
        if (waAberto) return; waAberto = true;
        if (waWin && !waWin.closed) { try { waWin.opener = null; } catch (e) {} waWin.location.href = waUrl; }
        else window.location.href = waUrl;
      };

      btn.disabled = true; btn.textContent = "Enviando…";
      msg.className = "form-msg";
      fetch("/api/socio-castelinho", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, j: j }; }); })
        .then(function (r) {
          abrirWa();
          if (!r.ok) throw new Error(r.j.error || "Não foi possível enviar agora.");
          var primeiro = dados.nome.split(" ")[0];
          $("#formBox").innerHTML =
            '<div class="success"><img src="/sociocastelinho/img/selo.webp" alt="Selo Sou amigo do Castelinho">' +
            "<h3>Bem-vindo(a), " + primeiro.replace(/[<>&"]/g, "") + "!</h3>" +
            '<p class="muted">Recebemos seu cadastro e abrimos a conversa com a Associação no WhatsApp. É só tocar em enviar. Essa história também é sua.</p>' +
            '<p><a class="btn red" href="' + waUrl.replace(/"/g, "&quot;") + '" target="_blank" rel="noopener">Abrir WhatsApp (54) 9674-7864</a></p>' +
            '<div class="cta-row" style="justify-content:center"><a class="btn" href="https://castelinho.delumo.com.br" target="_blank" rel="noopener">Jogar Castelinho Vivo</a>' +
            '<a class="btn ghost" href="https://www.instagram.com/amigosdocastelinhoerechim/" target="_blank" rel="noopener">Seguir no Instagram</a></div></div>';
          if (window.gtag) window.gtag("event", "generate_lead", { form: "socio_castelinho" });
        })
        .catch(function (err) {
          abrirWa();
          erro(err.message + " Abrimos o WhatsApp da Associação (54) 9674-7864 com seus dados: é só enviar a mensagem.");
          btn.disabled = false; btn.textContent = "Quero fazer parte dessa história";
        });
    });
  }
})();
