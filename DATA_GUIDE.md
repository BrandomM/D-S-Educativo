# Guía de estructura de datos — D&S Educativo

Este documento describe exactamente qué información debe ir en cada campo de los dos archivos JSON que alimentan la aplicación. Está pensado para usarse en una sesión de síntesis de fuentes bibliográficas: con esta guía y las referencias del curso, se puede rellenar toda la app sin tocar una sola línea de código.

---

## Archivos de datos

| Archivo | Qué contiene |
|---|---|
| `data/content.es.json` | Textos de interfaz, tarjetas de contenido por audiencia, glosario y fuentes |
| `data/decision-tree.es.json` | Las tres situaciones del recurso interactivo y el mensaje de cierre |

---

## 1. `data/content.es.json`

### 1.1 Bloque `ui` — Etiquetas de interfaz

Textos cortos que aparecen en botones, encabezados y mensajes del sistema. No son contenido educativo; son literales de la interfaz.

```json
"ui": {
  "appName": "Nombre de la aplicación que aparece en la barra superior",
  "toggleEasyLabel": "Etiqueta del botón de texto fácil (ej. 'Texto fácil')",
  "toggleEasyOn": "Texto del botón cuando el modo fácil está activo (ej. 'ON')",
  "toggleEasyOff": "Texto del botón cuando el modo fácil está inactivo (ej. 'OFF')",
  "backBtn": "Texto del botón Volver",
  "restartBtn": "Texto del botón Reiniciar",
  "openResource": "Texto del botón que lleva al recurso interactivo",
  "sourcesTitle": "Título del acordeón de fuentes (ej. 'Fuentes y créditos')",
  "homeTitle": "Título principal de la página de inicio",
  "homeSubtitle": "Subtítulo de la página de inicio",
  "chooseAudience": "Encabezado de la sección de selección de perfil",
  "glossaryTitle": "Encabezado del modal de glosario",
  "glossaryClose": "Aria-label del botón cerrar del modal (solo para lectores de pantalla)",
  "loading": "Mensaje mientras carga la app",
  "errorLoad": "Mensaje si falla la carga de datos",
  "invalidRoute": "Mensaje si la URL es inválida"
}
```

---

### 1.2 Bloque `audiences` — Tarjetas de selección de perfil

Array con exactamente **3 objetos**, uno por audiencia. Aparecen en la página de inicio como tarjetas de selección.

```json
"audiences": [
  {
    "id": "estudiante",         // No cambiar — es la clave de ruta
    "label": "Estudiante",      // Nombre del perfil (texto completo)
    "labelEasy": "Soy estudiante",  // Nombre del perfil (texto fácil)
    "icon": "🎓",               // Emoji o código SVG representativo
    "description": "Una oración que describe qué encontrará este perfil en la app.",
    "descriptionEasy": "La misma idea en palabras más simples y cortas."
  },
  {
    "id": "familia",
    ...
  },
  {
    "id": "docente",
    ...
  }
]
```

> **Regla:** Los valores de `id` (`estudiante`, `familia`, `docente`) no deben cambiarse; son los identificadores de ruta que usa el router.

---

### 1.3 Bloque `routes` — Contenido por audiencia

Objeto con tres claves (`estudiante`, `familia`, `docente`). Cada clave contiene el título, la introducción y un array de **3 tarjetas** de contenido.

#### Estructura de cada ruta

```json
"routes": {
  "estudiante": {
    "title": "Título de la sección para estudiantes (texto completo)",
    "titleEasy": "Título para estudiantes (texto fácil)",
    "intro": "Párrafo introductorio que contextualiza el tema para este perfil.",
    "introEasy": "La misma introducción en lenguaje sencillo.",
    "cards": [ /* ver estructura de card abajo */ ]
  },
  "familia": { ... },
  "docente": { ... }
}
```

#### Estructura de cada `card`

Cada tarjeta presenta un concepto, tema o estrategia. La app muestra 3 por audiencia.

```json
{
  "id": "est-1",       // Identificador único — no cambiar el prefijo, sí el número
  "icon": "📖",        // Emoji representativo del tema de la tarjeta
  "title": "Nombre del tema o concepto (texto completo, máx. ~60 caracteres)",
  "titleEasy": "Nombre del tema (texto fácil, más corto)",
  "textFull": "Explicación completa del tema. Aquí va el contenido académico sintetizado de las fuentes. Puede incluir tokens de glosario con la sintaxis {glosario:clave_del_termino}. Longitud sugerida: 3-5 oraciones.",
  "textEasy": "La misma explicación en lenguaje claro y sencillo, sin tecnicismos. Oraciones cortas. Longitud sugerida: 2-3 oraciones."
}
```

#### Cómo usar tokens de glosario en los textos

Dentro de `textFull` o `textEasy`, encierra un término con `{glosario:clave}` para que la app lo convierta en un enlace que abre el modal del glosario:

```
"textFull": "La {glosario:autonomia} es un derecho fundamental reconocido en la Convención sobre los Derechos de las Personas con Discapacidad."
```

La `clave` debe coincidir exactamente con una entrada en el bloque `glossary` (ver sección 1.4).

---

### 1.4 Bloque `glossary` — Glosario de términos

Objeto con exactamente **3 entradas** clave-valor. Las claves son los identificadores que se usan en los tokens `{glosario:clave}` de los textos de las tarjetas.

```json
"glossary": {
  "clave_del_termino": {
    "term": "Nombre del término tal como aparecerá en el modal y en el enlace dentro del texto",
    "definitionFull": "Definición académica completa del término. Puede incluir referencias o matices técnicos. Longitud sugerida: 2-4 oraciones.",
    "definitionEasy": "Definición breve en lenguaje sencillo y directo. Longitud sugerida: 1-2 oraciones."
  }
}
```

**Ejemplo con claves reales:**

```json
"glossary": {
  "autonomia": {
    "term": "Autonomía",
    "definitionFull": "Capacidad de una persona para tomar decisiones sobre su propia vida sin interferencia externa, reconocida como derecho en la Convención sobre los Derechos de las Personas con Discapacidad (ONU, 2006).",
    "definitionEasy": "Poder decidir por ti mismo sobre tu propia vida."
  },
  "diversidad_funcional": { ... },
  "inclusion": { ... }
}
```

> **Importante:** Si cambias las claves del glosario, debes actualizar también los tokens `{glosario:clave}` en los textos de las tarjetas para que coincidan.

---

### 1.5 Bloque `sources` — Fuentes y créditos

Array de cadenas de texto. Aparece en la página de inicio dentro del acordeón "Fuentes y créditos". Cada elemento es una referencia bibliográfica o crédito formateado como texto plano.

```json
"sources": [
  "Apellido, N. (Año). Título del artículo o libro. Revista o Editorial. https://doi.org/...",
  "Apellido, N. y Apellido, N. (Año). Título. Ciudad: Editorial.",
  "Organización (Año). Nombre del documento. Recuperado de https://...",
  "Créditos de accesibilidad: nombre de la guía o estándar utilizado."
]
```

> Formato sugerido: **APA 7.ª edición**, que es el estándar habitual en la UNAD.

---

## 2. `data/decision-tree.es.json`

### 2.1 Estructura general

```json
{
  "scenarios": [ /* 3 objetos, uno por situación */ ],
  "completion": { /* mensaje final de agradecimiento */ }
}
```

### 2.2 Bloque `scenarios` — Las tres situaciones

Cada escenario es una mini-situación independiente con una pregunta inicial y dos posibles resultados. El usuario recorre los tres en secuencia.

```json
{
  "id": "s1",           // No cambiar
  "startNode": "n1",    // No cambiar — siempre arranca en n1
  "nodes": {
    "n1": { /* nodo inicial con dos opciones */ },
    "n2": { /* resultado de la Opción A */ },
    "n3": { /* resultado de la Opción B */ }
  }
}
```

#### Nodo inicial (`n1`) — La situación / pregunta

```json
"n1": {
  "id": "n1",
  "icon": "🤔",
  "title": "Título breve de la situación (máx. ~50 caracteres)",
  "promptFull": "Descripción completa de la situación o pregunta. Debe plantear un dilema, escenario o decisión que el usuario deba evaluar. Longitud sugerida: 3-5 oraciones.",
  "promptEasy": "La misma situación en lenguaje sencillo y directo. Oraciones cortas. Longitud sugerida: 2-3 oraciones.",
  "choices": [
    {
      "id": "c1",
      "labelFull": "Texto de la Opción A (acción, decisión o respuesta). Máx. ~80 caracteres.",
      "labelEasy": "Opción A en palabras simples. Máx. ~60 caracteres.",
      "next": "n2"
    },
    {
      "id": "c2",
      "labelFull": "Texto de la Opción B. Máx. ~80 caracteres.",
      "labelEasy": "Opción B en palabras simples. Máx. ~60 caracteres.",
      "next": "n3"
    }
  ]
}
```

#### Nodos de resultado (`n2` y `n3`) — Las consecuencias

Los nodos de resultado no tienen `choices` (o tienen el array vacío). Explican qué implica haber elegido esa opción.

```json
"n2": {
  "id": "n2",
  "icon": "✅",
  "title": "Título del resultado (ej. 'Decisión acertada', 'Reflexión importante')",
  "promptFull": "Explicación de las implicaciones, consecuencias o aprendizajes de la Opción A. Puede incluir orientaciones, recomendaciones o información educativa relevante. Longitud sugerida: 3-5 oraciones.",
  "promptEasy": "La misma explicación en palabras sencillas. Longitud sugerida: 2-3 oraciones.",
  "choices": []
}
```

> **Nota sobre los iconos de resultado:** Usa iconos que no impliquen juicio de valor entre las dos opciones (no "✅ correcto / ❌ incorrecto"). Ambas opciones deben ser oportunidades de aprendizaje.

---

### 2.3 Bloque `completion` — Mensaje de cierre

Aparece después de completar las tres situaciones. Es un mensaje único, no asociado a ninguna opción específica.

```json
"completion": {
  "icon": "🎉",
  "title": "Título del mensaje de cierre (ej. '¡Gracias por participar!')",
  "messageFull": "Mensaje de cierre completo. Puede resumir los aprendizajes del recorrido, invitar a la reflexión, o agradecer la participación. Longitud sugerida: 3-5 oraciones.",
  "messageEasy": "El mismo mensaje en lenguaje sencillo. Longitud sugerida: 2-3 oraciones."
}
```

---

## Resumen de campos a reemplazar

| Campo | Ubicación | Versiones requeridas |
|---|---|---|
| Nombre de la app | `ui.appName` | 1 (única) |
| Descripciones de perfil | `audiences[*].description` | 2 por perfil (completa + fácil) |
| Título e intro de ruta | `routes.*.title / intro` | 2 por audiencia (completa + fácil) |
| Tarjetas de contenido | `routes.*.cards[*].textFull / textEasy` | 2 por tarjeta × 3 tarjetas × 3 audiencias = **18 textos** |
| Términos de glosario | `glossary.*` | 2 definiciones por término × 3 términos = **6 definiciones** |
| Fuentes bibliográficas | `sources[]` | Mínimo 3 referencias en formato APA |
| Situaciones del árbol | `scenarios[*].nodes.n1.promptFull / promptEasy` | 2 por situación × 3 situaciones = **6 textos** |
| Opciones del árbol | `scenarios[*].nodes.n1.choices[*].labelFull / labelEasy` | 2 por opción × 2 opciones × 3 situaciones = **12 etiquetas** |
| Resultados del árbol | `scenarios[*].nodes.n2 / n3.promptFull / promptEasy` | 2 por resultado × 2 resultados × 3 situaciones = **12 textos** |
| Mensaje de cierre | `completion.messageFull / messageEasy` | 2 (completo + fácil) |

---

## Consideraciones para la síntesis de contenido

- **Audiencia principal:** Jóvenes universitarios con discapacidad auditiva. El lenguaje debe ser claro y evitar depender de metáforas auditivas.
- **Texto fácil:** No es simplemente "más corto". Debe usar vocabulario cotidiano, oraciones activas, y evitar subordinadas complejas. Referencia: criterios de Lectura Fácil (IFLA, 2010).
- **Neutralidad:** No se deben incluir juicios normativos ni contenido explícito. El árbol de decisiones no tiene opciones "correctas" o "incorrectas"; ambas son oportunidades de reflexión.
- **Tokens de glosario:** Úsalos con moderación — 1 a 2 por tarjeta es suficiente. Demasiados fragmentan el texto.
- **Longitud de textos:** Los textos completos pueden tener entre 50 y 120 palabras. Los textos fáciles entre 20 y 50 palabras.
