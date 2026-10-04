/* ==========================================================================
   HILA v6 · Sal a vivirlo
   JavaScript puro, sin librerías.

   ─────────────────────────────────────────────────────────────────────────
   CÓMO AGREGAR TUS FOTOS Y VIDEOS AL CARRUSEL
   1. Copia tus archivos a la carpeta v6/media/ (jpg, png, webp o mp4).
   2. Edita el arreglo MEDIOS de aquí abajo. Cada { ... } es un slide:
        tipo:      'imagen' o 'video'
        archivo:   el nombre exacto del archivo dentro de v6/media/
        titulo:    texto grande del slide
        subtitulo: una línea corta debajo del título
        etiqueta:  palabra corta arriba del título (ej. "Adrenalina")
        alt:       OBLIGATORIO. Qué se ve en la foto o video, en una frase
                   (ayuda a Google y a personas con lector de pantalla)
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
   12. Un vistazo: carrusel tipo historias (fotos y videos)
   13. Cuestionario por pantallas (validación, sessionStorage, resumen)
   14. Pago simulado (boleto, sello, confeti en canvas, calendario)
   15. Merch: carrusel manual (edita la lista MERCH, más abajo)
   ========================================================================== */

/* ===== SLIDES DEL CARRUSEL: edita solo esta lista ===== */
const MEDIOS = [
  { tipo: 'imagen', archivo: 'kayak-xochimilco.jpg', titulo: 'Kayak en Xochimilco', subtitulo: 'Remar al amanecer entre canales', etiqueta: 'Tranquilidad', alt: 'Grupo remando en kayak por un canal de Xochimilco al amanecer' },
  { tipo: 'video',  archivo: 'via-ferrata.mp4',      titulo: 'Vía ferrata',          subtitulo: 'Paso a paso sobre la roca',        etiqueta: 'Adrenalina', alt: 'Persona con casco y arnés avanzando por la vía ferrata' },
  { tipo: 'imagen', archivo: 'camping-estacas.jpg',  titulo: 'Camping en Las Estacas', subtitulo: 'Fogata, río y cielo estrellado',  etiqueta: 'Naturaleza', alt: 'Casas de campaña junto a una fogata en Las Estacas al anochecer' },
  { tipo: 'video',  archivo: 'rappel-dinamos.mp4',   titulo: 'Rappel en Los Dínamos', subtitulo: 'Descubre otra perspectiva',       etiqueta: 'Adrenalina', alt: 'Persona descendiendo en rappel junto a una cascada en Los Dínamos' },
  { tipo: 'imagen', archivo: 'comunidad.jpg',        titulo: 'Momentos de comunidad', subtitulo: 'Vas por la experiencia, te quedas por la gente', etiqueta: 'Comunidad', alt: 'Grupo de HILA conversando alrededor de una fogata después de la salida' }
];
const CARPETA_MEDIOS = 'media/';

/* ===== PRODUCTOS DEL MERCH: edita solo esta lista =====
   CÓMO AGREGAR TUS FOTOS DEL MERCH
   1. Copia la foto a la carpeta v6/media/merch/ (jpg, png o webp, vertical 4:5,
      por ejemplo 1200 x 1500).
   2. En la lista de abajo, cada { ... } es una tarjeta:
        nombre:      nombre del producto
        archivo:     nombre exacto de la foto dentro de v6/media/merch/
        numero:      el número que se muestra (ej. '01')
        descripcion: una línea corta
        dato1, dato2: los dos datos de la ficha, con el formato 'Etiqueta: valor'
        tono:        color de fondo: 'crema', 'arena', 'salvia' o 'terracota'
        alt:         OBLIGATORIO. Qué se ve en la foto, en una frase
   3. Para agregar un producto copia un bloque { ... }; para quitarlo, bórralo
      completo (con su coma); para cambiar el orden, mueve los bloques.
   Si la foto todavía no existe, la tarjeta muestra un marcador con su nombre. */
const MERCH = [
  { nombre: 'Botella térmica', archivo: 'botella-termica.jpg', numero: '01', descripcion: 'Café caliente al amanecer, agua fresca en la cima.', dato1: 'Material: Acero de doble pared', dato2: 'Uso: Salidas de día completo', tono: 'crema', alt: 'Botella térmica verde HILA sobre una roca junto al sendero' },
  { nombre: 'Tote bag', archivo: 'tote-bag.jpg', numero: '02', descripcion: 'Para la toalla del río, el bloqueador y lo que encuentres.', dato1: 'Material: Algodón grueso', dato2: 'Uso: Día de río o de ciudad', tono: 'arena', alt: 'Tote bag de algodón color arena con el logotipo de HILA' },
  { nombre: 'Stickers', archivo: 'stickers.jpg', numero: '03', descripcion: 'Uno por cada lugar al que llegues.', dato1: 'Material: Vinil resistente al agua', dato2: 'Uso: Botella, laptop o libreta', tono: 'salvia', alt: 'Stickers de HILA con montañas sobre una libreta de viaje' },
  { nombre: 'Mosquetón', archivo: 'mosqueton.jpg', numero: '04', descripcion: 'Para colgar la botella o las llaves en la mochila.', dato1: 'Material: Aluminio ligero', dato2: 'Uso: Accesorio (no para escalar)', tono: 'terracota', alt: 'Mosquetón verde de HILA colgado de una mochila' }
];
const CARPETA_MERCH = 'media/merch/';

// Revisión: cada slide y cada producto necesita su alt (se avisa en la consola)
[...MEDIOS.map((m) => ['MEDIOS', m.titulo, m.alt]), ...MERCH.map((p) => ['MERCH', p.nombre, p.alt])]
  .filter(([, , alt]) => !alt || !String(alt).trim())
  .forEach(([lista, nombre]) => console.warn(`[HILA] Falta el campo alt en ${lista}: "${nombre}"`));

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
      nombre: 'Kayak en Xochimilco', slug: 'kayak-en-xochimilco', alt: 'Grupo remando en kayak por un canal de Xochimilco al amanecer',
      llevar: ['Ropa cómoda y una capa ligera', 'Tenis que se puedan mojar', 'Protector solar y gorra', 'Cambio de ropa extra (opcional)'],
      mood: 'Tranquilidad', duracion: '5 horas', dificultad: 'Baja', precio: 850,
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
      nombre: 'Vía ferrata + rappel', slug: 'via-ferrata-y-rappel', alt: 'Persona con casco y arnés avanzando por una vía ferrata sobre la roca',
      llevar: ['Ropa deportiva que te deje moverte', 'Tenis con buen agarre', 'Gorra y protector solar', 'Botella de agua'],
      mood: 'Adrenalina', duracion: '8 horas', dificultad: 'Media', precio: 1450,
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
      nombre: 'Camping en Las Estacas', slug: 'camping-en-las-estacas', alt: 'Casas de campaña junto al río de Las Estacas al atardecer',
      llevar: ['Bolsa de dormir o cobija', 'Traje de baño y toalla', 'Ropa abrigadora para la noche', 'Lámpara de mano o frontal'],
      mood: 'Naturaleza', duracion: '2 días, 1 noche', dificultad: 'Baja', precio: 1890,
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

  /* 2b. SALIDAS Y CUPOS (DEMO) ===========================================
     Se leen de data/salidas.json, que imita la futura base de datos.
     IMPORTANTE: esto es solo visual de demostración. El control real de cupos
     y la prevención de sobreventa se harán en el servidor en la Fase 2.
     Al abrir con doble clic (file://) el navegador no deja leer el JSON;
     en ese caso se usa la copia data/salidas.js con los mismos datos. */
  let SALIDAS = null;
  const salidasListas = new Promise((listo) => {
    const usar = (datos) => { SALIDAS = datos; listo(datos); };
    const respaldo = () => {
      const sc = document.createElement('script');
      sc.src = 'data/salidas.js';
      sc.onload = () => usar(window.HILA_SALIDAS_DEMO || null);
      sc.onerror = () => usar(null);
      document.head.append(sc);
    };
    if (location.protocol === 'file:') { respaldo(); return; }
    fetch('data/salidas.json', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then(usar)
      .catch(respaldo);
  });
  const salidasDe = (id) => (SALIDAS ? SALIDAS.salidas.filter((x) => x.experiencia_id === id && x.estado !== 'desactivada') : [])
    .sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora));
  const lugaresLibres = (x) => Math.max(0, x.cupo_total - x.cupo_reservado);
  const disponible = (x) => x.estado === 'publicada' && lugaresLibres(x) > 0;
  function textoFecha(iso) {
    const [a, m, d] = iso.split('-').map(Number);
    const t = new Date(a, m - 1, d).toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });
    const limpio = t.replace(',', ''); // 'Sábado 17 de octubre', igual que en la v5
    return limpio.charAt(0).toUpperCase() + limpio.slice(1);
  }
  function textoHora(hhmm) {
    const [h, m] = hhmm.split(':').map(Number);
    const sufijo = h < 12 ? 'a. m.' : 'p. m.';
    return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${sufijo}`;
  }
  const etiquetaSalida = (x) => `${textoFecha(x.fecha)} · ${textoHora(x.hora)}`;

  /* 3. ESCENAS: viven en escenas.js (compartido con las demás páginas) */
  const { construirEscena } = window.HILA_ESCENAS;

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
      cursor.classList.toggle('is-drag', Boolean(t.closest && t.closest('.stage, .shelf__viewport')) && !t.closest('button'));
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
  // El "fantasma" (la ventana que vuela) y el velo oscuro viven FUERA del
  // <dialog>. Así el cierre puede seguir animándose con el diálogo ya cerrado,
  // sin cortes, y si vuelves a abrir a medio camino la animación continúa desde
  // donde va. Todo se anima con la Web Animations API (solo transform y opacity)
  // y cada paso espera el fin real de su animación, no un temporizador fijo.
  const modalExp = $('#exp-modal');
  const panelExp = $('.modal__panel', modalExp);
  const fantasma = $('.flip-ghost');
  const velo = $('.flip-scrim');
  const escenasModal = {};
  const DUR_ABRIR = 480;
  const DUR_CERRAR = 460;
  const CURVA_VELO = 'cubic-bezier(0.4, 0, 0.2, 1)';
  let expActual = null;
  let tarjetaOrigen = null;
  let estadoFlip = 'cerrado'; // cerrado | abriendo | abierto | cerrando
  let animsFlip = [];

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
      s.dataset.photo = `media/${id}.jpg`;
      s.dataset.alt = x.alt;
      escenasModal[id] = s;
    }
    cont.append(escenasModal[id]);
    $('#exp-mood').textContent = x.mood;
    $('#exp-title').textContent = x.nombre;
    $('#exp-duracion').textContent = x.duracion;
    $('#exp-dificultad').textContent = x.dificultad;
    const proxima = salidasDe(id).find(disponible);
    $('#exp-fecha').textContent = proxima ? etiquetaSalida(proxima) : x.fechas[0].label;
    $('#exp-desc').textContent = x.descripcion;
    $('#exp-precio').textContent = formatoPrecio(x.precio);
    $('#exp-incluye').innerHTML = x.incluye.map(([i, t]) => `<li><i class="ph ${i}" aria-hidden="true"></i>${t}</li>`).join('');
    $('#exp-faq').innerHTML = x.faq.map(([q, a], i) => `
      <div class="acc-item"><h4><button class="acc-trigger" type="button" aria-expanded="false" aria-controls="exp-faq-${i}" id="exp-faq-${i}-btn">${q}<span class="acc-icon" aria-hidden="true"></span></button></h4>
      <div class="acc-panel" id="exp-faq-${i}" role="region" aria-labelledby="exp-faq-${i}-btn"><div class="acc-inner"><p>${a}</p></div></div></div>`).join('');
  }

  // Deja el modal como nuevo: arriba y con las preguntas cerradas.
  // OJO: solo funciona con el <dialog> abierto. Con el diálogo cerrado
  // (display: none) el navegador ignora scrollTop y recuerda la posición
  // anterior; esa era la causa de que el modal se abriera a media página.
  function reiniciarModal() {
    $('.modal__scroll', modalExp).scrollTop = 0;
    $$('.acc-trigger', modalExp).forEach((b) => b.setAttribute('aria-expanded', 'false'));
    $$('.acc-panel', modalExp).forEach((p) => p.classList.remove('is-open'));
  }

  // Transforma el rectángulo "de" en el rectángulo "a" (el fantasma mide como el panel)
  const rectATransform = (de, a) =>
    `translate(${de.left.toFixed(2)}px, ${de.top.toFixed(2)}px) scale(${(de.width / a.width).toFixed(4)}, ${(de.height / a.height).toFixed(4)})`;

  // Rectángulo visible del fantasma ahora mismo (para continuar si se interrumpe)
  function rectFantasma() {
    const m = new DOMMatrixReadOnly(getComputedStyle(fantasma).transform);
    const w = parseFloat(fantasma.style.width) || 1;
    const h = parseFloat(fantasma.style.height) || 1;
    return { left: m.e, top: m.f, width: w * m.a, height: h * m.d };
  }
  const opacidad = (el) => Number(getComputedStyle(el).opacity);
  function animar(el, cuadros, opciones) {
    const a = el.animate(cuadros, { fill: 'forwards', ...opciones });
    animsFlip.push(a);
    return a;
  }
  const alTerminar = (a) => a.finished.then(() => true, () => false);
  // Congela el estado visual actual y cancela todo (permite interrumpir sin saltos)
  function detenerFlip() {
    animsFlip.forEach((a) => { try { a.commitStyles(); } catch (_) { /* elemento oculto */ } a.cancel(); });
    animsFlip = [];
  }
  function limpiarFlip() {
    detenerFlip();
    fantasma.style.opacity = '0';
    velo.style.opacity = '0';
    if (tarjetaOrigen) tarjetaOrigen.style.opacity = '';
    panelExp.style.opacity = '';
    panelExp.style.transform = '';
    estadoFlip = 'cerrado';
  }

  async function abrirExperiencia(id, boton) {
    if (estadoFlip === 'abriendo' || estadoFlip === 'abierto') return;
    const tarjeta = boton.closest('.exp-card');
    const continuar = estadoFlip === 'cerrando' && tarjeta === tarjetaOrigen;
    const origen = continuar ? rectFantasma() : tarjeta.getBoundingClientRect();
    const veloDesde = opacidad(velo);
    const tarjetaDesde = opacidad(tarjeta);
    detenerFlip();
    if (tarjetaOrigen && tarjetaOrigen !== tarjeta) tarjetaOrigen.style.opacity = '';
    llenarExperiencia(id);
    tarjetaOrigen = tarjeta;
    modalExp._disparador = boton;
    estadoFlip = 'abriendo';
    panelExp.style.transform = '';
    panelExp.style.opacity = '0';
    if (!modalExp.open) modalExp.showModal();
    reiniciarModal(); // ya abierto pero todavía invisible (opacidad 0)
    actualizarBloqueo();
    construirEscena(escenasModal[id]);
    const destino = panelExp.getBoundingClientRect();

    if (reduceMotion()) {
      animar(velo, [{ opacity: veloDesde }, { opacity: 1 }], { duration: 200, easing: 'ease' });
      const p = animar(panelExp, [{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: 'ease' });
      if (!(await alTerminar(p)) || estadoFlip !== 'abriendo') return;
      detenerFlip();
      panelExp.style.opacity = '';
      estadoFlip = 'abierto';
      return;
    }

    fantasma.style.width = destino.width + 'px';
    fantasma.style.height = destino.height + 'px';
    fantasma.style.opacity = '1';
    const vuelo = animar(fantasma, [
      { transform: rectATransform(origen, destino) },
      { transform: rectATransform(destino, destino) }
    ], { duration: DUR_ABRIR, easing: EASE_SCENE });
    animar(velo, [{ opacity: veloDesde }, { opacity: 1 }], { duration: DUR_ABRIR, easing: CURVA_VELO });
    animar(tarjeta, [{ opacity: tarjetaDesde }, { opacity: 0 }], { duration: 140, easing: 'ease' });
    if (!(await alTerminar(vuelo)) || estadoFlip !== 'abriendo') return;

    const aparece = animar(panelExp, [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 260, easing: EASE_OUT });
    if (!(await alTerminar(aparece)) || estadoFlip !== 'abriendo') return;
    detenerFlip();
    panelExp.style.opacity = '';
    panelExp.style.transform = '';
    fantasma.style.opacity = '0'; // queda escondido bajo el panel
    estadoFlip = 'abierto';
  }

  async function cerrarExperiencia({ devolverFoco = true, conVuelo = true } = {}) {
    if (estadoFlip === 'cerrado' || estadoFlip === 'cerrando') return;
    const tarjeta = tarjetaOrigen;
    const interrumpido = estadoFlip === 'abriendo';
    const panel = panelExp.getBoundingClientRect();
    const desde = interrumpido && opacidad(fantasma) > 0 ? rectFantasma() : panel;
    const panelDesde = opacidad(panelExp);
    const veloDesde = opacidad(velo);
    detenerFlip();
    estadoFlip = 'cerrando';

    // El diálogo se cierra en cuanto el contenido ya no se ve: la página
    // vuelve a ser interactiva mientras la ventana termina de regresar.
    const cerrarDialogoNativo = () => {
      panelExp.style.opacity = '0';
      // el contenido ya terminó de desvanecerse: se reinicia sin que se vea
      if (modalExp.open) reiniciarModal();
      if (modalExp.open) modalExp.close();
      actualizarBloqueo();
      if (devolverFoco && modalExp._disparador) modalExp._disparador.focus({ preventScroll: true });
    };

    if (reduceMotion() || !conVuelo || !tarjeta) {
      const p = animar(panelExp, [{ opacity: panelDesde }, { opacity: 0 }], { duration: 180, easing: 'ease' });
      const v = animar(velo, [{ opacity: veloDesde }, { opacity: 0 }], { duration: 200, easing: 'ease' });
      if (tarjeta) animar(tarjeta, [{ opacity: opacidad(tarjeta) }, { opacity: 1 }], { duration: 200, easing: 'ease' });
      if (!(await alTerminar(p)) || estadoFlip !== 'cerrando') return;
      cerrarDialogoNativo();
      if (!(await alTerminar(v)) || estadoFlip !== 'cerrando') return;
      limpiarFlip();
      return;
    }

    const final = tarjeta.getBoundingClientRect();
    fantasma.style.width = panel.width + 'px';
    fantasma.style.height = panel.height + 'px';
    fantasma.style.transform = rectATransform(desde, panel);
    fantasma.style.opacity = '1';
    const ESPERA = 60; // el contenido empieza a irse un instante antes que la ventana

    // 1) el contenido interior se desvanece un poco antes
    const sale = animar(panelExp, [{ opacity: panelDesde }, { opacity: 0 }], { duration: 150, easing: 'ease-out' });
    // 2) la ventana regresa a la tarjeta de origen
    const vuelo = animar(fantasma, [
      { transform: rectATransform(desde, panel) },
      { transform: rectATransform(final, panel) }
    ], { duration: DUR_CERRAR, delay: ESPERA, easing: EASE_SCENE });
    // 3) al llegar, la tarjeta reaparece debajo y el fantasma se desvanece encima
    const llega = ESPERA + DUR_CERRAR - 150;
    const funde = animar(fantasma, [{ opacity: 1 }, { opacity: 0 }], { duration: 170, delay: llega, easing: 'ease' });
    animar(tarjeta, [{ opacity: opacidad(tarjeta) }, { opacity: 1 }], { duration: 170, delay: llega - 20, easing: 'ease' });
    // 4) el fondo se aclara en paralelo
    animar(velo, [{ opacity: veloDesde }, { opacity: 0 }], { duration: ESPERA + DUR_CERRAR, easing: CURVA_VELO });

    if (!(await alTerminar(sale)) || estadoFlip !== 'cerrando') return;
    cerrarDialogoNativo();
    const listo = (await alTerminar(vuelo)) && (await alTerminar(funde));
    if (!listo || estadoFlip !== 'cerrando') return;
    limpiarFlip();
  }

  // Las tarjetas son enlaces reales a /experiencias/<slug>/. Con JavaScript se
  // abre la vista rápida y la URL cambia con pushState (solo en servidor; con
  // doble clic los navegadores no permiten cambiar la ruta de un archivo).
  const urlInicial = location.href;
  const tituloInicial = document.title;
  const puedeCambiarURL = /^https?:$/.test(location.protocol);
  const conModificador = (e) => e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0;
  $$('[data-open-exp]').forEach((b) => b.addEventListener('click', (e) => {
    if (conModificador(e)) return; // nueva pestaña o ventana: deja que el enlace funcione
    e.preventDefault();
    const id = b.dataset.openExp;
    abrirExperiencia(id, b);
    document.title = `${EXPERIENCIAS[id].nombre} | HILA Experiencias`;
    if (puedeCambiarURL) {
      try { history.pushState({ hilaExp: id }, '', new URL(b.getAttribute('href'), location.href).href.replace(/index\.html$/, '')); } catch (_) { /* sin cambio de URL */ }
    }
  }));
  // Cerrar: si la URL cambió, se regresa en el historial (así el botón Atrás también cierra)
  function pedirCierre(opciones) {
    document.title = tituloInicial;
    if (puedeCambiarURL && history.state && history.state.hilaExp) { history.back(); return; }
    cerrarExperiencia(opciones);
  }
  window.addEventListener('popstate', (e) => {
    const id = e.state && e.state.hilaExp;
    if (!id && (estadoFlip === 'abierto' || estadoFlip === 'abriendo')) { document.title = tituloInicial; cerrarExperiencia(); }
    else if (id && estadoFlip === 'cerrado') {
      const b = $(`[data-open-exp="${id}"]`);
      if (b) { abrirExperiencia(id, b); document.title = `${EXPERIENCIAS[id].nombre} | HILA Experiencias`; }
    }
  });
  modalExp.addEventListener('cancel', (e) => { e.preventDefault(); pedirCierre(); });
  let empezoFueraExp = false;
  modalExp.addEventListener('pointerdown', (e) => { empezoFueraExp = e.target === modalExp; });
  modalExp.addEventListener('click', (e) => {
    if ((e.target === modalExp && empezoFueraExp) || e.target.closest('[data-close]')) pedirCierre();
  });
  $('#exp-reservar').addEventListener('click', async () => {
    const id = expActual;
    // La página va a desplazarse al formulario: aquí basta un fundido
    document.title = tituloInicial;
    if (puedeCambiarURL && history.state && history.state.hilaExp) history.replaceState(null, '', urlInicial);
    await cerrarExperiencia({ devolverFoco: false, conVuelo: false });
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
    if (!b || conModificador(e)) return;
    e.preventDefault(); // vista rápida: no se pierde lo escrito en el cuestionario
    const doc = LEGALES[b.dataset.openLegal];
    $('#legal-title').textContent = doc.titulo;
    $('#legal-body').innerHTML = '<p class="legal__flag">Texto legal por revisar con un abogado antes de publicar.</p>' + doc.parrafos.map((p) => `<p>${p}</p>`).join('')
      + `<p><a class="link" href="${b.getAttribute('href')}">Leer el documento completo</a></p>`;
    abrirDialogo(modalLegal, b);
  });

  /* 12. UN VISTAZO: CARRUSEL TIPO HISTORIAS ================================
     Se construye desde MEDIOS. Cambia solo cada ~6 s (los videos duran lo que
     dure el video, con un máximo). Se navega tocando los lados, deslizando,
     con scroll horizontal, con la lista lateral o con el teclado.
     Mantener presionado pausa; al soltar continúa.

     Corrección respecto a la v3: allá, al hacer clic en una flecha el foco se
     quedaba dentro del carrusel y la pausa "por foco" nunca se quitaba. Ahora
     solo pausa el foco de TECLADO (:focus-visible), y el mouse nunca deja la
     pausa activada. Con "movimiento reducido" el avance empieza apagado, pero
     el botón de reproducir siempre está visible. */
  const seccionMomentos = $('.moments');
  const escenario = $('#stage');
  const contSlides = $('.stage__slides', escenario);
  const contBarras = $('.stage__bars', escenario);
  const listaMomentos = $('.moments__list');
  const btnToggle = $('#stage-toggle');
  const avisoVivo = $('#stage-live');
  const DURACION = 6000;            // milisegundos por foto
  const VIDEO_MIN = 4000, VIDEO_MAX = 15000; // límites para videos
  const TONOS = ['#15463a', '#1f4e5f', '#4d4433', '#3d5235', '#5e3423']; // fondos neutros de los marcadores
  const total = MEDIOS.length;

  MEDIOS.forEach((m, i) => {
    const esVideo = m.tipo === 'video';
    const ruta = CARPETA_MEDIOS + m.archivo;
    const li = document.createElement('li');
    li.className = 'stage__slide';
    li.setAttribute('aria-roledescription', 'slide');
    li.setAttribute('aria-label', `${i + 1} de ${total}: ${m.titulo}`);
    li.innerHTML = `
      <div class="stage__visual" style="--ph:${TONOS[i % TONOS.length]}">
        <div class="stage__ph" aria-hidden="true">
          <i class="ph ${esVideo ? 'ph-film-strip' : 'ph-image'}"></i>
          <strong>Aquí va tu ${esVideo ? 'video' : 'foto'}</strong>
          <code>${escapar(ruta)}</code>
        </div>
        ${esVideo
          ? `<video class="stage__media" muted playsinline preload="none" width="1080" height="1920" aria-label="${escapar(m.alt || m.titulo)}"></video>`
          : `<img class="stage__media" alt="${escapar(m.alt || m.titulo)}" width="1080" height="1920" loading="lazy" decoding="async">`}
      </div>
      <div class="stage__shade" aria-hidden="true"></div>
      <div class="stage__caption">
        ${m.etiqueta ? `<span class="stage__tag">${escapar(m.etiqueta)}</span>` : ''}
        <h3>${escapar(m.titulo)}</h3>
        ${m.subtitulo ? `<p>${escapar(m.subtitulo)}</p>` : ''}
      </div>`;
    const medio = $('.stage__media', li);
    medio.dataset.src = ruta;
    if (esVideo) {
      medio.addEventListener('loadeddata', () => medio.classList.add('is-loaded'), { once: true });
      medio.addEventListener('loadedmetadata', () => ajustarDuracionVideo(i));
      medio.addEventListener('ended', () => { if (i === activo && !estaPausado()) irAMomento(activo + 1); });
    } else {
      medio.addEventListener('load', () => medio.classList.add('is-loaded'), { once: true });
      medio.src = ruta; // carga diferida con loading="lazy"
    }
    contSlides.append(li);

    const barra = document.createElement('button');
    barra.type = 'button';
    barra.className = 'stage__bar';
    barra.setAttribute('aria-label', `Ir a ${m.titulo}`);
    barra.innerHTML = '<span aria-hidden="true"></span>';
    barra.addEventListener('click', () => irAMomento(i, { manual: true }));
    contBarras.append(barra);

    const item = document.createElement('li');
    item.innerHTML = `<button class="moments__item" type="button"><span class="moments__progress" aria-hidden="true"></span><strong>${escapar(m.titulo)}</strong><small>${escapar(m.etiqueta || '')}</small></button>`;
    $('button', item).addEventListener('click', () => irAMomento(i, { manual: true }));
    listaMomentos.append(item);
  });

  const slidesM = $$('.stage__slide', escenario);
  const barrasM = $$('.stage__bar', contBarras);
  const itemsM = $$('.moments__item', listaMomentos);
  let activo = -1;
  let duracionActual = DURACION;

  // Estado del avance automático
  let modoAuto = !reduceMotion(); // con movimiento reducido empieza apagado
  let pausaUsuario = false;
  let encima = false, focoTeclado = false, sosteniendo = false, arrastrando = false, enPantalla = false;
  let restante = DURACION, inicioTimer = 0, timerAuto = null;

  const videoDe = (i) => $('video', slidesM[i]);
  function duracionDe(i) {
    const v = videoDe(i);
    if (v && v.duration && isFinite(v.duration)) return clamp(v.duration * 1000, VIDEO_MIN, VIDEO_MAX);
    return DURACION;
  }
  function cargarCercanos() {
    [activo - 1, activo, activo + 1].forEach((j) => {
      const v = videoDe((j + total) % total);
      if (v && !v.getAttribute('src')) { v.preload = 'metadata'; v.src = v.dataset.src; }
    });
  }
  function ajustarDuracionVideo(i) {
    // si los datos del video llegan con su slide recién activado, se ajusta su tiempo
    if (i !== activo || performance.now() - inicioTimer > 1500) return;
    duracionActual = duracionDe(i);
    marcarDuracion(i);
    reiniciarAuto();
  }
  function marcarDuracion(i) {
    const d = duracionActual + 'ms';
    slidesM[i].style.setProperty('--dur', d);
    barrasM[i].style.setProperty('--dur', d);
    itemsM[i].style.setProperty('--dur', d);
  }

  function irAMomento(destino, { manual = false } = {}) {
    const i = ((destino % total) + total) % total;
    if (i === activo) return;
    const anterior = activo;
    activo = i;
    slidesM.forEach((s, j) => {
      s.classList.toggle('is-active', j === i);
      s.classList.toggle('is-leaving', j === anterior);
    });
    if (anterior > -1) {
      const s = slidesM[anterior];
      const fin = (e) => {
        if (e.target !== s || e.propertyName !== 'opacity') return;
        s.removeEventListener('transitionend', fin);
        if (activo !== anterior) s.classList.remove('is-leaving');
      };
      s.addEventListener('transitionend', fin);
    }
    [barrasM, itemsM].forEach((grupo) => grupo.forEach((b, j) => {
      b.classList.toggle('is-past', j < i);
      if (j === i) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current');
    }));
    duracionActual = duracionDe(i);
    marcarDuracion(i);
    cargarCercanos();
    slidesM.forEach((s, j) => {
      const v = videoDe(j);
      if (!v) return;
      if (j === i) { try { v.currentTime = 0; } catch (_) { /* aún sin datos */ } }
      else if (!v.paused) v.pause();
    });
    if (manual) avisoVivo.textContent = `${i + 1} de ${total}: ${MEDIOS[i].titulo}`;
    reiniciarAuto();
  }

  const estaPausado = () => !modoAuto || pausaUsuario || encima || focoTeclado || sosteniendo || arrastrando
    || !enPantalla || document.hidden || $$('dialog[open]').length > 0;

  // Pausa real: guarda el tiempo restante y congela la barra, el zoom y el video
  function sincronizarAuto() {
    if (!seccionMomentos) return;
    const pausado = estaPausado();
    seccionMomentos.classList.toggle('is-auto', modoAuto);
    seccionMomentos.classList.toggle('is-paused', pausado);
    const v = activo > -1 ? videoDe(activo) : null;
    if (v) {
      if (pausado || !v.getAttribute('src')) { if (!v.paused) v.pause(); }
      else v.play().catch(() => {});
    }
    if (pausado) {
      if (timerAuto) { clearTimeout(timerAuto); timerAuto = null; restante = Math.max(0, restante - (performance.now() - inicioTimer)); }
    } else if (!timerAuto) {
      inicioTimer = performance.now();
      timerAuto = setTimeout(() => { timerAuto = null; irAMomento(activo + 1); }, restante);
    }
  }
  function reiniciarAuto() {
    clearTimeout(timerAuto);
    timerAuto = null;
    restante = duracionActual;
    inicioTimer = performance.now();
    sincronizarAuto();
  }

  function pintarToggle() {
    const reproduciendo = modoAuto && !pausaUsuario;
    btnToggle.setAttribute('aria-pressed', String(!reproduciendo));
    btnToggle.setAttribute('aria-label', reproduciendo ? 'Pausar avance automático' : 'Reproducir avance automático');
    $('i', btnToggle).className = reproduciendo ? 'ph ph-pause' : 'ph ph-play';
  }
  function alternarAuto() {
    if (!modoAuto) { modoAuto = true; pausaUsuario = false; pintarToggle(); reiniciarAuto(); return; }
    pausaUsuario = !pausaUsuario;
    pintarToggle();
    sincronizarAuto();
  }
  btnToggle.addEventListener('click', alternarAuto);

  // Pausas automáticas: mouse encima, foco de teclado, pestaña oculta, fuera de pantalla
  escenario.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') { encima = true; sincronizarAuto(); } });
  escenario.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') { encima = false; sincronizarAuto(); } });
  seccionMomentos.addEventListener('focusin', (e) => {
    focoTeclado = e.target.matches(':focus-visible');
    sincronizarAuto();
  });
  seccionMomentos.addEventListener('focusout', (e) => {
    if (!seccionMomentos.contains(e.relatedTarget)) { focoTeclado = false; sincronizarAuto(); }
  });
  document.addEventListener('pointerdown', () => { if (focoTeclado) { focoTeclado = false; sincronizarAuto(); } }, true);
  document.addEventListener('visibilitychange', sincronizarAuto);
  new IntersectionObserver(([e]) => { enPantalla = e.isIntersecting; sincronizarAuto(); }, { threshold: 0.3 }).observe(escenario);

  // Teclado: flechas para navegar, espacio para pausar
  escenario.addEventListener('keydown', (e) => {
    if (e.target !== escenario) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); irAMomento(activo + 1, { manual: true }); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); irAMomento(activo - 1, { manual: true }); }
    else if (e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); alternarAuto(); }
  });

  // Toques, mantener presionado y deslizar con inercia
  let gesto = null;
  function moverArrastre(dx) {
    if (reduceMotion()) return;
    const w = escenario.clientWidth;
    slidesM[activo].style.transform = `translate3d(${dx.toFixed(1)}px, 0, 0)`;
    const vecino = slidesM[(activo + (dx < 0 ? 1 : -1) + total) % total];
    if (gesto.vecino && gesto.vecino !== vecino) { gesto.vecino.style.opacity = ''; gesto.vecino.style.transition = ''; }
    gesto.vecino = vecino;
    vecino.style.transition = 'none'; // sigue al dedo sin retraso
    vecino.style.opacity = Math.min(1, (Math.abs(dx) / w) * 1.6).toFixed(3);
  }
  function soltarArrastre(dx, velocidad) {
    const w = escenario.clientWidth;
    const actual = slidesM[activo];
    const vecino = gesto.vecino;
    const pasa = Math.abs(dx) > w * 0.2 || Math.abs(velocidad) > 0.45;
    arrastrando = false;
    if (!pasa) {
      if (!reduceMotion()) {
        actual.animate([{ transform: `translate3d(${dx}px, 0, 0)` }, { transform: 'none' }], { duration: 260, easing: EASE_OUT });
        if (vecino) {
          const baja = vecino.animate([{ opacity: vecino.style.opacity || 0 }, { opacity: 0 }], { duration: 200, easing: 'ease' });
          const listo = () => { vecino.style.opacity = ''; vecino.style.transition = ''; };
          baja.finished.then(listo, listo);
          vecino.style.opacity = '0';
        }
      }
      actual.style.transform = '';
      if (vecino && reduceMotion()) { vecino.style.opacity = ''; vecino.style.transition = ''; }
      sincronizarAuto();
      return;
    }
    const dir = dx < 0 ? 1 : -1;
    if (!reduceMotion()) {
      // la tarjeta sigue su camino con la velocidad del dedo y se va
      actual.style.zIndex = '3';
      const salida = actual.animate([
        { transform: `translate3d(${dx}px, 0, 0)` },
        { transform: `translate3d(${-dir * w * 1.05}px, 0, 0)` }
      ], { duration: clamp(300 - Math.abs(velocidad) * 90, 170, 300), easing: EASE_OUT, fill: 'forwards' });
      actual.style.transform = '';
      const limpiar = () => {
        actual.style.opacity = '0';
        salida.cancel();
        actual.style.zIndex = '';
        actual.classList.remove('is-leaving');
        requestAnimationFrame(() => { actual.style.opacity = ''; });
      };
      salida.finished.then(limpiar, limpiar);
    }
    irAMomento(activo + dir, { manual: true });
    if (vecino) { vecino.style.opacity = ''; vecino.style.transition = ''; } // la nueva sube desde donde iba hasta 1
  }

  escenario.addEventListener('pointerdown', (e) => {
    if (e.button !== 0 || e.target.closest('button')) return;
    gesto = { x: e.clientX, y: e.clientY, id: e.pointerId, arrastre: false, sostener: false, vecino: null, muestras: [[e.clientX, performance.now()]] };
    gesto.timer = setTimeout(() => {
      if (gesto && !gesto.arrastre) { gesto.sostener = true; sosteniendo = true; sincronizarAuto(); }
    }, 260);
  });
  escenario.addEventListener('pointermove', (e) => {
    if (!gesto || e.pointerId !== gesto.id) return;
    const dx = e.clientX - gesto.x, dy = e.clientY - gesto.y;
    if (!gesto.arrastre && Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      gesto.arrastre = true;
      clearTimeout(gesto.timer);
      if (gesto.sostener) { gesto.sostener = false; sosteniendo = false; }
      arrastrando = true;
      escenario.setPointerCapture(e.pointerId);
      sincronizarAuto();
    }
    if (gesto.arrastre) {
      moverArrastre(dx);
      gesto.muestras.push([e.clientX, performance.now()]);
      if (gesto.muestras.length > 5) gesto.muestras.shift();
    }
  });
  escenario.addEventListener('pointerup', (e) => {
    if (!gesto || e.pointerId !== gesto.id) return;
    const g = gesto;
    clearTimeout(g.timer);
    const dx = e.clientX - g.x;
    if (g.arrastre) {
      const [x0, t0] = g.muestras[0];
      const [x1, t1] = g.muestras[g.muestras.length - 1];
      soltarArrastre(dx, (x1 - x0) / Math.max(1, t1 - t0));
    } else if (g.sostener) {
      sosteniendo = false;
      sincronizarAuto();
    } else {
      // toque: lado izquierdo atrás, el resto adelante
      const r = escenario.getBoundingClientRect();
      irAMomento(activo + (e.clientX - r.left < r.width * 0.3 ? -1 : 1), { manual: true });
    }
    gesto = null;
  });
  escenario.addEventListener('pointercancel', () => {
    if (!gesto) return;
    clearTimeout(gesto.timer);
    if (gesto.arrastre) soltarArrastre(0, 0);
    sosteniendo = false;
    arrastrando = false;
    gesto = null;
    sincronizarAuto();
  });
  escenario.addEventListener('contextmenu', (e) => { if (gesto) e.preventDefault(); }); // mantener presionado no abre menú

  // Scroll horizontal (trackpad) para cambiar de slide
  let ruedaAcumulada = 0, ruedaBloqueo = 0;
  escenario.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return; // el scroll vertical sigue siendo de la página
    e.preventDefault();
    const ahora = performance.now();
    if (ahora < ruedaBloqueo) return;
    ruedaAcumulada += e.deltaX;
    if (Math.abs(ruedaAcumulada) > 40) {
      irAMomento(activo + (ruedaAcumulada > 0 ? 1 : -1), { manual: true });
      ruedaAcumulada = 0;
      ruedaBloqueo = ahora + 650;
    }
  }, { passive: false });

  pintarToggle();
  irAMomento(0);

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
  const CLAVE = 'hila-reserva-v6';
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

  // Las fechas salen de data/salidas.json: "Quedan N lugares" y "Agotado" (deshabilitado).
  // Solo visual de demostración: el cupo real se valida en el servidor (Fase 2).
  function llenarFechas(id, seleccion) {
    const select = form.elements.fecha;
    const previa = seleccion ?? select.value;
    const x = EXPERIENCIAS[id];
    if (!x) { select.innerHTML = '<option value="">Primero elige una experiencia</option>'; return; }
    const salidas = salidasDe(id);
    const opciones = salidas.length
      ? salidas.map((sa) => {
        const libres = lugaresLibres(sa);
        const ok = disponible(sa);
        const extra = ok ? (libres === 1 ? 'Queda 1 lugar' : `Quedan ${libres} lugares`) : 'Agotado';
        return `<option value="${sa.id}" data-label="${etiquetaSalida(sa)}"${ok ? '' : ' disabled'}>${etiquetaSalida(sa)} · ${extra}</option>`;
      })
      : x.fechas.map((f) => `<option value="${f.value}" data-label="${f.label}">${f.label}</option>`);
    select.innerHTML = '<option value="">Elige una fecha</option>' + opciones.join('');
    const opcion = [...select.options].find((o) => o.value === previa && !o.disabled);
    if (opcion) select.value = previa;
  }
  const salidaElegida = () => (SALIDAS ? SALIDAS.salidas.find((x) => x.id === form.elements.fecha.value) : null);
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
  const fechaElegida = () => {
    const o = form.elements.fecha.selectedOptions[0];
    return form.elements.fecha.value && o ? (o.dataset.label || o.textContent) : '';
  };
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
  salidasListas.then(() => {
    let guardada = '';
    try { guardada = (JSON.parse(sessionStorage.getItem(CLAVE) || '{}').valores || {}).fecha || ''; } catch (_) { /* nada */ }
    if (expElegida()) llenarFechas(expElegida(), form.elements.fecha.value || guardada);
    actualizarResumen();
  });
  // Llegada desde una página de experiencia: index.html?experiencia=kayak#reserva
  const pedida = new URLSearchParams(location.search).get('experiencia');
  if (pedida && EXPERIENCIAS[pedida]) {
    elegirExperiencia(pedida);
    salidasListas.then(() => llenarFechas(pedida));
  }
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
    folioActual = 'HILA-' + Math.floor(1000 + Math.random() * 9000); // DEMO: el folio real lo genera el servidor
    transaccionDemo = '';
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
    const inicio = salidaElegida()?.fecha || form.elements.fecha.value;
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

  // Comprobante para "Guardar como PDF" (hoja de impresión, sin librerías).
  // FASE 2: el folio y el ID de transacción vendrán del servidor y de PayPal;
  // aquí son DEMO. Reemplaza datosComprobante() por la respuesta de la API.
  let transaccionDemo = '';
  function datosComprobante() {
    const x = EXPERIENCIAS[expElegida()];
    const sa = salidaElegida();
    if (!transaccionDemo) transaccionDemo = 'DEMO-' + Math.random().toString(36).slice(2, 10).toUpperCase();
    return {
      folio: folioActual || 'HILA-0000',
      cliente: `${form.elements.nombre.value.trim()} ${form.elements.apellido.value.trim()}`,
      experiencia: x.nombre,
      fecha: sa ? etiquetaSalida(sa) : fechaElegida(),
      punto: sa ? sa.punto_de_encuentro : 'Te lo enviamos por correo y WhatsApp',
      personas: '1',
      importe: `${formatoPrecio(sa ? sa.precio : x.precio)} MXN`,
      transaccion: transaccionDemo,
      llevar: x.llevar || [],
      emision: new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })
    };
  }
  function imprimirComprobante() {
    // La plantilla se inserta en la página solo cuando se va a imprimir
    if (!document.getElementById('comprobante')) document.body.append($('#plantilla-comprobante').content.cloneNode(true));
    const d = datosComprobante();
    $('#cp-folio').textContent = d.folio;
    $('#cp-emision').textContent = d.emision;
    $('#cp-cliente').textContent = d.cliente;
    $('#cp-experiencia').textContent = d.experiencia;
    $('#cp-fecha').textContent = d.fecha;
    $('#cp-punto').textContent = d.punto;
    $('#cp-personas').textContent = d.personas;
    $('#cp-importe').textContent = d.importe;
    $('#cp-transaccion').textContent = d.transaccion;
    $('#cp-llevar').innerHTML = d.llevar.map((t) => `<li>${escapar(t)}</li>`).join('');
    detenerConfeti();
    window.print();
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
    if (accion === 'pdf') imprimirComprobante();
    if (accion === 'contact') { clearTimeout(timerPago); cerrarDialogo(pago, { devolverFoco: false }); }
  });
  pago.addEventListener('cancel', (e) => { e.preventDefault(); pago.dataset.view === 'ok' ? terminar() : volverAlCuestionario(); });

  /* 15. MERCH: CARRUSEL MANUAL =============================================
     Sin autoavance (a diferencia de "Un vistazo"). Scroll nativo con snap
     (swipe con inercia en celular), arrastre con el mouse y teclado.
     La barra fina muestra qué parte del carrusel estás viendo. */
  const TONOS_MERCH = { crema: '#f8f3ea', arena: '#efe4d0', salvia: '#e1e8d9', terracota: '#f2ddd2' };
  const estante = $('#shelf');
  const pistaEstante = $('.shelf__track', estante);
  const barraEstante = $('.shelf__progress span');

  const separarDato = (texto) => {
    const i = String(texto || '').indexOf(':');
    return i > -1 ? [texto.slice(0, i).trim(), texto.slice(i + 1).trim()] : ['', String(texto || '').trim()];
  };

  MERCH.forEach((p) => {
    const ruta = CARPETA_MERCH + p.archivo;
    const [e1, v1] = separarDato(p.dato1);
    const [e2, v2] = separarDato(p.dato2);
    const li = document.createElement('li');
    li.className = 'shelf__item';
    li.innerHTML = `
      <article class="merch-card" tabindex="0" style="--tono:${TONOS_MERCH[p.tono] || TONOS_MERCH.crema}" aria-label="N.º ${escapar(p.numero)}, ${escapar(p.nombre)}">
        <figure class="merch-card__photo">
          <div class="merch-card__ph" aria-hidden="true">
            <i class="ph-light ph-image"></i>
            <strong>Aquí va la foto de ${escapar(p.nombre.toLowerCase())}</strong>
            <code>${escapar(ruta)}</code>
          </div>
          <img class="merch-card__img" alt="${escapar(p.alt || p.nombre)}" width="1200" height="1500" loading="lazy" decoding="async">
        </figure>
        <div class="merch-card__body">
          <div class="merch-card__top">
            <span class="merch-card__no">N.º ${escapar(p.numero)}</span>
            <span class="merch-card__ed">Edición Sal a vivirlo</span>
          </div>
          <h3 class="merch-card__name">${escapar(p.nombre)}</h3>
          <p class="merch-card__desc">${escapar(p.descripcion)}</p>
          <dl class="merch-card__specs">
            <div><dt>${escapar(e1)}</dt><dd>${escapar(v1)}</dd></div>
            <div><dt>${escapar(e2)}</dt><dd>${escapar(v2)}</dd></div>
          </dl>
        </div>
      </article>`;
    const img = $('.merch-card__img', li);
    img.addEventListener('load', () => img.classList.add('is-loaded'), { once: true });
    img.addEventListener('error', () => img.remove(), { once: true }); // sin foto: queda el marcador
    img.src = ruta;
    pistaEstante.append(li);
  });
  const productos = $$('.shelf__item', estante);

  // Barra de avance (solo transform): tamaño = parte visible, posición = scroll
  let pendEstante = false;
  function pintarAvance() {
    pendEstante = false;
    const max = estante.scrollWidth - estante.clientWidth;
    const f = clamp(estante.clientWidth / estante.scrollWidth, 0.08, 1);
    const r = max > 0 ? estante.scrollLeft / max : 0;
    barraEstante.style.setProperty('--f', f.toFixed(4));
    barraEstante.style.setProperty('--x', `${(r * (1 - f) * 100).toFixed(2)}%`);
  }
  estante.addEventListener('scroll', () => { if (!pendEstante) { pendEstante = true; requestAnimationFrame(pintarAvance); } }, { passive: true });
  window.addEventListener('resize', pintarAvance);
  pintarAvance();

  // Posición de cada tarjeta (alineada al inicio, respetando el margen)
  const objetivoProducto = (li) => li.offsetLeft - (parseFloat(getComputedStyle(estante).scrollPaddingLeft) || 0);
  function productoCercano(pos) {
    let mejor = 0, dist = Infinity;
    productos.forEach((li, i) => { const d = Math.abs(objetivoProducto(li) - pos); if (d < dist) { dist = d; mejor = i; } });
    return mejor;
  }
  function irAProducto(i) {
    const li = productos[clamp(i, 0, productos.length - 1)];
    estante.scrollTo({ left: clamp(objetivoProducto(li), 0, estante.scrollWidth - estante.clientWidth), behavior: scrollBehavior() });
  }

  // Teclado: flechas, Inicio y Fin
  estante.addEventListener('keydown', (e) => {
    const actual = productoCercano(estante.scrollLeft);
    const mapa = { ArrowRight: actual + 1, ArrowLeft: actual - 1, Home: 0, End: productos.length - 1 };
    if (!(e.key in mapa) || (e.target !== estante && !e.target.classList.contains('merch-card'))) return;
    e.preventDefault();
    irAProducto(mapa[e.key]);
  });

  // Arrastre con el mouse, con inercia al soltar
  let arrastreEstante = null;
  estante.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    arrastreEstante = { x: e.clientX, scroll: estante.scrollLeft, movido: false, muestras: [[e.clientX, performance.now()]] };
  });
  estante.addEventListener('pointermove', (e) => {
    if (!arrastreEstante) return;
    const dx = e.clientX - arrastreEstante.x;
    if (!arrastreEstante.movido && Math.abs(dx) > 4) {
      arrastreEstante.movido = true;
      estante.classList.add('is-dragging');
      estante.setPointerCapture(e.pointerId);
    }
    if (arrastreEstante.movido) {
      estante.scrollLeft = arrastreEstante.scroll - dx;
      arrastreEstante.muestras.push([e.clientX, performance.now()]);
      if (arrastreEstante.muestras.length > 5) arrastreEstante.muestras.shift();
    }
  });
  const soltarEstante = () => {
    if (!arrastreEstante) return;
    const a = arrastreEstante;
    arrastreEstante = null;
    if (!a.movido) return;
    const [x0, t0] = a.muestras[0];
    const [x1, t1] = a.muestras[a.muestras.length - 1];
    const v = (x1 - x0) / Math.max(1, t1 - t0);
    estante.classList.remove('is-dragging');
    irAProducto(productoCercano(estante.scrollLeft - v * 260));
    estante.addEventListener('click', (ev) => { ev.preventDefault(); ev.stopPropagation(); }, { capture: true, once: true });
  };
  estante.addEventListener('pointerup', soltarEstante);
  estante.addEventListener('pointercancel', soltarEstante);

  /* 16. URLS LIMPIAS ======================================================
     Los enlaces internos apuntan a .../index.html para que funcionen con doble
     clic. En un servidor se muestran limpios (/experiencias/kayak-en-xochimilco/). */
  if (/^https?:$/.test(location.protocol)) {
    $$('a[href]').forEach((a) => {
      const h = a.getAttribute('href');
      if (/^(https?:|mailto:|tel:|#)/.test(h)) return;
      a.setAttribute('href', h.replace(/(^|\/)index\.html(?=$|[?#])/, '$1') || './');
    });
  }

  $('#year').textContent = new Date().getFullYear();
})();
