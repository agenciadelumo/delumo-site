'use strict';
(() => {
  const config = window.REDELIUS_DEMO || {};
  const pending = document.getElementById('demo-pending');
  const stage = document.getElementById('demo-stage');
  const caption = document.getElementById('demo-caption');
  const fullscreen = document.getElementById('demo-fullscreen');
  window.addEventListener('message', event => {
    const frame = document.getElementById('demo-scorm');
    if (event.origin !== location.origin || event.source !== frame.contentWindow || event.data?.type !== 'redelius-demo-height') return;
    const height = Number(event.data.height);
    if (!Number.isFinite(height) || height < 100 || height > 2000) return;
    stage.style.height = window.innerWidth <= 600 && !document.fullscreenElement ? `${height}px` : '';
  });
  const showError = () => {
    document.getElementById('demo-status').textContent = 'A demonstração está temporariamente indisponível.';
    pending.hidden = false;
    document.getElementById('demo-video').hidden = true;
    document.getElementById('demo-scorm').hidden = true;
    fullscreen.hidden = true;
  };
  if (config.src && ['video', 'scorm'].includes(config.mode)) {
    // Only publish same-origin assets within this proposal; prevent accidental remote embeds.
    const source = new URL(config.src, document.baseURI);
    if (source.origin !== location.origin || !source.pathname.startsWith('/redelius/') || /\.zip$/i.test(source.pathname)) {
      showError();
    } else if (config.mode === 'video') {
      const video = document.getElementById('demo-video');
      video.addEventListener('error', showError);
      video.src = source.href;
      if (config.captions) {
        const track = document.createElement('track');
        track.kind = 'captions'; track.srclang = 'pt-BR'; track.label = 'Português';
        track.src = config.captions; track.default = true; video.append(track);
      }
      video.hidden = false; pending.hidden = true;
      caption.textContent = 'Use os controles do vídeo para reproduzir, pausar, ajustar o volume e ampliar.';
    } else {
      const frame = document.getElementById('demo-scorm');
      frame.src = source.href; frame.hidden = false; pending.hidden = true;
      fullscreen.hidden = !document.fullscreenEnabled;
      caption.textContent = 'Use os controles da demonstração para navegar pelo vídeo e responder ao quiz.';
    }
  }
  fullscreen.addEventListener('click', async () => {
    try { await stage.requestFullscreen(); }
    catch { caption.textContent = 'Seu navegador não permitiu ampliar. Continue usando a demonstração nesta página.'; }
  });
  document.getElementById('print-proposal').addEventListener('click', () => window.print());
})();
