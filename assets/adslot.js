/* ============================================================
   ESIC · Display & RTB · Sesión 1 — BANNER PUBLICITARIO STICKY
   La "nota clave" de cada pantalla se sirve como una creatividad
   display que cambia al hacer scroll (guiño a la programática).
   Escucha el evento `spw:section` que emite el scrollspy.
   ============================================================ */
(function () {
  // Creatividad por sección: frase (nota), puja ganadora y fondo (advertiser)
  const G_NAVY   = 'linear-gradient(135deg,#0D1F3C,#1A3058)';
  const G_RED    = 'linear-gradient(135deg,#C8102E,#e05577)';
  const G_TEAL   = 'linear-gradient(135deg,#0f766e,#14b8a6)';
  const G_VIOLET = 'linear-gradient(135deg,#5b21b6,#7c3aed)';
  const G_AMBER  = 'linear-gradient(135deg,#b45309,#f59e0b)';

  const AD = {
    s00: { q: 'No gana quien más términos técnicos use. Gana quien mejor observa, justifica y explica.', cpm: '3,20 €', bg: G_NAVY },
    s01: { q: 'Antes se compraban espacios. Ahora se compran oportunidades de impacto.', cpm: '4,80 €', bg: G_RED },
    s02: { q: 'Formato + posición + contexto + visibilidad = valor publicitario.', cpm: '2,90 €', bg: G_TEAL },
    s03: { q: 'Una duda bien formulada vale más que una respuesta inventada.', cpm: '3,60 €', bg: G_VIOLET },
    s04: { q: 'Un banner es solo la parte visible de una cadena de decisiones técnicas, comerciales y de medición.', cpm: '5,10 €', bg: G_AMBER },
    s05: { q: 'Header Bidding no sustituye a Google Ad Manager. Aporta competencia.', cpm: '4,20 €', bg: G_NAVY },
    s06: { q: 'Un buen diagnóstico distingue evidencia, hipótesis y duda.', cpm: '2,40 €', bg: G_RED },
    s07: { q: 'La misión no es pujar siempre más alto. La misión es comprar bien.', cpm: '6,50 €', bg: G_TEAL },
    s08: { q: 'En una subasta, la información puede valer tanto como la puja.', cpm: '5,80 €', bg: G_VIOLET },
    s09: { q: 'La monetización no consiste en vender siempre al precio más alto. Consiste en encontrar equilibrio.', cpm: '3,90 €', bg: G_AMBER },
    s10: { q: 'Servido no significa visto. Visto no significa clicado. Clicado no significa convertido.', cpm: '4,60 €', bg: G_NAVY },
    s11: { q: 'Hoy hemos seguido la impresión. El sábado vamos a aprender a gestionarla.', cpm: '3,10 €', bg: G_RED }
  };

  const slot     = document.getElementById('adslot');
  if (!slot) return;
  const creative = document.getElementById('adCreative');
  const kicker   = document.getElementById('adKicker');
  const copy     = document.getElementById('adCopy');
  const serving  = document.getElementById('adServing');
  const closeBtn = document.getElementById('adClose');
  const reopen   = document.getElementById('adReopen');
  const reduce   = matchMedia('(prefers-reduced-motion: reduce)').matches;

  let cur = null, timer;

  function paint(d) {
    creative.style.setProperty('--adbg', d.bg);
    kicker.textContent = 'Puja ganadora · ' + d.cpm;
    copy.textContent = d.q;
  }

  // Sirve una nueva creatividad; con animación de "subasta" salvo la inicial
  function serve(id, instant) {
    const d = AD[id];
    if (!d || id === cur) return;
    cur = id;

    if (instant || reduce) { paint(d); return; }

    serving.classList.add('on');
    creative.classList.add('loading');
    clearTimeout(timer);
    timer = setTimeout(() => {
      paint(d);
      creative.classList.remove('loading');
      serving.classList.remove('on');
      creative.classList.remove('served');
      void creative.offsetWidth;          // reinicia la animación
      creative.classList.add('served');
    }, 430);
  }

  document.addEventListener('spw:section', e => serve(e.detail.id));

  // Creatividad inicial = sección activa al cargar (sin animación)
  const active = document.querySelector('#spw-nav a.active');
  serve(active ? active.getAttribute('href').slice(1) : 's00', true);

  // Cerrar / reabrir (persistente en la sesión)
  if (sessionStorage.getItem('esic_ad_closed') === '1') { slot.hidden = true; reopen.hidden = false; }
  closeBtn.addEventListener('click', () => {
    slot.hidden = true; reopen.hidden = false;
    sessionStorage.setItem('esic_ad_closed', '1');
  });
  reopen.addEventListener('click', () => {
    slot.hidden = false; reopen.hidden = true;
    sessionStorage.removeItem('esic_ad_closed');
  });
})();
