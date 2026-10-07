(() => {
  document.documentElement.classList.add('motion-on');
  const header = document.querySelector('.site-header');
  const mobileCta = document.querySelector('.mobile-cta');
  const hero = document.querySelector('.hero');
  const contacts = document.getElementById('contacts');
  const updateHeader = () => {
    header?.classList.toggle('is-scrolled', window.scrollY > 12);
    const pastHero = !!hero && hero.getBoundingClientRect().bottom < window.innerHeight * 0.85;
    const beforeContacts = !!contacts && contacts.getBoundingClientRect().top > window.innerHeight * 0.85;
    const formFocused = !!document.activeElement?.closest('.lead-form');
    mobileCta?.classList.toggle('is-visible', pastHero && beforeContacts && !formFocused);
  };
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
  document.addEventListener('focusin', updateHeader);
  document.addEventListener('focusout', updateHeader);

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduced && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' });

    const targets = document.querySelectorAll(
      'section.section .eyebrow, section.section h2, section.section .section-sub, ' +
      '.svc-featured, .svc-card, .guar-item, .step, .case-card, .faq-item, ' +
      '.lead-form, .contact-grid, .mix-row, .project-copy, .project-actions'
    );
    targets.forEach((element) => {
      // Never conceal content already visible before the observer is ready.
      if (element.getBoundingClientRect().top <= window.innerHeight * 0.88) return;
      const order = Array.prototype.indexOf.call(element.parentElement.children, element) % 4;
      element.style.setProperty('--stagger', `${order * 65}ms`);
      element.classList.add('reveal');
      observer.observe(element);
    });
  }

  const slider = document.getElementById('cnt');
  const total = document.getElementById('totalVal');
  if (slider && total && !reduced) {
    slider.addEventListener('input', () => {
      total.classList.remove('calc-pop');
      // Restart the one-shot price transition for each deliberate slider change.
      void total.offsetWidth;
      total.classList.add('calc-pop');
    });
  }
})();
