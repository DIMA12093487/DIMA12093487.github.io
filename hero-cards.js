(() => {
  const region = document.querySelector('.hero-examples');
  if (!region) return;
  const cards = [...region.querySelectorAll('.hero-rating')];
  const dots = [...region.querySelectorAll('[data-hero-index]')];
  const pause = document.getElementById('heroCardsPause');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let index = 0, visible = false, hover = false, paused = reduced.matches;
  let timer;
  const show = n => {
    index = (n + cards.length) % cards.length;
    cards.forEach((card, i) => {
      card.classList.toggle('is-active', i === index);
      card.setAttribute('aria-hidden', String(i !== index));
      card.inert = i !== index;
    });
    dots.forEach((dot, i) => dot.setAttribute('aria-current', String(i === index)));
  };
  const updatePause = () => {
    pause.textContent = paused ? '▶' : 'Ⅱ';
    pause.setAttribute('aria-pressed', String(paused));
    pause.setAttribute('aria-label', paused ? 'Включить смену карточек' : 'Остановить смену карточек');
  };
  const resetTimer = () => {
    clearInterval(timer);
    timer = setInterval(() => {
      if (visible && !paused && !hover && !document.hidden && !region.contains(document.activeElement)) show(index + 1);
    }, 6500);
  };
  dots.forEach(dot => dot.addEventListener('click', () => { show(Number(dot.dataset.heroIndex)); resetTimer(); }));
  pause.addEventListener('click', () => { paused = !paused; updatePause(); resetTimer(); });
  region.addEventListener('mouseenter', () => hover = true);
  region.addEventListener('mouseleave', () => hover = false);
  region.addEventListener('keydown', e => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault(); show(index + (e.key === 'ArrowRight' ? 1 : -1)); dots[index].focus(); resetTimer();
  });
  new IntersectionObserver(entries => visible = entries[0].isIntersecting, {threshold:.25}).observe(region);
  reduced.addEventListener('change', () => { paused = reduced.matches; updatePause(); });
  updatePause(); show(0); resetTimer();
})();
