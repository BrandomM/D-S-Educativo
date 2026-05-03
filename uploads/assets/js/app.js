import store from './store.js';
import { initRouter, route } from './router.js';
import { renderHome, renderRoute } from './views.js';
import { renderTree } from './decisionTree.js';
import { qs, createEl } from './utils.js';

const BASE = import.meta.url
  ? new URL('.', import.meta.url).href.replace(/assets\/js\/$/, '')
  : './';

async function loadData() {
  const [contentRes, treeRes] = await Promise.all([
    fetch(`${BASE}data/content.es.json`),
    fetch(`${BASE}data/decision-tree.es.json`)
  ]);

  if (!contentRes.ok || !treeRes.ok) throw new Error('Failed to load data');

  const [content, tree] = await Promise.all([contentRes.json(), treeRes.json()]);
  store.setContent(content);
  store.setTree(tree);
}

function buildHeader() {
  const header = qs('#app-header');
  if (!header) return;

  const ui = store.content.ui;

  const brand = createEl('a', {
    href: '#/',
    class: 'header-brand',
    'aria-label': `${ui.appName} — Ir al inicio`
  }, [ui.appName]);

  const toggleWrapper = createEl('div', { class: 'toggle-wrapper' });
  const toggleLabel = createEl('label', {
    class: 'toggle-label',
    for: 'easy-toggle'
  }, [ui.toggleEasyLabel]);

  const toggle = createEl('button', {
    id: 'easy-toggle',
    class: `toggle-btn${store.easyText ? ' toggle-btn--on' : ''}`,
    role: 'switch',
    'aria-checked': String(store.easyText),
    'aria-label': `${ui.toggleEasyLabel}: ${store.easyText ? ui.toggleEasyOn : ui.toggleEasyOff}`
  }, [store.easyText ? ui.toggleEasyOn : ui.toggleEasyOff]);

  toggle.addEventListener('click', () => {
    store.setEasyText(!store.easyText);
    updateToggle(toggle);
    route();
  });

  store.subscribe((changed) => {
    if (changed === 'easyText') updateToggle(toggle);
  });

  function updateToggle(btn) {
    const ui = store.content.ui;
    btn.textContent = store.easyText ? ui.toggleEasyOn : ui.toggleEasyOff;
    btn.setAttribute('aria-checked', String(store.easyText));
    btn.setAttribute('aria-label', `${ui.toggleEasyLabel}: ${store.easyText ? ui.toggleEasyOn : ui.toggleEasyOff}`);
    btn.classList.toggle('toggle-btn--on', store.easyText);
  }

  toggleWrapper.appendChild(toggleLabel);
  toggleWrapper.appendChild(toggle);
  header.appendChild(brand);
  header.appendChild(toggleWrapper);
}

function showError(msg) {
  const main = qs('#main-content');
  if (main) {
    main.innerHTML = '';
    const p = createEl('p', { class: 'error-msg', role: 'alert' }, [msg]);
    main.appendChild(p);
  }
}

async function init() {
  const main = qs('#main-content');
  if (main) {
    main.innerHTML = '';
    const loading = createEl('p', { class: 'loading-msg', 'aria-live': 'polite' }, [
      'Cargando…'
    ]);
    main.appendChild(loading);
  }

  try {
    await loadData();
  } catch (e) {
    showError(store.content?.ui?.errorLoad || 'Error al cargar el contenido.');
    return;
  }

  buildHeader();
  initRouter();
}

init();
