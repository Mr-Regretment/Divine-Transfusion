(function () {
  const here = location.pathname.split('/').pop() || 'index.html';
  const sidebar = document.getElementById('sidebar');
  const root = document.documentElement;

  function renderNav() {
    sidebar.innerHTML = `
      <a class="brand" href="index.html" aria-label="Infusion guide home">
        <span class="brand-wordmark">INFUSION</span>
        <span class="brand-subtitle">The complete magic system guide</span>
      </a>
      <input class="nav-search" id="navSearch" type="search" autocomplete="off" placeholder="Filter the guide…" aria-label="Filter guide pages">
      <nav id="pageNav" aria-label="Guide chapters"></nav>
      <div class="sidebar-bottom">
        <button class="themebtn" id="themeToggle" type="button">Toggle theme</button>
        <p class="sidebar-note">Three slots. One god. Countless ways to fight.</p>
      </div>`;

    const nav = document.getElementById('pageNav');
    let chapter = '';
    NAV_DATA.forEach((page) => {
      if (page.chapter !== chapter) {
        chapter = page.chapter;
        const label = document.createElement('div');
        label.className = 'chapter-label';
        label.dataset.chapter = chapter.toLowerCase();
        label.textContent = chapter;
        nav.appendChild(label);
      }
      const link = document.createElement('a');
      link.href = page.file;
      link.className = `navlink${page.file === here ? ' active' : ''}`;
      link.textContent = page.label;
      link.dataset.search = `${page.label} ${page.chapter}`.toLowerCase();
      if (page.file === here) link.setAttribute('aria-current', 'page');
      nav.appendChild(link);
    });

    const search = document.getElementById('navSearch');
    search.addEventListener('input', () => {
      const value = search.value.trim().toLowerCase();
      document.querySelectorAll('.navlink').forEach((link) => {
        link.hidden = value && !link.dataset.search.includes(value);
      });
      document.querySelectorAll('.chapter-label').forEach((label) => {
        const links = [];
        let node = label.nextElementSibling;
        while (node && !node.classList.contains('chapter-label')) { links.push(node); node = node.nextElementSibling; }
        label.hidden = value && links.every(link => link.hidden);
      });
    });

    document.getElementById('themeToggle').addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('infusion-theme', next); } catch (_) {}
    });
  }

  try {
    const saved = localStorage.getItem('infusion-theme');
    if (saved) root.setAttribute('data-theme', saved);
  } catch (_) {}
  renderNav();

  const pageIndex = NAV_DATA.findIndex(page => page.file === here);
  const previous = pageIndex > 0 ? NAV_DATA[pageIndex - 1] : null;
  const next = pageIndex >= 0 && pageIndex < NAV_DATA.length - 1 ? NAV_DATA[pageIndex + 1] : null;
  const pager = document.getElementById('pagenav');
  if (pager) {
    pager.innerHTML = `${previous ? `<a href="${previous.file}"><span class="nav-caption">← Previous</span>${previous.label}</a>` : '<span></span>'}${next ? `<a class="next" href="${next.file}"><span class="nav-caption">Next →</span>${next.label}</a>` : '<span></span>'}`;
  }

  const menu = document.getElementById('mobileMenu');
  if (menu) {
    menu.addEventListener('click', () => {
      const open = sidebar.classList.toggle('open');
      menu.setAttribute('aria-expanded', String(open));
      menu.textContent = open ? 'Close' : 'Guide';
    });
  }
})();
