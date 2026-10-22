/* Copy contact email without opening an external mail client. */
(() => {
  'use strict';
  const buttons = document.querySelectorAll('[data-copy-email]');
  if (!buttons.length) return;
  const status = document.createElement('output');
  status.id = 'email-copy-status';
  status.className = 'email-copy-status';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  status.hidden = true;
  document.body.append(status);
  let hideTimer;
  function fallbackCopy(text) {
    const focused = document.activeElement;
    const field = document.createElement('textarea');
    field.value = text;
    field.readOnly = true;
    field.style.cssText = 'position:fixed;left:-9999px;top:0;font-size:16px;';
    document.body.append(field);
    field.focus();
    field.select();
    field.setSelectionRange(0, text.length);
    let copied = false;
    try { copied = document.execCommand('copy'); } catch {}
    field.remove();
    if (focused && typeof focused.focus === 'function') focused.focus({preventScroll:true});
    return copied;
  }
  buttons.forEach(button => button.addEventListener('click', async event => {
    event.preventDefault();
    if (button.dataset.copyState === 'busy') return;
    const email = button.dataset.copyEmail;
    const label = button.getAttribute('aria-label');
    const title = button.getAttribute('title');
    button.dataset.copyState = 'busy';
    clearTimeout(hideTimer);
    status.hidden = false;
    status.textContent = 'Копируем почту…';
    let copied = false;
    let timeout;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await Promise.race([
          navigator.clipboard.writeText(email),
          new Promise((_, reject) => { timeout = setTimeout(() => reject(new Error('Clipboard timeout')), 1200); })
        ]);
        copied = true;
      }
    } catch {} finally { clearTimeout(timeout); }
    if (!copied) copied = fallbackCopy(email);
    button.dataset.copyState = copied ? 'success' : 'error';
    status.textContent = copied ? 'Почта скопирована ✓' : 'Не удалось скопировать. Почта: ' + email;
    button.setAttribute('aria-label', copied ? 'Почта скопирована' : 'Скопировать почту: ' + email);
    button.title = copied ? 'Скопировано ✓' : email;
    hideTimer = setTimeout(() => {
      status.hidden = true;
      delete button.dataset.copyState;
      if (label) button.setAttribute('aria-label', label);
      if (title) button.setAttribute('title', title);
    }, copied ? 2400 : 7000);
  }));
})();
