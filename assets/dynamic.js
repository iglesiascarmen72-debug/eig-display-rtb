/* ============================================================
   ESIC · Display & RTB · Sesión 1 — INTERACCIONES DINÁMICAS
   Vanilla JS. Controla: reveal al scroll, carrusel numerado,
   el "viaje" clicable, tabs y checklists. Robusto en iframes.
   ============================================================ */
(function () {
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- 1) REVEAL AL HACER SCROLL (mejora progresiva) ----
     Solo ocultamos si JS está activo; así sin JS todo se ve. */
  const revealEls = [...document.querySelectorAll('[data-reveal], [data-journey]')];
  const show = el => el.classList.add('is-in');

  if (reduce) {
    revealEls.forEach(show);
  } else {
    root.classList.add('js-reveal');

    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(e => { if (e.isIntersecting) { show(e.target); obs.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));

    // Revela de inmediato lo que ya está en pantalla al cargar…
    requestAnimationFrame(() => {
      revealEls.forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight * 0.92) show(el);
      });
    });
    // …y respaldo por posición de scroll (por si el IO no dispara en el iframe).
    function sweep() {
      revealEls.forEach(el => {
        if (!el.classList.contains('is-in') &&
            el.getBoundingClientRect().top < window.innerHeight * 0.92) show(el);
      });
    }
    window.addEventListener('scroll', sweep, { passive: true });
    // Red de seguridad: nada se queda invisible.
    setTimeout(() => revealEls.forEach(show), 1800);
  }

  /* ---- 2) CARRUSEL NUMERADO (estilo ESIC) ---- */
  document.querySelectorAll('.esic-carousel').forEach(car => {
    const track = car.querySelector('.ec-track');
    const cards = [...track.children];
    const prev  = car.querySelector('.ec-prev');
    const next  = car.querySelector('.ec-next');
    const segs  = [...car.querySelectorAll('.ec-seg')];

    const current = () => {
      let idx = 0, min = Infinity;
      cards.forEach((c, i) => {
        const d = Math.abs(c.offsetLeft - track.scrollLeft);
        if (d < min) { min = d; idx = i; }
      });
      return idx;
    };
    const scrollTo = i => {
      const t = cards[Math.max(0, Math.min(cards.length - 1, i))];
      if (t) track.scrollTo({ left: t.offsetLeft, behavior: 'smooth' });
    };
    const update = () => {
      const i = current();
      segs.forEach((s, j) => s.classList.toggle('on', j === i));
      if (prev) prev.disabled = track.scrollLeft <= 2;
      if (next) next.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
    };

    if (prev) prev.addEventListener('click', () => scrollTo(current() - 1));
    if (next) next.addEventListener('click', () => scrollTo(current() + 1));
    segs.forEach((s, j) => s.addEventListener('click', () => scrollTo(j)));
    track.addEventListener('scroll', update, { passive: true });
    update();
  });

  /* ---- 3) EL "VIAJE" HORIZONTAL CLICABLE ---- */
  document.querySelectorAll('[data-journey]:not([data-static])').forEach(j => {
    const nodes  = [...j.querySelectorAll('.journey-node')];
    const panels = [...j.querySelectorAll('.journey-panel')];

    const select = step => {
      const ai = nodes.findIndex(n => n.dataset.step === step);
      nodes.forEach((n, i) => {
        n.classList.toggle('active', i === ai);
        n.classList.toggle('done', i <= ai);   // ilumina el recorrido hasta aquí
      });
      panels.forEach(p => p.classList.toggle('active', p.dataset.panel === step));
    };

    nodes.forEach(n => n.addEventListener('click', () => select(n.dataset.step)));
    if (nodes[0]) select(nodes[0].dataset.step);
  });

  /* ---- 4) TABS ---- */
  document.querySelectorAll('[data-tabs]').forEach(t => {
    const btns   = [...t.querySelectorAll('.tab-btn')];
    const panels = [...t.querySelectorAll('.tab-panel')];
    btns.forEach(b => b.addEventListener('click', () => {
      btns.forEach(x => x.classList.toggle('active', x === b));
      panels.forEach(p => p.classList.toggle('active', p.dataset.tab === b.dataset.tab));
    }));
  });

  /* ---- 5) CHECKLIST ---- */
  document.querySelectorAll('.checklist li').forEach(li => {
    li.addEventListener('click', () => li.classList.toggle('done'));
  });

  /* ---- 6) TARJETAS DE CANAL (S02): toca para ver el detalle ---- */
  document.querySelectorAll('[data-channels]').forEach(group => {
    const cards   = [...group.querySelectorAll('.channel-card')];
    const wrap    = group.parentElement;
    const panels  = [...wrap.querySelectorAll('.channel-detail')];
    cards.forEach(card => card.addEventListener('click', () => {
      const ch = card.dataset.channel;
      const isActive = card.classList.contains('active');
      cards.forEach(c => c.classList.toggle('active', c === card && !isActive));
      panels.forEach(p => { p.hidden = (p.dataset.channelPanel !== ch) || isActive; });
    }));
  });

  /* ---- 7) CHIPS DE FORMATO (S02 evolución): toca para ver ventajas ---- */
  document.querySelectorAll('[data-evo-chips]').forEach(group => {
    const btns   = [...group.querySelectorAll('.evo-chip-btn')];
    const col    = group.parentElement;
    const panels = [...col.querySelectorAll('.evo-detail')];
    btns.forEach(btn => btn.addEventListener('click', () => {
      const ev = btn.dataset.evo;
      const isActive = btn.classList.contains('active');
      btns.forEach(b => b.classList.toggle('active', b === btn && !isActive));
      panels.forEach(p => { p.hidden = (p.dataset.evoPanel !== ev) || isActive; });
    }));
  });
})();
