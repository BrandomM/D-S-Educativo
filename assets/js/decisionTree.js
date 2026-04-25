import store from './store.js';
import { navigate } from './router.js';
import { createEl, announce } from './utils.js';

// Module-level refs — reset on every renderTree() call
let scenarioIdx = 0;
let _nodeRegion = null;
let _progressRegion = null;
let _backBtn = null;

export function renderTree(container) {
  if (!store.tree) return;

  const scenarios = store.tree.scenarios;
  const ui = store.content?.ui || {};

  // Reset state
  scenarioIdx = 0;
  store.resetTreeHistory();
  container.innerHTML = '';

  // --- Scaffold ---
  const section = createEl('section', { class: 'tree-section', 'aria-labelledby': 'tree-title' });
  section.appendChild(createEl('h1', { id: 'tree-title', class: 'tree-section-title' }, ['Recurso interactivo']));

  _progressRegion = createEl('div', {
    class: 'progress-region',
    'aria-label': 'Progreso de situaciones'
  });
  section.appendChild(_progressRegion);

  _nodeRegion = createEl('div', {
    class: 'tree-node-region',
    'aria-live': 'polite',
    'aria-atomic': 'true',
    id: 'tree-node-region'
  });
  section.appendChild(_nodeRegion);

  const navRow = createEl('div', { class: 'tree-nav' });
  _backBtn = createEl('button', { class: 'btn btn-secondary', id: 'tree-back-btn' }, [ui.backBtn || 'Volver']);
  const restartBtn = createEl('button', { class: 'btn btn-outline', id: 'tree-restart-btn' }, [ui.restartBtn || 'Reiniciar']);
  const homeBtn = createEl('button', { class: 'btn btn-ghost' }, ['Ir al inicio']);
  navRow.appendChild(_backBtn);
  navRow.appendChild(restartBtn);
  navRow.appendChild(homeBtn);
  section.appendChild(navRow);

  container.appendChild(section);

  // --- Nav button handlers ---
  _backBtn.addEventListener('click', () => {
    const scenario = scenarios[scenarioIdx];
    if (store.treeHistory.length > 0) {
      store.popTreeHistory();
      const prevId = store.treeHistory.length
        ? store.treeHistory[store.treeHistory.length - 1]
        : scenario.startNode;
      renderNode(prevId, scenario);
    }
  });

  restartBtn.addEventListener('click', () => {
    scenarioIdx = 0;
    store.resetTreeHistory();
    _backBtn.disabled = false;
    updateProgress(scenarios);
    renderNode(scenarios[0].startNode, scenarios[0]);
    announce(`Reiniciado. Situación 1 de ${scenarios.length}`);
  });

  homeBtn.addEventListener('click', () => navigate('#/'));

  // --- First render ---
  updateProgress(scenarios);
  renderNode(scenarios[0].startNode, scenarios[0]);
}

function updateProgress(scenarios, allComplete = false) {
  if (!_progressRegion) return;
  _progressRegion.innerHTML = '';

  const total = scenarios.length;
  const labelText = allComplete
    ? `¡Completado! ${total} de ${total} situaciones`
    : `Situación ${scenarioIdx + 1} de ${total}`;

  _progressRegion.appendChild(
    createEl('p', { class: 'progress-label', 'aria-live': 'polite' }, [labelText])
  );

  const steps = createEl('div', {
    class: 'progress-steps',
    role: 'list',
    'aria-label': labelText
  });

  for (let i = 0; i < total; i++) {
    const isDone = allComplete || i < scenarioIdx;
    const isCurrent = !allComplete && i === scenarioIdx;

    const cls = ['progress-step', isDone && 'progress-step--done', isCurrent && 'progress-step--current']
      .filter(Boolean).join(' ');

    const step = createEl('div', {
      class: cls,
      role: 'listitem',
      'aria-label': `Situación ${i + 1}${isDone ? ' completada' : isCurrent ? ' (actual)' : ''}`
    });
    if (isCurrent) step.setAttribute('aria-current', 'step');
    step.appendChild(createEl('span', { 'aria-hidden': 'true' }, [isDone ? '✓' : String(i + 1)]));
    steps.appendChild(step);

    if (i < total - 1) {
      steps.appendChild(createEl('div', {
        class: `progress-connector${isDone ? ' progress-connector--done' : ''}`,
        'aria-hidden': 'true'
      }));
    }
  }

  _progressRegion.appendChild(steps);
}

function renderNode(nodeId, scenario) {
  const node = scenario.nodes[nodeId];
  if (!node) return;

  const scenarios = store.tree.scenarios;
  const easy = store.easyText;
  const ui = store.content?.ui || {};
  const isStart = nodeId === scenario.startNode;
  const isResult = !node.choices || node.choices.length === 0;
  const isLastScenario = scenarioIdx === scenarios.length - 1;

  _nodeRegion.innerHTML = '';

  const card = createEl('div', { class: `tree-card${isResult ? ' tree-card--result' : ''}` });
  card.appendChild(createEl('span', { class: 'tree-node-icon', 'aria-hidden': 'true' }, [node.icon || '']));
  card.appendChild(createEl('h2', { class: 'tree-node-title' }, [node.title]));
  card.appendChild(createEl('p', { class: 'tree-node-prompt' }, [easy ? node.promptEasy : node.promptFull]));

  if (!isResult && node.choices?.length) {
    card.appendChild(createEl('p', { class: 'tree-choices-label' }, ['Elige una opción:']));
    const group = createEl('div', { class: 'tree-choices', role: 'group', 'aria-label': 'Opciones' });
    node.choices.forEach(choice => {
      const btn = createEl('button', { class: 'btn btn-choice' }, [easy ? choice.labelEasy : choice.labelFull]);
      btn.addEventListener('click', () => {
        store.pushTreeHistory(nodeId);
        renderNode(choice.next, scenario);
        announce(easy ? choice.labelEasy : choice.labelFull);
      });
      group.appendChild(btn);
    });
    card.appendChild(group);
  }

  if (isResult) {
    const actions = createEl('div', { class: 'tree-result-actions' });
    if (isLastScenario) {
      const finishBtn = createEl('button', { class: 'btn btn-primary' }, ['Ver mensaje final →']);
      finishBtn.addEventListener('click', () => {
        _nodeRegion.innerHTML = '';
        renderCompletion();
        _backBtn.disabled = true;
      });
      actions.appendChild(finishBtn);
    } else {
      const nextBtn = createEl('button', { class: 'btn btn-primary' }, ['Siguiente situación →']);
      nextBtn.addEventListener('click', () => {
        scenarioIdx++;
        store.resetTreeHistory();
        _backBtn.disabled = false;
        updateProgress(scenarios);
        renderNode(scenarios[scenarioIdx].startNode, scenarios[scenarioIdx]);
        announce(`Situación ${scenarioIdx + 1} de ${scenarios.length}`);
      });
      actions.appendChild(nextBtn);
    }
    card.appendChild(actions);
  }

  _nodeRegion.appendChild(card);
  _backBtn.disabled = isStart && store.treeHistory.length === 0;

  const firstFocusable = _nodeRegion.querySelector('button, [tabindex="0"]');
  if (firstFocusable) firstFocusable.focus();
  announce(node.title);
}

function renderCompletion() {
  const completion = store.tree.completion;
  const scenarios = store.tree.scenarios;
  const easy = store.easyText;
  const ui = store.content?.ui || {};

  updateProgress(scenarios, true);

  const card = createEl('div', { class: 'tree-card tree-card--completion' });
  card.appendChild(createEl('span', { class: 'tree-node-icon tree-completion-icon', 'aria-hidden': 'true' }, [completion.icon || '🎉']));
  card.appendChild(createEl('h2', { class: 'tree-node-title tree-completion-title' }, [completion.title]));
  card.appendChild(createEl('p', { class: 'tree-node-prompt' }, [easy ? completion.messageEasy : completion.messageFull]));

  const actions = createEl('div', { class: 'tree-result-actions' });
  const restartBtn = createEl('button', { class: 'btn btn-outline' }, [ui.restartBtn || 'Reiniciar desde el inicio']);
  restartBtn.addEventListener('click', () => {
    scenarioIdx = 0;
    store.resetTreeHistory();
    _backBtn.disabled = false;
    updateProgress(scenarios);
    renderNode(scenarios[0].startNode, scenarios[0]);
    announce(`Reiniciado. Situación 1 de ${scenarios.length}`);
  });
  actions.appendChild(restartBtn);
  card.appendChild(actions);

  _nodeRegion.appendChild(card);
  announce(completion.title);

  const firstFocusable = _nodeRegion.querySelector('button');
  if (firstFocusable) firstFocusable.focus();
}
