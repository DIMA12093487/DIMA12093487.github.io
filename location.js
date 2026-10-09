(() => {
  const select = document.getElementById('citySelect');
  const heading = document.getElementById('heroCity');
  if (!select || !heading) return;
  const locations = { moscow:'в Москве', spb:'в Санкт-Петербурге' };
  try { const saved = localStorage.getItem('repustar-city'); if (Object.hasOwn(locations, saved)) select.value = saved; } catch {}
  const apply = () => {
    heading.textContent = locations[select.value] || locations.moscow;
    document.querySelector('.city-full').textContent = select.selectedOptions[0].textContent;
    document.querySelector('.city-short').textContent = select.value === 'spb' ? 'СПБ' : 'Москва';
  };
  apply();
  select.addEventListener('change', () => {
    apply();
    try { localStorage.setItem('repustar-city', select.value); } catch {}
  });
  // Use the existing lead payload, with no backend changes or automatic location tracking.
  const form = document.getElementById('leadForm');
  form?.addEventListener('submit', () => {
    const task = document.getElementById('leadTask');
    if (!task || !form.checkValidity()) return;
    const previous = task.value.split('\n').filter(line => !line.startsWith('Город: ')).join('\n').trim();
    task.value = ('Город: ' + select.selectedOptions[0].textContent + (previous ? '\n' + previous : '')).slice(0,1000);
  }, {capture:true});
})();
