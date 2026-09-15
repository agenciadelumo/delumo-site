// Adapt the vendor demo to a proposal iframe without emulating an LMS.
(() => {
  const video = document.getElementById('miVideo');
  const navigation = document.getElementById('demo-navigation');
  const toggle = document.getElementById('demo-toggle');
  const seek = document.getElementById('demo-seek');
  const status = document.getElementById('playback-status');
  const formatTime = seconds => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
  const syncPlayback = () => {
    // Keep one consistent control bar, including while the quiz is visible.
    video.controls = false;
    toggle.textContent = video.paused ? '▶ Reproduzir' : 'Ⅱ Pausar';
    if (Number.isFinite(video.duration)) {
      seek.max = video.duration;
      seek.value = video.currentTime;
      seek.setAttribute('aria-valuetext', `${formatTime(video.currentTime)} de ${formatTime(video.duration)}`);
      document.getElementById('demo-time').textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
    }
    const mute = document.getElementById('demo-mute');
    mute.textContent = video.muted ? 'Som desligado' : 'Som ligado';
    mute.setAttribute('aria-label', video.muted ? 'Ativar som do vídeo' : 'Silenciar vídeo');
  };
  toggle.addEventListener('click', async () => {
    status.textContent = '';
    if (!video.paused) video.pause();
    else {
      try { await video.play(); }
      catch { status.textContent = 'Não foi possível reproduzir. Tente novamente.'; }
    }
  });
  document.getElementById('demo-back').addEventListener('click', () => {
    video.currentTime = Math.max(0, video.currentTime - 10);
    syncPlayback();
  });
  seek.addEventListener('input', () => {
    video.currentTime = Number(seek.value);
    syncPlayback();
  });
  // Reload the public demo to reset both the video and the original quiz state.
  document.getElementById('demo-replay').addEventListener('click', () => location.reload());
  document.getElementById('demo-mute').addEventListener('click', () => { video.muted = !video.muted; });
  ['loadedmetadata', 'timeupdate', 'play', 'pause', 'ended', 'volumechange', 'seeked'].forEach(name => video.addEventListener(name, syncPlayback));
  new MutationObserver(() => { if (video.controls) video.controls = false; }).observe(video, { attributes: true, attributeFilter: ['controls'] });
  window.addEventListener('message', event => {
    if (event.source !== parent || event.origin !== location.origin || event.data?.type !== 'redelius-demo-fullscreen') return;
    document.documentElement.classList.toggle('demo-fullscreen', !!event.data.active);
  });
  let lastHeight = 0;
  const update = () => {
    document.querySelectorAll('[data-quiz-option]').forEach(option => {
      option.setAttribute('role', 'button');
      if (!option.hasAttribute('tabindex')) {
        option.tabIndex = 0;
        option.addEventListener('keydown', event => {
          if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); option.click(); }
        });
      }
    });
    document.querySelectorAll('[data-interactive-element-id] button').forEach(button => {
      if (button.textContent.trim() === 'Try Again') button.textContent = 'Tentar novamente';
      if (!button.textContent.trim()) button.setAttribute('aria-label', 'Continuar');
    });
    const container = document.getElementById('videoContainer');
    const navigationHeight = Math.ceil(navigation.getBoundingClientRect().height);
    document.documentElement.style.setProperty('--navigation-height', `${navigationHeight}px`);
    const height = Math.ceil(container.getBoundingClientRect().height + navigationHeight);
    if (height !== lastHeight) {
      lastHeight = height;
      if (parent !== window) parent.postMessage({ type: 'redelius-demo-height', height }, location.origin);
    }
  };
  let queued = false;
  const schedule = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; update(); });
  };
  // Observe only child changes; ARIA updates must not cause an observer loop.
  new MutationObserver(schedule).observe(document.getElementById('videoContainer'), { childList: true, subtree: true });
  new ResizeObserver(schedule).observe(document.getElementById('videoContainer'));
  new ResizeObserver(schedule).observe(navigation);
  window.addEventListener('resize', schedule);
  schedule();
  syncPlayback();
})();
