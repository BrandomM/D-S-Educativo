import store from './store.js';
import { navigate } from './router.js';
import { createEl, announce } from './utils.js';

export function renderTree(container) {
  if (!store.tree) return;

  store.resetTreeHistory();
  container.innerHTML = '';

  const ui = store.content?.ui || {};
  const sources = store.content?.sources || [];

  const section = createEl('section', {
    class: 'tree-section',
    'aria-labelledby': 'tree-title'
  });

  const h1 = createEl('h1', { id: 'tree-title', class: 'tree-section-title' }, [
    'Recurso interactivo'
  ]);
  section.appendChild(h1);

  const nodeRegion = createEl('div', {
    class: 'tree-node-region',
    'aria-live': 'polite',
    'aria-atomic': 'true',
    id: 'tree-node-region'
  });
  section.appendChild(nodeRegion);

  const navRow = createEl('div', { class: 'tree-nav' });
  const backBtn = createEl('button', {
    class: 'btn btn-secondary',
    id: 'tree-back-btn',
    'aria-label': ui.backBtn || 'Volver'
  }, [ui.backBtn || 'Volver']);
  const restartBtn = createEl('button', {
    class: 'btn btn-outline',
    id: 'tree-restart-btn'
  }, [ui.restartBtn || 'Reiniciar']);
  const homeBtn = createEl('button', {
    class: 'btn btn-ghost',
    id: 'tree-home-btn'
  }, ['Ir al inicio']);
  navRow.appendChild(backBtn);
  navRow.appendChild(restartBtn);
  navRow.appendChild(homeBtn);
  section.appendChild(navRow);

  backBtn.addEventListener('click', () => {
    if (store.treeHistory.length > 0) {
      store.popTreeHistory();
      const prevId = store.treeHistory.length
        ? store.treeHistory[store.treeHistory.length - 1]
        : store.tree.startNode;
      renderNode(nodeRegion, prevId, backBtn, restartBtn);
    }
  });

  restartBtn.addEventListener('click', () => {
    store.resetTreeHistory();
    renderNode(nodeRegion, store.tree.startNode, backBtn, restartBtn);
    announce(ui.restartBtn || 'Reiniciar');
  });

  homeBtn.addEventListener('click', () => navigate('#/'));

  const sourcesDetails = createEl('details', { class: 'sources-accordion' });
  const sourcesSummary = createEl('summary', { class: 'sources-summary' }, [
    ui.sourcesTitle || 'Fuentes y créditos'
  ]);
  sourcesDetails.appendChild(sourcesSummary);

  const sourcesList = createEl('ul', { class: 'sources-list' });
  sources.forEach(src => {
    const li = createEl('li', { class: 'sources-item' }, [src]);
    sourcesList.appendChild(li);
  });
  sourcesDetails.appendChild(sourcesList);

  container.appendChild(section);
  container.appendChild(sourcesDetails);

  renderNode(nodeRegion, store.tree.startNode, backBtn, restartBtn);
}

function renderNode(region, nodeId, backBtn, restartBtn) {
  const node = store.tree.nodes[nodeId];
  if (!node) return;

  const easy = store.easyText;
  const ui = store.content?.ui || {};
  const isStart = nodeId === store.tree.startNode;
  const isResult = !node.choices || node.choices.length === 0;

  region.innerHTML = '';

  const card = createEl('div', { class: `tree-card${isResult ? ' tree-card--result' : ''}` });

  const iconEl = createEl('span', { class: 'tree-node-icon', 'aria-hidden': 'true' }, [
    node.icon || ''
  ]);
  const titleEl = createEl('h2', { class: 'tree-node-title' }, [node.title]);
  const promptEl = createEl('p', { class: 'tree-node-prompt' }, [
    easy ? node.promptEasy : node.promptFull
  ]);

  card.appendChild(iconEl);
  card.appendChild(titleEl);
  card.appendChild(promptEl);

  if (!isResult && node.choices?.length) {
    const choicesLabel = createEl('p', { class: 'tree-choices-label' }, ['Elige una opción:']);
    const choicesGroup = createEl('div', {
      class: 'tree-choices',
      role: 'group',
      'aria-label': 'Opciones del árbol'
    });

    node.choices.forEach(choice => {
      const btn = createEl('button', {
        class: 'btn btn-choice',
        'aria-label': easy ? choice.labelEasy : choice.labelFull
      }, [easy ? choice.labelEasy : choice.labelFull]);

      btn.addEventListener('click', () => {
        store.pushTreeHistory(nodeId);
        renderNode(region, choice.next, backBtn, restartBtn);
        announce(easy ? choice.labelEasy : choice.labelFull);
      });

      choicesGroup.appendChild(btn);
    });

    card.appendChild(choicesLabel);
    card.appendChild(choicesGroup);
  }

  if (isResult) {
    const resultActions = createEl('div', { class: 'tree-result-actions' });
    const restartInline = createEl('button', {
      class: 'btn btn-primary'
    }, [ui.restartBtn || 'Reiniciar']);
    restartInline.addEventListener('click', () => {
      store.resetTreeHistory();
      renderNode(region, store.tree.startNode, backBtn, restartBtn);
      announce(ui.restartBtn || 'Reiniciar');
    });
    resultActions.appendChild(restartInline);
    card.appendChild(resultActions);
  }

  region.appendChild(card);

  backBtn.disabled = isStart && store.treeHistory.length === 0;

  const firstFocusable = region.querySelector('button, [tabindex="0"]');
  if (firstFocusable) firstFocusable.focus();

  announce(node.title);
}
