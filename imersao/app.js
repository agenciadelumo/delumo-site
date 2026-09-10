(() => {
  'use strict';
  const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
  const panels = Array.from(document.querySelectorAll('[role="tabpanel"]'));
  const firstPanel = 'sala-completa';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function activate(id, {focusTab = false, scroll = false, updateUrl = true} = {}) {
    if (!panels.some(panel => panel.id === id)) id = firstPanel;
    panels.forEach(panel => {
      panel.hidden = panel.id !== id;
      if (panel.hidden) {
        panel.querySelectorAll('video').forEach(video => video.pause());
      }
    });
    tabs.forEach(tab => {
      const selected = tab.dataset.panel === id;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      if (selected && focusTab) tab.focus({preventScroll:true});
    });
    document.title = `${id === firstPanel ? 'Estrutura e tecnologia' : 'Conteúdo imersivo'} · CIT Frinape 2026 | Delumo`;
    if (updateUrl && window.location.hash !== `#${id}`) history.pushState({proposal:id}, '', `#${id}`);
    if (scroll) document.getElementById('conteudo').scrollIntoView({behavior:reducedMotion.matches ? 'instant' : 'smooth', block:'start'});
  }

  function applyHash() {
    const hash = window.location.hash.slice(1);
    if (hash === 'top') return;
    const id = hash === 'video-imersivo' || hash.startsWith('p2-') ? 'video-imersivo' : firstPanel;
    activate(id, {updateUrl:false});
    const target = hash.startsWith('p1-') || hash.startsWith('p2-') ? document.getElementById(hash) : null;
    if (target) target.scrollIntoView({block:'start'});
  }

  tabs.forEach((tab,index) => {
    tab.addEventListener('click',() => activate(tab.dataset.panel,{scroll:true}));
    tab.addEventListener('keydown',event => {
      let nextIndex;
      if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = tabs.length - 1;
      if (nextIndex === undefined) return;
      event.preventDefault();
      activate(tabs[nextIndex].dataset.panel,{focusTab:true,scroll:true});
    });
  });
  document.querySelectorAll('[data-switch]').forEach(button => {
    button.addEventListener('click',() => activate(button.dataset.switch,{focusTab:true,scroll:true}));
  });
  window.addEventListener('hashchange',applyHash);
  window.addEventListener('popstate',applyHash);
  document.getElementById('print-proposal').addEventListener('click',() => window.print());
  const footer = document.querySelector('.site-footer');
  const motionButton = document.getElementById('footer-motion');
  motionButton.addEventListener('click', () => {
    const paused = footer.dataset.motion !== 'paused';
    footer.dataset.motion = paused ? 'paused' : 'running';
    motionButton.setAttribute('aria-pressed', String(paused));
    motionButton.setAttribute('aria-label', paused ? 'Ativar animação do logotipo' : 'Pausar animação do logotipo');
    motionButton.textContent = paused ? 'Ativar animação' : 'Pausar animação';
  });
  let openedForPrint = [];
  window.addEventListener('beforeprint',() => {
    openedForPrint = Array.from(document.querySelectorAll('.proposal-panel:not([hidden]) details:not([open])'));
    openedForPrint.forEach(detail => detail.open = true);
  });
  window.addEventListener('afterprint',() => {
    openedForPrint.forEach(detail => detail.open = false);
    openedForPrint = [];
  });
  applyHash();
})();
