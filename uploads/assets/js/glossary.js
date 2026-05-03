import store from './store.js';
import { createEl, qs, trapFocus } from './utils.js';

const TOKEN_RE = /\{glosario:([a-z0-9_]+)\}/g;

/** Replace {glosario:key} tokens in a string with clickable buttons */
export function parseGlossaryTokens(text) {
  const glossary = store.content?.glossary || {};
  const parts = [];
  let last = 0;
  let match;

  TOKEN_RE.lastIndex = 0;
  while ((match = TOKEN_RE.exec(text)) !== null) {
    if (match.index > last) parts.push(document.createTextNode(text.slice(last, match.index)));
    const key = match[1];
    const entry = glossary[key];
    if (entry) {
      const btn = createEl('button', {
        class: 'glossary-link',
        'aria-haspopup': 'dialog',
        'data-key': key
      }, [entry.term]);
      btn.addEventListener('click', () => openGlossaryModal(key, btn));
      parts.push(btn);
    } else {
      parts.push(document.createTextNode(match[0]));
    }
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(document.createTextNode(text.slice(last)));
  return parts;
}

/** Build a span with parsed glossary nodes from a text string */
export function glossarySpan(text) {
  const span = createEl('span', {});
  parseGlossaryTokens(text).forEach(n => span.appendChild(n));
  return span;
}

let removeTrap = null;

export function openGlossaryModal(key, triggerEl) {
  closeGlossaryModal();
  const glossary = store.content?.glossary || {};
  const entry = glossary[key];
  if (!entry) return;

  const easy = store.easyText;
  const def = easy ? entry.definitionEasy : entry.definitionFull;
  const ui = store.content?.ui || {};

  const overlay = createEl('div', {
    class: 'modal-overlay',
    role: 'dialog',
    'aria-modal': 'true',
    'aria-labelledby': 'modal-title',
    id: 'glossary-modal'
  });

  const dialog = createEl('div', { class: 'modal-dialog' });

  const header = createEl('div', { class: 'modal-header' });
  const title = createEl('h2', { id: 'modal-title', class: 'modal-title' }, [
    `${ui.glossaryTitle || 'Glosario'}: ${entry.term}`
  ]);
  const closeBtn = createEl('button', {
    class: 'modal-close',
    'aria-label': ui.glossaryClose || 'Cerrar glosario'
  }, ['✕']);

  header.appendChild(title);
  header.appendChild(closeBtn);

  const body = createEl('div', { class: 'modal-body' });
  const defPara = createEl('p', {}, [def]);
  body.appendChild(defPara);

  if (!easy) {
    const easyLabel = createEl('p', { class: 'modal-easy-label' }, ['Versión fácil:']);
    const easyPara = createEl('p', { class: 'modal-easy-text' }, [entry.definitionEasy]);
    body.appendChild(easyLabel);
    body.appendChild(easyPara);
  }

  dialog.appendChild(header);
  dialog.appendChild(body);
  overlay.appendChild(dialog);
  document.body.appendChild(overlay);

  removeTrap = trapFocus(dialog);
  closeBtn.focus();

  closeBtn.addEventListener('click', () => closeGlossaryModal(triggerEl));
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeGlossaryModal(triggerEl);
  });
  overlay.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeGlossaryModal(triggerEl);
  });
}

export function closeGlossaryModal(returnFocusTo = null) {
  const existing = qs('#glossary-modal');
  if (existing) {
    if (removeTrap) { removeTrap(); removeTrap = null; }
    existing.remove();
    if (returnFocusTo) returnFocusTo.focus();
  }
}
