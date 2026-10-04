# HILA v6 · Guía del sitio

Sitio estático (HTML, CSS y JavaScript puros, sin compilar). Funciona abriendo
`index.html` con doble clic y también publicado en cualquier servidor web.

## Qué hay en cada carpeta

| Ruta | Qué es |
|---|---|
| `index.html` | Página principal (un solo H1, en el hero). |
| `styles.css` | Estilos de todo el sitio (incluye la hoja de impresión del comprobante). |
| `script.js` | Interacción de la página principal: modal, carruseles, cuestionario, pago simulado, comprobante PDF. Al inicio están las listas editables `MEDIOS` (carrusel "Un vistazo") y `MERCH`. |
| `escenas.js` | Ilustraciones por capas y líneas topográficas (lo usan todas las páginas). |
| `pagina.js` | Script ligero de las páginas interiores (menú, navegación, URLs limpias). |
| `experiencias/<slug>/index.html` | Una página indexable por experiencia. |
| `legal/<slug>/index.html` | Aviso de privacidad, Políticas de cancelación y Términos y condiciones (texto provisional). |
| `404.html` | Página de error (usa rutas absolutas: asume que el sitio vive en la raíz del dominio). |
| `data/salidas.json` | Esquema DEMO de experiencias, salidas y cupos (imita la futura base de datos). |
| `data/salidas.js` | Copia del JSON para cuando abres con doble clic (el navegador no deja leer `.json` desde `file://`). Si editas uno, copia el contenido al otro. |
| `media/` | Fotos y videos del sitio. `media/merch/` para la merch. |
| `img/` | Imagen social, íconos y logotipo (ver `img/LEEME-imagenes.txt`). |
| `favicon.svg` | Favicon provisional. |
| `sitemap.xml`, `robots.txt` | Para buscadores. |

## Reemplazar SITE_URL (tu dominio) en un solo paso

Todas las URLs absolutas usan el marcador `https://www.tu-dominio.com`
(canonical, Open Graph, JSON-LD, sitemap y robots). Reemplázalo en todos los
archivos a la vez:

- **VS Code:** Buscar en archivos (Ctrl+Shift+H) → buscar `https://www.tu-dominio.com` → reemplazar por tu dominio (sin `/` final) → *Reemplazar todo*.
- **PowerShell** (dentro de la carpeta `v6`):

  ```powershell
  Get-ChildItem -Recurse -Include *.html,*.xml,*.txt | ForEach-Object {
    (Get-Content $_ -Raw -Encoding UTF8).Replace('https://www.tu-dominio.com','https://www.hila.mx') |
      Set-Content $_ -Encoding UTF8 -NoNewline }
  ```

## Fotos

- Hero: `media/hero.jpg` (2400 × 1600). Tarjetas, vista rápida y páginas de experiencia: `media/kayak.jpg`, `media/ferrata.jpg`, `media/camping.jpg` (1200 × 1600 o mayor).
- Carrusel "Un vistazo": archivos en `media/` según la lista `MEDIOS` de `script.js`. Cada slide **debe** tener `alt` (la consola avisa si falta).
- Merch: `media/merch/` según la lista `MERCH`. Cada producto **debe** tener `alt`.
- Mientras una foto no exista se ve la ilustración o un marcador neutro. Ajusta los `alt` del HTML a lo que muestre cada foto real.

## Agregar una experiencia nueva

1. Copia la carpeta `experiencias/kayak-en-xochimilco/` con el nuevo slug (por ejemplo `experiencias/senderismo-en-el-ajusco/`).
2. En su `index.html` edita: `<title>`, `meta description`, `canonical`, `og:*`, `twitter:*`, el JSON-LD de migas de pan, el `data-mood`, la escena (`data-scene`), la foto y su `alt`, textos, preguntas frecuentes y el enlace de reservar (`?experiencia=<id>`).
3. En `script.js`, agrega la experiencia al objeto `EXPERIENCIAS` (con `slug`, `alt` y `llevar`). Si necesita otra ilustración, agrega una función en `ESCENAS` de `escenas.js` y un ambiente `[data-mood="<id>"]` en `styles.css`.
4. En `index.html`, agrega su tarjeta en la sección "Encuentra tu plan ideal" y su opción en el cuestionario (paso 2).
5. Agrega enlaces a la nueva página en: menú móvil y pie de `index.html`, bloque "También te puede gustar" y pie de las otras páginas de experiencia, y `404.html`.
6. Agrega su `<url>` en `sitemap.xml` (con `lastmod`).
7. Agrega la experiencia y sus salidas en `data/salidas.json` y `data/salidas.js`.

## Qué está simulado (DEMO)

- **Pago:** la pantalla de PayPal es una simulación con botones de demo; no hay cobro.
- **Folio** (`HILA-0000`) e **ID de transacción** del comprobante: se generan al azar en el navegador.
- **Salidas y cupos:** `data/salidas.json` es de ejemplo. "Quedan N lugares" y "Agotado" son solo visuales.
- **Correo de confirmación y WhatsApp:** no se envía nada; el número es `+52 55 0000 0000`.
- **Textos legales:** provisionales, marcados "por revisar con un abogado".
- **Precios, fechas, "seguro" y "12 personas máximo":** de ejemplo; confirma los reales.

## Qué falta para producción (Fase 2)

- Servidor con base de datos para experiencias, salidas y cupos, y **control real de cupos y sobreventa** (bloquear el lugar al iniciar el pago y liberarlo si falla).
- Integración real con PayPal (Checkout + confirmación del pago en el servidor con webhook).
- Folio y comprobante generados por el servidor; envío del correo de confirmación.
- Guardar las respuestas del cuestionario de forma segura (datos de salud: aviso de privacidad aprobado).
- `/administrador` protegido con login del servidor y `noindex` (robots.txt no es seguridad).
- Datos estructurados `Event`/`Offer` por experiencia cuando existan fechas y precios reales.
- Imagen social, íconos y logotipo reales en `img/`; favicon definitivo.
- Dar de alta el sitio y el sitemap en Google Search Console.
