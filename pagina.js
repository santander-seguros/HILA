/* ==========================================================================
   HILA · Script ligero de las páginas interiores
   (páginas de experiencia, legales y 404). La página principal usa script.js.
   Incluye: navegación que se compacta, menú móvil, texto manuscrito
   "Sal a vivirlo.", próximas salidas, URLs limpias en servidor y año del pie.
   ========================================================================== */
(() => {
  'use strict';
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Navegación: se compacta al bajar (sin escuchar el scroll)
  const nav = $('#nav');
  const sentinela = $('.nav-sentinel');
  if (nav && sentinela) {
    new IntersectionObserver(([e]) => nav.classList.toggle('is-scrolled', !e.isIntersecting)).observe(sentinela);
  }

  // Menú móvil
  const toggle = $('#nav-toggle');
  const menu = $('#menu-movil');
  if (toggle && menu) {
    let timer;
    const abrir = () => {
      clearTimeout(timer);
      menu.hidden = false;
      menu.offsetHeight;
      menu.classList.add('is-open');
      nav.classList.add('is-menu-open');
      toggle.setAttribute('aria-expanded', 'true');
      $('.visually-hidden', toggle).textContent = 'Cerrar menú';
    };
    const cerrar = () => {
      menu.classList.remove('is-open');
      nav.classList.remove('is-menu-open');
      toggle.setAttribute('aria-expanded', 'false');
      $('.visually-hidden', toggle).textContent = 'Abrir menú';
      timer = setTimeout(() => { menu.hidden = true; }, reduceMotion() ? 0 : 200);
    };
    toggle.addEventListener('click', () => (toggle.getAttribute('aria-expanded') === 'true' ? cerrar() : abrir()));
    menu.addEventListener('click', (e) => { if (e.target.closest('a')) cerrar(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { cerrar(); toggle.focus(); }
    });
  }

  // "Sal a vivirlo." se escribe al aparecer
  const obs = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target._escritura.forEach((el) => el.classList.add('is-written'));
      obs.unobserve(e.target);
    });
  }, { threshold: 0.3 });
  $$('[data-write]').forEach((el) => {
    const padre = el.parentElement;
    (padre._escritura = padre._escritura || []).push(el);
    obs.observe(padre);
  });

  // URLs limpias en servidor (con doble clic se conservan los index.html)
  if (/^https?:$/.test(location.protocol)) {
    $$('a[href]').forEach((a) => {
      const h = a.getAttribute('href');
      if (/^(https?:|mailto:|tel:|#)/.test(h)) return;
      a.setAttribute('href', h.replace(/(^|\/)index\.html(?=$|[?#])/, '$1') || './');
    });
  }

  // Próximas salidas (páginas de experiencia). Se leen de data/salidas.json
  // en servidor, o de data/salidas.js al abrir con doble clic. Solo se
  // muestran las salidas "publicada". En esta versión NO hay control de
  // capacidad; el negocio confirma cada reserva manualmente.
  const listaSalidas = $('[data-salidas]');
  if (listaSalidas) {
    const id = listaSalidas.dataset.salidas;
    const precio = (n) => '$' + n.toLocaleString('es-MX');
    const escapar = (t) => { const d = document.createElement('div'); d.textContent = t; return d.innerHTML; };
    const fecha = (iso) => {
      const [a, m, d] = iso.split('-').map(Number);
      const t = new Date(a, m - 1, d).toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' }).replace(',', '');
      return t.charAt(0).toUpperCase() + t.slice(1);
    };
    const hora = (hhmm) => {
      const [h, m] = hhmm.split(':').map(Number);
      return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h < 12 ? 'a. m.' : 'p. m.'}`;
    };
    const pintar = (datos) => {
      if (!datos || !Array.isArray(datos.salidas)) return; // se queda la lista escrita en el HTML
      const ss = datos.salidas
        .filter((s) => s.experiencia_id === id && s.estado === 'publicada')
        .sort((a, b) => a.fecha.localeCompare(b.fecha));
      const base = /^https?:$/.test(location.protocol) ? '../../' : '../../index.html';
      listaSalidas.innerHTML = ss.length
        ? ss.map((s) => `<li class="salida">
            <div class="salida__info">
              <p class="salida__fecha">${fecha(s.fecha)} · ${hora(s.hora)}</p>
              <p class="salida__punto"><i class="ph ph-map-pin" aria-hidden="true"></i>${escapar(s.punto_de_encuentro)}</p>
            </div>
            <p class="salida__precio">${precio(s.precio)} <span>MXN</span></p>
            <a class="btn btn--primary btn--sm salida__btn" href="${base}?experiencia=${id}&salida=${encodeURIComponent(s.id)}#reserva">Reservar esta fecha</a>
          </li>`).join('')
        : '<li class="salida salida--pronto"><p>Próximamente. Escríbenos y te avisamos cuando haya fechas.</p></li>';
    };
    if (/^https?:$/.test(location.protocol)) {
      fetch('../../data/salidas.json', { cache: 'no-cache' })
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then(pintar)
        .catch(() => pintar(window.HILA_SALIDAS));
    } else {
      pintar(window.HILA_SALIDAS);
    }
  }

  const anio = $('#year');
  if (anio) anio.textContent = new Date().getFullYear();
})();
