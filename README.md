# Sesión 1 · El viaje de una impresión

Sitio de una sola página (Single Page Website) para la clase de programática (ESIC), con navegación sticky + scrollspy, secciones interactivas y un banner leaderboard 728×90 simulado.

## Estructura
- `index.html` — página principal (SPW con las 12 secciones).
- `assets/` — estilos y lógica:
  - `styles.css` — sistema visual base.
  - `spw.css` / `spw.js` — barra sticky, scrollspy y progreso.
  - `dynamic.css` / `dynamic.js` — componentes interactivos (carrusel, "viaje" clicable, tabs, checklist, tarjetas de formato).
  - `adslot.js` — banner publicitario sticky por sección.
- `recursos/` — herramientas y materiales enlazados (Inspector AdTech, Last Look, benchmarks CPM, simulador RTB…).

## Uso
Es un sitio estático: abre `index.html` en el navegador. No requiere build ni dependencias.

### Publicar en GitHub Pages
1. Sube estos archivos a un repositorio.
2. En *Settings → Pages*, selecciona la rama y la carpeta raíz.
3. El sitio quedará disponible en la URL de GitHub Pages.

> Tecnología: HTML, CSS y JavaScript nativo (sin frameworks).
