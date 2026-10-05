/* ==========================================================================
   HILA v9 · animaciones.js — núcleo de movimiento de TODAS las páginas
   Se carga en el <head> (antes de pintar) para decidir el modo ligero y el
   telón sin parpadeos; lo que necesita el DOM corre al terminar de cargar.

   ─────────────────────────────────────────────────────────────────────────
   INTERRUPTORES (cámbialos aquí):
   - forzarLigero: null = automático · true = siempre ligero · false = nunca.
     (También para probar: agrega ?ligero=1 o ?ligero=0 a la dirección.)
   - telon: telón de entrada del hero (una vez por sesión, solo en la portada).
   - parallax, luz (spotlight de tarjetas), magnetico, vibracion: cada efecto.
   - fondoEscala: escala la página de atrás al abrir un plan (costoso; apagado).
   Duraciones y curvas: variables --mov-* al inicio de styles.css.
   ─────────────────────────────────────────────────────────────────────────

   Reglas: solo transform y opacity (salvo revelados de una vez con clip-path
   y trazos SVG); nada de secuestrar el scroll; lo que no se ve se pausa; sin
   JavaScript todo el contenido se ve completo (los estados ocultos dependen
   de la clase .js de <html>).
   ========================================================================== */
(function () {
  'use strict';

  var CONFIG = {
    forzarLigero: null,
    telon: true,
    parallax: true,
    luz: true,
    magnetico: true,
    vibracion: true,
    // Escalar la página de atrás (0.985) al abrir un plan. Apagado: en las
    // pruebas costó cuadros de más de 400 ms al re-rasterizar toda la página.
    // Sin él, el fondo se aleja con una viñeta sobre el velo (solo opacidad).
    fondoEscala: false
  };

  var html = document.documentElement;
  var mq = function (q) { return window.matchMedia(q); };
  var mqReducido = mq('(prefers-reduced-motion: reduce)');
  var mqFino = mq('(hover: hover) and (pointer: fine)');
  var mqEscritorio = mq('(min-width: 1024px)');

  /* ---------- Modo ligero automático ----------
     Dispositivo modesto: 4 núcleos o menos, 4 GB o menos (deviceMemory solo
     existe en Chrome/Edge), ahorro de datos o prefers-reduced-data. */
  function detectarLigero() {
    var p = /[?&]ligero=([01])/.exec(location.search);
    if (p) return p[1] === '1';
    if (CONFIG.forzarLigero !== null) return CONFIG.forzarLigero;
    var n = navigator;
    return Boolean(
      (n.hardwareConcurrency && n.hardwareConcurrency <= 4) ||
      (n.deviceMemory && n.deviceMemory <= 4) ||
      (n.connection && n.connection.saveData) ||
      mq('(prefers-reduced-data: reduce)').matches
    );
  }
  var ligero = detectarLigero();
  html.classList.toggle('mov-ligero', ligero);
  var reducido = function () { return mqReducido.matches; };
  var fino = function () { return mqFino.matches && !ligero && !reducido(); };

  /* ---------- Curva física (resorte casi sin rebote) ----------
     Se calcula una sola vez como linear(); si el navegador no la entiende,
     queda la curva de salida suave. */
  var CURVA = 'cubic-bezier(0.22, 1, 0.36, 1)';
  var RESORTE = CURVA;
  try {
    if (window.CSS && CSS.supports('transition-timing-function', 'linear(0, 1)')) {
      var pts = [], k = 170, c = 2 * Math.sqrt(k) * 0.86, x = 0, v = 0, dt = 1 / 60;
      for (var i = 0; i <= 48; i++) {
        pts.push(Math.round(x * 1000) / 1000);
        for (var s = 0; s < 2; s++) { var a = k * (1 - x) - c * v; v += a * dt / 2; x += v * dt / 2; }
      }
      pts[pts.length - 1] = 1;
      RESORTE = 'linear(' + pts.join(', ') + ')';
      html.style.setProperty('--mov-resorte', RESORTE);
    }
  } catch (_) { /* sin linear(): se queda la curva suave */ }

  var DUR = ligero ? { corta: 120, media: 240, larga: 480 } : { corta: 160, media: 320, larga: 700 };

  /* ---------- Telón de entrada (portada, una vez por sesión) ---------- */
  var script = document.currentScript;
  var conTelon = false;
  try {
    conTelon = CONFIG.telon && script && script.hasAttribute('data-telon') && !reducido() && !ligero &&
      !sessionStorage.getItem('hila-telon') &&
      (!performance.getEntriesByType || (performance.getEntriesByType('navigation')[0] || {}).type !== 'reload');
    if (conTelon) { html.classList.add('con-telon'); sessionStorage.setItem('hila-telon', '1'); }
  } catch (_) { conTelon = false; }
  function quitarTelon() { html.classList.remove('con-telon'); }
  if (conTelon) {
    // Se omite con cualquier toque, tecla o rueda; y se retira solo al terminar
    ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach(function (ev) {
      window.addEventListener(ev, quitarTelon, { once: true, passive: true });
    });
    setTimeout(quitarTelon, 1150);
  }

  /* ---------- Vibración háptica (Android; iOS no la soporta) ---------- */
  function vibrar(ms) {
    if (!CONFIG.vibracion || reducido() || !navigator.vibrate) return;
    try { navigator.vibrate(ms || 12); } catch (_) { /* nada */ }
  }

  /* ---------- Utilidades ---------- */
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var esc = function (t) { var d = document.createElement('div'); d.textContent = t; return d.innerHTML; };

  // Parte un título en líneas para revelarlo con máscara (el texto no cambia)
  function partirLineas(h) {
    var original = h.dataset.original || h.textContent.trim().replace(/\s+/g, ' ');
    h.dataset.original = original;
    h.innerHTML = original.split(' ').map(function (w) { return '<span class="w">' + esc(w) + '</span>'; }).join(' ');
    var lineas = [], top = null;
    $$('.w', h).forEach(function (w) {
      if (w.offsetTop !== top) { lineas.push([]); top = w.offsetTop; }
      lineas[lineas.length - 1].push(w.textContent);
    });
    h.innerHTML = lineas.map(function (l, n) {
      return '<span class="mask" style="--l:' + n + '"><span>' + esc(l.join(' ')) + '</span></span>';
    }).join('');
    h.classList.add('is-split');
    h._lineas = lineas.length;
    return lineas.length;
  }
  function restaurarTexto(h) { if (h.dataset.original) h.textContent = h.dataset.original; }

  /* ==========================================================================
     ENTRADAS AL HACER SCROLL (una sola vez)
     data-reveal="" | "arriba" | "izquierda" | "mascara"   data-delay="ms"
     - "mascara" en un título lo revela por líneas; en una imagen o escena,
       con un recorte suave de abajo hacia arriba.
     Hermanos con data-reveal entran escalonados (~50 ms).
     ========================================================================== */
  var obsReveal, obsTitulos, obsContadores, obsEscritura, obsTopo, obsPausa;
  var entradasIniciales = [], titulosIniciales = [];

  function esTexto(el) { return /^(H[1-6]|P|SPAN|STRONG|EM|LI|BLOCKQUOTE)$/.test(el.tagName); }

  function prepararEntradas() {
    $$('[data-reveal="mascara"]').forEach(function (el) {
      if (esTexto(el)) { el.classList.add('reveal-title'); el.removeAttribute('data-reveal'); }
      else el.classList.add('reveal-img');
    });
    $$('[data-reveal]').forEach(function (el) {
      var hermanos = Array.prototype.filter.call(el.parentElement.children, function (h) { return h.hasAttribute('data-reveal'); });
      el.style.setProperty('--i', hermanos.indexOf(el));
      if (el.dataset.delay) el.style.setProperty('--d', parseInt(el.dataset.delay, 10) + 'ms');
    });
    entradasIniciales = $$('[data-reveal]');
    titulosIniciales = $$('.reveal-title');
  }

  function crearObservadores() {
    obsReveal = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        obsReveal.unobserve(e.target);
        var el = e.target._revelaHijo || e.target;
        el.classList.add('is-visible');
        var retraso = (parseFloat(el.style.getPropertyValue('--i')) || 0) * 50 + 60 + (parseInt(el.dataset.delay, 10) || 0);
        // se libera el elemento para que use sus propias transiciones de hover
        setTimeout(function () { el.removeAttribute('data-reveal'); el.classList.remove('is-visible'); }, (el.classList.contains('reveal-img') ? 1100 : 660) + retraso);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

    obsTitulos = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        var h = e.target;
        obsTitulos.unobserve(h);
        h.classList.add('is-visible');
        // al terminar se restaura el texto original para que se acomode libremente
        setTimeout(function () { restaurarTexto(h); }, 780 + (h._lineas || 1) * 60);
      });
    }, { threshold: 0.3, rootMargin: '0px 0px -6% 0px' });

    obsContadores = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        obsContadores.unobserve(el);
        var fin = Number(el.dataset.count);
        if (reducido()) { el.textContent = fin; return; }
        var inicio = performance.now(), dur = ligero ? 900 : 1400;
        var paso = function (t) {
          var p = Math.min(1, Math.max(0, (t - inicio) / dur));
          el.textContent = Math.round(fin * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(paso);
        };
        el.textContent = '0';
        requestAnimationFrame(paso);
      });
    }, { threshold: 0.6 });

    obsEscritura = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        (e.target._escritura || []).forEach(function (el) { el.classList.add('is-written'); });
        obsEscritura.unobserve(e.target);
      });
    }, { threshold: 0.3 });

    // Líneas topográficas: se "dibujan" (recorte circular) al entrar en la vista
    obsTopo = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        // (se observa la sección: la línea recortada mide 0 hasta dibujarse)
        Array.prototype.forEach.call(e.target.children, function (h) { if (h.classList.contains('topo')) h.classList.add('is-dibujada'); });
        obsTopo.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -20% 0px' });

    // Animaciones continuas: se pausan fuera de pantalla
    obsPausa = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) { e.target.classList.toggle('mov-fuera', !e.isIntersecting); });
    });
  }

  // Un elemento recortado por completo mide 0 para IntersectionObserver:
  // en las imágenes con máscara se observa a su contenedor.
  function observarReveal(el) {
    if (!el.classList.contains('reveal-img')) { obsReveal.observe(el); return; }
    var padre = el.parentElement;
    padre._revelaHijo = el;
    obsReveal.observe(padre);
  }
  function observarEntradas() {
    entradasIniciales.forEach(observarReveal);
    $$('[data-count]').forEach(function (el) { obsContadores.observe(el); });
    $$('[data-write]').forEach(function (el) {
      var padre = el.parentElement;
      if (!padre._escritura) padre._escritura = [];
      if (padre._escritura.indexOf(el) < 0) padre._escritura.push(el);
      obsEscritura.observe(padre);
    });
    $$('.topo').forEach(function (el) { obsTopo.observe(el.parentElement); });
    $$('.marquee, .stage').forEach(function (el) { obsPausa.observe(el); });
    // Títulos: se parten cuando las fuentes ya cargaron (las líneas no cambian)
    var fuentes = document.fonts ? document.fonts.ready : Promise.resolve();
    Promise.race([fuentes, new Promise(function (r) { setTimeout(r, 800); })]).then(function () {
      titulosIniciales.forEach(function (h) { partirLineas(h); obsTitulos.observe(h); });
      requestAnimationFrame(function () { document.body.classList.add('is-ready'); });
    });
  }

  // Al volver desde la caché del navegador: todo listo para entrar de nuevo
  function reiniciarEntradas() {
    document.body.classList.remove('is-ready');
    entradasIniciales.forEach(function (el) {
      el.setAttribute('data-reveal', el.classList.contains('reveal-img') ? 'mascara' : '');
      el.classList.remove('is-visible');
      observarReveal(el);
    });
    titulosIniciales.forEach(function (h) {
      if (!h.classList.contains('is-split')) return; // aún no se había preparado
      h.classList.remove('is-visible', 'is-split');
      partirLineas(h);
      obsTitulos.observe(h);
    });
    $$('[data-count]').forEach(function (el) { obsContadores.observe(el); });
    $$('[data-write]').forEach(function (el) { el.classList.remove('is-written'); obsEscritura.observe(el.parentElement); });
    requestAnimationFrame(function () { requestAnimationFrame(function () { document.body.classList.add('is-ready'); }); });
  }

  /* ==========================================================================
     PARALLAX LEVE (solo computadora, 4 a 6 %): data-parallax="5"
     Solo se calcula mientras el elemento está en pantalla.
     ========================================================================== */
  function iniciarParallax() {
    var els = $$('[data-parallax]');
    if (!els.length) return;
    var activos = new Set(), pend = false;
    var capasDe = function (el) { var c = $$('.scene__layer', el); return c.length ? c : [el]; };
    var pintar = function () {
      pend = false;
      activos.forEach(function (el) {
        var r = el.getBoundingClientRect();
        // 0 mientras el borde superior está a la vista (reposo idéntico); crece al salir
        var p = -Math.max(0, Math.min(1, -r.top / r.height));
        var pct = Math.min(6, parseFloat(el.dataset.parallax) || 5);
        // En una escena ilustrada se mueven sus capas (más lejos = menos), que
        // ya tienen margen de sobra: el encuadre en reposo no cambia.
        capasDe(el).forEach(function (c, i, todas) {
          var f = todas.length > 1 ? (i + 1) / todas.length : 1;
          c.style.transform = 'translate3d(0,' + Math.max(0, -p * pct * f).toFixed(2) + '%,0)';
        });
      });
    };
    var pedir = function () { if (!pend && activos.size) { pend = true; requestAnimationFrame(pintar); } };
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) { if (e.isIntersecting) activos.add(e.target); else activos.delete(e.target); });
      pedir();
    });
    var encender = function () {
      var si = CONFIG.parallax && fino() && mqEscritorio.matches;
      els.forEach(function (el) {
        if (si) obs.observe(el);
        else { obs.unobserve(el); activos.delete(el); capasDe(el).forEach(function (c) { c.style.transform = ''; }); }
      });
    };
    encender();
    mqEscritorio.addEventListener('change', encender);
    mqReducido.addEventListener('change', encender);
    window.addEventListener('scroll', pedir, { passive: true });
    window.addEventListener('resize', pedir, { passive: true });
  }

  /* ==========================================================================
     LUZ QUE SIGUE AL CURSOR en tarjetas de planes y de merch (computadora).
     Se mueve con transform (sin repintar la tarjeta).
     ========================================================================== */
  function iniciarLuz() {
    if (!CONFIG.luz || !fino()) return;
    $$('.exp-card, .merch-card').forEach(function (card) {
      if (card.querySelector('.mov-luz')) return;
      var luz = document.createElement('span');
      luz.className = 'mov-luz';
      luz.setAttribute('aria-hidden', 'true');
      card.appendChild(luz);
      var raf = 0, x = 0, y = 0;
      card.addEventListener('pointermove', function (e) {
        if (e.pointerType !== 'mouse') return;
        var r = card.getBoundingClientRect();
        x = e.clientX - r.left; y = e.clientY - r.top;
        if (!raf) raf = requestAnimationFrame(function () { raf = 0; luz.style.transform = 'translate3d(' + (x - 180) + 'px,' + (y - 180) + 'px,0)'; });
      }, { passive: true });
    });
  }

  /* ==========================================================================
     BOTÓN MAGNÉTICO (computadora): .btn--magnetic (con .btn__inner) o
     [data-magnetico]. Se mueve hacia el cursor unos pocos píxeles.
     ========================================================================== */
  function iniciarMagnetico() {
    if (!CONFIG.magnetico) return;
    $$('.btn--magnetic, [data-magnetico]').forEach(function (btn) {
      var zona = btn.classList.contains('btn--magnetic') ? btn.parentElement : btn;
      var limpiar = function () { ['--mx', '--my', '--ix', '--iy'].forEach(function (v) { btn.style.removeProperty(v); }); };
      zona.addEventListener('pointermove', function (e) {
        if (e.pointerType !== 'mouse' || !fino()) return;
        var c = btn.getBoundingClientRect();
        var dx = e.clientX - (c.left + c.width / 2), dy = e.clientY - (c.top + c.height / 2);
        var lim = function (v, m) { return Math.max(-m, Math.min(m, v)).toFixed(1) + 'px'; };
        btn.style.setProperty('--mx', lim(dx * 0.3, btn.hasAttribute('data-magnetico') ? 6 : 14));
        btn.style.setProperty('--my', lim(dy * 0.4, btn.hasAttribute('data-magnetico') ? 4 : 10));
        btn.style.setProperty('--ix', lim(dx * 0.12, 6));
        btn.style.setProperty('--iy', lim(dy * 0.15, 4));
      });
      zona.addEventListener('pointerleave', limpiar);
    });
  }

  /* ==========================================================================
     MENÚ MÓVIL: enlaces escalonados (~40 ms); se cierra deslizando hacia
     arriba o tocando fuera. (El menú en sí lo abren script.js o pagina.js.)
     ========================================================================== */
  function iniciarMenu() {
    var menu = document.getElementById('menu-movil');
    var toggle = document.getElementById('nav-toggle');
    var nav = document.getElementById('nav');
    if (!menu || !toggle) return;
    var k = 0;
    $$('nav > *, :scope > .btn', menu).forEach(function (el) { el.style.setProperty('--k', k++); });
    var abierto = function () { return toggle.getAttribute('aria-expanded') === 'true'; };
    document.addEventListener('pointerdown', function (e) {
      if (abierto() && nav && !nav.contains(e.target)) toggle.click();
    });
    var y0 = null;
    menu.addEventListener('touchstart', function (e) { y0 = e.touches[0].clientY; }, { passive: true });
    menu.addEventListener('touchmove', function (e) {
      if (y0 === null || !abierto()) return;
      if (y0 - e.touches[0].clientY > 48) { y0 = null; toggle.click(); }
    }, { passive: true });
    menu.addEventListener('touchend', function () { y0 = null; }, { passive: true });
  }

  /* ==========================================================================
     BARRA DE LECTURA en las páginas interiores (la portada ya la tiene)
     ========================================================================== */
  function iniciarBarraLectura() {
    if (document.querySelector('.read-progress') || !document.querySelector('.legal-doc, .exp-page')) return;
    var barra = document.createElement('div');
    barra.className = 'read-progress';
    barra.setAttribute('aria-hidden', 'true');
    barra.innerHTML = '<span></span>';
    document.body.prepend(barra);
    if (window.CSS && CSS.supports('animation-timeline: scroll()')) return;
    var span = barra.firstChild, pend = false;
    window.addEventListener('scroll', function () {
      if (pend) return;
      pend = true;
      requestAnimationFrame(function () {
        pend = false;
        var max = document.documentElement.scrollHeight - innerHeight;
        span.style.setProperty('--read', max > 0 ? (scrollY / max).toFixed(4) : 0);
      });
    }, { passive: true });
  }

  /* ---------- Arranque cuando el DOM está listo ---------- */
  function iniciar() {
    prepararEntradas();
    crearObservadores();
    observarEntradas();
    iniciarParallax();
    iniciarLuz();
    iniciarMagnetico();
    iniciarMenu();
    iniciarBarraLectura();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();

  window.HILA_MOV = {
    CONFIG: CONFIG,
    ligero: ligero,
    reducido: reducido,
    fino: fino,
    curva: CURVA,
    resorte: RESORTE,
    dur: DUR,
    vibrar: vibrar,
    partirLineas: partirLineas,
    restaurarTexto: restaurarTexto,
    reiniciarEntradas: reiniciarEntradas,
    iniciarLuz: iniciarLuz
  };
})();
