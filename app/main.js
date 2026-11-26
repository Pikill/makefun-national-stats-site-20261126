// DataNusa router and controls — hash routes, one section per address.
// Every control on the page is wired here: the year picker, the chart
// toggles, the province search and the sortable table headers. Nothing on
// the page is decorative: a button that does nothing is a bug.
//
//   #/                       overview
//   #/penduduk               population
//   #/ekonomi                economy (year picker lives here)
//   #/ketenagakerjaan        employment
//   #/kesehatan-pendidikan   health & education
//   #/provinsi               all 38 provinces, searchable and sortable
//
// window.__shotReady is false while a page renders and true once it is on
// screen, so a screenshot script knows when to capture.

import { economy, employment, healthEdu, missing, overview, population, regions } from './views.js';

const app = document.getElementById('app');

// State that survives navigation: the chosen economy year, the chart
// toggles, the province search and sort, and the selected province.
const state = {
  year: 2024,
  gdpMode: 'growth',
  ageMode: 'abs',
  q: '',
  sort: 'pop',
  dir: 'desc',
  selected: null,
};

const ROUTES = {
  '': overview,
  '/penduduk': population,
  '/ekonomi': economy,
  '/ketenagakerjaan': employment,
  '/kesehatan-pendidikan': healthEdu,
  '/provinsi': regions,
};

const TITLES = {
  '': 'DataNusa — Statistik Indonesia',
  '/penduduk': 'Penduduk — DataNusa',
  '/ekonomi': 'Ekonomi — DataNusa',
  '/ketenagakerjaan': 'Ketenagakerjaan — DataNusa',
  '/kesehatan-pendidikan': 'Kesehatan & Pendidikan — DataNusa',
  '/provinsi': 'Provinsi — DataNusa',
};

function currentRoute() {
  const m = location.hash.match(/^#(\/[^?]*)/);
  let raw = m ? m[1] : '';
  // '#/' and '#/ekonomi/' are the same addresses as '#/' and '#/ekonomi'.
  if (raw.length > 1 && raw.endsWith('/')) raw = raw.slice(0, -1);
  if (raw === '/') raw = '';
  return raw;
}

function render() {
  window.__shotReady = false;
  const route = currentRoute();
  const view = ROUTES[route] || missing;
  document.title = TITLES[route] || 'DataNusa';
  app.innerHTML = view(state);
  document.querySelectorAll('nav a').forEach((a) => {
    a.classList.toggle('active', a.getAttribute('href') === `#${route || '/'}`);
  });
  wireControls();
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

function wireControls() {
  // Overview: GDP chart mode toggle.
  document.querySelectorAll('[data-gdp]').forEach((b) => {
    b.addEventListener('click', () => { state.gdpMode = b.dataset.gdp; render(); });
  });
  // Overview: age chart unit toggle.
  document.querySelectorAll('[data-age]').forEach((b) => {
    b.addEventListener('click', () => { state.ageMode = b.dataset.age; render(); });
  });
  // Economy: year picker re-renders the cards and the chart highlight.
  const yearSelect = document.getElementById('yearSelect');
  if (yearSelect) {
    yearSelect.addEventListener('change', () => { state.year = Number(yearSelect.value); render(); });
  }
  // Regions: live search filters the table as you type.
  const search = document.getElementById('regionSearch');
  if (search) {
    search.addEventListener('input', () => {
      state.q = search.value;
      render();
      const again = document.getElementById('regionSearch');
      again.focus();
      again.setSelectionRange(again.value.length, again.value.length);
    });
  }
  // Regions: sortable column headers; a second click reverses the order.
  document.querySelectorAll('[data-sort]').forEach((b) => {
    b.addEventListener('click', () => {
      const key = b.dataset.sort;
      if (state.sort === key) state.dir = state.dir === 'asc' ? 'desc' : 'asc';
      else { state.sort = key; state.dir = key === 'name' ? 'asc' : 'desc'; }
      render();
    });
  });
  // Regions: clicking a row shows that province's figures below the table.
  document.querySelectorAll('table.data tbody tr').forEach((tr) => {
    tr.addEventListener('click', () => {
      const name = tr.firstElementChild?.textContent;
      if (name) { state.selected = name; render(); }
    });
  });
}

window.addEventListener('hashchange', render);
render();
