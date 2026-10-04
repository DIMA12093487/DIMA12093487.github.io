// Preserve the intended CSS size unless a protected phrase cannot fit.
// Inline emphasis and text remain untouched; paragraphs never shrink.
(() => {
  const headings = [...document.querySelectorAll('h1,h2,h3,.case-title,.case-score')];
  const originalSizes = new WeakMap(headings.map(el => [el, el.style.fontSize]));
  let scheduled = false;

  function fitHeadings() {
    scheduled = false;
    headings.forEach(el => { el.style.fontSize = originalSizes.get(el); });
    for (const el of headings) {
      if (!el.getClientRects().length || !el.clientWidth) continue;
      for (let attempt = 0; attempt < 5 && el.scrollWidth > el.clientWidth + 1; attempt++) {
        const size = parseFloat(getComputedStyle(el).fontSize);
        el.style.fontSize = `${size * el.clientWidth / el.scrollWidth * 0.985}px`;
      }
    }
  }

  function scheduleFit() {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(fitHeadings);
    }
  }

  window.addEventListener('resize', scheduleFit, { passive: true });
  document.addEventListener('toggle', scheduleFit, true);
  if (document.fonts) document.fonts.ready.then(scheduleFit);
  scheduleFit();
})();
