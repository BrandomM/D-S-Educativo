# D&S Educativo — Prototipo SPA Educativa Accesible

SPA estática (HTML/CSS/JS vanilla) para educación sobre discapacidad y sexualidad, diseñada para jóvenes universitarios con discapacidad auditiva.

---

## Estructura del proyecto

```
/
  index.html
  assets/
    css/
      main.css
    js/
      app.js          — arranque, carga de datos, header
      router.js       — hash router
      store.js        — estado global
      views.js        — vistas Inicio y Ruta
      decisionTree.js — árbol de decisiones
      glossary.js     — modal de glosario
      utils.js        — helpers
  data/
    content.es.json        — textos, audiencias, cards, glosario, fuentes
    decision-tree.es.json  — nodos del árbol de decisiones
  README.md
  CLAUDE.md
  ROADMAP.md
```

---

## Cómo correr localmente

El proyecto usa ES Modules (`type="module"`), por lo que **no se puede abrir con `file://`** directamente en algunos navegadores. Usa un servidor local:

```bash
# Opción 1: Python
python -m http.server 8080

# Opción 2: Node (npx)
npx serve .

# Opción 3: VS Code
# Instala la extensión "Live Server" y haz clic en "Go Live"
```

Luego abre `http://localhost:8080` en el navegador.

---

## Despliegue en GitHub Pages

1. Crea un repositorio en GitHub (puede ser público o privado con plan que lo permita).
2. Sube todos los archivos a la rama `main` (o `master`):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
   git push -u origin main
   ```
3. En el repositorio, ve a **Settings → Pages**.
4. En *Source*, selecciona la rama `main` y la carpeta `/ (root)`.
5. Haz clic en **Save**. GitHub Pages generará una URL del tipo:
   `https://TU_USUARIO.github.io/TU_REPO/`
6. La app usará rutas relativas y funcionará correctamente con hash routing.

> **Nota:** No se requiere ningún archivo `_config.yml` ni configuración adicional de Jekyll para esta SPA.

---

## Dónde reemplazar placeholders

### `data/content.es.json`

| Clave | Qué reemplazar |
|---|---|
| `ui.appName` | Nombre real de la app |
| `audiences[*].label / description` | Nombres y descripciones de audiencias |
| `routes.*.title / intro` | Título e introducción de cada ruta |
| `routes.*.cards[*].title` | Título real de cada tarjeta |
| `routes.*.cards[*].textFull` | Texto académico completo |
| `routes.*.cards[*].textEasy` | Versión en lenguaje sencillo |
| `glossary.concepto_a/b/c` | Términos reales con definiciones |
| `sources[*]` | Referencias bibliográficas reales |

### `data/decision-tree.es.json`

| Clave | Qué reemplazar |
|---|---|
| `nodes.n1.title / promptFull / promptEasy` | Situación inicial real |
| `nodes.n1.choices[*].labelFull / labelEasy` | Etiquetas de las opciones |
| `nodes.n2 / n3.title / promptFull / promptEasy` | Texto de cada resultado |

### `index.html`

- Footer: reemplaza `[Institución]` y `[Año]` con los datos reales.

### Imágenes (placeholder)

Si deseas agregar imágenes ilustrativas a las cards:
- Crea la carpeta `assets/img/`
- Agrega la imagen (por ejemplo: `assets/img/tema1.jpg`)
- En `views.js`, dentro de la función que construye cada card, agrega:
  ```js
  const img = createEl('img', {
    src: 'assets/img/tema1.jpg',
    alt: 'Descripción accesible de la imagen',
    class: 'card-img'
  });
  article.insertBefore(img, cardTitle);
  ```

---

## Accesibilidad implementada

- Skip link "Saltar al contenido principal"
- `:focus-visible` con contraste visible
- `aria-live="polite"` en árbol de decisiones
- Modal con trampa de foco y cierre con ESC
- Botones mínimo 44px táctil en móvil
- `prefers-reduced-motion` respetado
- Sin dependencia de audio
- Roles semánticos: `banner`, `main`, `contentinfo`, `dialog`
