# CLAUDE.md — Memoria del proyecto D&S Educativo

## Descripción del proyecto

SPA estática educativa (HTML/CSS/JS vanilla sin frameworks) para jóvenes universitarios con discapacidad auditiva. Tema: discapacidad y sexualidad (todos los textos de contenido son placeholders neutrales). Desplegable en GitHub Pages.

## Stack técnico

- HTML5 semántico + CSS custom properties
- JavaScript ES Modules (sin build step)
- Hash routing manual (`#/`, `#/ruta/:audiencia`, `#/recurso`)
- Datos externos: dos JSON en `data/` cargados con `fetch`
- Sin frameworks, sin dependencias npm

## Arquitectura de archivos

```
index.html           — entrada, carga app.js como módulo
assets/css/main.css  — todos los estilos, variables CSS, responsive
assets/js/
  app.js             — init: fetch JSONs → buildHeader → initRouter
  router.js          — parsea hash, llama vistas; exporta navigate() y route()
  store.js           — estado global reactivo (easyText, audience, content, tree, treeHistory)
  views.js           — renderHome() y renderRoute(container, audienceId)
  decisionTree.js    — renderTree(container), renderNode() interno
  glossary.js        — parseGlossaryTokens(), openGlossaryModal(), closeGlossaryModal()
  utils.js           — qs(), qsa(), createEl(), escapeHTML(), trapFocus(), announce()
data/
  content.es.json    — ui strings, audiences[], routes{}, glossary{}, sources[]
  decision-tree.es.json — startNode + nodes{n1,n2,n3}
```

## Decisiones de diseño

- **Sin rutas absolutas**: todos los `fetch` y `href` son relativos para que funcionen en GitHub Pages bajo un subdirectorio.
- **import.meta.url para BASE**: `app.js` deriva la ruta base del módulo para construir las URLs de fetch de manera compatible con cualquier subdirectorio de GitHub Pages.
- **Tokens de glosario**: patrón `{glosario:clave}` en los textos de los JSON, parseados en tiempo de render por `glossary.js`.
- **store.js reactivo simple**: patrón pub-sub con `subscribe(fn)` para que el toggle de texto fácil re-renderice la vista activa.
- **aria-live en árbol**: el contenedor `#tree-node-region` tiene `aria-live="polite"` y `aria-atomic="true"` para que los lectores de pantalla anuncien cambios de nodo.
- **trapFocus para modal**: la función en `utils.js` captura Tab/Shift-Tab dentro del modal y lo libera al cerrar.

## Restricciones activas

- NO agregar frameworks (React, Vue, Angular, Svelte, etc.)
- NO contenido sexual explícito — solo placeholders
- NO gamificación (sin puntajes, rankings, correcto/incorrecto)
- NO rutas absolutas tipo `/assets`
- Máximo 3 nodos en árbol de decisiones

## Cómo extender el proyecto

### Agregar un nuevo idioma
1. Duplicar `data/content.es.json` → `data/content.en.json`
2. En `app.js`, detectar preferencia de idioma y cargar el JSON correspondiente.

### Agregar más nodos al árbol (máximo actual: 3)
- Modificar `data/decision-tree.es.json` agregando claves al objeto `nodes`
- El árbol es completamente data-driven, no requiere cambios en el código

### Agregar imágenes
- Carpeta: `assets/img/`
- Referenciar con ruta relativa: `assets/img/nombre.jpg`
- Siempre incluir atributo `alt` accesible

### Agregar nueva audiencia
1. Agregar entrada en `content.es.json → audiences[]`
2. Agregar entrada en `content.es.json → routes`
3. Agregar el `id` al array `VALID_AUDIENCES` en `router.js`

## Criterios de aceptación verificados

- [x] Navegación hash entre las 3 vistas sin errores
- [x] Hash inválido redirige a `#/`
- [x] Toggle texto fácil persiste en localStorage al recargar
- [x] Modal glosario: abre con clic, cierra con ESC, devuelve foco al activador
- [x] Árbol: iniciar → elegir → resultado → reiniciar / volver
- [x] Compatible con GitHub Pages (rutas relativas)
- [x] Accesible: skip link, focus-visible, aria-live, sin dependencia de audio
