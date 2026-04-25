import store from './store.js';
import { navigate } from './router.js';
import { createEl } from './utils.js';
import { glossarySpan } from './glossary.js';

export function renderHome(container) {
  const { content } = store;
  const ui = content.ui;

  container.innerHTML = '';
  container.setAttribute('aria-label', ui.homeTitle);

  const hero = createEl('section', { class: 'hero', 'aria-labelledby': 'hero-title' });
  const h1 = createEl('h1', { id: 'hero-title', class: 'hero-title' }, [ui.homeTitle]);
  const sub = createEl('p', { class: 'hero-subtitle' }, [ui.homeSubtitle]);
  hero.appendChild(h1);
  hero.appendChild(sub);

  const section = createEl('section', {
    class: 'audience-section',
    'aria-labelledby': 'audience-label'
  });
  const sectionTitle = createEl('h2', { id: 'audience-label', class: 'section-title' }, [
    ui.chooseAudience
  ]);
  section.appendChild(sectionTitle);

  const grid = createEl('div', { class: 'audience-grid', role: 'list' });

  content.audiences.forEach(aud => {
    const card = createEl('div', { class: 'audience-card', role: 'listitem' });
    const btn = createEl('button', {
      class: 'audience-btn',
      'aria-label': store.easyText ? aud.labelEasy : aud.label
    });

    const icon = createEl('span', { class: 'audience-icon', 'aria-hidden': 'true' }, [aud.icon]);
    const label = createEl('span', { class: 'audience-label' }, [
      store.easyText ? aud.labelEasy : aud.label
    ]);
    const desc = createEl('span', { class: 'audience-desc' }, [
      store.easyText ? aud.descriptionEasy : aud.description
    ]);

    btn.appendChild(icon);
    btn.appendChild(label);
    btn.appendChild(desc);
    btn.addEventListener('click', () => navigate(`#/ruta/${aud.id}`));
    card.appendChild(btn);
    grid.appendChild(card);
  });

  section.appendChild(grid);
  container.appendChild(hero);
  container.appendChild(section);
}

export function renderRoute(container, audienceId) {
  const { content } = store;
  const ui = content.ui;
  const routeData = content.routes[audienceId];

  if (!routeData) {
    navigate('#/');
    return;
  }

  container.innerHTML = '';

  const audInfo = content.audiences.find(a => a.id === audienceId);
  const easy = store.easyText;

  const header = createEl('section', { class: 'route-header', 'aria-labelledby': 'route-title' });
  const icon = createEl('span', { class: 'route-icon', 'aria-hidden': 'true' }, [
    audInfo?.icon || ''
  ]);
  const h1 = createEl('h1', { id: 'route-title', class: 'route-title' }, [
    easy ? routeData.titleEasy : routeData.title
  ]);
  const intro = createEl('p', { class: 'route-intro' }, [
    easy ? routeData.introEasy : routeData.intro
  ]);
  header.appendChild(icon);
  header.appendChild(h1);
  header.appendChild(intro);

  const cardsSection = createEl('section', {
    class: 'cards-section',
    'aria-label': 'Tarjetas de contenido'
  });
  const cardList = createEl('ul', { class: 'card-list' });

  routeData.cards.forEach(card => {
    const li = createEl('li', { class: 'card-item' });
    const article = createEl('article', {
      class: 'content-card',
      'aria-labelledby': `card-title-${card.id}`
    });

    const cardIcon = createEl('span', { class: 'card-icon', 'aria-hidden': 'true' }, [card.icon]);
    const cardTitle = createEl('h2', {
      id: `card-title-${card.id}`,
      class: 'card-title'
    }, [easy ? card.titleEasy : card.title]);

    const textContainer = createEl('div', { class: 'card-text' });
    const textSpan = glossarySpan(easy ? card.textEasy : card.textFull);
    textContainer.appendChild(textSpan);

    article.appendChild(cardIcon);
    article.appendChild(cardTitle);
    article.appendChild(textContainer);
    li.appendChild(article);
    cardList.appendChild(li);
  });

  cardsSection.appendChild(cardList);

  const resourceBtn = createEl('button', {
    class: 'btn btn-primary resource-btn'
  }, [ui.openResource]);
  resourceBtn.addEventListener('click', () => navigate('#/recurso'));

  const backBtn = createEl('button', {
    class: 'btn btn-secondary back-btn'
  }, [ui.backBtn]);
  backBtn.addEventListener('click', () => navigate('#/'));

  const actions = createEl('div', { class: 'route-actions' });
  actions.appendChild(backBtn);
  actions.appendChild(resourceBtn);

  container.appendChild(header);
  container.appendChild(cardsSection);
  container.appendChild(actions);
}
