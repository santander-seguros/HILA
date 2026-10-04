/* ==========================================================================
   HILA · Escenas ilustradas y líneas topográficas
   Compartido por la página principal, las páginas de experiencia y las
   páginas legales. Expone window.HILA_ESCENAS = { construirEscena }.
   ========================================================================== */
(() => {
  'use strict';
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  /* ESCENAS ILUSTRADAS ==================================================
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
    // Si el HTML ya trae una foto real (<img class="scene__photo">), se conserva
    const foto = el.querySelector(':scope > .scene__photo');
    el.innerHTML = crear(r, W, H, k).map(([prof, py, contenido]) =>
      `<div class="scene__layer" data-depth="${prof}" style="--py:${py}px" aria-hidden="true"><svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMax slice" aria-hidden="true">${contenido}</svg></div>`
    ).join('');
    el.dataset.built = '1';
    if (foto) { el.append(foto); vigilarFoto(el, foto); } else cargarFoto(el);
  }

  // Foto escrita en el HTML: se muestra solo si existe (si falla, se quita y queda la ilustración)
  function vigilarFoto(el, img) {
    const lista = () => { img.classList.add('is-loaded'); el.classList.add('has-photo'); };
    if (img.complete) { if (img.naturalWidth) lista(); else img.remove(); return; }
    img.addEventListener('load', lista, { once: true });
    img.addEventListener('error', () => img.remove(), { once: true });
  }

  // Foto indicada con data-photo (vista rápida del modal): se agrega solo si existe
  function cargarFoto(el) {
    const ruta = el.dataset.photo;
    if (!ruta || el.dataset.photoTried) return;
    el.dataset.photoTried = '1';
    const img = new Image();
    img.alt = el.dataset.alt || '';
    img.className = 'scene__photo is-loaded';
    img.decoding = 'async';
    img.onload = () => { el.append(img); el.classList.add('has-photo'); };
    img.src = ruta;
  }

  /* LÍNEAS TOPOGRÁFICAS ================================================= */
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

  window.HILA_ESCENAS = { construirEscena };
  document.querySelectorAll('.scene[data-scene]').forEach(construirEscena);
})();
