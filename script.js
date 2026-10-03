/* ==========================================================================
   HILA v2 · Sal a vivirlo
   JavaScript puro, sin librerías.

   Índice
   1. Utilidades
   2. Datos (EDITA AQUÍ precios, fechas, FAQ y textos legales)
   3. Escenas ilustradas por capas (SVG generado) + fotos reales opcionales
   4. Líneas topográficas
   5. Parallax (mouse y hover)
   6. Navegación, barra de lectura y cursor personalizado
   7. Entradas: hero, títulos con máscara, escalonados, contadores, manuscrito, marquee
   8. Botón magnético
   9. Experiencias: momento narrativo y ambientes de color
   10. Acordeones
   11. Modales: detalle con transición compartida (FLIP) y textos legales
   12. Carrusel inmersivo
   13. Cuestionario (validación, sessionStorage, resumen en vivo)
   14. Pago simulado
   ========================================================================== */
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

    rappel(r, W, H, k) {
      const lejos = cresta(r, W, H, H * 0.36, H * 0.12, 2);
      const s = W / 900;
      const g0 = W * 0.42, g1 = W * 0.6;
      const borde = (lado) => {
        let d = lado === 'izq' ? 'M0 0' : `M${W} 0`;
        for (let y = 0; y <= H; y += 30) {
          const base = lado === 'izq' ? g0 : g1;
          const x = base + (lado === 'izq' ? -1 : 1) * (r() * W * 0.04) + Math.sin(y * 0.02) * W * 0.015;
          d += ` L${x.toFixed(0)} ${y}`;
        }
        return d + (lado === 'izq' ? ` L0 ${H} Z` : ` L${W} ${H} Z`);
      };
      let chorros = '';
      for (let i = 0; i < 26; i++) {
        const x = g0 + r() * (g1 - g0);
        const y = r() * H * 2;
        chorros += `<rect x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="${(1.5 + r() * 4) * s}" height="${(80 + r() * 220) * s}" rx="2" fill="#f4fbf8" opacity="${(0.25 + r() * 0.5).toFixed(2)}"/>`;
      }
      const rx = W * 0.3, ry = H * 0.42;
      return [
        [0, 0, `<defs>${degradado(k + 'c', [[0, '#d4e5de'], [1, '#93b2a9']])}</defs><rect width="${W}" height="${H}" fill="url(#${k}c)"/>`],
        [0.1, 0, `<path d="${lejos.d}" fill="#7f9a91"/>`],
        [0.2, 0, `<defs>${degradado(k + 'w', [[0, '#e6f3ee'], [1, '#a9cbc2']])}<clipPath id="${k}g"><rect x="${g0}" y="0" width="${g1 - g0}" height="${H}"/></clipPath></defs>
          <rect x="${g0}" width="${g1 - g0}" height="${H}" fill="url(#${k}w)"/>
          <g clip-path="url(#${k}g)"><g class="anim-fall">${chorros}</g></g>`],
        [0.35, 0, `<path d="${borde('izq')}" fill="#2c463e"/><path d="${borde('der')}" fill="#203830"/>
          <path d="M${rx + 4 * s} 0L${rx + 4 * s} ${ry - 36 * s}" stroke="#f2b765" stroke-width="${2 * s}"/>
          <g fill="#0e1f1a"><circle cx="${rx}" cy="${ry - 30 * s}" r="${8 * s}"/><path d="M${rx - 6 * s} ${ry - 22 * s}L${rx + 8 * s} ${ry - 20 * s}L${rx + 24 * s} ${ry}L${rx + 18 * s} ${ry + 4 * s}L${rx + 4 * s} ${ry - 6 * s}L${rx - 6 * s} ${ry + 10 * s}L${rx - 12 * s} ${ry + 6 * s}Z"/></g>`],
        [0.5, 0, `<ellipse cx="${(g0 + g1) / 2}" cy="${H * 0.95}" rx="${W * 0.34}" ry="${H * 0.08}" fill="#eef7f3" opacity="0.55"/><ellipse cx="${(g0 + g1) / 2}" cy="${H * 1.0}" rx="${W * 0.6}" ry="${H * 0.08}" fill="#4d756b"/>`]
      ];
    },

    comunidad(r, W, H, k) {
      const lejos = cresta(r, W, H, H * 0.6, H * 0.14, 2);
      const suelo = cresta(r, W, H, H * 0.78, H * 0.05, 2);
      const s = W / 900;
      const fx = W * 0.5, fy = H * 0.86;
      return [
        [0, 0, `<defs>${degradado(k + 'c', [[0, '#4e3a52'], [0.35, '#c77f62'], [0.62, '#f2c18a'], [0.75, '#f7d7a4']])}</defs><rect width="${W}" height="${H}" fill="url(#${k}c)"/>`],
        [0.06, 0, `<defs>${radial(k + 's', '#ffd9a0', 0.8)}</defs><circle cx="${W * 0.3}" cy="${H * 0.6}" r="${W * 0.35}" fill="url(#${k}s)"/><circle cx="${W * 0.3}" cy="${H * 0.6}" r="${W * 0.06}" fill="#ffe4b5"/>`],
        [0.14, 0, `<path d="${lejos.d}" fill="#6b4535"/>`],
        [0.4, 0, `<defs>${radial(k + 'f', '#f0c35a', 0.55)}</defs><path d="${suelo.d}" fill="#2a1a12"/>
          ${fogata(fx, fy, s * 1.1, k + 'f')}
          ${sentado(fx - 150 * s, fy + 8 * s, s * 1.15, '#1b100a')}${sentado(fx - 78 * s, fy - 22 * s, s, '#1b100a')}
          ${sentado(fx + 84 * s, fy - 20 * s, s, '#1b100a')}${sentado(fx + 156 * s, fy + 10 * s, s * 1.15, '#1b100a')}`]
      ];
    },

    merch(r, W, H, k) {
      const cabo = cresta(r, W, H, H * 0.56, H * 0.12, 1.4);
      const duna1 = cresta(r, W, H, H * 0.86, H * 0.12, 1.2);
      const duna2 = cresta(r, W, H, H * 0.96, H * 0.1, 1.6);
      return [
        [0, 0, `<defs>${degradado(k + 'c', [[0, '#f6efe1'], [0.55, '#f1d9b4']])}</defs><rect width="${W}" height="${H}" fill="url(#${k}c)"/>`],
        [0.06, 0, `<defs>${radial(k + 's', '#fff1cf', 0.9)}</defs><circle cx="${W * 0.7}" cy="${H * 0.42}" r="${H * 0.4}" fill="url(#${k}s)"/><circle cx="${W * 0.7}" cy="${H * 0.42}" r="${H * 0.06}" fill="#fff4d8"/>`],
        [0.12, 0, `<path d="${cabo.d}" fill="#9fb5ae"/>`],
        [0.2, 0, `<defs>${degradado(k + 'm', [[0, '#7aa6a6'], [1, '#2f6b73']])}</defs><rect y="${H * 0.56}" width="${W}" height="${H * 0.2}" fill="url(#${k}m)"/>${reflejos(r, W, H * 0.57, H * 0.74, W * 0.7, W * 0.12, '#fff6dc', 14)}`],
        [0.4, 0, `<path d="${duna1.d}" fill="#dcc6a2"/><path d="${duna2.d}" fill="#c9a97f"/>`]
      ];
    }
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
      estado.x = lerp(estado.x, estado.tx, 0.09);
      estado.y = lerp(estado.y, estado.ty, 0.09);
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
  const heroParallax = crearParallax(heroEscena, 46, 24);
  let heroVisible = true;
  new IntersectionObserver(([e]) => { heroVisible = e.isIntersecting; }).observe($('.hero'));
  window.addEventListener('pointermove', (e) => {
    if (!heroVisible || e.pointerType !== 'mouse') return;
    heroParallax.mover((e.clientX / innerWidth) * 2 - 1, (e.clientY / innerHeight) * 2 - 1);
  }, { passive: true });

  // Tarjetas: la ilustración se mueve en parallax al pasar el mouse
  $$('.exp-card').forEach((card) => {
    const p = crearParallax($('.scene', card), 30, 18);
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
      cursor.classList.toggle('is-drag', Boolean(t.closest && t.closest('.reel__viewport')) && !t.closest('.reel__play'));
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
      setTimeout(() => { h.textContent = h.dataset.original; }, 950 + h._lineas * 80);
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
      const retraso = (parseFloat(el.style.getPropertyValue('--i')) || 0) * 60 + 80;
      // se libera el elemento para que use sus propias transiciones de hover
      setTimeout(() => { el.removeAttribute('data-reveal'); el.classList.remove('is-visible'); }, 600 + retraso);
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

  /* 12. CARRUSEL INMERSIVO =================================================
     Scroll nativo con snap (swipe con inercia en celular), arrastre con
     mouse, flechas, teclado, barra de progreso y autoavance lento que se
     pausa al interactuar. */
  const reel = $('.reel');
  const vista = $('#reel');
  const slides = $$('.reel__slide', vista);
  const escenasReel = slides.map((s) => $('.scene', s));
  const progreso = $('.reel__progress');
  const [flechaAnt, flechaSig] = $$('.reel__btn--arrow');
  const btnPausa = $('#reel-pause');
  const AUTO = 6000;
  reel.style.setProperty('--auto', AUTO + 'ms');
  let activa = -1;

  slides.forEach((s, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'reel__seg';
    b.setAttribute('aria-label', `Ir a ${$('h3', s).textContent}`);
    b.innerHTML = '<span aria-hidden="true"></span>';
    b.addEventListener('click', () => { interactuar(); irASlide(i); });
    progreso.append(b);
  });
  const segmentos = $$('.reel__seg', progreso);

  function irASlide(i, suave = true) {
    const s = slides[clamp(i, 0, slides.length - 1)];
    vista.scrollTo({ left: s.offsetLeft - (vista.clientWidth - s.offsetWidth) / 2, behavior: suave ? scrollBehavior() : 'auto' });
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
    slides.forEach((s, j) => { if (j !== i) detenerVista(s); });
    programarAuto();
  }

  // Slide activa + parallax interno según la distancia al centro
  let pendReel = false;
  function cuadroReel() {
    pendReel = false;
    const centro = vista.scrollLeft + vista.clientWidth / 2;
    let mejor = 0, dist = Infinity;
    slides.forEach((s, i) => {
      const c = s.offsetLeft + s.offsetWidth / 2;
      const d = c - centro;
      if (Math.abs(d) < dist) { dist = Math.abs(d); mejor = i; }
      if (!reduceMotion() && Math.abs(d) < vista.clientWidth) {
        escenasReel[i].style.transform = `translate3d(${(-d / vista.clientWidth * 12).toFixed(2)}%, 0, 0)`;
      }
    });
    marcarActiva(mejor);
  }
  vista.addEventListener('scroll', () => { if (!pendReel) { pendReel = true; requestAnimationFrame(cuadroReel); } }, { passive: true });
  window.addEventListener('resize', () => irASlide(activa, false));

  flechaAnt.addEventListener('click', () => { interactuar(); irASlide(activa - 1); });
  flechaSig.addEventListener('click', () => { interactuar(); irASlide(activa + 1); });
  vista.addEventListener('keydown', (e) => {
    const mapa = { ArrowRight: activa + 1, ArrowLeft: activa - 1, Home: 0, End: slides.length - 1 };
    if (e.target !== vista || !(e.key in mapa)) return;
    e.preventDefault();
    interactuar();
    irASlide(mapa[e.key]);
  });

  // Arrastre con el mouse, con inercia al soltar
  let arrastre = null;
  vista.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0 || e.target.closest('.reel__play')) return;
    arrastre = { x: e.clientX, scroll: vista.scrollLeft, movido: false, muestras: [[e.clientX, performance.now()]] };
    interactuar();
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
    if (!a.movido) return;
    const [x0, t0] = a.muestras[0];
    const [x1, t1] = a.muestras[a.muestras.length - 1];
    const v = (x1 - x0) / Math.max(1, t1 - t0); // px por ms
    const proyectado = vista.scrollLeft - v * 260 + vista.clientWidth / 2;
    let mejor = 0, dist = Infinity;
    slides.forEach((s, i) => { const d = Math.abs(s.offsetLeft + s.offsetWidth / 2 - proyectado); if (d < dist) { dist = d; mejor = i; } });
    vista.classList.remove('is-dragging');
    irASlide(mejor);
    // evita que el clic al soltar active algo dentro del carrusel
    vista.addEventListener('click', (ev) => { ev.preventDefault(); ev.stopPropagation(); }, { capture: true, once: true });
  };
  vista.addEventListener('pointerup', soltar);
  vista.addEventListener('pointercancel', soltar);

  // Autoavance: se pausa al pasar el mouse, con foco, al tocar, fuera de pantalla o en otra pestaña
  let pausadoPorUsuario = false, encima = false, conFoco = false, enPantalla = false, ultimaInteraccion = 0, timerAuto, timerReanudar;
  function interactuar() {
    ultimaInteraccion = performance.now();
    programarAuto();
    clearTimeout(timerReanudar);
    timerReanudar = setTimeout(programarAuto, 5200);
  }
  function puedeAvanzar() {
    return !reduceMotion() && !pausadoPorUsuario && !encima && !conFoco && enPantalla && !document.hidden && !arrastre
      && performance.now() - ultimaInteraccion > 5000;
  }
  function programarAuto() {
    clearTimeout(timerAuto);
    const avanzar = puedeAvanzar();
    reel.classList.toggle('is-playing', avanzar);
    if (avanzar) timerAuto = setTimeout(() => irASlide(activa >= slides.length - 1 ? 0 : activa + 1), AUTO);
  }
  reel.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') { encima = true; programarAuto(); } });
  reel.addEventListener('pointerleave', () => { encima = false; programarAuto(); });
  reel.addEventListener('focusin', () => { conFoco = true; programarAuto(); });
  reel.addEventListener('focusout', (e) => { if (!reel.contains(e.relatedTarget)) { conFoco = false; programarAuto(); } });
  vista.addEventListener('touchstart', interactuar, { passive: true });
  vista.addEventListener('wheel', interactuar, { passive: true });
  document.addEventListener('visibilitychange', programarAuto);
  new IntersectionObserver(([e]) => { enPantalla = e.isIntersecting; programarAuto(); }, { threshold: 0.4 }).observe(reel);
  btnPausa.addEventListener('click', () => {
    pausadoPorUsuario = !pausadoPorUsuario;
    btnPausa.setAttribute('aria-pressed', String(pausadoPorUsuario));
    btnPausa.setAttribute('aria-label', pausadoPorUsuario ? 'Reanudar avance automático' : 'Pausar avance automático');
    $('i', btnPausa).className = pausadoPorUsuario ? 'ph ph-play' : 'ph ph-pause';
    programarAuto();
  });
  if (reduceMotion()) btnPausa.hidden = true;

  // Videos: vista previa animada al pasar el mouse; con el archivo real se reproduce el video
  function asegurarVideo(slide) {
    const escena = $('.scene', slide);
    if (escena._video !== undefined) return escena._video;
    escena._video = null;
    const src = escena.dataset.video;
    if (!src) return null;
    const v = document.createElement('video');
    v.className = 'scene__video';
    v.muted = true; v.loop = true; v.playsInline = true; v.preload = 'auto';
    v.setAttribute('aria-hidden', 'true');
    v.addEventListener('loadeddata', () => { escena._video = v; if (slide.classList.contains('is-previewing')) reproducir(slide); }, { once: true });
    v.addEventListener('error', () => { v.remove(); }, { once: true });
    v.src = src;
    escena.append(v);
    return null;
  }
  function reproducir(slide) {
    slide.classList.add('is-previewing');
    const v = asegurarVideo(slide);
    if (v) v.play().then(() => v.classList.add('is-playing')).catch(() => {});
  }
  function detenerVista(slide) {
    if (!slide.classList.contains('is-video')) return;
    slide.classList.remove('is-previewing');
    const b = $('.reel__play', slide);
    b.setAttribute('aria-pressed', 'false');
    b.setAttribute('aria-label', b.getAttribute('aria-label').replace('Pausar', 'Reproducir'));
    $('i', b).className = 'ph ph-play';
    const v = $('.scene', slide)._video;
    if (v) { v.pause(); v.classList.remove('is-playing'); }
  }
  slides.filter((s) => s.classList.contains('is-video')).forEach((slide) => {
    const b = $('.reel__play', slide);
    const frame = $('.reel__frame', slide);
    frame.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse' && !reduceMotion()) reproducir(slide); });
    frame.addEventListener('pointerleave', () => { if (b.getAttribute('aria-pressed') !== 'true') detenerVista(slide); });
    b.addEventListener('click', () => {
      interactuar();
      irASlide(slides.indexOf(slide));
      if (b.getAttribute('aria-pressed') === 'true') { detenerVista(slide); return; }
      reproducir(slide);
      b.setAttribute('aria-pressed', 'true');
      b.setAttribute('aria-label', b.getAttribute('aria-label').replace('Reproducir', 'Pausar'));
      $('i', b).className = 'ph ph-pause';
    });
  });

  requestAnimationFrame(() => { irASlide(1, false); cuadroReel(); });

  /* 13. CUESTIONARIO ======================================================= */
  const form = $('#booking-form');
  const pasos = $$('.step', form);
  const etiquetasPaso = $$('.progress__step');
  const barra = $('.progress__bar');
  const btnAtras = $('#step-back');
  const btnSiguiente = $('#step-next');
  const btnPagar = $('#step-submit');
  const grupoExp = $('.choice', form);
  const CLAVE = 'hila-reserva-v2';
  const NOMBRES_PASO = ['Tus datos', 'Experiencia y salud', 'Emergencia y avisos'];
  let pasoActual = 1;
  let cambiando = false;

  const soloDigitos = (v) => v.replace(/\D/g, '');
  const celularValido = (v) => { let d = soloDigitos(v); if (d.length === 12 && d.startsWith('52')) d = d.slice(2); return d.length === 10; };
  const enRango = (v, min, max) => v !== '' && Number(v) >= min && Number(v) <= max;
  const expElegida = () => form.elements.experiencia.value;

  const REGLAS = {
    nombre: (v) => (v.trim().length >= 2 ? '' : 'Escribe tu nombre para saber cómo llamarte.'),
    apellido: (v) => (v.trim().length >= 2 ? '' : 'Escribe tu apellido.'),
    edad: (v) => {
      if (!v) return 'Escribe tu edad.';
      if (!Number.isInteger(Number(v))) return 'Escribe tu edad en números, por ejemplo 25.';
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
    sangre: (v) => (v ? '' : 'Elige tu tipo de sangre o la opción “No lo sé”.'),
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

  // Campos de un paso (los radios cuentan como uno solo)
  function camposDe(n) {
    const vistos = new Set();
    return $$('input, select, textarea', pasos[n - 1]).filter((el) => {
      if (!REGLAS[el.name] || vistos.has(el.name)) return false;
      vistos.add(el.name);
      return true;
    });
  }
  const errorDe = (el) => (el.name === 'experiencia' ? $('#f-experiencia-error') : document.getElementById(el.id + '-error'));
  const pasoValido = (n) => camposDe(n).every((el) => !REGLAS[el.name](el.value, el));

  function validarCampo(el, { sacudir = false } = {}) {
    const regla = REGLAS[el.name];
    if (!regla) return true;
    const mensaje = regla(el.value, el);
    const error = errorDe(el);
    error.textContent = mensaje;
    const objetivo = el.name === 'experiencia' ? grupoExp : el;
    if (mensaje) {
      objetivo.setAttribute('aria-invalid', 'true');
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
      objetivo.removeAttribute('aria-invalid');
    }
    marcarValido(el, !mensaje);
    return !mensaje;
  }
  function marcarValido(el, ok) {
    const c = el.closest('.control');
    if (c) c.classList.toggle('is-valid', ok && el.value.trim() !== '' && el.tagName !== 'SELECT');
  }

  function validarPaso(n) {
    const invalidos = camposDe(n).filter((el) => !validarCampo(el, { sacudir: true }));
    if (invalidos.length) {
      const primero = invalidos[0].name === 'experiencia' ? $('input[name="experiencia"]', form) : invalidos[0];
      primero.focus();
    }
    return invalidos.length === 0;
  }

  form.addEventListener('focusout', (e) => {
    const el = e.target;
    if (!REGLAS[el.name] || el.type === 'checkbox' || el.type === 'radio') return;
    if (el.value.trim() !== '' || el.getAttribute('aria-invalid') === 'true') validarCampo(el);
  });
  form.addEventListener('input', (e) => {
    const el = e.target;
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

  // Resumen lateral en vivo
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
  function actualizarResumen() {
    const id = expElegida();
    const x = EXPERIENCIAS[id];
    const resumen = $('#summary');
    resumen.dataset.mood = id || '';
    $('#sum-exp').textContent = x ? x.nombre : 'Elige una experiencia en el paso 2';
    ponerDato('sum-fecha', form.elements.fecha.value ? form.elements.fecha.selectedOptions[0].textContent : '', 'Por elegir');
    ponerDato('sum-nombre', `${form.elements.nombre.value.trim()} ${form.elements.apellido.value.trim()}`.trim(), 'Por escribir');
    ponerDato('sum-contacto', form.elements.mail.value.trim() || form.elements.celular.value.trim(), 'Por escribir');
    $('#sum-total').textContent = formatoPrecio(x ? x.precio : 0);
    $$('[data-check]', resumen).forEach((li) => li.classList.toggle('is-done', pasoValido(Number(li.dataset.check))));
  }

  function actualizarProgreso() {
    etiquetasPaso.forEach((li, i) => {
      li.classList.toggle('is-current', i + 1 === pasoActual);
      li.classList.toggle('is-done', i + 1 < pasoActual);
    });
    barra.style.setProperty('--progress', pasoActual / 3);
    barra.setAttribute('aria-valuenow', pasoActual);
    barra.setAttribute('aria-valuetext', `Paso ${pasoActual} de 3: ${NOMBRES_PASO[pasoActual - 1]}`);
    btnAtras.hidden = pasoActual === 1;
    btnSiguiente.hidden = pasoActual === 3;
    btnPagar.hidden = pasoActual !== 3;
  }

  function irAPaso(n, { instantaneo = false } = {}) {
    if (n === pasoActual || cambiando) return;
    const dir = n > pasoActual ? 1 : -1;
    const sale = pasos[pasoActual - 1];
    const entra = pasos[n - 1];
    pasoActual = n;
    actualizarProgreso();
    guardar();
    const mostrar = () => {
      sale.classList.remove('is-active');
      entra.classList.add('is-active');
      if (instantaneo) return;
      const tarjeta = $('.form-card');
      if (tarjeta.getBoundingClientRect().top < 0) tarjeta.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
      entra.setAttribute('tabindex', '-1');
      entra.focus({ preventScroll: true });
    };
    if (instantaneo) return mostrar();
    const d = reduceMotion() ? 0 : 28;
    cambiando = true;
    sale.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: `translateX(${-dir * d}px)` }], { duration: 150, easing: EASE_OUT }).onfinish = () => {
      mostrar();
      entra.animate([{ opacity: 0, transform: `translateX(${dir * d}px)` }, { opacity: 1, transform: 'none' }], { duration: 260, easing: EASE_OUT }).onfinish = () => { cambiando = false; };
    };
  }

  btnSiguiente.addEventListener('click', () => { if (validarPaso(pasoActual)) irAPaso(pasoActual + 1); });
  btnAtras.addEventListener('click', () => irAPaso(pasoActual - 1));
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (pasoActual < 3) { btnSiguiente.click(); return; } // Enter en pasos 1 y 2 = Siguiente
    for (let n = 1; n <= 3; n++) {
      if (!pasoValido(n)) {
        if (n !== pasoActual) irAPaso(n, { instantaneo: true });
        validarPaso(n);
        return;
      }
    }
    guardar();
    abrirPago();
  });

  // Guardado en sessionStorage: se conserva al volver del pago o al recargar
  function guardar() {
    const datos = { paso: pasoActual, valores: {} };
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
    if (datos.paso > 1 && datos.paso <= 3) irAPaso(datos.paso, { instantaneo: true });
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

  actualizarProgreso();
  restaurar();
  actualizarResumen();

  /* 14. PAGO SIMULADO ======================================================
     Sin cobros reales: la pantalla de PayPal es una simulación con botones
     de demo para probar el pago exitoso (6A) y el fallido (6B). */
  const pago = $('#pay');
  let timerPago;
  let vistaPago = 'redirect';

  function resumenHTML() {
    const x = EXPERIENCIAS[expElegida()];
    const filas = [
      ['Experiencia', x.nombre],
      ['Fecha', form.elements.fecha.selectedOptions[0]?.textContent || ''],
      ['A nombre de', `${form.elements.nombre.value.trim()} ${form.elements.apellido.value.trim()}`]
    ];
    return filas.map(([dt, dd]) => `<div><dt>${dt}</dt><dd>${escapar(dd)}</dd></div>`).join('')
      + `<div class="summary__total"><dt>Total</dt><dd>${formatoPrecio(x.precio)} MXN</dd></div>`;
  }

  function mostrarVista(nombre, { instantaneo = false } = {}) {
    const actual = $(`.pay__view[data-view="${vistaPago}"]`, pago);
    const nueva = $(`.pay__view[data-view="${nombre}"]`, pago);
    vistaPago = nombre;
    const entrar = () => {
      $$('.pay__view', pago).forEach((v) => v.classList.toggle('is-active', v === nueva));
      const t = $('.pay__title', nueva);
      if (t && t.hasAttribute('tabindex')) t.focus({ preventScroll: true });
      if (nombre === 'ok') requestAnimationFrame(() => { $('.check-draw', nueva).classList.add('is-drawn'); setTimeout(confeti, 380); });
      if (instantaneo) return;
      nueva.animate([{ opacity: 0, transform: `translateY(${reduceMotion() ? 0 : 10}px)` }, { opacity: 1, transform: 'none' }], { duration: 260, easing: EASE_OUT });
    };
    if (instantaneo || actual === nueva) return entrar();
    actual.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, easing: 'ease' }).onfinish = entrar;
  }

  // Confeti muy discreto con los colores de la marca
  function confeti() {
    if (reduceMotion()) return;
    const cont = $('.confetti', pago);
    const colores = ['#a8472a', '#e39a3b', '#9fd3cf', '#5f7342', '#c98a7a', '#0c3227'];
    for (let i = 0; i < 26; i++) {
      const p = document.createElement('i');
      p.style.background = colores[i % colores.length];
      cont.append(p);
      const ang = (-Math.PI / 2) + (Math.random() - 0.5) * Math.PI * 1.1;
      const dist = 70 + Math.random() * 110;
      const x = Math.cos(ang) * dist, y = Math.sin(ang) * dist;
      const giro = (Math.random() - 0.5) * 540;
      p.animate([
        { transform: 'translate(0,0) rotate(0deg) scale(0.6)', opacity: 0 },
        { transform: `translate(${x * 0.7}px, ${y * 0.7}px) rotate(${giro * 0.5}deg) scale(1)`, opacity: 1, offset: 0.35 },
        { transform: `translate(${x}px, ${y + 90}px) rotate(${giro}deg) scale(0.9)`, opacity: 0 }
      ], { duration: 1100 + Math.random() * 500, delay: Math.random() * 120, easing: 'cubic-bezier(0.2, 0.7, 0.3, 1)', fill: 'forwards' }).onfinish = () => p.remove();
    }
  }

  function iniciarRedireccion() {
    clearTimeout(timerPago);
    mostrarVista('redirect', { instantaneo: !pago.open });
    timerPago = setTimeout(() => { $('#pay-summary').innerHTML = resumenHTML(); mostrarVista('paypal'); }, 2000);
  }
  function abrirPago() {
    $('.check-draw', pago).classList.remove('is-drawn');
    vistaPago = 'redirect';
    $$('.pay__view', pago).forEach((v) => v.classList.toggle('is-active', v.dataset.view === 'redirect'));
    abrirDialogo(pago, btnPagar);
    iniciarRedireccion();
  }
  function pagoExitoso() {
    const x = EXPERIENCIAS[expElegida()];
    const folio = 'HILA-' + Math.floor(1000 + Math.random() * 9000);
    $('#ok-text').innerHTML = `Te enviaremos la confirmación a <strong>${escapar(form.elements.mail.value.trim())}</strong>. Tu folio es <strong>${folio}</strong>.`;
    $('#ok-summary').innerHTML = resumenHTML() + `<div><dt>Folio</dt><dd>${folio}</dd></div>`;
    const msj = `Hola HILA, soy ${form.elements.nombre.value.trim()}. Acabo de reservar ${x.nombre} (folio ${folio}).`;
    $('#ok-whatsapp').href = `https://wa.me/525500000000?text=${encodeURIComponent(msj)}`;
    borrarGuardado();
    mostrarVista('ok');
  }
  async function volverAlCuestionario() {
    clearTimeout(timerPago);
    await cerrarDialogo(pago, { devolverFoco: false });
    if (pasoActual !== 3) irAPaso(3, { instantaneo: true });
    mostrarAviso('Tus respuestas siguen guardadas. Revisa lo que necesites y vuelve a intentar el pago.');
    irAlCuestionario();
  }
  async function terminar() {
    await cerrarDialogo(pago, { devolverFoco: false });
    form.reset();
    llenarFechas('');
    $$('[aria-invalid]', form).forEach((el) => el.removeAttribute('aria-invalid'));
    $$('.field__error', form).forEach((el) => { el.textContent = ''; });
    $$('.control.is-valid', form).forEach((el) => el.classList.remove('is-valid'));
    $('#form-notice').hidden = true;
    irAPaso(1, { instantaneo: true });
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
    if (accion === 'retry') iniciarRedireccion();
    if (accion === 'back') volverAlCuestionario();
    if (accion === 'done') terminar();
    if (accion === 'contact') { clearTimeout(timerPago); cerrarDialogo(pago, { devolverFoco: false }); }
  });
  pago.addEventListener('cancel', (e) => { e.preventDefault(); vistaPago === 'ok' ? terminar() : volverAlCuestionario(); });

  $('#year').textContent = new Date().getFullYear();
})();
