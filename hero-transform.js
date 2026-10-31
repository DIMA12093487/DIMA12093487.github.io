(() => {
  'use strict';
  const root = document.querySelector('.hero-transform');
  if (!root) return;
  const buttons = [...root.querySelectorAll('[data-example-state]')];
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let timer;
  let visible = true;
  let hovered = false;
  let focused = false;
  const paused = () => motion.matches || document.hidden || !visible || hovered || focused;
  function show(state) {
    root.dataset.state = state;
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.exampleState === state)));
  }
  function schedule() {
    clearTimeout(timer);
    if (paused()) return;
    timer = setTimeout(() => {
      show(root.dataset.state === 'before' ? 'after' : 'before');
      schedule();
    }, root.dataset.state === 'before' ? 3200 : 6200);
  }
  buttons.forEach(button => button.addEventListener('click', () => {
    show(button.dataset.exampleState);
    schedule();
  }));
  root.addEventListener('mouseenter', () => { hovered = true; schedule(); });
  root.addEventListener('mouseleave', () => { hovered = false; schedule(); });
  root.addEventListener('focusin', () => { focused = true; schedule(); });
  root.addEventListener('focusout', event => { focused = root.contains(event.relatedTarget); schedule(); });
  document.addEventListener('visibilitychange', schedule);
  motion.addEventListener('change', schedule);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => { visible = entries[0].isIntersecting; schedule(); }, { threshold: 0.1 }).observe(root);
  }
  show('before');
  schedule();
})();
