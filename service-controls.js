(() => {
  'use strict';
  const scope = document.querySelector('#services .service-configurator');
  if (!scope) return;
  const range = scope.querySelector('#cnt');
  const quantity = scope.querySelector('#serviceQuantity');
  if (!range || !quantity) return;
  const minimum = Number(range.min);
  const maximum = Number(range.max);
  const steps = scope.querySelectorAll('[data-quantity-step]');
  const sync = () => {
    const value = Number(range.value);
    quantity.value = String(value);
    steps.forEach(button => {
      button.disabled = Number(button.dataset.quantityStep) < 0 ? value <= minimum : value >= maximum;
    });
  };
  const commit = () => {
    // Do not clamp on input: a draft "1" must be allowed to become "100".
    const draft = quantity.value.trim();
    const parsed = Number(draft);
    const value = draft && Number.isFinite(parsed)
      ? Math.min(maximum, Math.max(minimum, Math.round(parsed)))
      : Number(range.value);
    if (value !== Number(range.value)) {
      range.value = String(value);
      // The existing pricing, plural and progress listeners own rendering.
      range.dispatchEvent(new Event('input', { bubbles: true }));
    }
    sync();
  };
  quantity.addEventListener('change', commit);
  quantity.addEventListener('blur', commit);
  quantity.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      commit();
    }
  });
  range.addEventListener('input', sync);
  range.addEventListener('change', sync);
  steps.forEach(button => button.addEventListener('click', () => {
    commit();
    quantity.value = String(Number(range.value) + Number(button.dataset.quantityStep));
    commit();
  }));
  sync();
})();
