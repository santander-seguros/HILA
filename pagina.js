/* ==========================================================================
   HILA · Script ligero de las páginas interiores
   (páginas de experiencia, legales y 404). La página principal usa script.js.
   Incluye: navegación que se compacta, menú móvil, texto manuscrito
   "Sal a vivirlo.", URLs limpias en servidor y año del pie.
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

  const anio = $('#year');
  if (anio) anio.textContent = new Date().getFullYear();
})();
