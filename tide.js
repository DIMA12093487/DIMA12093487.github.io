(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
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
    progress.style.transitionDuration = reduced.matches ? '0s' : '.6s';
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
