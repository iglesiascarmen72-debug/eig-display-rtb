/* ESIC - Display & RTB - app.js compartido */
(function () {
  const mode = document.body.dataset.mode;
  const links = [...document.querySelectorAll('.nav a')];
  const sections = [...document.querySelectorAll('.screen')];
  let current = 0;

  function indexFromHash(hash) {
    const cleanHash = hash || window.location.hash || ('#' + sections[0]?.id);
    const idx = sections.findIndex(section => '#' + section.id === cleanHash);
    return idx === -1 ? 0 : idx;
  }

  function updateProgress(idx) {
    const prog = document.getElementById('progress-fill');
    if (prog && sections.length > 1) {
      prog.style.width = ((idx / (sections.length - 1)) * 100) + '%';
    }

    const label = document.getElementById('progress-label');
    if (label) label.textContent = `Pantalla ${idx + 1} de ${sections.length}`;
  }

  function go(idx, pushHash = true) {
    if (!sections.length || idx < 0 || idx >= sections.length) return;
    current = idx;

    sections.forEach((section, i) => {
      section.classList.toggle('active', i === idx);
    });

    links.forEach(link => {
      link.classList.toggle(
        'active',
        link.getAttribute('href') === '#' + sections[idx].id
      );
    });

    updateProgress(idx);

    if (pushHash) history.replaceState(null, '', '#' + sections[idx].id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function wireNavigation() {
    links.forEach(link => {
      link.addEventListener('click', event => {
        event.preventDefault();
        go(indexFromHash(link.getAttribute('href')));
      });
    });

    document.querySelectorAll('.pager a').forEach(link => {
      const targetIndex = indexFromHash(link.getAttribute('href'));
      const sourceIndex = sections.findIndex(section => section.contains(link));

      if (targetIndex > sourceIndex) link.textContent = 'Continuar';
      if (targetIndex < sourceIndex) link.textContent = 'Anterior';

      link.addEventListener('click', event => {
        event.preventDefault();
        go(targetIndex);
      });
    });

    document.addEventListener('keydown', event => {
      if (document.querySelector('.overlay.show')) return;
      if (event.key === 'ArrowRight') go(current + 1);
      if (event.key === 'ArrowLeft') go(current - 1);
    });

    go(indexFromHash(), false);
  }

  function wireDynamicBlocks() {
    document.querySelectorAll('.dynamic-toggle').forEach(button => {
      button.addEventListener('click', () => {
        const block = button.closest('.dynamic-block');
        const panel = block?.querySelector('.dynamic-panel');
        if (!panel) return;

        const isOpen = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', String(!isOpen));
        button.textContent = isOpen ? 'Mostrar' : 'Ocultar';
        panel.hidden = isOpen;
      });
    });
  }

  function wireEvolutionChoices() {
    document.querySelectorAll('.evolution-interactive').forEach(block => {
      const choices = [...block.querySelectorAll('.evolution-choice')];
      const panels = [...block.querySelectorAll('.evolution-detail')];

      choices.forEach(choice => {
        choice.addEventListener('click', () => {
          const target = choice.dataset.evolution;
          choices.forEach(item => item.classList.toggle('active', item === choice));
          panels.forEach(panel => {
            const isActive = panel.dataset.evolutionPanel === target;
            panel.classList.toggle('active', isActive);
            panel.hidden = !isActive;
          });
        });
      });
    });
  }

  wireNavigation();
  wireDynamicBlocks();
  wireEvolutionChoices();

  if (mode === 'profesor') {
    const overlay = document.querySelector('.overlay');
    const input = document.querySelector('#pass');
    const btn = document.querySelector('#unlock');
    const err = document.querySelector('#err');
    const saved = sessionStorage.getItem('esic_profesor_ok');

    if (overlay && saved !== '1') overlay.classList.add('show');

    function unlock() {
      const PASSWORD = 'esic2026';
      if (input.value === PASSWORD) {
        sessionStorage.setItem('esic_profesor_ok', '1');
        overlay.classList.remove('show');
      } else {
        err.textContent = 'Clave incorrecta.';
        input.focus();
      }
    }

    if (btn && input && overlay) {
      btn.addEventListener('click', unlock);
      input.addEventListener('keydown', event => {
        if (event.key === 'Enter') unlock();
      });
    }
  }
})();
