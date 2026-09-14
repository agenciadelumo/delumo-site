// Adapt the vendor demo to a proposal iframe without emulating an LMS.
(() => {
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
    const height = Math.ceil(container.getBoundingClientRect().height);
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
  window.addEventListener('resize', schedule);
  schedule();
})();
