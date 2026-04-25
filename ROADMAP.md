# ROADMAP — D&S Educativo

Control de hitos del proyecto. Actualiza el estado de cada ítem conforme avances.

## Estado

| Símbolo | Significado |
|---|---|
| ✅ | Completado |
| 🔄 | En progreso |
| ⬜ | Pendiente |
| ❌ | Bloqueado / descartado |

---

## Hito 1 — Estructura base y navegación ✅

**Meta:** SPA funcional con hash router, vistas vacías y sin errores en consola.

- [x] Crear estructura de carpetas y archivos
- [x] `index.html` con skip link, header, main, footer
- [x] `main.css` con variables, reset, layout base
- [x] `utils.js` — helpers (qs, createEl, escapeHTML, trapFocus, announce)
- [x] `store.js` — estado global reactivo
- [x] `router.js` — hash router con redirección en rutas inválidas
- [x] `app.js` — init, carga de JSONs, buildHeader

---

## Hito 2 — Vistas y contenido por audiencia ✅

**Meta:** Las tres rutas de audiencia muestran contenido con cards.

- [x] `data/content.es.json` con audiencias, cards por ruta, glosario, fuentes
- [x] `views.js` — renderHome() con grid de 3 tarjetas de audiencia
- [x] `views.js` — renderRoute() con cards y botón "Abrir recurso interactivo"
- [x] Estilos: hero, audience-grid, content-card

---

## Hito 3 — Texto fácil (toggle global) ✅

**Meta:** Toggle visible en header que reemplaza textos en todas las vistas y persiste.

- [x] Toggle switch en header con estado aria-checked
- [x] Persistencia en localStorage (clave: `ds_easyText`)
- [x] Re-render de la vista activa al cambiar el toggle
- [x] Afecta cards, árbol de decisiones y descripciones de audiencia

---

## Hito 4 — Glosario accesible ✅

**Meta:** Tokens `{glosario:clave}` en textos de cards se convierten en botones que abren un modal accesible.

- [x] `glossary.js` — parseGlossaryTokens(), glossarySpan()
- [x] `glossary.js` — openGlossaryModal() con trapFocus y cierre ESC
- [x] `data/content.es.json → glossary` con 3 términos placeholder
- [x] Modal muestra definición fácil + completa (si el toggle no está en modo fácil)
- [x] Devuelve foco al botón activador al cerrar

---

## Hito 5 — Árbol de decisiones ✅

**Meta:** Módulo interactivo con 3 nodos, historial, reiniciar/volver y accesibilidad.

- [x] `data/decision-tree.es.json` con n1 (inicio), n2, n3 (resultados)
- [x] `decisionTree.js` — renderTree() y renderNode()
- [x] Botones "Volver" (historial) y "Reiniciar"
- [x] `aria-live="polite"` en contenedor del nodo
- [x] Foco automático al primer elemento interactivo al cambiar nodo
- [x] Acordeón "Fuentes y créditos" con `<details>/<summary>`

---

## Hito 6 — Documentación ✅

- [x] `README.md` — instrucciones de ejecución local y despliegue en GitHub Pages
- [x] `CLAUDE.md` — memoria del proyecto para Claude Code
- [x] `ROADMAP.md` — este archivo

---

## Hito 7 — Reemplazo de placeholders ⬜

**Meta:** Sustituir todos los textos placeholder con contenido educativo real.

- [ ] Reemplazar `ui.appName` y textos de interfaz
- [ ] Reemplazar cards de audiencia `estudiante` (3 cards)
- [ ] Reemplazar cards de audiencia `familia` (3 cards)
- [ ] Reemplazar cards de audiencia `docente` (3 cards)
- [ ] Reemplazar términos de glosario (concepto_a, concepto_b, concepto_c)
- [ ] Reemplazar nodos del árbol de decisiones (n1, n2, n3)
- [ ] Reemplazar fuentes y créditos
- [ ] Reemplazar footer con institución y año reales

---

## Hito 8 — Pruebas y ajuste ⬜

- [ ] Probar en Chrome, Firefox, Safari (móvil y escritorio)
- [ ] Probar con lector de pantalla (NVDA / VoiceOver)
- [ ] Verificar contraste de colores (WCAG AA mínimo)
- [ ] Verificar navegación completa con solo teclado
- [ ] Probar en GitHub Pages (URL real)

---

## Hito 9 — Despliegue ⬜

- [ ] Crear repositorio en GitHub
- [ ] Subir todos los archivos a la rama `main`
- [ ] Activar GitHub Pages en Settings → Pages
- [ ] Verificar URL pública funcionando
- [ ] Compartir URL con usuarios de prueba

---

## Backlog (ideas futuras, no comprometidas)

- [ ] Soporte multiidioma (EN/ES)
- [ ] Modo alto contraste manual (además del automático del OS)
- [ ] Animación de transición entre vistas (respetando prefers-reduced-motion)
- [ ] Exportar/imprimir resultado del árbol de decisiones
- [ ] Añadir más de 3 nodos al árbol si el contenido lo requiere
