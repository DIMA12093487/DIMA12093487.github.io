(() => {
  'use strict';
  const root = document.querySelector('.search-demo');
  if (!root) return;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const queries = ['кофейня рядом', 'мебель на заказ', 'салон красоты рядом'];
  const query = root.querySelector('.demo-query');
  const rows = [...root.querySelectorAll('.demo-row')];
  const mine = root.querySelector('.is-company');
  const rating = mine.querySelector('[data-demo-rating]');
  const reviews = mine.querySelector('[data-demo-count]');
  let niche = 0, elapsed = 0, last = 0, visible = false, frame = 0;
  function render(ms) {
    const reduced = motion.matches;
    const t = reduced ? 7000 : ms % 11000;
    query.textContent = queries[niche].slice(0, Math.min(queries[niche].length, Math.floor(t / 60)));
    const growth = Math.max(0, Math.min(1, (t - 2600) / 2800));
    const position = 3 - Math.min(3, Math.floor(growth * 3.999));
    const order = [0, 1, 2]; order.splice(position, 0, 3);
    order.forEach((index, slot) => {
      rows[index].style.setProperty('--slot', slot);
      rows[index].querySelector('.demo-pos').textContent = String(slot + 1).padStart(2, '0');
      rows[index].setAttribute('aria-posinset', String(slot + 1));
    });
    rating.textContent = (4 + .9 * growth).toFixed(1).replace('.', ',');
    reviews.textContent = `${Math.round(15 + 85 * growth)} оценок`;
    root.dataset.phase = t < 1500 ? 'search' : t < 2600 ? 'results' : growth < 1 ? 'grow' : 'done';

  }
  function tick(now) {
    frame = 0;
    if (!active()) { last = 0; return; }
    if (last) elapsed += Math.min(now - last, 100);
    last = now;
    if (elapsed >= 11000) { elapsed %= 11000; niche = (niche + 1) % queries.length; }
    render(elapsed);
    frame = requestAnimationFrame(tick);
  }
  function active() { return visible && !document.hidden && !motion.matches; }
  function sync() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0; last = 0;
    if (motion.matches) render(7000);
    if (active()) frame = requestAnimationFrame(tick);
  }



  document.addEventListener('visibilitychange', sync);
  motion.addEventListener('change', sync);
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); }, { threshold: .15 }).observe(root);
  render(motion.matches ? 7000 : 0);
})();
