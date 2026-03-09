document.addEventListener('DOMContentLoaded', () => {
  const searchBox = document.getElementById('searchBox');
  const results = [...document.querySelectorAll('#results .result-card')];
  const resultCount = document.getElementById('resultCount');
  const clearFilters = document.getElementById('clearFilters');
  const emptyState = document.getElementById('emptyState');
  const categoryButtons = [...document.querySelectorAll('#categoryFilters .pill')];
  const tagButtons = [...document.querySelectorAll('#tagFilters .pill')];
  let activeCategory = '';
  let activeTag = '';

  const render = () => {
    const term = (searchBox?.value || '').trim().toLowerCase();
    let visible = 0;

    for (const card of results) {
      const haystack = [card.dataset.title, card.dataset.description, card.dataset.tags].join(' ');
      const matchesTerm = !term || haystack.includes(term);
      const matchesCategory = !activeCategory || (card.dataset.tags || '').includes(activeCategory);
      const matchesTag = !activeTag || (card.dataset.tags || '').includes(activeTag);
      const show = matchesTerm && matchesCategory && matchesTag;
      card.style.display = show ? '' : 'none';
      if (show) visible += 1;
    }

    if (resultCount) {
      const filters = [activeCategory, activeTag, term].filter(Boolean).length;
      resultCount.textContent = `${visible} result${visible === 1 ? '' : 's'} shown${filters ? ' · filtered' : ''}`;
    }

    if (emptyState) emptyState.style.display = visible === 0 ? '' : 'none';
    if (clearFilters) clearFilters.hidden = !(term || activeCategory || activeTag);
  };

  const toggleSingle = (buttons, clicked, setterName) => {
    const current = setterName === 'category' ? activeCategory : activeTag;
    const value = clicked.dataset.filter || '';
    const next = current === value ? '' : value;
    buttons.forEach((btn) => btn.classList.toggle('active', btn === clicked && next !== ''));
    if (setterName === 'category') activeCategory = next;
    if (setterName === 'tag') activeTag = next;
    render();
  };

  const resetAll = () => {
    activeCategory = '';
    activeTag = '';
    if (searchBox) searchBox.value = '';
    categoryButtons.forEach((btn) => btn.classList.remove('active'));
    tagButtons.forEach((btn) => btn.classList.remove('active'));
    render();
  };

  searchBox?.addEventListener('input', render);
  categoryButtons.forEach((btn) => btn.addEventListener('click', () => toggleSingle(categoryButtons, btn, 'category')));
  tagButtons.forEach((btn) => btn.addEventListener('click', () => toggleSingle(tagButtons, btn, 'tag')));
  clearFilters?.addEventListener('click', resetAll);
  render();
});
