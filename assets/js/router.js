import store from './store.js';
import { renderHome, renderRoute } from './views.js';
import { renderTree } from './decisionTree.js';
import { qs } from './utils.js';

const VALID_AUDIENCES = ['estudiante', 'familia', 'docente'];

function parseHash(hash) {
  const h = hash.replace(/^#\/?/, '');
  if (!h) return { view: 'home' };
  const parts = h.split('/');
  if (parts[0] === 'ruta' && VALID_AUDIENCES.includes(parts[1])) {
    return { view: 'ruta', audience: parts[1] };
  }
  if (parts[0] === 'recurso') return { view: 'recurso' };
  return { view: 'notfound' };
}

export function navigate(hash) {
  window.location.hash = hash;
}

function route() {
  if (!store.content) return;

  const parsed = parseHash(window.location.hash);
  const main = qs('#main-content');

  if (parsed.view === 'notfound') {
    navigate('#/');
    return;
  }

  if (parsed.view === 'home') {
    store.setAudience(null);
    renderHome(main);
    return;
  }

  if (parsed.view === 'ruta') {
    store.setAudience(parsed.audience);
    renderRoute(main, parsed.audience);
    return;
  }

  if (parsed.view === 'recurso') {
    renderTree(main);
    return;
  }
}

export function initRouter() {
  window.addEventListener('hashchange', route);
  route();
}

export { route };
