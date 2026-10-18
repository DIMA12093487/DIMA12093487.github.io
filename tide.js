(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(pointer: fine)');
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const canvas = document.createElement('canvas');
  canvas.className = 'tide-mesh';
  canvas.setAttribute('aria-hidden', 'true');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  hero.prepend(canvas);
  hero.classList.add('tide-ready');
  let width = 0, height = 0, frame = 0, visible = true;
  let x = -1000, y = -1000, tx = -1000, ty = -1000, strength = 0, target = 0;
  const draw = () => {
    frame = 0;
    if (!visible || document.hidden) return;
    strength += (target - strength) * .14;
    x += (tx - x) * .22;
    y += (ty - y) * .22;
    ctx.clearRect(0, 0, width, height);
    const step = 42, points = [];
    for (let row = 0; row <= Math.ceil(height / step); row++) {
      const line = [];
      for (let col = 0; col <= Math.ceil(width / step); col++) {
        let px = col * step, py = row * step;
        const dx = x - px, dy = y - py;
        const pull = Math.exp(-(dx * dx + dy * dy) / 29000) * .32 * strength;
        line.push([px + dx * pull, py + dy * pull]);
      }
      points.push(line);
    }
    ctx.strokeStyle = 'rgba(67,119,157,.12)';
    ctx.lineWidth = .7;
    ctx.beginPath();
    points.forEach(line => line.forEach(([px, py], i) => i ? ctx.lineTo(px, py) : ctx.moveTo(px, py)));
    for (let col = 0; col < points[0].length; col++) {
      points.forEach((line, i) => i ? ctx.lineTo(...line[col]) : ctx.moveTo(...line[col]));
    }
    ctx.stroke();
    ctx.fillStyle = 'rgba(67,119,157,.32)';
    points.flat().forEach(([px, py]) => { ctx.beginPath(); ctx.arc(px, py, 1.25, 0, Math.PI * 2); ctx.fill(); });
    if (Math.abs(target - strength) > .002 || Math.abs(tx - x) > .2 || Math.abs(ty - y) > .2) schedule();
  };
  const schedule = () => { if (!frame && visible && !document.hidden) frame = requestAnimationFrame(draw); };
  const resize = () => {
    width = hero.clientWidth;
    height = hero.clientHeight;
    const ratio = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    schedule();
  };
  hero.addEventListener('pointermove', event => {
    if (reduced.matches || !fine.matches || event.pointerType === 'touch') return;
    const box = hero.getBoundingClientRect();
    tx = event.clientX - box.left;
    ty = event.clientY - box.top;
    if (!strength) { x = tx; y = ty; }
    target = 1;
    schedule();
  }, { passive:true });
  hero.addEventListener('pointerleave', () => { target = 0; schedule(); }, { passive:true });
  reduced.addEventListener('change', () => { target = 0; strength = 0; schedule(); });
  document.addEventListener('visibilitychange', schedule);
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(hero);
  else window.addEventListener('resize', resize, { passive:true });
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    if (!visible) { cancelAnimationFrame(frame); frame = 0; }
    else schedule();
  }).observe(hero);
  resize();

  const steps = document.querySelector('#how .steps');
  if (!steps) return;
  const stages = [...steps.querySelectorAll('.step')];
  const process = document.createElement('div');
  process.className = 'tide-process';
  steps.before(process);
  process.append(steps);
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.classList.add('tide-route');
  svg.setAttribute('aria-hidden', 'true');
  const track = document.createElementNS(ns, 'path');
  track.classList.add('tide-route-track');
  const progress = document.createElementNS(ns, 'path');
  progress.classList.add('tide-route-progress');
  progress.setAttribute('pathLength', '1');
  progress.setAttribute('stroke-dasharray', '1');
  progress.setAttribute('stroke-dashoffset', '1');
  svg.append(track, progress);
  process.prepend(svg);
  let processFrame = 0;
  const updateRoute = () => {
    processFrame = 0;
    const box = process.getBoundingClientRect();
    const p = reduced.matches ? 1 : Math.max(0, Math.min(1, (innerHeight * .78 - box.top) / Math.max(1, box.height * .88)));
    progress.setAttribute('stroke-dashoffset', String(1 - p));
    stages.forEach((stage, i) => stage.classList.toggle('tide-reached', p >= i / (stages.length - 1)));
  };
  const scheduleRoute = () => { if (!processFrame) processFrame = requestAnimationFrame(updateRoute); };
  const layoutRoute = () => {
    const box = process.getBoundingClientRect();
    svg.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`);
    const points = stages.map(stage => {
      const n = stage.querySelector('.step-num').getBoundingClientRect();
      return [n.left + n.width / 2 - box.left, n.top + n.height / 2 - box.top];
    });
    let d = `M ${points[0].join(' ')}`;
    points.slice(1).forEach(([px, py], i) => {
      const [ax, ay] = points[i];
      if (Math.abs(px - ax) > Math.abs(py - ay)) {
        const dx = (px - ax) / 3;
        d += ` C ${ax + dx} ${ay - 20}, ${px - dx} ${py + 20}, ${px} ${py}`;
      } else d += ` L ${px} ${py}`;
    });
    track.setAttribute('d', d);
    progress.setAttribute('d', d);
    scheduleRoute();
  };
  if ('ResizeObserver' in window) new ResizeObserver(layoutRoute).observe(steps);
  window.addEventListener('resize', layoutRoute, { passive:true });
  window.addEventListener('scroll', scheduleRoute, { passive:true });
  reduced.addEventListener('change', scheduleRoute);
  document.fonts?.ready.then(layoutRoute);
  layoutRoute();
})();
