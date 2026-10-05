# HILA v9 · Guía del sitio

Sitio estático (HTML, CSS y JavaScript puros, sin compilar). Funciona abriendo
`index.html` con doble clic y también publicado en cualquier servidor web.

## Qué hay en cada carpeta

| Ruta | Qué es |
|---|---|
| `index.html` | Página principal (un solo H1, en el hero). |
| `styles.css` | Estilos de todo el sitio (incluye la hoja de impresión del comprobante). La paleta está al inicio, en `:root`. |
| `script.js` | Interacción de la página principal: vista rápida, "Un vistazo", cuestionario, pago simulado y comprobante PDF. Al inicio están las listas editables `VISTAZO` y `MERCH`. |
| `animaciones.js` | Movimiento compartido por todas las páginas (va en el `<head>`): modo ligero, telón, entradas al hacer scroll, parallax, luz de tarjetas, botón magnético, menú móvil y barra de lectura. Ver "Movimiento". |
| `escenas.js` | Ilustraciones por capas y líneas topográficas (las usan todas las páginas). Sus colores salen de la paleta oficial. |
| `pagina.js` | Script ligero de las páginas interiores (menú, próximas salidas, índice de los textos legales, URLs limpias). |
| `experiencias/<slug>/index.html` | Una página indexable por experiencia, con su lista de "Próximas salidas". |
| `legal/<slug>/index.html` | Aviso de privacidad, Política de cancelaciones y reembolsos, y Términos y condiciones (texto oficial, ver abajo). |
| `404.html` | Página de error (usa rutas absolutas: asume que el sitio vive en la raíz del dominio). |
| `data/salidas.json` | Experiencias y salidas (fecha, hora, punto de encuentro, precio y estado). |
| `data/salidas.js` | Copia del JSON para cuando abres con doble clic (el navegador no deja leer `.json` desde `file://`). |
| `media/` | Fotos del sitio. `media/vistazo/<slug>/` para "Un vistazo" y `media/merch/` para la merch. |
| `img/` | Logotipo oficial, imagen social e íconos (ver `img/LEEME-imagenes.txt`). |
| `favicon.svg` | Favicon provisional. |
| `sitemap.xml`, `robots.txt` | Para buscadores. |

## Cambiar fechas, horas, puntos de encuentro y precios

Todo vive en `data/salidas.json` (las instrucciones también están dentro del archivo).

1. Cada bloque dentro de `"salidas"` es una fecha:

   ```json
   {
     "id": "DEMO-1001",
     "experiencia_id": "kayak",
     "fecha": "2026-10-17",
     "hora": "05:30",
     "punto_de_encuentro": "Punto de encuentro DEMO en CDMX (por confirmar)",
     "precio": 850,
     "estado": "publicada"
   }
   ```

   - `fecha`: AAAA-MM-DD. `hora`: HH:MM en formato de 24 horas.
   - `precio`: en pesos y sin comas. Es el precio **por persona** de esa fecha.
   - `experiencia_id`: `kayak`, `ferrata` o `camping`.
   - `estado`: `publicada` (se ve y se puede reservar) o `desactivada` (no se muestra).
2. **Agregar una fecha:** copia un bloque completo y cámbiale el `id`, que no se debe repetir. **Quitarla:** bórrala o ponle `"estado": "desactivada"`.
3. El precio "desde" de cada experiencia está en `"experiencias"` → `precio_desde`.
4. **Importante:** cuando termines, copia el mismo contenido en `data/salidas.js`, entre `window.HILA_SALIDAS = ` y el `;` del final.

Con eso se actualizan solas la próxima fecha de cada tarjeta ("Próxima salida: Sáb 17 oct"), la "Próxima fecha" de la vista rápida, la lista "Próximas salidas" de las páginas de experiencia y el selector de fecha del cuestionario. (La vista rápida ya no lista las fechas: su botón "Reservar" abre el cuestionario con la experiencia elegida y la fecha se escoge ahí.) Si una experiencia no tiene fechas publicadas, se muestra "Próximamente".

> En esta versión **no hay control de capacidad**: cualquier persona puede reservar cualquier fecha publicada, de 1 a 10 personas por reserva, y el negocio confirma cada reserva manualmente. El total que se muestra es el precio de la fecha por el número de personas.

## Logotipo

- **Archivo maestro:** `img/logo-hila.png` (copia idéntica de `referencias/logo-hila.png`). Usa siempre ese archivo; no reconstruyas HILA ni el lema con tipografía, CSS ni SVG.
- `img/logo-hila.webp` es la misma imagen en WebP, del mismo tamaño (396 × 265) y con el mismo aspecto, para que cargue más rápido. El navegador elige sola la mejor versión con `<picture>`.
- Como el maestro tiene fondo de papel, el sitio lo presenta siempre como una **etiqueta**: esquinas redondeadas, borde fino y sombra suave (sobre fondos oscuros, solo el borde). Lo ves en el encabezado, el menú móvil, el pie, las páginas interiores, la 404, la pantalla de pago y el comprobante PDF.
- **Si consigues una versión más grande** (al menos 1600 px de ancho), reemplaza `img/logo-hila.png` con el mismo nombre y vuelve a crear el WebP. Después, en el HTML, agrega los anchos nuevos al `srcset`.
- **Si consigues una versión transparente oficial** (PNG o SVG del diseñador), guárdala como `img/logo-hila-transparente.png` (o `.svg`). Úsala solo sobre fondos que contrasten con el verde del logo (crema o blanco) y sin etiqueta. Sobre verde bosque el logo verde no se ve.
- `img/logo-hila-sin-fondo.png` y `img/logo-hila-trazado.svg` son **intentos automáticos que no se usan**. Sirven solo de referencia y no reemplazan un archivo oficial del diseñador.
- **Favicon:** `favicon.svg` es provisional. Para el definitivo, recorta del logo maestro el símbolo (la "i" con el punto y la montaña) en un cuadrado, sin redibujarlo, y súbelo a un generador como realfavicongenerator.net. Te devuelve `favicon.ico`, `apple-touch-icon.png` (180 × 180) y los PNG; cópialos a la raíz y a `img/`.

## Paleta oficial

| Variable CSS | Color | Uso |
|---|---|---|
| `--verde-bosque` | `#153F2C` | Texto principal, fondos oscuros, mensajes de éxito. |
| `--terracota` | `#AF4323` | Botones principales, acentos y errores (siempre con icono). |
| `--crema` | `#FAF7F1` | Fondo general y texto sobre oscuro. |
| `--arena` | `#E0D1C1` | Fondos secundarios y acentos sobre oscuro. |
| `--salvia` | `#788877` | Detalles e ilustraciones (nunca texto pequeño sobre fondo claro). |
| `--blanco` | `#FFFFFF` | Tarjetas, campos y comprobante. |

Ambientes por experiencia: **Tranquilidad** (kayak) = salvia + verde bosque; **Adrenalina** (vía ferrata) = terracota + arena; **Naturaleza** (camping) = verde bosque + crema y arena.
Cualquier tono intermedio se obtiene de estos seis con `color-mix()` o con transparencia, nunca con un color nuevo. Nunca uses terracota como texto sobre verde bosque.

## Agregar fotos y videos a "Un vistazo"

1. Copia el archivo a la carpeta de su experiencia:
   - `media/vistazo/kayak-en-xochimilco/`
   - `media/vistazo/via-ferrata-y-rappel/`
   - `media/vistazo/camping-en-las-estacas/`
2. Abre `script.js` y busca la lista `VISTAZO` (al inicio). Cada `{ ... }` es un slide:

   ```js
   { tipo: 'imagen', archivo: 'amanecer-en-el-canal.jpg', titulo: 'Amanecer en el canal', etiqueta: 'Kayak', alt: 'Kayaks avanzando por un canal de Xochimilco con la primera luz del día' },
   { tipo: 'video', archivo: 'remando-juntos.mp4', poster: 'remando-juntos.jpg', titulo: 'Remando juntos', etiqueta: 'Grupo', alt: 'Grupo remando en kayak y riendo en el canal' },
   ```

   - `tipo`: `'imagen'` o `'video'`. `archivo`: el nombre exacto del archivo dentro de la carpeta.
   - `titulo` y `etiqueta`: los textos que se ven sobre la foto.
   - `alt`: **obligatorio**. Describe lo que se ve (la consola avisa si falta).
   - `poster`: opcional, solo en videos. Es la imagen de portada.
3. **Agregar:** copia un bloque. **Quitar:** bórralo junto con su coma. **Reordenar:** mueve los bloques. Hay un máximo de 10 por experiencia (los demás se ignoran y la consola lo avisa). Una experiencia sin slides muestra "Próximamente".
4. Mientras un archivo no exista se ve el marcador "Aquí va tu foto o video" con el nombre que falta.

**Pesos recomendados:** fotos verticales 4:5 (por ejemplo 1080 × 1350), en `.jpg` o `.webp` y de **menos de 300 KB**. Videos `.mp4` de **10 a 20 segundos**, de **menos de 8 MB**, sin audio importante (se reproducen en silencio) y **siempre con poster**. Solo se cargan el slide activo y el siguiente.

**Mayúsculas y minúsculas:** el nombre en `archivo` debe coincidir *exactamente* con el del archivo, incluida la extensión. En Windows `foto.JPG` y `foto.jpg` son lo mismo, pero en casi todos los servidores web no: si la lista dice `foto.jpg` y el archivo se llama `foto.JPG`, en el sitio publicado se verá el marcador. Lo más fácil es renombrar los archivos con la extensión en minúsculas.

### Convertir un video a MP4 y sacar su portada (con ffmpeg)

ffmpeg es un programa gratuito. En Windows se instala con `winget install Gyan.FFmpeg` (o desde ffmpeg.org) y se usa desde PowerShell, dentro de la carpeta del video:

```powershell
# Convertir .mov a .mp4 compatible con todos los navegadores (H.264 + AAC, máx. 1080p)
ffmpeg -i rio-cristalino.MOV -c:v libx264 -preset slow -crf 23 -vf "scale='min(1080,iw)':-2" -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart rio-cristalino.mp4

# Sacar una portada (fotograma del segundo 1) con el mismo nombre del video
ffmpeg -ss 1 -i amanecer-en-el-canal.mp4 -frames:v 1 -q:v 3 amanecer-en-el-canal.jpg
```

Después, en la lista `VISTAZO`, cambia `archivo` al `.mp4` nuevo y agrega `poster: 'nombre.jpg'` a ese video. Sin ffmpeg: abre el video en el reproductor de Windows o en VLC, pausa en un buen momento y guarda una captura (VLC: *Video → Tomar instantánea*); para convertir, sirve HandBrake (gratuito) con el ajuste "Fast 1080p30" y la casilla "Web Optimized".

## Textos legales

Las 3 páginas tienen el texto **íntegro** de `referencias/legal/` (solo se le dio formato HTML):

| Página | Archivo de origen |
|---|---|
| `legal/aviso-de-privacidad/index.html` | `referencias/legal/aviso-de-privacidad.txt` |
| `legal/terminos-y-condiciones/index.html` | `referencias/legal/terminos-y-condiciones.txt` |
| `legal/politicas-de-cancelacion/index.html` | `referencias/legal/politica-de-cancelaciones.txt` |

Cada página tiene un índice (fijo a la izquierda en computadora y plegable en celular), un botón "Volver arriba" y una hoja de impresión limpia (Ctrl+P → Guardar como PDF). Las menciones de los otros documentos son enlaces. Los enlaces de las casillas del cuestionario abren en una pestaña nueva para no perder lo que la persona ya escribió.

### Marcadores pendientes

Están resaltados en las páginas (fondo arena con borde punteado terracota). Lista exacta:

| Marcador | Aviso de privacidad | Términos y condiciones | Política de cancelaciones |
|---|---|---|---|
| `[FECHA]` | 2 (arriba y al final) | 2 (arriba y al final) | 1 (arriba) |
| `[DOMICILIO COMPLETO EN CIUDAD DE MÉXICO]` | 1 (primer párrafo) | — | — |
| `[DOMICILIO]` | 1 (datos finales) | 1 (datos finales) | — |
| `[CORREO DE PRIVACIDAD]` | 6 (introducción, secciones 3, 9, 10 y 11, datos finales) | — | — |
| `[CORREO ELECTRÓNICO]` | — | 1 (datos finales) | 2 (sección 5 y datos finales) |
| `[DOMINIO / PÁGINA WEB]` | 1 (sección 12) | — | — |
| `[DOMINIO / URL DEL AVISO DE PRIVACIDAD]` | 1 (sección 13) | — | — |
| `[URL DEL AVISO DE PRIVACIDAD]` | — | 1 (sección 21) | — |
| `[DOMINIO / URL]` | — | 1 (sección 22) | — |
| `[DOMINIO]` | — | 1 (datos finales) | 1 (datos finales) |

En total son 12 en el aviso, 7 en los términos y 4 en la política de cancelaciones.

**Cómo reemplazarlos:** en cada página busca el marcador (Ctrl+F) y reemplaza **todo** el `<mark class="pendiente">[MARCADOR]</mark>` por el dato real. Por ejemplo, `<mark class="pendiente">[FECHA]</mark>` se cambia por `4 de octubre de 2026`. Así desaparece el resaltado. Si cambias el texto de algún documento, actualiza también su `.txt` en `referencias/legal/` para que sigan iguales. Al actualizar una página, cambia su `<lastmod>` en `sitemap.xml`.

## Al recargar la página

- Al **recargar** (F5 o el botón del navegador) o al volver con **Atrás/Adelante**, cualquier página empieza **arriba**, como una visita nueva: no recuerda el scroll y se quita el `#ancla` de la dirección. Lo hace un script pequeño dentro del `<head>` de cada página.
- Si el navegador restaura la página desde su memoria (caché de ida y vuelta), además se cierran los modales y el menú, se desbloquea el scroll, "Un vistazo" vuelve a la primera experiencia y foto, el merch vuelve al inicio y las animaciones de entrada se repiten.
- Los enlaces del menú a secciones (`#experiencias`, `#faq`...) y las visitas nuevas con `#ancla` funcionan normal.
- Las respuestas del cuestionario se conservan al recargar (se guardan en la pestaña mientras escribes), igual que antes.
- **Plan abierto:** en un servidor, al abrir un plan la dirección cambia a `/experiencias/<slug>/`; si recargas ahí, se carga la página de esa experiencia, arriba. Con doble clic (`file://`) la dirección no cambia al abrir un plan (los navegadores no lo permiten), así que al recargar se vuelve a cargar la página principal, arriba y sin el plan abierto. No hay errores en ninguno de los dos casos.

## Otras fotos

- Hero: `media/hero.jpg` (2400 × 1600). Tarjetas, vista rápida y páginas de experiencia: `media/kayak.jpg`, `media/ferrata.jpg` y `media/camping.jpg` (1200 × 1600 o mayor).
- Merch: `media/merch/`, según la lista `MERCH` de `script.js`. Cada producto **debe** tener `alt`.
- Mientras una foto no exista se ve la ilustración o un marcador neutro. Ajusta los `alt` del HTML a lo que muestre cada foto real.

## Reemplazar SITE_URL (tu dominio) en un solo paso

Todas las URLs absolutas usan el marcador `https://www.tu-dominio.com`
(canonical, Open Graph, JSON-LD, sitemap y robots). Reemplázalo en todos los
archivos a la vez:

- **VS Code:** Buscar en archivos (Ctrl+Shift+H) → buscar `https://www.tu-dominio.com` → reemplazar por tu dominio (sin `/` final) → *Reemplazar todo*.
- **PowerShell** (dentro de la carpeta `v9`):

  ```powershell
  Get-ChildItem -Recurse -Include *.html,*.xml,*.txt | ForEach-Object {
    (Get-Content $_ -Raw -Encoding UTF8).Replace('https://www.tu-dominio.com','https://www.hila.mx') |
      Set-Content $_ -Encoding UTF8 -NoNewline }
  ```

## Movimiento (v9): cómo apagarlo o ajustarlo

El movimiento vive en tres lugares:

1. **`animaciones.js`** (al inicio, objeto `CONFIG`): interruptores generales.
2. **`styles.css`**, sección 1 (variables `--mov-*`) y **sección 23** (cada efecto con su comentario).
3. **`script.js`**: lo propio de la portada (cascada del detalle, arrastre para cerrar, cuestionario y secuencia del pago), marcado con `V9`.

### Interruptores en `animaciones.js`

| Interruptor | Qué hace | Valor |
|---|---|---|
| `forzarLigero` | `null` = automático, `true` = siempre ligero, `false` = nunca ligero | `null` |
| `telon` | Telón con el logo al entrar a la portada (una vez por sesión, menos de 1.2 s; se omite con un toque) | `true` |
| `parallax` | Parallax leve de la ilustración en las páginas de experiencia (solo computadora) | `true` |
| `luz` | Luz suave que sigue al cursor en las tarjetas de planes y de merch (solo computadora) | `true` |
| `magnetico` | Botones que se acercan al cursor (hero, "Reservar" del encabezado y "Avísame") | `true` |
| `vibracion` | Vibración corta al completar un paso y al sellarse el pago (Android; **iOS no la soporta**) | `true` |
| `fondoEscala` | Al abrir un plan, la página de atrás escala a 0.985. **Apagado**: en las pruebas costó cuadros de más de 400 ms. Sin él, el fondo se aleja con una viñeta verde bosque (solo opacidad) | `false` |

Para probar sin editar nada: agrega `?ligero=1` (fuerza el modo ligero) o `?ligero=0` (lo apaga) a la dirección.

**Modo ligero automático.** Se activa si el dispositivo tiene 4 núcleos o menos, 4 GB de memoria o menos (dato que solo dan Chrome y Edge), ahorro de datos o `prefers-reduced-data`. Apaga el telón, la luz del cursor, el botón magnético, el parallax, el dibujo de las líneas topográficas, el confeti, la flotación del boleto y el acercamiento de la ilustración del detalle; además acorta las duraciones. **Ojo:** con el umbral de 4 núcleos entran muchos celulares de gama media, y también el Chrome de pruebas de esta computadora. Si quieres que más dispositivos vean todo, cambia el `4` de `hardwareConcurrency` por `2` en `detectarLigero()`.

### Variables CSS (sección 1 de `styles.css`)

| Variable | Valor | Para qué |
|---|---|---|
| `--mov-corta` | 160ms | Respuestas al toque y cambios pequeños |
| `--mov-media` | 320ms | Transiciones de interfaz (pestañas, menú, cascada) |
| `--mov-larga` | 700ms | Revelados |
| `--mov-curva` | `cubic-bezier(.22,1,.36,1)` | Salida suave (la curva general) |
| `--mov-resorte` | Curva física `linear()` casi sin rebote, que calcula `animaciones.js` | Boleto que sube, panel que regresa al soltarlo |
| `--mov-escalonado` | 40ms | Separación entre elementos escalonados (menú) |

En modo ligero, `--mov-media` baja a 240 ms y `--mov-larga` a 480 ms.

### Qué hay y cómo quitar cada cosa (sección 23 de `styles.css`)

- **Entradas al hacer scroll:** usa `data-reveal` (vacío o `arriba`), `data-reveal="izquierda"` o `data-reveal="mascara"` (en un título lo revela por líneas; en una imagen, con un recorte suave), más `data-delay="120"` (en ms) si quieres retrasarla. Para quitar una entrada, borra el atributo. Sin JavaScript todo se ve completo.
- **Respuesta al toque:** todo botón se encoge a 0.97 y se oscurece levemente al presionarlo (capa `.btn::before`). En computadora esa misma capa hace el **barrido de color** al pasar el mouse. Para quitar el barrido, borra la regla `.btn:hover::before`.
- **Subrayado que se dibuja** en los enlaces: bloque "Enlaces" (solo computadora).
- **Líneas topográficas que se dibujan:** borra las dos reglas `.topo` / `.topo.is-dibujada` del bloque correspondiente.
- **Telón:** `CONFIG.telon = false` (o borra el atributo `data-telon` del `<script>` de `index.html`).
- **Menú móvil:** enlaces escalonados; se cierra al deslizar hacia arriba o al tocar fuera.
- **Carruseles:** miniatura activa con escala, pestaña con transición de color y, en celular, la tarjeta activa del merch resaltada (las demás a 0.96 y un poco más tenues). Para quitarlo, borra la regla `.shelf__viewport.tiene-activo`.
- **Cuestionario:** transición lateral, título que entra, brillo de la barra (`.progress__bar.brilla`), palomita junto al nombre del paso (`.paso-hecho`), etiqueta que responde al foco y casillas que se marcan con trazo.
- **Detalle de cada plan:** cascada de menos de 900 ms (`.cascada-prep` / `.cascada-on`): zoom de la ilustración, título por líneas, datos escalonados, secciones con fundido y un único pulso en "Reservar". Para quitarla, borra la llamada `prepararCascada();` en `script.js`. En celular se cierra **arrastrando hacia abajo** (con la X y Esc como siempre).
- **Pago exitoso:** la función `secuenciaExito()` de `script.js` controla la ruta, el boleto, el sello, el odómetro del folio, el confeti, la línea de corte y las acciones. El PDF **nunca** se anima: la hoja de impresión desactiva toda animación.
- **Navegación entre páginas:** fundido suave con `@view-transition` (solo en servidor y en navegadores que lo soportan). Para quitarlo, borra la regla `@view-transition`.
- **Movimiento reducido:** si la persona lo pidió en su sistema, todo queda en fundidos cortos, sin parallax, telón, ruta, confeti ni odómetro.

## Agregar una experiencia nueva

1. Copia la carpeta `experiencias/kayak-en-xochimilco/` con el nuevo slug (por ejemplo `experiencias/senderismo-en-el-ajusco/`).
2. En su `index.html` edita: `<title>`, `meta description`, `canonical`, `og:*`, `twitter:*`, el JSON-LD de migas de pan, el `data-mood`, la escena (`data-scene`), la foto y su `alt`, los textos, las preguntas frecuentes, el `data-salidas="<id>"` de "Próximas salidas" y el enlace de reservar (`?experiencia=<id>`).
3. En `script.js`, agrega la experiencia al objeto `EXPERIENCIAS` (con `slug`, `alt` y `llevar`) y su grupo en `VISTAZO`. Si necesita otra ilustración, agrega una función en `ESCENAS` de `escenas.js` y un ambiente `[data-mood="<id>"]` en `styles.css`, usando solo la paleta.
4. En `index.html`, agrega su tarjeta en "Encuentra tu plan ideal", su pestaña en "Un vistazo" y su opción en el cuestionario (paso 2).
5. Agrega enlaces a la nueva página en el menú móvil y el pie de `index.html`, en el bloque "También te puede gustar" y el pie de las otras páginas de experiencia, y en `404.html`.
6. Agrega su `<url>` en `sitemap.xml` (con `lastmod`).
7. Agrega la experiencia y sus salidas en `data/salidas.json` y `data/salidas.js`.

## Qué está simulado (DEMO)

- **Pago:** la pantalla de PayPal es una simulación con botones de demostración; no se cobra nada.
- **Folio** (`HILA-0000`) e **ID de transacción** del comprobante: se generan al azar en el navegador.
- **Fechas, horas, puntos de encuentro y precios:** los de `data/salidas.json` son de ejemplo (sus `id` empiezan con `DEMO-`).
- **Confirmación:** la reserva no aparta lugar; el negocio la confirma manualmente por WhatsApp.
- **Correo de confirmación y WhatsApp:** no se envía nada; el número es `+52 55 0000 0000`.
- **Textos legales:** son los oficiales, pero tienen datos pendientes entre corchetes (ver "Textos legales").
- **"Seguro" y "12 personas máximo por grupo":** son textos de ejemplo; confirma los reales.

## Qué falta para producción (Fase 2)

- Servidor con base de datos para experiencias, salidas y reservas, y un panel para confirmarlas.
- Integración real con PayPal (Checkout más confirmación del pago en el servidor con webhook).
- Folio y comprobante generados por el servidor, y envío del correo de confirmación.
- Guardar las respuestas del cuestionario de forma segura (incluyen datos de salud: requiere el aviso de privacidad aprobado).
- `/administrador` protegido con login en el servidor y `noindex` (robots.txt no es seguridad).
- Datos estructurados `Event`/`Offer` por experiencia cuando existan fechas y precios reales.
- Logotipo en alta resolución, imagen social e íconos reales en `img/`, y el favicon definitivo.
- Dar de alta el sitio y el sitemap en Google Search Console.
