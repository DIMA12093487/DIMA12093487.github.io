(() => {
  'use strict';
  const action = document.querySelector('.hero-actions .btn-accent');
  if (action) {
    action.classList.add('glow-ring');
    const disc = document.createElement('span');
    disc.className = 'glow-disc';
    disc.setAttribute('aria-hidden', 'true');
    disc.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 18 18 6M6 6h12v12"/></svg>';
    action.append(disc);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries => {
        action.classList.toggle('is-inview', entries[0].isIntersecting);
      }).observe(action);
    } else action.classList.add('is-inview');
  }
  document.querySelectorAll('[data-package-count]').forEach(link => {
    const label = `Выбрать пакет «${link.dataset.packageName}», ${link.dataset.packageCount} отзывов`;
    link.setAttribute('aria-label', label);
    link.setAttribute('title', label);
  });
})();
