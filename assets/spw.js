/* ============================================================
   ESIC · Display & RTB · Sesión 1 — LÓGICA SPW
   Reemplaza la navegación por carrusel de app.js por un modelo
   Single Page real con SCROLLSPY. Vanilla JS, sin dependencias.
   ============================================================ */
(function () {
  const PASSWORD = 'esic2026';

  const nav      = document.getElementById('spw-nav');
  const links    = [...nav.querySelectorAll('a')];
  const sections = [...document.querySelectorAll('.screen')];
  const linkFor  = id => links.find(a => a.getAttribute('href') === '#' + id);

  /* ==========================================================
     1) SCROLLSPY  ·  IntersectionObserver
     Ilumina en el menú la sección que el usuario está viendo.
     rootMargin recorta la ventana a una banda central: la
     sección activa es la que ocupa el centro del viewport.
     ========================================================== */
  let activeId = sections[0] ? sections[0].id : null;

  function setActive(id) {
    if (!id || id === activeId) return;
    activeId = id;
    links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));

    // Desplaza el enlace activo dentro de la barra (sin usar scrollIntoView)
    const a = linkFor(id);
    if (a && nav.scrollWidth > nav.clientWidth) {
      nav.scrollTo({ left: a.offsetLeft - nav.clientWidth / 2 + a.offsetWidth / 2, behavior: 'smooth' });
    }

    // Notifica el cambio de sección (lo usa el banner publicitario sticky)
    document.dispatchEvent(new CustomEvent('spw:section', { detail: { id } }));
  }

  // (a) IntersectionObserver: resalta al entrar la sección en la banda central.
  const spy = new IntersectionObserver((entries) => {
    const visibles = entries
      .filter(e => e.isIntersecting)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
    if (visibles.length) setActive(visibles[0].target.id);
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
  sections.forEach(s => spy.observe(s));

  // (b) Respaldo por posición de scroll: garantiza el resaltado en cualquier
  //     entorno aunque el IntersectionObserver no dispare. La sección activa es
  //     la última cuyo inicio ya ha pasado la línea de referencia (bajo el nav).
  const OFFSET = 120;
  function spyByScroll() {
    const y = window.scrollY || document.documentElement.scrollTop || 0;
    let id = sections[0].id;
    for (const s of sections) {
      if (s.offsetTop - OFFSET <= y) id = s.id; else break;
    }
    // Al llegar al final, marca la última sección
    if (y + window.innerHeight >= document.documentElement.scrollHeight - 4) {
      id = sections[sections.length - 1].id;
    }
    setActive(id);
  }

  // Feedback inmediato al hacer clic (el smooth-scroll de CSS hace el resto)
  links.forEach(a => a.addEventListener('click', () => {
    setActive(a.getAttribute('href').slice(1));
  }));

  /* ==========================================================
     2) BARRA DE PROGRESO de lectura
     ========================================================== */
  const fill = document.getElementById('progress-fill');
  function updateProgress() {
    const y = window.scrollY || document.documentElement.scrollTop || 0;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (fill) fill.style.width = Math.min(100, max > 0 ? (y / max) * 100 : 0) + '%';
  }

  // Listener de scroll directo (sin rAF, para funcionar también en iframes
  // en segundo plano donde requestAnimationFrame puede no dispararse).
  function onScroll() { spyByScroll(); updateProgress(); }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ==========================================================
     3) MODO PROFESOR  ·  revela las notas docentes tras clave
     ========================================================== */
  const toggle  = document.getElementById('profesor-toggle');
  const overlay = document.querySelector('.overlay');
  const input   = document.getElementById('pass');
  const unlock  = document.getElementById('unlock');
  const err     = document.getElementById('err');

  if (toggle && overlay) {
  function setProfesor(on) {
    document.body.classList.toggle('profesor-on', on);
    toggle.classList.toggle('on', on);
    toggle.innerHTML = on
      ? '<span aria-hidden="true">🔓</span> Ocultar notas'
      : '<span aria-hidden="true">🔒</span> Modo profesor';
  }

  if (sessionStorage.getItem('esic_profesor_ok') === '1') setProfesor(true);

  function tryUnlock() {
    if (input.value === PASSWORD) {
      sessionStorage.setItem('esic_profesor_ok', '1');
      overlay.classList.remove('show');
      err.textContent = '';
      input.value = '';
      setProfesor(true);
    } else {
      err.textContent = 'Clave incorrecta.';
      input.focus();
    }
  }

  toggle.addEventListener('click', () => {
    // Si ya está desbloqueado en esta sesión, solo alterna la visibilidad
    if (document.body.classList.contains('profesor-on')) { setProfesor(false); return; }
    if (sessionStorage.getItem('esic_profesor_ok') === '1') { setProfesor(true); return; }
    overlay.classList.add('show');
    setTimeout(() => input.focus(), 50);
  });
  unlock.addEventListener('click', tryUnlock);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') tryUnlock(); });
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.classList.remove('show'); });
  }

  /* ==========================================================
     4) BLOQUES DINÁMICOS (Mostrar/Ocultar)  ·  portado de app.js
     ========================================================== */
  document.querySelectorAll('.dynamic-toggle').forEach(button => {
    button.addEventListener('click', () => {
      const block = button.closest('.dynamic-block');
      const panel = block && block.querySelector('.dynamic-panel');
      if (!panel) return;
      const isOpen = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!isOpen));
      button.textContent = isOpen ? 'Mostrar' : 'Ocultar';
      panel.hidden = isOpen;
    });
  });

  /* ==========================================================
     4b) TARJETAS DE CONCEPTO EXPANDIBLES (S07)
     ========================================================== */
  document.querySelectorAll('.qcard-ex[data-expand]').forEach(card => {
    card.addEventListener('click', () => card.classList.toggle('active'));
  });

  /* ==========================================================
     5) SELECTOR "Evolución de la compra"  ·  portado de app.js
     ========================================================== */
  document.querySelectorAll('.evolution-interactive').forEach(block => {
    const choices = [...block.querySelectorAll('.evolution-choice')];
    const panels  = [...block.querySelectorAll('.evolution-detail')];
    choices.forEach(choice => {
      choice.addEventListener('click', () => {
        const target = choice.dataset.evolution;
        choices.forEach(c => c.classList.toggle('active', c === choice));
        panels.forEach(p => {
          const on = p.dataset.evolutionPanel === target;
          p.classList.toggle('active', on);
          p.hidden = !on;
        });
      });
    });
  });
})();
