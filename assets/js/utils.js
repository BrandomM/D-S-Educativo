/** Query selector shorthand */
export const qs = (sel, ctx = document) => ctx.querySelector(sel);
export const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/** Create element with optional attrs and children */
export function createEl(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') el.className = v;
    else if (k.startsWith('data-')) el.dataset[k.slice(5)] = v;
    else el.setAttribute(k, v);
  }
  for (const child of children) {
    if (typeof child === 'string') el.appendChild(document.createTextNode(child));
    else if (child instanceof Node) el.appendChild(child);
  }
  return el;
}

/** Escape HTML special characters */
export function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Trap focus inside a container (for modals) */
export function trapFocus(container) {
  const focusable = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  const els = [...container.querySelectorAll(focusable)].filter(el => !el.disabled);
  if (!els.length) return () => {};
  const first = els[0];
  const last = els[els.length - 1];

  function handler(e) {
    if (e.key !== 'Tab') return;
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }
  container.addEventListener('keydown', handler);
  return () => container.removeEventListener('keydown', handler);
}

/** Announce message to screen readers via aria-live */
export function announce(msg, politeness = 'polite') {
  let region = qs('#sr-announce');
  if (!region) {
    region = createEl('div', {
      id: 'sr-announce',
      'aria-live': politeness,
      'aria-atomic': 'true',
      class: 'sr-only'
    });
    document.body.appendChild(region);
  }
  region.textContent = '';
  requestAnimationFrame(() => { region.textContent = msg; });
}
