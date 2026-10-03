/* ==========================================================================
   HILA v3 · Sal a vivirlo
   JavaScript puro, sin librerías.

   ─────────────────────────────────────────────────────────────────────────
   CÓMO AGREGAR TUS FOTOS Y VIDEOS AL CARRUSEL
   1. Copia tus archivos a la carpeta v3/media/ (jpg, png, webp o mp4).
   2. Edita el arreglo MEDIOS de aquí abajo. Cada { ... } es un slide:
        tipo:      'imagen' o 'video'
        archivo:   el nombre exacto del archivo dentro de v3/media/
        titulo:    texto grande del slide
        subtitulo: una línea corta debajo del título
        etiqueta:  palabra corta arriba del título (ej. "Adrenalina")
   3. Para agregar un slide, copia un bloque { ... }, pégalo y cambia los datos.
      Para quitarlo, borra su bloque completo (con su coma).
      Para cambiar el orden, mueve los bloques.
   Mientras un archivo no exista, el slide muestra un marcador con su nombre.
   Recomendado: formato vertical 9:16 (ej. 1080 x 1920). Videos cortos y ligeros.
   ─────────────────────────────────────────────────────────────────────────

   Índice
   1. Utilidades
   2. Datos (EDITA AQUÍ precios, fechas, FAQ y textos legales)
   3. Escenas ilustradas por capas del hero, tarjetas y modal
   4. Líneas topográficas
   5. Parallax (mouse y hover)
   6. Navegación, barra de lectura y cursor personalizado
   7. Entradas: hero, títulos con máscara, escalonados, contadores, manuscrito, marquee
   8. Botón magnético
   9. Experiencias: momento narrativo y ambientes de color
   10. Acordeones
   11. Modales: detalle con transición compartida (FLIP) y textos legales
   12. Carrusel de fotos y videos
   13. Cuestionario por pantallas (validación, sessionStorage, resumen)
   14. Pago simulado (boleto, sello, confeti en canvas, calendario)
   ========================================================================== */

/* ===== SLIDES DEL CARRUSEL: edita solo esta lista ===== */
const MEDIOS = [
  { tipo: 'imagen', archivo: 'kayak-xochimilco.jpg', titulo: 'Kayak en Xochimilco', subtitulo: 'Remar al amanecer entre canales', etiqueta: 'Tranquilidad' },
  { tipo: 'video',  archivo: 'via-ferrata.mp4',      titulo: 'Vía ferrata',          subtitulo: 'Paso a paso sobre la roca',        etiqueta: 'Adrenalina' },
  { tipo: 'imagen', archivo: 'camping-estacas.jpg',  titulo: 'Camping en Las Estacas', subtitulo: 'Fogata, río y cielo estrellado',  etiqueta: 'Naturaleza' },
  { tipo: 'video',  archivo: 'rappel-dinamos.mp4',   titulo: 'Rappel en Los Dínamos', subtitulo: 'Descubre otra perspectiva',       etiqueta: 'Adrenalina' },
  { tipo: 'imagen', archivo: 'comunidad.jpg',        titulo: 'Momentos de comunidad', subtitulo: 'Vas por la experiencia, te quedas por la gente', etiqueta: 'Comunidad' }
];
const CARPETA_MEDIOS = 'media/';

(() => {
  'use strict';

  /* 1. UTILIDADES ========================================================== */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const reduceMotion = () => motionQuery.matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)';
  const EASE_SCENE = 'cubic-bezier(0.32, 0.72, 0, 1)';
  const formatoPrecio = (n) => '$' + n.toLocaleString('es-MX');
  const scrollBehavior = () => (reduceMotion() ? 'auto' : 'smooth');
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const escapar = (texto) => { const d = document.createElement('div'); d.textContent = texto; return d.innerHTML; };

  /* 2. DATOS ===============================================================
     Precios, horarios y fechas son de ejemplo: cámbialos por los reales. */
  const EXPERIENCIAS = {
    kayak: {
      nombre: 'Kayak en Xochimilco', mood: 'Tranquilidad', duracion: '5 horas', dificultad: 'Baja', precio: 850,
      fechas: [
        { value: '2026-10-17', label: 'Sábado 17 de octubre' },
        { value: '2026-10-31', label: 'Sábado 31 de octubre' },
        { value: '2026-11-14', label: 'Sábado 14 de noviembre' }
      ],
      descripcion: 'Ver el amanecer en Xochimilco remando entre canales y chinampas. Salimos con transporte incluido desde la CDMX y hay desayuno para disfrutar la experiencia desde temprano.',
      incluye: [['ph-bus', 'Transporte incluido'], ['ph-coffee', 'Desayuno incluido'], ['ph-lifebuoy', 'Kayak y chaleco']],
      faq: [
        ['¿Qué tengo que llevar de ropa?', 'Te recomendamos llevar ropa cómoda, tenis que se puedan mojar, una capa ligera para la mañana y protección solar. Si quieres, también puedes llevar un cambio extra.'],
        ['¿Dónde es el punto de encuentro?', 'Salimos desde un punto de encuentro en la CDMX. Al confirmar tu reserva te mandamos la ubicación exacta y la hora de salida por correo y WhatsApp.'],
        ['¿Qué incluye esta experiencia?', 'Transporte redondo, desayuno, kayak, chaleco salvavidas, guía certificado, fotos de la experiencia y tu merch HILA.'],
        ['¿Necesito saber remar?', 'No. Antes de salir te explicamos la técnica básica y el recorrido es tranquilo, pensado para disfrutar el paisaje.']
      ]
    },
    ferrata: {
      nombre: 'Vía ferrata + rappel', mood: 'Adrenalina', duracion: '8 horas', dificultad: 'Media', precio: 1450,
      fechas: [
        { value: '2026-10-25', label: 'Domingo 25 de octubre' },
        { value: '2026-11-22', label: 'Domingo 22 de noviembre' }
      ],
      descripcion: 'Sube por una pared de roca asegurado a una línea de vida y termina con un rappel que no vas a olvidar. No necesitas experiencia previa: los guías te enseñan todo antes de empezar.',
      incluye: [['ph-bus', 'Transporte incluido'], ['ph-coffee', 'Desayuno incluido'], ['ph-hard-hat', 'Casco, arnés y equipo']],
      faq: [
        ['¿Necesito experiencia previa?', 'No. Antes de subir hay una plática de seguridad y una práctica en el piso. Durante todo el recorrido vas asegurado a la línea de vida.'],
        ['¿Qué pasa si me da miedo la altura?', 'Es más común de lo que crees. Los guías van contigo a tu ritmo y hay puntos para descansar. Si en algún momento decides no seguir, te acompañan de regreso con calma.'],
        ['¿Por qué me piden peso y altura?', 'Por seguridad del equipo (arneses y cuerdas tienen rangos de uso). Si algo necesita revisarse, te contactamos antes de cobrar.'],
        ['¿Qué ropa llevo?', 'Ropa deportiva que te permita moverte, tenis con buen agarre, gorra, bloqueador y una botella de agua.']
      ]
    },
    camping: {
      nombre: 'Camping en Las Estacas', mood: 'Naturaleza', duracion: '2 días, 1 noche', dificultad: 'Baja', precio: 1890,
      fechas: [
        { value: '2026-11-07', label: 'Sábado 7 y domingo 8 de noviembre' },
        { value: '2026-12-05', label: 'Sábado 5 y domingo 6 de diciembre' }
      ],
      descripcion: 'Un fin de semana junto al río de aguas cristalinas de Las Estacas, en Morelos. Nado, fogata, cielo estrellado y un grupo con quien compartirlo.',
      incluye: [['ph-bus', 'Transporte incluido'], ['ph-coffee', 'Desayuno incluido'], ['ph-tent', 'Casa de campaña'], ['ph-campfire', 'Cena en fogata']],
      faq: [
        ['¿Tengo que llevar casa de campaña?', 'No, nosotros la ponemos. Solo lleva tu bolsa de dormir o una cobija, y una almohada si quieres.'],
        ['¿Hay baños y regaderas?', 'Sí, el parque cuenta con baños y regaderas para los campistas.'],
        ['¿Y si no sé nadar bien?', 'Puedes disfrutar el río con chaleco salvavidas, que te prestamos. Los guías conocen las zonas más tranquilas.']
      ]
    }
  };

  const LEGALES = {
    privacidad: { titulo: 'Aviso de Privacidad', parrafos: [
      'HILA usa tus datos personales y de salud únicamente para organizar tu experiencia, contactarte y atenderte en caso de emergencia.',
      'No vendemos ni compartimos tu información con terceros, salvo con los proveedores necesarios para la actividad (transporte, seguros o servicios médicos).',
      'Puedes pedir el acceso, la corrección o la eliminación de tus datos escribiendo a hola@hilaexperiencias.com.'
    ] },
    cancelacion: { titulo: 'Políticas de Cancelación', parrafos: [
      'Si cancelas con anticipación, puedes cambiar tu fecha o recibir un reembolso según los plazos que indique la política vigente de cada experiencia.',
      'Si el clima no permite realizar la actividad, eliges entre reagendar en otra fecha o recibir un reembolso completo a tu método de pago original.',
      'Si HILA cancela por cualquier motivo, te devolvemos el 100% de tu pago.'
    ] },
    terminos: { titulo: 'Términos y Condiciones', parrafos: [
      'Al reservar confirmas que la información del cuestionario es verdadera y que conoces el nivel físico que requiere la experiencia.',
      'Debes seguir en todo momento las indicaciones de seguridad de los guías. HILA puede suspender la participación de alguien si pone en riesgo su seguridad o la del grupo.',
      'Las fotos tomadas durante la experiencia pueden usarse en redes de HILA. Si prefieres no aparecer, avísale a tu guía.'
    ] }
  };

  /* 3. ESCENAS ILUSTRADAS ==================================================
     Cada escena son varias capas SVG apiladas (cielo, sol, montañas lejanas,
     niebla, montañas cercanas, agua, primer plano). Cada capa tiene una
     profundidad (data-depth) que usa el parallax. Todo se genera con números
     pseudoaleatorios con semilla, así cada escena sale siempre igual. */
  let uid = 0;

  function azar(semilla) {
    let a = semilla >>> 0;
    return () => {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // Cresta de montaña con picos (ruido "ridged" a base de senos)
  function cresta(r, W, H, y, amp, picos, paso = 12) {
    const p1 = r() * 6.28, p2 = r() * 6.28, p3 = r() * 6.28;
    const f = (Math.PI * picos) / W;
    const ys = [];
    let d = `M${-paso} ${H}`;
    for (let x = -paso; x <= W + paso; x += paso) {
      const n = 0.62 * (1 - Math.abs(Math.sin(x * f + p1)))
        + 0.26 * (1 - Math.abs(Math.sin(x * f * 2.4 + p2)))
        + 0.12 * Math.sin(x * f * 6 + p3);
      const yy = y - amp * n;
      ys.push(yy);
      d += ` L${x} ${yy.toFixed(1)}`;
    }
    d += ` L${W + paso} ${H} Z`;
    return { d, at: (x) => ys[clamp(Math.round((x + paso) / paso), 0, ys.length - 1)] };
  }

  // Siluetas de pinos sobre una cresta
  function pinos(r, c, desde, hasta, { sep = [10, 24], alto = [18, 42], bajar = 4 } = {}) {
    let d = '';
    for (let x = desde; x < hasta; x += sep[0] + r() * (sep[1] - sep[0])) {
      const b = c.at(x) + bajar;
      const h = alto[0] + r() * (alto[1] - alto[0]);
      const w = h * 0.42;
      const f = (n) => n.toFixed(1);
      d += `M${f(x)} ${f(b - h)}L${f(x - w * 0.5)} ${f(b - h * 0.36)}L${f(x - w * 0.2)} ${f(b - h * 0.4)}L${f(x - w * 0.66)} ${f(b)}L${f(x + w * 0.66)} ${f(b)}L${f(x + w * 0.2)} ${f(b - h * 0.4)}L${f(x + w * 0.5)} ${f(b - h * 0.36)}Z`;
    }
    return d;
  }

  const degradado = (id, stops, vertical = true) =>
    `<linearGradient id="${id}" x1="0" y1="0" x2="${vertical ? 0 : 1}" y2="${vertical ? 1 : 0}">${stops.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join('')}</linearGradient>`;
  const radial = (id, color, a = 1) =>
    `<radialGradient id="${id}"><stop offset="0" stop-color="${color}" stop-opacity="${a}"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient>`;

  // Reflejos horizontales en el agua
  function reflejos(r, W, y0, y1, cx, ancho, color, n = 26) {
    let s = '';
    for (let i = 0; i < n; i++) {
      const t = i / n;
      const y = y0 + (y1 - y0) * Math.pow(t, 1.3);
      const w = ancho * (1 - t * 0.55) * (0.4 + r() * 0.8);
      const x = cx - w / 2 + (r() - 0.5) * ancho * 0.5;
      s += `<rect x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="${w.toFixed(0)}" height="${(2 + r() * 3).toFixed(1)}" rx="2" fill="${color}" opacity="${(0.55 - t * 0.4).toFixed(2)}"/>`;
    }
    return s;
  }

  // Persona sentada (silueta simple)
  const sentado = (x, y, s, color) =>
    `<g fill="${color}"><circle cx="${x}" cy="${y - 46 * s}" r="${11 * s}"/><path d="M${x - 16 * s} ${y}C${x - 18 * s} ${y - 22 * s} ${x - 12 * s} ${y - 34 * s} ${x} ${y - 34 * s}C${x + 12 * s} ${y - 34 * s} ${x + 18 * s} ${y - 22 * s} ${x + 16 * s} ${y}Z"/></g>`;

  // Fogata con brillo (la llama "respira" solo en la vista previa)
  const fogata = (x, y, s, id) =>
    `<circle cx="${x}" cy="${y - 10 * s}" r="${220 * s}" fill="url(#${id})"/>
     <g class="anim-flicker" style="transform-box:fill-box">
       <path d="M${x} ${y - 52 * s}C${x + 18 * s} ${y - 30 * s} ${x + 16 * s} ${y - 6 * s} ${x} ${y}C${x - 16 * s} ${y - 6 * s} ${x - 18 * s} ${y - 30 * s} ${x} ${y - 52 * s}Z" fill="#f0a23a"/>
       <path d="M${x + 2 * s} ${y - 32 * s}C${x + 11 * s} ${y - 18 * s} ${x + 9 * s} ${y - 4 * s} ${x + 1 * s} ${y}C${x - 8 * s} ${y - 4 * s} ${x - 9 * s} ${y - 18 * s} ${x + 2 * s} ${y - 32 * s}Z" fill="#ffd77a"/>
     </g>
     <path d="M${x - 26 * s} ${y + 2 * s}L${x + 26 * s} ${y - 6 * s}M${x - 24 * s} ${y - 6 * s}L${x + 26 * s} ${y + 3 * s}" stroke="#2a160c" stroke-width="${6 * s}" stroke-linecap="round"/>`;

  // Definición de cada escena: devuelve capas [profundidad, desplazamiento de scroll, contenido]
  const ESCENAS = {
    hero(r, W, H, k) {
      const h = H * 0.68;
      const lejos = cresta(r, W, H, H * 0.6, H * 0.22, 2.2);
      const medio = cresta(r, W, H, H * 0.645, H * 0.15, 3.4);
      const cerca = cresta(r, W, H, h, H * 0.07, 5);
      const orilla = cresta(r, W, H, H * 0.95, H * 0.1, 1.6);
      const sx = W * 0.7, sy = H * 0.58;
      return [
        [0, 160, `<defs>${degradado(k + 'c', [[0, '#0f2d40'], [0.36, '#3c566a'], [0.58, '#c98a7a'], [0.76, '#efad66'], [0.9, '#f7d29a']])}</defs><rect width="${W}" height="${H}" fill="url(#${k}c)"/>`],
        [0.06, 150, `<defs>${radial(k + 's', '#ffdca6', 0.75)}</defs><circle cx="${sx}" cy="${sy}" r="${H * 0.34}" fill="url(#${k}s)"/><circle cx="${sx}" cy="${sy}" r="${H * 0.05}" fill="#ffe6b8"/>`],
        [0.12, 130, `<path d="${lejos.d}" fill="#8a6c79" opacity="0.85"/>`],
        [0.18, 110, `<defs>${degradado(k + 'n', [[0, '#f7d29a', 0], [0.5, '#f7d29a', 0.38], [1, '#f7d29a', 0]])}</defs><rect y="${H * 0.5}" width="${W}" height="${H * 0.16}" fill="url(#${k}n)"/>`],
        [0.26, 90, `<path d="${medio.d}" fill="#3c5468"/>`],
        [0.4, 60, `<defs>${degradado(k + 'a', [[0, '#e9a866', 0.85], [0.18, '#5e6f78'], [0.6, '#1f4352'], [1, '#0b2529']])}</defs>
          <rect y="${h - 2}" width="${W}" height="${H - h + 2}" fill="url(#${k}a)"/>
          ${reflejos(r, W, h + 6, H * 0.94, sx, W * 0.16, '#ffdca6')}
          <path d="${cerca.d}" fill="#18332f"/><path d="${pinos(r, cerca, 0, W, { alto: [14, 34] })}" fill="#0f261f"/>`],
        [0.8, 0, `<path d="${orilla.d}" fill="#071a13"/><path d="${pinos(r, orilla, -20, W * 0.32, { sep: [14, 30], alto: [60, 130], bajar: 10 })}" fill="#061510"/>`]
      ];
    },

    kayak(r, W, H, k) {
      const h = H * 0.56;
      const lejos = cresta(r, W, H, H * 0.47, H * 0.14, 2);
      const medio = cresta(r, W, H, H * 0.52, H * 0.06, 4);
      const cerca = cresta(r, W, H, h, H * 0.025, 8);
      const kx = W * 0.56, ky = H * 0.8, s = W / 900;
      return [
        [0, 0, `<defs>${degradado(k + 'c', [[0, '#8fc0c4'], [0.5, '#cfe2d6'], [0.62, '#f1e2bf']])}</defs><rect width="${W}" height="${H}" fill="url(#${k}c)"/>`],
        [0.05, 0, `<defs>${radial(k + 's', '#fff4d6', 0.9)}</defs><circle cx="${W * 0.28}" cy="${H * 0.4}" r="${W * 0.22}" fill="url(#${k}s)"/><circle cx="${W * 0.28}" cy="${H * 0.4}" r="${W * 0.035}" fill="#fff6dc"/>`],
        [0.1, 0, `<path d="${lejos.d}" fill="#7ea2a3"/>`],
        [0.2, 0, `<path d="${medio.d}" fill="#4f7d76"/><path d="${pinos(r, medio, 0, W, { alto: [16, 30], sep: [8, 18] })}" fill="#3f5f3d"/>`],
        [0.3, 0, `<defs>${degradado(k + 'a', [[0, '#7aa9a6'], [0.4, '#2f6b73'], [1, '#0f3440']])}</defs>
          <rect y="${h - 2}" width="${W}" height="${H - h + 2}" fill="url(#${k}a)"/>
          ${reflejos(r, W, h + 8, H, W * 0.28, W * 0.3, '#eef6ee', 22)}
          <path d="${cerca.d}" fill="#24412d"/><path d="${pinos(r, cerca, 0, W, { alto: [26, 54], sep: [10, 20] })}" fill="#1c3626"/>`],
        [0.55, 0, `<g fill="#0c2a30">
            <ellipse cx="${kx}" cy="${ky + 22 * s}" rx="${120 * s}" ry="${7 * s}" fill="#dcefe8" opacity="0.25"/>
            <path d="M${kx - 110 * s} ${ky}Q${kx} ${ky + 26 * s} ${kx + 110 * s} ${ky}Q${kx} ${ky + 10 * s} ${kx - 110 * s} ${ky}Z"/>
            <circle cx="${kx - 4 * s}" cy="${ky - 44 * s}" r="${10 * s}"/>
            <path d="M${kx - 18 * s} ${ky + 4 * s}C${kx - 20 * s} ${ky - 18 * s} ${kx - 14 * s} ${ky - 32 * s} ${kx - 3 * s} ${ky - 32 * s}C${kx + 9 * s} ${ky - 32 * s} ${kx + 14 * s} ${ky - 18 * s} ${kx + 12 * s} ${ky + 4 * s}Z"/>
            <path d="M${kx - 70 * s} ${ky + 18 * s}L${kx + 60 * s} ${ky - 40 * s}" stroke="#0c2a30" stroke-width="${4 * s}" stroke-linecap="round"/>
          </g>
          <g fill="#14383c" opacity="0.7"><path d="M${W * 0.2} ${H * 0.66}Q${W * 0.26} ${H * 0.672} ${W * 0.32} ${H * 0.66}Q${W * 0.26} ${H * 0.665} ${W * 0.2} ${H * 0.66}Z"/>${sentado(W * 0.26, H * 0.662, s * 0.5, '#14383c')}</g>`]
      ];
    },

    ferrata(r, W, H, k) {
      const lejos = cresta(r, W, H, H * 0.62, H * 0.22, 2.4);
      const medio = cresta(r, W, H, H * 0.74, H * 0.1, 4);
      const s = W / 900;
      // Pared de roca a la izquierda, con borde irregular
      let pared = `M0 0 L${W * 0.48} 0`;
      for (let y = 0; y <= H; y += 26) {
        const x = W * (0.46 - 0.12 * (y / H)) + Math.sin(y * 0.013 + 1) * W * 0.04 + (r() - 0.5) * W * 0.035;
        pared += ` L${x.toFixed(0)} ${y}`;
      }
      pared += ` L0 ${H} Z`;
      let grietas = '';
      for (let i = 0; i < 9; i++) {
        const x = r() * W * 0.34, y = r() * H;
        grietas += `M${x.toFixed(0)} ${y.toFixed(0)}l${(r() * 40 - 20).toFixed(0)} ${(30 + r() * 60).toFixed(0)}l${(r() * 30 - 15).toFixed(0)} ${(20 + r() * 40).toFixed(0)}`;
      }
      const ruta = [[0.34, 0.95], [0.2, 0.8], [0.32, 0.64], [0.17, 0.47], [0.29, 0.3], [0.2, 0.12]].map(([x, y]) => `${(W * x).toFixed(0)},${(H * y).toFixed(0)}`).join(' ');
      const cx = W * 0.235, cy = H * 0.555;
      return [
        [0, 0, `<defs>${degradado(k + 'c', [[0, '#6f2a18'], [0.4, '#c95f36'], [0.7, '#f0aa55'], [1, '#f8d69a']])}</defs><rect width="${W}" height="${H}" fill="url(#${k}c)"/>`],
        [0.06, 0, `<defs>${radial(k + 's', '#ffd48a', 0.85)}</defs><circle cx="${W * 0.74}" cy="${H * 0.52}" r="${W * 0.4}" fill="url(#${k}s)"/><circle cx="${W * 0.74}" cy="${H * 0.52}" r="${W * 0.07}" fill="#ffe2a8"/>`],
        [0.14, 0, `<path d="${lejos.d}" fill="#b0553a" opacity="0.85"/>`],
        [0.24, 0, `<path d="${medio.d}" fill="#6b2a17"/>`],
        [0.5, 0, `<defs>${degradado(k + 'p', [[0, '#55210f'], [1, '#2a0f07']], false)}</defs>
          <path d="${pared}" fill="url(#${k}p)"/>
          <path d="${grietas}" stroke="#7a3a22" stroke-width="${2 * s}" fill="none" opacity="0.6"/>
          <polyline points="${ruta}" fill="none" stroke="#ffd08a" stroke-width="${3 * s}" stroke-dasharray="${2 * s} ${11 * s}" stroke-linecap="round"/>
          <g fill="#160703"><circle cx="${cx}" cy="${cy - 30 * s}" r="${8 * s}"/>
            <path d="M${cx - 6 * s} ${cy - 22 * s}L${cx + 8 * s} ${cy - 20 * s}L${cx + 10 * s} ${cy + 6 * s}L${cx + 18 * s} ${cy + 26 * s}L${cx + 11 * s} ${cy + 28 * s}L${cx + 2 * s} ${cy + 10 * s}L${cx - 8 * s} ${cy + 28 * s}L${cx - 14 * s} ${cy + 24 * s}L${cx - 6 * s} ${cy + 4 * s}Z"/>
            <path d="M${cx + 6 * s} ${cy - 18 * s}L${cx + 22 * s} ${cy - 40 * s}" stroke="#160703" stroke-width="${4 * s}" stroke-linecap="round"/></g>`]
      ];
    },

    camping(r, W, H, k) {
      const lejos = cresta(r, W, H, H * 0.6, H * 0.2, 2.2);
      const medio = cresta(r, W, H, H * 0.67, H * 0.06, 4);
      const suelo = cresta(r, W, H, H * 0.82, H * 0.025, 3);
      const s = W / 900;
      let estrellas = '';
      for (let i = 0; i < 80; i++) {
        estrellas += `<circle cx="${(r() * W).toFixed(0)}" cy="${(r() * H * 0.55).toFixed(0)}" r="${(0.6 + r() * 1.6) * s}" fill="#f9f4eb" opacity="${(0.25 + r() * 0.65).toFixed(2)}"/>`;
      }
      const tx = W * 0.36, ty = H * 0.84, fx = W * 0.62;
      return [
        [0, 0, `<defs>${degradado(k + 'c', [[0, '#03120d'], [0.55, '#0b2c22'], [0.8, '#1d4433']])}</defs><rect width="${W}" height="${H}" fill="url(#${k}c)"/>${estrellas}`],
        [0.06, 0, `<defs>${radial(k + 'm', '#f3e3b5', 0.4)}</defs><circle cx="${W * 0.76}" cy="${H * 0.2}" r="${W * 0.18}" fill="url(#${k}m)"/><circle cx="${W * 0.76}" cy="${H * 0.2}" r="${W * 0.035}" fill="#f6e8c0"/>`],
        [0.12, 0, `<path d="${lejos.d}" fill="#123a2c"/>`],
        [0.24, 0, `<path d="${medio.d}" fill="#0b2a1f"/><path d="${pinos(r, medio, 0, W, { alto: [24, 52], sep: [9, 20] })}" fill="#082019"/>`],
        [0.45, 0, `<defs>${radial(k + 'f', '#f0c35a', 0.5)}${degradado(k + 't', [[0, '#b36d2c'], [1, '#3a2210']])}</defs>
          <path d="${suelo.d}" fill="#061a13"/>
          ${fogata(fx, ty + 4 * s, s * 1.1, k + 'f')}
          <path d="M${tx} ${ty - 150 * s}L${tx - 120 * s} ${ty}L${tx + 120 * s} ${ty}Z" fill="url(#${k}t)"/>
          <path d="M${tx} ${ty - 150 * s}L${tx - 26 * s} ${ty}L${tx + 26 * s} ${ty}Z" fill="#ffc565" opacity="0.9"/>
          <path d="M${tx} ${ty - 150 * s}L${tx} ${ty - 168 * s}" stroke="#1a120a" stroke-width="${3 * s}"/>`]
      ];
    },

  };

  function construirEscena(el) {
    if (el.dataset.built) return;
    const tipo = el.dataset.scene;
    const crear = ESCENAS[tipo];
    if (!crear) return;
    const caja = el.getBoundingClientRect();
    const alta = caja.height > caja.width * 1.05;
    const W = alta ? 900 : 1600;
    const H = alta ? 1300 : 900;
    const semilla = Number(el.dataset.seed) || [...tipo].reduce((a, c) => a + c.charCodeAt(0) * 7, 11);
    const r = azar(semilla);
    const k = 'e' + (++uid);
    el.innerHTML = crear(r, W, H, k).map(([prof, py, contenido]) =>
      `<div class="scene__layer" data-depth="${prof}" style="--py:${py}px"><svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMax slice" aria-hidden="true">${contenido}</svg></div>`
    ).join('');
    el.dataset.built = '1';
    cargarFoto(el);
  }

  // Si existe la foto real, se coloca encima de la ilustración
  function cargarFoto(el) {
    const ruta = el.dataset.photo;
    if (!ruta || el.dataset.photoTried) return;
    el.dataset.photoTried = '1';
    const img = new Image();
    img.alt = '';
    img.className = 'scene__photo';
    img.decoding = 'async';
    img.onload = () => { el.append(img); el.classList.add('has-photo'); };
    img.src = ruta;
  }

  $$('.scene[data-scene]').forEach(construirEscena);

  /* 4. LÍNEAS TOPOGRÁFICAS ================================================= */
  function crearTopografia(color, semilla) {
    const r = azar(semilla);
    const centros = [{ x: 270, y: 290, anillos: 12, r0: 18 }, { x: 500, y: 520, anillos: 5, r0: 14 }];
    let trazos = '';
    centros.forEach((c) => {
      const f1 = r() * 6.28, f2 = r() * 6.28, f3 = r() * 6.28;
      for (let k = 0; k < c.anillos; k++) {
        const rad = c.r0 + k * 23;
        const p = [];
        for (let i = 0; i < 72; i++) {
          const t = (i / 72) * Math.PI * 2;
          const o = 1 + 0.16 * Math.sin(2 * t + f1 + k * 0.2) + 0.08 * Math.sin(3 * t + f2 - k * 0.14) + 0.04 * Math.sin(5 * t + f3 + k * 0.3);
          p.push([c.x + Math.cos(t) * rad * o, c.y + Math.sin(t) * rad * o * 0.86]);
        }
        const n = p.length, q = (v) => v.toFixed(1);
        let d = `M${q(p[0][0])} ${q(p[0][1])}`;
        for (let i = 0; i < n; i++) {
          const a = p[(i - 1 + n) % n], b = p[i], c2 = p[(i + 1) % n], e = p[(i + 2) % n];
          d += `C${q(b[0] + (c2[0] - a[0]) / 6)} ${q(b[1] + (c2[1] - a[1]) / 6)} ${q(c2[0] - (e[0] - b[0]) / 6)} ${q(c2[1] - (e[1] - b[1]) / 6)} ${q(c2[0])} ${q(c2[1])}`;
        }
        trazos += `<path d="${d}Z"/>`;
      }
    });
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" fill="none" stroke="${color}" stroke-width="1.1">${trazos}</svg>`;
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  }
  document.documentElement.style.setProperty('--topo-dark', crearTopografia('rgba(12,50,39,0.14)', 7));
  document.documentElement.style.setProperty('--topo-light', crearTopografia('rgba(249,244,235,0.1)', 19));

  /* 5. PARALLAX ============================================================
     Cada capa se mueve según su profundidad. Se interpola en cada cuadro
     (lerp) para que el movimiento tenga inercia y nunca salte. */
  function crearParallax(escena, fuerzaX, fuerzaY) {
    const capas = $$('.scene__layer', escena).map((capa) => ({ svg: capa.firstElementChild, d: Number(capa.dataset.depth) }));
    const estado = { tx: 0, ty: 0, x: 0, y: 0, corriendo: false };
    function cuadro() {
      estado.x = lerp(estado.x, estado.tx, 0.08);
      estado.y = lerp(estado.y, estado.ty, 0.08);
      capas.forEach(({ svg, d }) => {
        svg.style.transform = `translate3d(${(-estado.x * d * fuerzaX).toFixed(2)}px, ${(-estado.y * d * fuerzaY).toFixed(2)}px, 0)`;
      });
      if (Math.abs(estado.x - estado.tx) > 0.001 || Math.abs(estado.y - estado.ty) > 0.001) requestAnimationFrame(cuadro);
      else estado.corriendo = false;
    }
    return {
      mover(nx, ny) {
        if (reduceMotion()) return;
        estado.tx = nx; estado.ty = ny;
        if (!estado.corriendo) { estado.corriendo = true; requestAnimationFrame(cuadro); }
      }
    };
  }

  // Hero: sigue al mouse mientras el hero está en pantalla
  const heroEscena = $('.scene--hero');
  const heroParallax = crearParallax(heroEscena, 22, 12);
  let heroVisible = true;
  new IntersectionObserver(([e]) => { heroVisible = e.isIntersecting; }).observe($('.hero'));
  window.addEventListener('pointermove', (e) => {
    if (!heroVisible || e.pointerType !== 'mouse') return;
    heroParallax.mover((e.clientX / innerWidth) * 2 - 1, (e.clientY / innerHeight) * 2 - 1);
  }, { passive: true });

  // Tarjetas: la ilustración se mueve en parallax al pasar el mouse
  $$('.exp-card').forEach((card) => {
    const p = crearParallax($('.scene', card), 14, 8);
    card.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      const c = card.getBoundingClientRect();
      p.mover(((e.clientX - c.left) / c.width) * 2 - 1, ((e.clientY - c.top) / c.height) * 2 - 1);
    });
    card.addEventListener('pointerleave', () => p.mover(0, 0));
  });

  /* 6. NAVEGACIÓN, BARRA DE LECTURA Y CURSOR =============================== */
  const nav = $('#nav');
  const toggle = $('#nav-toggle');
  const menu = $('#menu-movil');

  new IntersectionObserver(([e]) => nav.classList.toggle('is-scrolled', !e.isIntersecting)).observe($('.nav-sentinel'));

  let menuTimer;
  function abrirMenu() {
    clearTimeout(menuTimer);
    menu.hidden = false;
    menu.offsetHeight;
    menu.classList.add('is-open');
    nav.classList.add('is-menu-open');
    toggle.setAttribute('aria-expanded', 'true');
    $('.visually-hidden', toggle).textContent = 'Cerrar menú';
  }
  function cerrarMenu() {
    menu.classList.remove('is-open');
    nav.classList.remove('is-menu-open');
    toggle.setAttribute('aria-expanded', 'false');
    $('.visually-hidden', toggle).textContent = 'Abrir menú';
    menuTimer = setTimeout(() => { menu.hidden = true; }, reduceMotion() ? 0 : 200);
  }
  toggle.addEventListener('click', () => (toggle.getAttribute('aria-expanded') === 'true' ? cerrarMenu() : abrirMenu()));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) cerrarMenu(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { cerrarMenu(); toggle.focus(); }
  });
  window.matchMedia('(min-width: 960px)').addEventListener('change', (e) => { if (e.matches) cerrarMenu(); });

  // Sección activa en la navegación
  const enlacesNav = $$('.nav__links a');
  const obsSecciones = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => {
      if (!e.isIntersecting) return;
      enlacesNav.forEach((a) => {
        if (a.getAttribute('href') === '#' + e.target.id) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  ['inicio', 'experiencias', 'comunidad', 'nosotros', 'reserva', 'faq', 'contacto'].forEach((id) => obsSecciones.observe(document.getElementById(id)));

  // Barra de lectura: CSS la mueve con el scroll; respaldo para navegadores sin scroll-timeline
  if (!CSS.supports('animation-timeline: scroll()')) {
    const barra = $('.read-progress span');
    let pend = false;
    window.addEventListener('scroll', () => {
      if (pend) return;
      pend = true;
      requestAnimationFrame(() => {
        pend = false;
        const max = document.documentElement.scrollHeight - innerHeight;
        barra.style.setProperty('--read', max > 0 ? (scrollY / max).toFixed(4) : 0);
      });
    }, { passive: true });
  }

  // Cursor personalizado (solo con mouse y sin movimiento reducido)
  const cursor = $('.cursor');
  let cursorActivo = false;
  if (finePointer.matches && !reduceMotion()) {
    cursorActivo = true;
    document.documentElement.classList.add('has-cursor');
    const punto = $('.cursor__dot'), anillo = $('.cursor__ring');
    let mx = -100, my = -100, ax = -100, ay = -100, corriendo = false;
    const cuadro = () => {
      ax = lerp(ax, mx, 0.22); ay = lerp(ay, my, 0.22);
      anillo.style.transform = `translate3d(${ax.toFixed(1)}px, ${ay.toFixed(1)}px, 0)`;
      if (Math.abs(ax - mx) > 0.1 || Math.abs(ay - my) > 0.1) requestAnimationFrame(cuadro); else corriendo = false;
    };
    window.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      mx = e.clientX; my = e.clientY;
      punto.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      const t = e.target;
      cursor.classList.toggle('is-drag', Boolean(t.closest && t.closest('.reel__viewport')) && !t.closest('button'));
      cursor.classList.toggle('is-text', Boolean(t.closest && t.closest('input, textarea, select')));
      cursor.classList.toggle('is-link', Boolean(t.closest && t.closest('a, button, label, .exp-card, [role="button"]')) && !cursor.classList.contains('is-drag'));
      cursor.classList.remove('is-hidden');
      if (!corriendo) { corriendo = true; requestAnimationFrame(cuadro); }
    }, { passive: true });
    document.addEventListener('pointerdown', () => cursor.classList.add('is-down'));
    document.addEventListener('pointerup', () => cursor.classList.remove('is-down'));
    document.documentElement.addEventListener('pointerleave', () => cursor.classList.add('is-hidden'));
  }

  /* 7. ENTRADAS ============================================================ */
  // Parte los títulos en líneas para revelarlos con máscara
  function partirLineas(h) {
    const original = h.textContent.trim().replace(/\s+/g, ' ');
    h.dataset.original = original;
    h.innerHTML = original.split(' ').map((w) => `<span class="w">${escapar(w)}</span>`).join(' ');
    const lineas = [];
    let top = null;
    $$('.w', h).forEach((w) => {
      if (w.offsetTop !== top) { lineas.push([]); top = w.offsetTop; }
      lineas[lineas.length - 1].push(w.textContent);
    });
    h.innerHTML = lineas.map((l, i) => `<span class="mask" style="--l:${i}"><span>${escapar(l.join(' '))}</span></span>`).join('');
    h.classList.add('is-split');
    h._lineas = lineas.length;
  }

  const obsTitulos = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => {
      if (!e.isIntersecting) return;
      const h = e.target;
      obsTitulos.unobserve(h);
      h.classList.add('is-visible');
      // al terminar se restaura el texto original para que se acomode libremente
      setTimeout(() => { h.textContent = h.dataset.original; }, 780 + h._lineas * 60);
    });
  }, { threshold: 0.3, rootMargin: '0px 0px -6% 0px' });

  const fuentes = document.fonts ? document.fonts.ready : Promise.resolve();
  Promise.race([fuentes, new Promise((r) => setTimeout(r, 800))]).then(() => {
    $$('.reveal-title').forEach((h) => { partirLineas(h); obsTitulos.observe(h); });
    requestAnimationFrame(() => document.body.classList.add('is-ready'));
  });

  // Escalonado entre hermanos (~60 ms)
  $$('[data-reveal]').forEach((el) => {
    const hermanos = [...el.parentElement.children].filter((h) => h.hasAttribute('data-reveal'));
    el.style.setProperty('--i', hermanos.indexOf(el));
  });
  const obsReveal = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      obsReveal.unobserve(el);
      el.classList.add('is-visible');
      const retraso = (parseFloat(el.style.getPropertyValue('--i')) || 0) * 50 + 60;
      // se libera el elemento para que use sus propias transiciones de hover
      setTimeout(() => { el.removeAttribute('data-reveal'); el.classList.remove('is-visible'); }, 660 + retraso);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  $$('[data-reveal]').forEach((el) => obsReveal.observe(el));

  // Números que cuentan
  const obsContadores = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      obsContadores.unobserve(el);
      const fin = Number(el.dataset.count);
      if (reduceMotion()) { el.textContent = fin; return; }
      const inicio = performance.now(), dur = 1400;
      const paso = (t) => {
        const p = clamp((t - inicio) / dur, 0, 1);
        el.textContent = Math.round(fin * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(paso);
      };
      el.textContent = '0';
      requestAnimationFrame(paso);
    });
  }, { threshold: 0.6 });
  $$('[data-count]').forEach((el) => obsContadores.observe(el));

  // "Sal a vivirlo." se escribe al aparecer (se observa al contenedor)
  const obsEscritura = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target._escritura.forEach((el) => el.classList.add('is-written'));
      obsEscritura.unobserve(e.target);
    });
  }, { threshold: 0.3 });
  $$('[data-write]').forEach((el) => {
    const padre = el.parentElement;
    (padre._escritura = padre._escritura || []).push(el);
    obsEscritura.observe(padre);
  });

  // Marquee: se duplica el contenido para un ciclo sin cortes
  const marquee = $('.marquee');
  const pista = $('.marquee__track', marquee);
  [...pista.children].forEach((n) => pista.append(n.cloneNode(true)));
  marquee.classList.add('is-ready');

  /* 8. BOTÓN MAGNÉTICO (computadora) ======================================= */
  $$('.btn--magnetic').forEach((btn) => {
    const zona = btn.parentElement;
    zona.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse' || reduceMotion()) return;
      const c = btn.getBoundingClientRect();
      const dx = e.clientX - (c.left + c.width / 2);
      const dy = e.clientY - (c.top + c.height / 2);
      btn.style.setProperty('--mx', `${clamp(dx * 0.3, -14, 14).toFixed(1)}px`);
      btn.style.setProperty('--my', `${clamp(dy * 0.4, -10, 10).toFixed(1)}px`);
      btn.style.setProperty('--ix', `${clamp(dx * 0.12, -6, 6).toFixed(1)}px`);
      btn.style.setProperty('--iy', `${clamp(dy * 0.15, -4, 4).toFixed(1)}px`);
    });
    zona.addEventListener('pointerleave', () => ['--mx', '--my', '--ix', '--iy'].forEach((v) => btn.style.removeProperty(v)));
  });

  /* 9. EXPERIENCIAS: MOMENTO NARRATIVO ===================================== */
  const plans = $('.plans');
  const tarjetas = $$('.exp-card');
  const botonesMood = $$('[data-mood-go]');
  const modoFijo = window.matchMedia('(min-width: 1024px) and (min-height: 720px)');

  function ponerMood(mood) {
    if (plans.dataset.mood === mood && plans.dataset.moodSet) return;
    plans.dataset.mood = mood;
    plans.dataset.moodSet = '1';
    botonesMood.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.moodGo === mood)));
    tarjetas.forEach((t) => t.classList.toggle('is-focus', modoFijo.matches && t.dataset.mood === mood));
  }

  const obsTriggers = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => { if (e.isIntersecting) ponerMood(e.target.dataset.trigger); });
  }, { rootMargin: '-50% 0px -50% 0px' });
  const obsTarjetas = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => { if (e.isIntersecting) ponerMood(e.target.dataset.mood); });
  }, { rootMargin: '-40% 0px -40% 0px' });

  function configurarNarrativa() {
    obsTriggers.disconnect();
    obsTarjetas.disconnect();
    if (modoFijo.matches) $$('[data-trigger]').forEach((t) => obsTriggers.observe(t));
    else tarjetas.forEach((t) => obsTarjetas.observe(t));
    tarjetas.forEach((t) => t.classList.toggle('is-focus', modoFijo.matches && t.dataset.mood === plans.dataset.mood));
  }
  configurarNarrativa();
  modoFijo.addEventListener('change', configurarNarrativa);

  botonesMood.forEach((b) => b.addEventListener('click', () => {
    const mood = b.dataset.moodGo;
    ponerMood(mood);
    if (modoFijo.matches) {
      const t = $(`[data-trigger="${mood}"]`);
      const y = t.getBoundingClientRect().top + scrollY - innerHeight / 2 + 4;
      window.scrollTo({ top: y, behavior: scrollBehavior() });
    }
  }));

  /* 10. ACORDEONES ========================================================= */
  document.addEventListener('click', (e) => {
    const b = e.target.closest('.acc-trigger');
    if (!b) return;
    const panel = document.getElementById(b.getAttribute('aria-controls'));
    const abrir = b.getAttribute('aria-expanded') !== 'true';
    b.setAttribute('aria-expanded', String(abrir));
    panel.classList.toggle('is-open', abrir);
  });

  /* 11. MODALES ============================================================ */
  function actualizarBloqueo() {
    const abierto = $$('dialog[open]').length > 0;
    document.documentElement.classList.toggle('is-locked', abierto);
    // Los <dialog> quedan por encima de todo: ahí se usa el cursor del sistema
    if (cursorActivo) document.documentElement.classList.toggle('has-cursor', !abierto);
    // el carrusel se pausa mientras hay un modal o el pago abierto
    if (typeof sincronizarAuto === 'function') sincronizarAuto();
  }

  // Apertura y cierre genéricos (legales y pago): fade + escala por CSS
  function abrirDialogo(dlg, disparador) {
    dlg._disparador = disparador || document.activeElement;
    clearTimeout(dlg._timer);
    dlg.classList.remove('is-closing');
    if (!dlg.open) dlg.showModal();
    actualizarBloqueo();
    dlg.offsetHeight;
    dlg.classList.add('is-open');
  }
  function cerrarDialogo(dlg, { devolverFoco = true } = {}) {
    if (!dlg.open || dlg.classList.contains('is-closing')) return Promise.resolve();
    dlg.classList.remove('is-open');
    dlg.classList.add('is-closing');
    return new Promise((ok) => {
      dlg._timer = setTimeout(() => {
        dlg.classList.remove('is-closing');
        dlg.close();
        actualizarBloqueo();
        if (devolverFoco && dlg._disparador && document.contains(dlg._disparador)) dlg._disparador.focus({ preventScroll: true });
        ok();
      }, reduceMotion() ? 0 : 200);
    });
  }

  // --- Detalle de experiencia con transición compartida (FLIP) ---
  const modalExp = $('#exp-modal');
  const panelExp = $('.modal__panel', modalExp);
  const fantasma = $('.modal__ghost', modalExp);
  const escenasModal = {};
  let expActual = null;
  let tarjetaOrigen = null;
  let animandoModal = false;

  function llenarExperiencia(id) {
    const x = EXPERIENCIAS[id];
    expActual = id;
    panelExp.dataset.mood = id;
    fantasma.dataset.mood = id;
    const cont = $('#exp-scene');
    cont.innerHTML = '';
    if (!escenasModal[id]) {
      const s = document.createElement('div');
      s.className = 'scene';
      s.dataset.scene = id;
      s.dataset.seed = '91';
      s.dataset.photo = `../fotos/${id}.jpg`;
      escenasModal[id] = s;
    }
    cont.append(escenasModal[id]);
    $('#exp-mood').textContent = x.mood;
    $('#exp-title').textContent = x.nombre;
    $('#exp-duracion').textContent = x.duracion;
    $('#exp-dificultad').textContent = x.dificultad;
    $('#exp-fecha').textContent = x.fechas[0].label;
    $('#exp-desc').textContent = x.descripcion;
    $('#exp-precio').textContent = formatoPrecio(x.precio);
    $('#exp-incluye').innerHTML = x.incluye.map(([i, t]) => `<li><i class="ph ${i}" aria-hidden="true"></i>${t}</li>`).join('');
    $('#exp-faq').innerHTML = x.faq.map(([q, a], i) => `
      <div class="acc-item"><h4><button class="acc-trigger" type="button" aria-expanded="false" aria-controls="exp-faq-${i}" id="exp-faq-${i}-btn">${q}<span class="acc-icon" aria-hidden="true"></span></button></h4>
      <div class="acc-panel" id="exp-faq-${i}" role="region" aria-labelledby="exp-faq-${i}-btn"><div class="acc-inner"><p>${a}</p></div></div></div>`).join('');
    $('.modal__scroll', modalExp).scrollTop = 0;
  }

  // Transforma el rectángulo "desde" en el rectángulo "hasta" (para el fantasma)
  const rectATransform = (de, a) =>
    `translate(${de.left}px, ${de.top}px) scale(${(de.width / a.width).toFixed(4)}, ${(de.height / a.height).toFixed(4)})`;

  function abrirExperiencia(id, boton) {
    if (animandoModal) return;
    llenarExperiencia(id);
    tarjetaOrigen = boton.closest('.exp-card');
    modalExp._disparador = boton;
    panelExp.style.opacity = '0';
    modalExp.showModal();
    actualizarBloqueo();
    construirEscena(escenasModal[id]);

    const destino = panelExp.getBoundingClientRect();
    modalExp.offsetHeight;
    modalExp.classList.add('is-open');

    if (reduceMotion() || !tarjetaOrigen) {
      panelExp.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: 'ease' });
      panelExp.style.opacity = '';
      return;
    }

    animandoModal = true;
    const origen = tarjetaOrigen.getBoundingClientRect();
    fantasma.style.width = destino.width + 'px';
    fantasma.style.height = destino.height + 'px';
    tarjetaOrigen.style.opacity = '0';
    const vuelo = fantasma.animate([
      { transform: rectATransform(origen, destino), opacity: 1 },
      { transform: rectATransform(destino, destino), opacity: 1 }
    ], { duration: 460, easing: EASE_SCENE, fill: 'forwards' });
    vuelo.onfinish = () => {
      panelExp.style.opacity = '';
      panelExp.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 240, easing: EASE_OUT });
      setTimeout(() => {
        fantasma.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160, fill: 'forwards' }).onfinish = () => { vuelo.cancel(); animandoModal = false; };
      }, 200);
    };
  }

  function cerrarExperiencia({ devolverFoco = true } = {}) {
    if (!modalExp.open || animandoModal || modalExp.classList.contains('is-closing')) return Promise.resolve();
    const tarjeta = tarjetaOrigen;
    const terminar = () => {
      modalExp.classList.remove('is-closing');
      modalExp.close();
      panelExp.style.opacity = '';
      if (tarjeta) tarjeta.style.opacity = '';
      actualizarBloqueo();
      animandoModal = false;
      if (devolverFoco && modalExp._disparador) modalExp._disparador.focus({ preventScroll: true });
    };
    modalExp.classList.remove('is-open');
    modalExp.classList.add('is-closing');

    if (reduceMotion() || !tarjeta) {
      return new Promise((ok) => {
        panelExp.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 180, fill: 'forwards' }).onfinish = () => { terminar(); ok(); };
      });
    }
    animandoModal = true;
    return new Promise((ok) => {
      const destino = panelExp.getBoundingClientRect();
      const origen = tarjeta.getBoundingClientRect();
      fantasma.style.width = destino.width + 'px';
      fantasma.style.height = destino.height + 'px';
      // primero se desvanece el contenido, luego el fantasma vuelve a la tarjeta
      panelExp.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, easing: 'ease', fill: 'forwards' }).onfinish = () => {
        panelExp.style.opacity = '0';
        const vuelta = fantasma.animate([
          { transform: rectATransform(destino, destino), opacity: 1 },
          { transform: rectATransform(origen, destino), opacity: 1 }
        ], { duration: 380, easing: EASE_SCENE, fill: 'forwards' });
        vuelta.onfinish = () => {
          tarjeta.style.opacity = '';
          fantasma.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: 'forwards' }).onfinish = () => {
            vuelta.cancel();
            panelExp.getAnimations().forEach((a) => a.cancel());
            terminar();
            ok();
          };
        };
      };
    });
  }

  $$('[data-open-exp]').forEach((b) => b.addEventListener('click', () => abrirExperiencia(b.dataset.openExp, b)));
  modalExp.addEventListener('cancel', (e) => { e.preventDefault(); cerrarExperiencia(); });
  let empezoFueraExp = false;
  modalExp.addEventListener('pointerdown', (e) => { empezoFueraExp = e.target === modalExp; });
  modalExp.addEventListener('click', (e) => {
    if ((e.target === modalExp && empezoFueraExp) || e.target.closest('[data-close]')) cerrarExperiencia();
  });
  $('#exp-reservar').addEventListener('click', async () => {
    const id = expActual;
    await cerrarExperiencia({ devolverFoco: false });
    elegirExperiencia(id);
    mostrarAviso(`Elegiste ${EXPERIENCIAS[id].nombre}. Ya quedó seleccionada en el paso 2.`);
    irAlCuestionario();
  });

  // --- Textos legales ---
  const modalLegal = $('#legal-modal');
  modalLegal.addEventListener('cancel', (e) => { e.preventDefault(); cerrarDialogo(modalLegal); });
  let empezoFueraLegal = false;
  modalLegal.addEventListener('pointerdown', (e) => { empezoFueraLegal = e.target === modalLegal; });
  modalLegal.addEventListener('click', (e) => {
    if ((e.target === modalLegal && empezoFueraLegal) || e.target.closest('[data-close]')) cerrarDialogo(modalLegal);
  });
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-open-legal]');
    if (!b) return;
    e.preventDefault(); // dentro de un <label> no debe marcar la casilla
    const doc = LEGALES[b.dataset.openLegal];
    $('#legal-title').textContent = doc.titulo;
    $('#legal-body').innerHTML = '<p class="legal__flag">Texto de ejemplo. Reemplázalo con el documento legal oficial de HILA.</p>' + doc.parrafos.map((p) => `<p>${p}</p>`).join('');
    abrirDialogo(modalLegal, b);
  });

  /* 12. CARRUSEL DE FOTOS Y VIDEOS =========================================
     Se construye desde MEDIOS. Scroll nativo con snap (swipe con inercia),
     arrastre con mouse, flechas, teclado y autoavance lento con barra de
     progreso que se pausa al tocar, al pasar el mouse, con foco o si la
     pestaña no está visible. Los videos cargan solo cerca del slide activo
     y se reproducen únicamente cuando su slide está activo. */
  const reel = $('.reel');
  const vista = $('#reel');
  const pistaReel = $('.reel__track', vista);
  const progreso = $('.reel__progress');
  const [flechaAnt, flechaSig] = $$('.reel__btn--arrow');
  const btnPausa = $('#reel-pause');
  const modoCentro = window.matchMedia('(min-width: 768px)');
  const AUTO = 7000; // milisegundos por slide
  const TONOS = ['#15463a', '#1f4e5f', '#4d4433', '#3d5235', '#5e3423']; // fondos neutros de los marcadores
  reel.style.setProperty('--auto', AUTO + 'ms');

  // Construcción de los slides
  MEDIOS.forEach((m, i) => {
    const esVideo = m.tipo === 'video';
    const ruta = CARPETA_MEDIOS + m.archivo;
    const li = document.createElement('li');
    li.className = 'reel__slide';
    li.setAttribute('aria-roledescription', 'slide');
    li.setAttribute('aria-label', `${i + 1} de ${MEDIOS.length}: ${m.titulo}`);
    li.innerHTML = `
      <figure class="reel__card" style="--ph:${TONOS[i % TONOS.length]}">
        <div class="reel__ph" aria-hidden="true">
          <i class="ph ${esVideo ? 'ph-film-strip' : 'ph-image'}"></i>
          <strong>Aquí va tu ${esVideo ? 'video' : 'foto'}</strong>
          <code>${escapar(ruta)}</code>
        </div>
        ${esVideo
          ? `<video class="reel__media" muted playsinline loop preload="none" aria-label="${escapar(m.titulo)}"></video>
             <button class="reel__vbtn" type="button" aria-pressed="false" aria-label="Pausar video: ${escapar(m.titulo)}"><i class="ph ph-pause" aria-hidden="true"></i></button>`
          : `<img class="reel__media" alt="${escapar(m.titulo)}" loading="lazy" decoding="async">`}
        <div class="reel__shade" aria-hidden="true"></div>
        <figcaption class="reel__caption">
          ${m.etiqueta ? `<span class="reel__tag">${escapar(m.etiqueta)}</span>` : ''}
          <h3>${escapar(m.titulo)}</h3>
          ${m.subtitulo ? `<p>${escapar(m.subtitulo)}</p>` : ''}
        </figcaption>
      </figure>`;
    const medio = $('.reel__media', li);
    medio.dataset.src = ruta;
    if (!esVideo) {
      medio.addEventListener('load', () => medio.classList.add('is-loaded'), { once: true });
      medio.src = ruta; // la carga diferida la hace loading="lazy"
    } else {
      // El botón de play/pausa aparece solo cuando el video existe y cargó
      const vbtn = $('.reel__vbtn', li);
      vbtn.hidden = true;
      medio.addEventListener('loadeddata', () => { medio.classList.add('is-loaded'); vbtn.hidden = false; }, { once: true });
      medio.addEventListener('play', () => pintarBotonVideo(li, true));
      medio.addEventListener('pause', () => pintarBotonVideo(li, false));
    }
    pistaReel.append(li);

    const seg = document.createElement('button');
    seg.type = 'button';
    seg.className = 'reel__seg';
    seg.setAttribute('aria-label', `Ir a ${m.titulo}`);
    seg.innerHTML = '<span aria-hidden="true"></span>';
    seg.addEventListener('click', () => irASlide(i));
    progreso.append(seg);
  });

  const slides = $$('.reel__slide', vista);
  const segmentos = $$('.reel__seg', progreso);
  const videoPausadoPorUsuario = new Set();
  let activa = -1;

  // Posición de scroll que deja un slide en su lugar (inicio en celular, centro en computadora)
  function objetivo(s) {
    if (modoCentro.matches) return s.offsetLeft - (vista.clientWidth - s.offsetWidth) / 2;
    return s.offsetLeft - (parseFloat(getComputedStyle(vista).scrollPaddingLeft) || 0);
  }
  const maxScroll = () => vista.scrollWidth - vista.clientWidth;
  function masCercano(pos) {
    let mejor = 0, dist = Infinity;
    slides.forEach((s, i) => {
      const d = Math.abs(clamp(objetivo(s), 0, maxScroll()) - pos);
      if (d < dist) { dist = d; mejor = i; }
    });
    return mejor;
  }
  function irASlide(i, suave = true) {
    const s = slides[clamp(i, 0, slides.length - 1)];
    vista.scrollTo({ left: clamp(objetivo(s), 0, maxScroll()), behavior: suave ? scrollBehavior() : 'auto' });
  }

  function cargarVideo(slide) {
    const v = $('video', slide);
    if (v && !v.getAttribute('src')) { v.preload = 'metadata'; v.src = v.dataset.src; }
  }
  function actualizarVideos() {
    slides.forEach((s, j) => {
      const v = $('video', s);
      if (!v) return;
      if (Math.abs(j - activa) <= 1) cargarVideo(s); // carga diferida: solo el activo y sus vecinos
      const debeSonar = j === activa && enPantalla && !document.hidden && !reduceMotion() && !videoPausadoPorUsuario.has(j);
      if (debeSonar) v.play().catch(() => {});
      else if (!v.paused) v.pause();
    });
  }

  // El botón refleja si el video realmente se está reproduciendo
  function pintarBotonVideo(slide, reproduciendo) {
    const b = $('.reel__vbtn', slide);
    const j = slides.indexOf(slide);
    b.setAttribute('aria-pressed', String(!reproduciendo));
    b.setAttribute('aria-label', `${reproduciendo ? 'Pausar' : 'Reproducir'} video: ${MEDIOS[j].titulo}`);
    $('i', b).className = reproduciendo ? 'ph ph-pause' : 'ph ph-play';
  }

  function marcarActiva(i) {
    if (i === activa) return;
    activa = i;
    slides.forEach((s, j) => s.classList.toggle('is-active', j === i));
    segmentos.forEach((g, j) => {
      g.classList.toggle('is-past', j < i);
      if (j === i) g.setAttribute('aria-current', 'true'); else g.removeAttribute('aria-current');
    });
    flechaAnt.disabled = i === 0;
    flechaSig.disabled = i === slides.length - 1;
    actualizarVideos();
    reiniciarAuto();
  }

  let pendReel = false;
  vista.addEventListener('scroll', () => {
    if (pendReel) return;
    pendReel = true;
    requestAnimationFrame(() => { pendReel = false; marcarActiva(masCercano(vista.scrollLeft)); });
  }, { passive: true });
  window.addEventListener('resize', () => irASlide(activa, false));
  modoCentro.addEventListener('change', () => irASlide(activa, false));

  flechaAnt.addEventListener('click', () => irASlide(activa - 1));
  flechaSig.addEventListener('click', () => irASlide(activa + 1));
  vista.addEventListener('keydown', (e) => {
    const mapa = { ArrowRight: activa + 1, ArrowLeft: activa - 1, Home: 0, End: slides.length - 1 };
    if (e.target !== vista || !(e.key in mapa)) return;
    e.preventDefault();
    irASlide(mapa[e.key]);
  });
  vista.addEventListener('click', (e) => {
    const b = e.target.closest('.reel__vbtn');
    if (!b) return;
    const j = slides.indexOf(b.closest('.reel__slide'));
    if (j !== activa) { irASlide(j); videoPausadoPorUsuario.delete(j); return; }
    if (videoPausadoPorUsuario.has(j)) videoPausadoPorUsuario.delete(j); else videoPausadoPorUsuario.add(j);
    actualizarVideos();
  });

  // Arrastre con el mouse, con inercia al soltar
  let arrastre = null;
  vista.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0 || e.target.closest('button')) return;
    arrastre = { x: e.clientX, scroll: vista.scrollLeft, movido: false, muestras: [[e.clientX, performance.now()]] };
    sincronizarAuto();
  });
  vista.addEventListener('pointermove', (e) => {
    if (!arrastre) return;
    const dx = e.clientX - arrastre.x;
    if (!arrastre.movido && Math.abs(dx) > 4) {
      arrastre.movido = true;
      vista.classList.add('is-dragging');
      vista.setPointerCapture(e.pointerId);
    }
    if (arrastre.movido) {
      vista.scrollLeft = arrastre.scroll - dx;
      arrastre.muestras.push([e.clientX, performance.now()]);
      if (arrastre.muestras.length > 5) arrastre.muestras.shift();
    }
  });
  const soltar = () => {
    if (!arrastre) return;
    const a = arrastre;
    arrastre = null;
    if (a.movido) {
      const [x0, t0] = a.muestras[0];
      const [x1, t1] = a.muestras[a.muestras.length - 1];
      const v = (x1 - x0) / Math.max(1, t1 - t0);
      vista.classList.remove('is-dragging');
      irASlide(masCercano(vista.scrollLeft - v * 240));
      vista.addEventListener('click', (ev) => { ev.preventDefault(); ev.stopPropagation(); }, { capture: true, once: true });
    }
    sincronizarAuto();
  };
  vista.addEventListener('pointerup', soltar);
  vista.addEventListener('pointercancel', soltar);

  // Autoavance con pausa real: guarda el tiempo restante y la barra se congela
  let pausadoPorUsuario = false, encima = false, conFoco = false, tocando = false, enPantalla = false;
  let restante = AUTO, inicioTimer = 0, timerAuto = null, timerToque;
  const autoActivo = () => !reduceMotion() && !pausadoPorUsuario;
  const enPausa = () => encima || conFoco || tocando || !enPantalla || document.hidden || Boolean(arrastre) || $$('dialog[open]').length > 0;
  function sincronizarAuto() {
    if (!reel) return;
    const activo = autoActivo();
    reel.classList.toggle('is-auto', activo);
    const pausar = !activo || enPausa();
    reel.classList.toggle('is-paused', pausar);
    if (pausar) {
      if (timerAuto) { clearTimeout(timerAuto); timerAuto = null; restante = Math.max(0, restante - (performance.now() - inicioTimer)); }
    } else if (!timerAuto) {
      inicioTimer = performance.now();
      timerAuto = setTimeout(() => { timerAuto = null; irASlide(activa >= slides.length - 1 ? 0 : activa + 1); }, restante);
    }
  }
  function reiniciarAuto() {
    clearTimeout(timerAuto);
    timerAuto = null;
    restante = AUTO;
    sincronizarAuto();
  }
  reel.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') { encima = true; sincronizarAuto(); } });
  reel.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') { encima = false; sincronizarAuto(); } });
  reel.addEventListener('focusin', () => { conFoco = true; sincronizarAuto(); });
  reel.addEventListener('focusout', (e) => { if (!reel.contains(e.relatedTarget)) { conFoco = false; sincronizarAuto(); } });
  vista.addEventListener('touchstart', () => { tocando = true; clearTimeout(timerToque); sincronizarAuto(); }, { passive: true });
  vista.addEventListener('touchend', () => { clearTimeout(timerToque); timerToque = setTimeout(() => { tocando = false; sincronizarAuto(); }, 4000); }, { passive: true });
  document.addEventListener('visibilitychange', () => { sincronizarAuto(); actualizarVideos(); });
  new IntersectionObserver(([e]) => { enPantalla = e.isIntersecting; sincronizarAuto(); actualizarVideos(); }, { threshold: 0.35 }).observe(reel);
  btnPausa.addEventListener('click', () => {
    pausadoPorUsuario = !pausadoPorUsuario;
    btnPausa.setAttribute('aria-pressed', String(pausadoPorUsuario));
    btnPausa.setAttribute('aria-label', pausadoPorUsuario ? 'Reanudar avance automático' : 'Pausar avance automático');
    $('i', btnPausa).className = pausadoPorUsuario ? 'ph ph-play' : 'ph ph-pause';
    reiniciarAuto();
  });
  if (reduceMotion()) btnPausa.hidden = true;

  // En computadora arranca en el segundo slide para que haya fotos a ambos lados
  requestAnimationFrame(() => { const i = modoCentro.matches && slides.length > 2 ? 1 : 0; irASlide(i, false); marcarActiva(i); });

  /* 13. CUESTIONARIO POR PANTALLAS =========================================
     En celular se muestra un grupo pequeño por pantalla; en computadora,
     el paso completo. "Atrás" siempre está disponible y nada se pierde:
     todo se guarda en sessionStorage mientras escribes. */
  const form = $('#booking-form');
  const pasos = $$('.step', form);
  const barra = $('.progress__bar');
  const btnAtras = $('#step-back');
  const btnSiguiente = $('#step-next');
  const etiquetaSiguiente = $('#step-next-label');
  const grupoExp = $('.choice', form);
  const resumen = $('#summary');
  const btnResumen = $('.summary__bar', resumen);
  const modoPantallas = window.matchMedia('(max-width: 767px)');
  const CLAVE = 'hila-reserva-v3';
  let pasoActual = 1;
  let pantallaActual = 0;
  let cambiando = false;

  const pantallasDe = (n) => $$('.screen', pasos[n - 1]);
  const TOTAL_PANTALLAS = pasos.reduce((t, _, i) => t + pantallasDe(i + 1).length, 0);
  const indiceGlobal = () => pasos.slice(0, pasoActual - 1).reduce((t, _, i) => t + pantallasDe(i + 1).length, 0) + pantallaActual;

  const soloDigitos = (v) => v.replace(/\D/g, '');
  const celularValido = (v) => { let d = soloDigitos(v); if (d.length === 12 && d.startsWith('52')) d = d.slice(2); return d.length === 10; };
  const enRango = (v, min, max) => /^\d+$/.test(v.trim()) && Number(v) >= min && Number(v) <= max;
  const expElegida = () => form.elements.experiencia.value;

  const REGLAS = {
    nombre: (v) => (v.trim().length >= 2 ? '' : 'Escribe tu nombre para saber cómo llamarte.'),
    apellido: (v) => (v.trim().length >= 2 ? '' : 'Escribe tu apellido.'),
    edad: (v) => {
      if (!v.trim()) return 'Escribe tu edad.';
      if (!/^\d+$/.test(v.trim())) return 'Escribe tu edad solo con números, por ejemplo 25.';
      return enRango(v, 18, 34) ? '' : 'Por ahora nuestras experiencias son para personas de 18 a 34 años. Si tienes dudas, escríbenos.';
    },
    celular: (v) => (!v.trim() ? 'Escribe tu celular para avisarte de cualquier cambio.' : celularValido(v) ? '' : 'Revisa tu celular: debe tener 10 dígitos, por ejemplo 55 1234 5678.'),
    mail: (v) => (!v.trim() ? 'Escribe tu correo para enviarte la confirmación.' : /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Revisa tu correo, parece que le falta algo (ejemplo: tu@correo.com).'),
    experiencia: () => (expElegida() ? '' : 'Elige la experiencia que quieres vivir.'),
    fecha: (v) => (v || !expElegida() ? '' : 'Elige una fecha para tu experiencia.'),
    padecimientos: (v) => (v.trim() ? '' : 'Cuéntanos si tienes algún padecimiento. Si no tienes, escribe “Ninguno”.'),
    alergias: (v) => (v.trim() ? '' : 'Cuéntanos si tienes alguna alergia. Si no tienes, escribe “Ninguna”.'),
    altura: (v) => (enRango(v, 120, 220) ? '' : 'Escribe tu altura en centímetros, por ejemplo 170.'),
    peso: (v) => (enRango(v, 35, 200) ? '' : 'Escribe tu peso en kilos, por ejemplo 65.'),
    sangre: (v) => (v ? '' : 'Elige tu tipo de sangre o “No lo sé”.'),
    emNombre: (v) => (v.trim().length >= 2 ? '' : 'Escribe el nombre de alguien a quien podamos llamar.'),
    emParentesco: (v) => (v.trim() ? '' : 'Cuéntanos qué relación tiene contigo.'),
    emTelefono: (v) => {
      if (!v.trim()) return 'Escribe el teléfono de tu contacto de emergencia.';
      if (!celularValido(v)) return 'Revisa el teléfono: debe tener 10 dígitos.';
      return soloDigitos(v).slice(-10) === soloDigitos(form.elements.celular.value).slice(-10) ? 'Usa un número distinto al tuyo, para poder localizar a alguien más.' : '';
    },
    privacidad: (_, el) => (el.checked ? '' : 'Necesitamos que aceptes el Aviso de Privacidad para continuar.'),
    cancelacion: (_, el) => (el.checked ? '' : 'Necesitamos que aceptes las Políticas de Cancelación para continuar.'),
    terminos: (_, el) => (el.checked ? '' : 'Necesitamos que aceptes los Términos y Condiciones para continuar.')
  };

  // Campos con regla dentro de un contenedor (los radios cuentan como uno)
  function camposEn(contenedor) {
    const vistos = new Set();
    return $$('input, select, textarea', contenedor).filter((el) => {
      if (!REGLAS[el.name] || vistos.has(el.name)) return false;
      vistos.add(el.name);
      return true;
    });
  }
  const errorDe = (el) => (el.name === 'experiencia' ? $('#f-experiencia-error') : document.getElementById(el.id + '-error'));
  const contenedorValido = (c) => camposEn(c).every((el) => !REGLAS[el.name](el.value, el));

  function validarCampo(el, { sacudir = false } = {}) {
    const regla = REGLAS[el.name];
    if (!regla) return true;
    const mensaje = regla(el.value, el);
    const error = errorDe(el);
    error.textContent = mensaje;
    const objetivoAria = el.name === 'experiencia' ? grupoExp : el;
    if (mensaje) {
      objetivoAria.setAttribute('aria-invalid', 'true');
      if (el.name !== 'experiencia') {
        const ids = new Set((el.getAttribute('aria-describedby') || '').split(' ').filter(Boolean));
        ids.add(error.id);
        el.setAttribute('aria-describedby', [...ids].join(' '));
      }
      if (sacudir && !reduceMotion()) {
        const s = el.type === 'checkbox' ? el.closest('.check') : el.name === 'experiencia' ? grupoExp : el.closest('.control') || el;
        s.classList.remove('is-shaking');
        s.offsetWidth;
        s.classList.add('is-shaking');
        s.addEventListener('animationend', () => s.classList.remove('is-shaking'), { once: true });
      }
    } else {
      objetivoAria.removeAttribute('aria-invalid');
    }
    marcarValido(el, !mensaje);
    return !mensaje;
  }
  function marcarValido(el, ok) {
    const c = el.closest('.control');
    if (c) c.classList.toggle('is-valid', ok && el.value.trim() !== '' && el.tagName !== 'SELECT');
  }
  function validarContenedor(c) {
    const invalidos = camposEn(c).filter((el) => !validarCampo(el, { sacudir: true }));
    if (invalidos.length) {
      const primero = invalidos[0].name === 'experiencia' ? $('input[name="experiencia"]', form) : invalidos[0];
      primero.focus({ preventScroll: true });
      primero.closest('.field, .choice, .check')?.scrollIntoView({ behavior: scrollBehavior(), block: 'center' });
    }
    return invalidos.length === 0;
  }

  // Validación al salir de cada campo (si ya se escribió algo) y en vivo al corregir
  form.addEventListener('focusout', (e) => {
    const el = e.target;
    if (!REGLAS[el.name] || el.type === 'checkbox' || el.type === 'radio') return;
    if (el.value.trim() !== '' || el.dataset.tocado || el.getAttribute('aria-invalid') === 'true') validarCampo(el);
  });
  form.addEventListener('input', (e) => {
    const el = e.target;
    el.dataset.tocado = '1';
    if (el.getAttribute('aria-invalid') === 'true') validarCampo(el);
    else if (REGLAS[el.name] && el.type !== 'radio' && el.type !== 'checkbox') marcarValido(el, !REGLAS[el.name](el.value, el));
    guardar();
    actualizarResumen();
  });
  form.addEventListener('change', (e) => {
    const el = e.target;
    if (el.name === 'experiencia') { llenarFechas(el.value); validarCampo(el); }
    else if (el.type === 'checkbox' || el.getAttribute('aria-invalid') === 'true') validarCampo(el);
    guardar();
    actualizarResumen();
  });
  // Enter salta al siguiente campo de la misma pantalla antes de continuar
  form.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'BUTTON') return;
    const contenedor = modoPantallas.matches ? e.target.closest('.screen') : e.target.closest('.step');
    const campos = $$('input:not([type="checkbox"]):not([type="radio"]), select', contenedor);
    const i = campos.indexOf(e.target);
    if (i > -1 && i < campos.length - 1) { e.preventDefault(); campos[i + 1].focus(); }
  });

  function llenarFechas(id, seleccion) {
    const select = form.elements.fecha;
    const previa = seleccion ?? select.value;
    const x = EXPERIENCIAS[id];
    select.innerHTML = x
      ? '<option value="">Elige una fecha</option>' + x.fechas.map((f) => `<option value="${f.value}">${f.label}</option>`).join('')
      : '<option value="">Primero elige una experiencia</option>';
    if (x && x.fechas.some((f) => f.value === previa)) select.value = previa;
  }
  function elegirExperiencia(id) {
    const radio = $(`input[name="experiencia"][value="${id}"]`, form);
    radio.checked = true;
    llenarFechas(id);
    if (grupoExp.getAttribute('aria-invalid') === 'true') validarCampo(radio);
    guardar();
    actualizarResumen();
  }

  // --- Resumen: barra plegable en celular, panel lateral en computadora ---
  function ponerDato(id, valor, vacio) {
    const dd = document.getElementById(id);
    const texto = valor || vacio;
    if (dd.textContent === texto) return;
    dd.textContent = texto;
    dd.classList.toggle('is-empty', !valor);
    dd.classList.remove('is-changed');
    dd.offsetWidth;
    dd.classList.add('is-changed');
  }
  const fechaElegida = () => (form.elements.fecha.value ? form.elements.fecha.selectedOptions[0].textContent : '');
  function actualizarResumen() {
    const id = expElegida();
    const x = EXPERIENCIAS[id];
    resumen.dataset.mood = id || '';
    $('#sum-exp').textContent = x ? x.nombre : 'Aún no eliges experiencia';
    $('#sum-meta').textContent = x ? (fechaElegida() || 'Falta elegir fecha') : 'La eliges en el paso 2';
    $('#sum-total').textContent = formatoPrecio(x ? x.precio : 0);
    ponerDato('sum-fecha', fechaElegida(), 'Por elegir');
    ponerDato('sum-nombre', `${form.elements.nombre.value.trim()} ${form.elements.apellido.value.trim()}`.trim(), 'Por escribir');
    ponerDato('sum-contacto', form.elements.mail.value.trim() || form.elements.celular.value.trim(), 'Por escribir');
    $('#sum-total-2').textContent = `${formatoPrecio(x ? x.precio : 0)} MXN`;
    $$('[data-check]', resumen).forEach((li) => li.classList.toggle('is-done', contenedorValido(pasos[Number(li.dataset.check) - 1])));
  }
  function abrirResumen(abrir) {
    resumen.classList.toggle('is-open', abrir);
    btnResumen.setAttribute('aria-expanded', String(abrir));
  }
  btnResumen.addEventListener('click', () => abrirResumen(!resumen.classList.contains('is-open')));
  document.addEventListener('click', (e) => { if (resumen.classList.contains('is-open') && !resumen.contains(e.target)) abrirResumen(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && resumen.classList.contains('is-open')) { abrirResumen(false); btnResumen.focus(); } });
  const modoPanel = window.matchMedia('(min-width: 1040px)');
  function ajustarResumen() {
    btnResumen.tabIndex = modoPanel.matches ? -1 : 0;
    if (modoPanel.matches) abrirResumen(false);
  }
  ajustarResumen();
  modoPanel.addEventListener('change', ajustarResumen);

  // --- Navegación entre pantallas y pasos ---
  function actualizarProgreso() {
    const fraccion = modoPantallas.matches ? (indiceGlobal() + 1) / TOTAL_PANTALLAS : pasoActual / 3;
    barra.style.setProperty('--progress', fraccion.toFixed(3));
    barra.setAttribute('aria-valuenow', Math.round(fraccion * 100));
    const nombre = pasos[pasoActual - 1].dataset.name;
    $('#progress-count').textContent = `Paso ${pasoActual} de 3`;
    $('#progress-name').textContent = nombre;
    barra.setAttribute('aria-valuetext', `Paso ${pasoActual} de 3: ${nombre}`);
    const esPrimero = pasoActual === 1 && (pantallaActual === 0 || !modoPantallas.matches);
    const esUltimo = pasoActual === 3 && (!modoPantallas.matches || pantallaActual === pantallasDe(3).length - 1);
    btnAtras.disabled = esPrimero;
    etiquetaSiguiente.textContent = esUltimo ? 'Continuar al pago' : 'Continuar';
  }

  function aplicarPosicion() {
    pasos.forEach((p, i) => {
      p.classList.toggle('is-active', i + 1 === pasoActual);
      pantallasDe(i + 1).forEach((s, j) => s.classList.toggle('is-active', i + 1 === pasoActual && j === pantallaActual));
    });
    actualizarProgreso();
  }

  function irA(paso, pantalla, { instantaneo = false } = {}) {
    if (cambiando) return;
    const dir = paso > pasoActual || (paso === pasoActual && pantalla > pantallaActual) ? 1 : -1;
    const saliente = modoPantallas.matches ? pantallasDe(pasoActual)[pantallaActual] : pasos[pasoActual - 1];
    pasoActual = paso;
    pantallaActual = pantalla;
    guardar();
    const entrante = modoPantallas.matches ? pantallasDe(pasoActual)[pantallaActual] : pasos[pasoActual - 1];
    if (instantaneo || saliente === entrante) { aplicarPosicion(); return; }
    const d = reduceMotion() ? 0 : 20;
    cambiando = true;
    // Seguro: la transición siempre se libera, aunque una animación se cancele
    const liberar = () => { cambiando = false; clearTimeout(seguro); };
    const seguro = setTimeout(liberar, 700);
    let mostrado = false;
    const salida = saliente.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: `translateX(${-dir * d}px)` }], { duration: 140, easing: EASE_OUT });
    salida.oncancel = () => { if (!mostrado) { mostrado = true; aplicarPosicion(); liberar(); } };
    salida.onfinish = () => {
      if (mostrado) return;
      mostrado = true;
      aplicarPosicion();
      const tarjeta = $('.form-card');
      if (tarjeta.getBoundingClientRect().top < 0) tarjeta.scrollIntoView({ behavior: 'auto', block: 'start' });
      const titulo = $('.screen.is-active .screen__title', entrante.closest('.step') || entrante) || $('.screen__title', entrante);
      if (titulo) { titulo.setAttribute('tabindex', '-1'); titulo.focus({ preventScroll: true }); }
      const entrada = entrante.animate([{ opacity: 0, transform: `translateX(${dir * d}px)` }, { opacity: 1, transform: 'none' }], { duration: 260, easing: EASE_OUT });
      entrada.onfinish = liberar;
      entrada.oncancel = liberar;
    };
  }

  function continuar() {
    if (cambiando) return;
    if (modoPantallas.matches) {
      if (!validarContenedor(pantallasDe(pasoActual)[pantallaActual])) return;
      if (pantallaActual < pantallasDe(pasoActual).length - 1) return irA(pasoActual, pantallaActual + 1);
    } else if (!validarContenedor(pasos[pasoActual - 1])) {
      return;
    }
    if (pasoActual < 3) return irA(pasoActual + 1, 0);
    // Último paso: revisa todo por si algún dato guardado quedó incompleto
    for (let n = 1; n <= 3; n++) {
      const pantallas = pantallasDe(n);
      for (let j = 0; j < pantallas.length; j++) {
        if (!contenedorValido(pantallas[j])) {
          irA(n, modoPantallas.matches ? j : 0, { instantaneo: true });
          validarContenedor(pantallas[j]);
          return;
        }
      }
    }
    guardar();
    abrirPago();
  }
  function atras() {
    if (cambiando || btnAtras.disabled) return;
    if (modoPantallas.matches && pantallaActual > 0) return irA(pasoActual, pantallaActual - 1);
    if (pasoActual > 1) irA(pasoActual - 1, modoPantallas.matches ? pantallasDe(pasoActual - 1).length - 1 : 0);
  }
  form.addEventListener('submit', (e) => { e.preventDefault(); continuar(); });
  btnAtras.addEventListener('click', atras);
  modoPantallas.addEventListener('change', () => { if (!modoPantallas.matches) pantallaActual = 0; aplicarPosicion(); });

  // --- Guardado en sessionStorage ---
  function guardar() {
    const datos = { paso: pasoActual, pantalla: pantallaActual, valores: {} };
    [...form.elements].forEach((el) => {
      if (!el.name) return;
      if (el.type === 'radio') { if (el.checked) datos.valores[el.name] = el.value; return; }
      datos.valores[el.name] = el.type === 'checkbox' ? el.checked : el.value;
    });
    try { sessionStorage.setItem(CLAVE, JSON.stringify(datos)); } catch (_) { /* modo privado */ }
  }
  function restaurar() {
    let datos;
    try { datos = JSON.parse(sessionStorage.getItem(CLAVE) || 'null'); } catch (_) { datos = null; }
    if (!datos) return;
    const v = datos.valores || {};
    if (v.experiencia) { $(`input[name="experiencia"][value="${v.experiencia}"]`, form).checked = true; llenarFechas(v.experiencia, v.fecha); }
    [...form.elements].forEach((el) => {
      if (!el.name || !(el.name in v) || el.type === 'radio' || el.name === 'fecha') return;
      if (el.type === 'checkbox') el.checked = Boolean(v[el.name]);
      else el.value = v[el.name];
      if (REGLAS[el.name] && el.type !== 'checkbox') marcarValido(el, !REGLAS[el.name](el.value, el));
    });
    const paso = clamp(Number(datos.paso) || 1, 1, 3);
    const pantalla = modoPantallas.matches ? clamp(Number(datos.pantalla) || 0, 0, pantallasDe(paso).length - 1) : 0;
    irA(paso, pantalla, { instantaneo: true });
  }
  const borrarGuardado = () => { try { sessionStorage.removeItem(CLAVE); } catch (_) { /* nada */ } };

  function mostrarAviso(texto) {
    const aviso = $('#form-notice');
    $('span', aviso).textContent = texto;
    aviso.hidden = true;
    aviso.offsetWidth;
    aviso.hidden = false;
  }
  function irAlCuestionario() {
    $('#reserva').scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
    $('#booking-title').focus({ preventScroll: true });
  }

  aplicarPosicion();
  restaurar();
  actualizarResumen();

  /* 14. PAGO SIMULADO ======================================================
     Vista a pantalla completa con el ambiente de la experiencia. Sin cobros
     reales: los botones de demo prueban el pago exitoso (6A) y el fallido (6B). */
  const pago = $('#pay');
  const boleto = $('.ticket', pago);
  const lienzo = $('.pay__confetti', pago);
  let timerPago, rafConfeti, folioActual = '';

  function llenarBoleto() {
    const id = expElegida();
    const x = EXPERIENCIAS[id];
    pago.dataset.mood = id;
    $('#t-mood').textContent = x.mood;
    $('#t-name').textContent = x.nombre;
    $('#t-fecha').textContent = fechaElegida();
    $('#t-persona').textContent = `${form.elements.nombre.value.trim()} ${form.elements.apellido.value.trim()}`;
    $('#t-total').textContent = `${formatoPrecio(x.precio)} MXN`;
    $('#t-folio').textContent = 'Pendiente';
    $('#t-stamp').textContent = new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
    boleto.classList.remove('is-stamped');
    $('.check-draw', pago).classList.remove('is-drawn');
  }

  function mostrarVista(nombre) {
    const actual = $('.pay__view.is-active', pago);
    const nueva = $(`.pay__view[data-view="${nombre}"]`, pago);
    pago.dataset.view = nombre;
    const entrar = () => {
      $$('.pay__view', pago).forEach((v) => v.classList.toggle('is-active', v === nueva));
      const t = $('.pay__title', nueva);
      if (t && t.hasAttribute('tabindex')) t.focus({ preventScroll: true });
      nueva.animate([{ opacity: 0, transform: `translateY(${reduceMotion() ? 0 : 8}px)` }, { opacity: 1, transform: 'none' }], { duration: 280, easing: EASE_OUT });
    };
    if (!actual || actual === nueva) return entrar();
    let hecho = false;
    const una = () => { if (!hecho) { hecho = true; entrar(); } };
    const salida = actual.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, easing: 'ease' });
    salida.onfinish = una;
    salida.oncancel = una;
    setTimeout(una, 400);
  }

  function iniciarConexion() {
    clearTimeout(timerPago);
    mostrarVista('redirect');
    timerPago = setTimeout(() => mostrarVista('paypal'), 2400);
  }

  function abrirPago() {
    llenarBoleto();
    $$('.pay__view', pago).forEach((v) => v.classList.toggle('is-active', v.dataset.view === 'redirect'));
    pago.dataset.view = 'redirect';
    abrirDialogo(pago, btnSiguiente);
    const ruta = $('.route__path', pago);
    ruta.style.setProperty('--len', Math.ceil(ruta.getTotalLength()));
    pago.querySelector('.pay__layout').scrollTop = 0;
    clearTimeout(timerPago);
    timerPago = setTimeout(() => mostrarVista('paypal'), 2400);
  }

  function pagoExitoso() {
    const x = EXPERIENCIAS[expElegida()];
    folioActual = 'HILA-' + Math.floor(1000 + Math.random() * 9000);
    $('#t-folio').textContent = folioActual;
    $('#ok-text').innerHTML = `Te enviamos la confirmación a <strong>${escapar(form.elements.mail.value.trim())}</strong>. Tu folio es <strong>${folioActual}</strong>.`;
    const msj = `Hola HILA, soy ${form.elements.nombre.value.trim()}. Acabo de reservar ${x.nombre} (folio ${folioActual}).`;
    $('#ok-whatsapp').href = `https://wa.me/525500000000?text=${encodeURIComponent(msj)}`;
    mostrarVista('ok');
    requestAnimationFrame(() => $('.check-draw', pago).classList.add('is-drawn'));
    setTimeout(() => { boleto.classList.add('is-stamped'); lanzarConfeti(); }, reduceMotion() ? 0 : 520);
    // La reserva quedó hecha: el borrador ya no hace falta, pero el formulario
    // conserva los datos hasta que la persona vuelva al inicio.
    borrarGuardado();
  }

  // Confeti en canvas: piezas de la paleta con gravedad, resistencia del aire
  // y aleteo. Dura unos 3 segundos y se limpia solo.
  function lanzarConfeti() {
    if (reduceMotion()) return;
    cancelAnimationFrame(rafConfeti);
    const ctx = lienzo.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = lienzo.clientWidth, H = lienzo.clientHeight;
    lienzo.width = W * dpr; lienzo.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const colores = ['#a8472a', '#e39a3b', '#f2b765', '#5f7342', '#9fd3cf', '#f9f4eb'];
    const caja = boleto.getBoundingClientRect();
    const ox = caja.left + caja.width / 2, oy = caja.top + caja.height * 0.25;
    const N = W < 640 ? 70 : 110;
    const piezas = Array.from({ length: N }, (_, i) => {
      const ang = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.95;
      const vel = 5 + Math.random() * 8;
      return {
        x: ox + (Math.random() - 0.5) * 60, y: oy,
        vx: Math.cos(ang) * vel, vy: Math.sin(ang) * vel,
        w: 6 + Math.random() * 5, h: 9 + Math.random() * 7,
        rot: Math.random() * Math.PI * 2, vr: (Math.random() - 0.5) * 0.28,
        giro: Math.random() * Math.PI * 2, vg: 0.08 + Math.random() * 0.12,
        color: colores[i % colores.length], redondo: Math.random() < 0.22
      };
    });
    const DUR = 3000, t0 = performance.now();
    let previo = t0;
    const cuadro = (ahora) => {
      const dt = Math.min(34, ahora - previo) / 16.67;
      previo = ahora;
      const t = ahora - t0;
      const alfa = t > DUR - 800 ? Math.max(0, (DUR - t) / 800) : 1;
      ctx.clearRect(0, 0, W, H);
      ctx.globalAlpha = alfa;
      for (const p of piezas) {
        p.vx *= Math.pow(0.986, dt);
        p.vy = Math.min(p.vy * Math.pow(0.986, dt) + 0.2 * dt, 4.6); // gravedad con velocidad terminal
        p.giro += p.vg * dt;
        p.x += (p.vx + Math.sin(p.giro) * 0.7) * dt;
        p.y += p.vy * dt;
        p.rot += p.vr * dt;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.scale(1, Math.cos(p.giro)); // aleteo: la pieza se voltea
        ctx.fillStyle = p.color;
        if (p.redondo) { ctx.beginPath(); ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2); ctx.fill(); }
        else ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
      if (t < DUR) rafConfeti = requestAnimationFrame(cuadro);
      else ctx.clearRect(0, 0, W, H);
    };
    rafConfeti = requestAnimationFrame(cuadro);
  }
  function detenerConfeti() {
    cancelAnimationFrame(rafConfeti);
    const ctx = lienzo.getContext('2d');
    ctx.clearRect(0, 0, lienzo.width, lienzo.height);
  }

  // Añadir al calendario: genera un archivo .ics con la fecha elegida
  function descargarCalendario() {
    const id = expElegida();
    const x = EXPERIENCIAS[id];
    const inicio = form.elements.fecha.value;
    if (!x || !inicio) return;
    const [a, m, d] = inicio.split('-').map(Number);
    const fin = new Date(Date.UTC(a, m - 1, d + (id === 'camping' ? 2 : 1)));
    const f = (fecha) => fecha.toISOString().slice(0, 10).replace(/-/g, '');
    const ahora = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
    const ics = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//HILA//Reserva//ES', 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT',
      `UID:${folioActual || Date.now()}@hilaexperiencias.com`, `DTSTAMP:${ahora}`,
      `DTSTART;VALUE=DATE:${inicio.replace(/-/g, '')}`, `DTEND;VALUE=DATE:${f(fin)}`,
      `SUMMARY:HILA · ${x.nombre}`,
      `DESCRIPTION:Folio ${folioActual}. Te escribiremos con el punto de encuentro y qué llevar.`,
      'END:VEVENT', 'END:VCALENDAR'
    ].join('\r\n');
    const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = `hila-${id}.ics`;
    document.body.append(enlace);
    enlace.click();
    enlace.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function volverAlCuestionario() {
    clearTimeout(timerPago);
    detenerConfeti();
    await cerrarDialogo(pago, { devolverFoco: false });
    const ultima = modoPantallas.matches ? pantallasDe(3).length - 1 : 0;
    irA(3, ultima, { instantaneo: true });
    mostrarAviso('Tus respuestas siguen guardadas. Revisa lo que necesites y vuelve a intentar el pago.');
    irAlCuestionario();
  }
  async function terminar() {
    detenerConfeti();
    await cerrarDialogo(pago, { devolverFoco: false });
    form.reset();
    llenarFechas('');
    $$('[aria-invalid]', form).forEach((el) => el.removeAttribute('aria-invalid'));
    $$('.field__error', form).forEach((el) => { el.textContent = ''; });
    $$('.control.is-valid', form).forEach((el) => el.classList.remove('is-valid'));
    $$('[data-tocado]', form).forEach((el) => delete el.dataset.tocado);
    $('#form-notice').hidden = true;
    irA(1, 0, { instantaneo: true });
    borrarGuardado();
    actualizarResumen();
    $('#inicio').scrollIntoView({ behavior: scrollBehavior() });
    $('.logo').focus({ preventScroll: true });
  }

  pago.addEventListener('click', (e) => {
    const accion = e.target.closest('[data-pay]')?.dataset.pay;
    if (!accion) return;
    if (accion === 'ok') pagoExitoso();
    if (accion === 'fail') mostrarVista('fail');
    if (accion === 'retry') iniciarConexion();
    if (accion === 'back') volverAlCuestionario();
    if (accion === 'done') terminar();
    if (accion === 'calendar') descargarCalendario();
    if (accion === 'contact') { clearTimeout(timerPago); cerrarDialogo(pago, { devolverFoco: false }); }
  });
  pago.addEventListener('cancel', (e) => { e.preventDefault(); pago.dataset.view === 'ok' ? terminar() : volverAlCuestionario(); });

  $('#year').textContent = new Date().getFullYear();
})();
