// NeuroHINTS Labs v2 (ndm-website2) — Interactive Editorial & Multimedia Controller

document.addEventListener('DOMContentLoaded', () => {
  // 1. Theme Toggle (MGB Editorial Light <-> MGB Cobalt Dark)
  const themeBtn = document.getElementById('theme-toggle');
  const applyThemeLabel = () => {
    if (!themeBtn) return;
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    themeBtn.setAttribute('aria-pressed', String(isDark));
    themeBtn.innerHTML = isDark
      ? '<span aria-hidden="true">☀</span><span>Editorial Light</span>'
      : '<span aria-hidden="true">◐</span><span>MGB Cobalt</span>';
  };
  applyThemeLabel();

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try {
        localStorage.setItem('neurohints-mgb-theme', next);
      } catch (_) {}
      applyThemeLabel();
    });
  }

  // 2. Mobile Navigation Drawer
  const mobileBtn = document.getElementById('mobile-menu-toggle');
  const primaryNav = document.getElementById('primary-nav');
  if (mobileBtn && primaryNav) {
    mobileBtn.addEventListener('click', () => {
      const open = primaryNav.classList.toggle('is-open');
      mobileBtn.setAttribute('aria-expanded', String(open));
    });
  }

  // 3. Interactive Hero Story Reel (McGovern / Zuckerman / Brain Modulation Lab style)
  const reelTabs = document.querySelectorAll('[data-reel-tab]');
  const reelImg = document.getElementById('reel-stage-img');
  const reelBadge = document.getElementById('reel-stage-badge');
  const reelTitle = document.getElementById('reel-stage-title');
  const reelDesc = document.getElementById('reel-stage-desc');
  const reelLink = document.getElementById('reel-stage-link');

  if (reelTabs.length && reelImg && reelTitle && reelDesc) {
    reelTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        reelTabs.forEach((t) => {
          t.classList.remove('is-active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('is-active');
        tab.setAttribute('aria-selected', 'true');

        const imgSrc = tab.getAttribute('data-img');
        const badgeText = tab.getAttribute('data-badge');
        const titleText = tab.getAttribute('data-title');
        const descText = tab.getAttribute('data-desc');
        const linkHref = tab.getAttribute('data-href');

        if (imgSrc) reelImg.src = imgSrc;
        if (badgeText && reelBadge) reelBadge.textContent = badgeText;
        if (titleText) reelTitle.textContent = titleText;
        if (descText) reelDesc.textContent = descText;
        if (linkHref && reelLink) reelLink.href = linkHref;
      });
    });
  }

  // 4. Interactive Podcast & Symposia Talk Player (NEURAL Research Lab Podcast style)
  const playerCard = document.getElementById('podcast-player-card');
  const playToggleBtn = document.getElementById('podcast-play-toggle');
  const activeEpTitle = document.getElementById('active-episode-title');
  const activeEpMeta = document.getElementById('active-episode-meta');
  const episodeBtns = document.querySelectorAll('[data-episode-btn]');

  if (playToggleBtn && playerCard) {
    playToggleBtn.addEventListener('click', () => {
      const playing = playerCard.classList.toggle('is-playing');
      playToggleBtn.setAttribute('aria-pressed', String(playing));
      playToggleBtn.innerHTML = playing
        ? '<span aria-hidden="true">⏸</span> Pause Preview'
        : '<span aria-hidden="true">▶</span> Play Episode Preview';
    });
  }

  if (episodeBtns.length && activeEpTitle && activeEpMeta) {
    episodeBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        episodeBtns.forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        activeEpTitle.textContent = btn.getAttribute('data-ep-title') || '';
        activeEpMeta.textContent = btn.getAttribute('data-ep-meta') || '';
        if (playerCard && playToggleBtn) {
          playerCard.classList.add('is-playing');
          playToggleBtn.setAttribute('aria-pressed', 'true');
          playToggleBtn.innerHTML = '<span aria-hidden="true">⏸</span> Pause Preview';
        }
      });
    });
  }

  // 5. People Directory Filtering & Search
  const roleFilterBtns = document.querySelectorAll('[data-filter-role]');
  const personCards = document.querySelectorAll('[data-person-card]');
  const peopleSearchInput = document.getElementById('people-search-input');

  const filterPeople = () => {
    const activeBtn = document.querySelector('[data-filter-role].is-active');
    const role = activeBtn ? activeBtn.getAttribute('data-filter-role') : 'all';
    const q = (peopleSearchInput ? peopleSearchInput.value : '').trim().toLowerCase();

    personCards.forEach((card) => {
      const cardRoles = (card.getAttribute('data-roles') || '').toLowerCase();
      const cardText = (card.textContent || '').toLowerCase();
      const matchesRole = role === 'all' || cardRoles.includes(role);
      const matchesQuery = !q || cardText.includes(q);
      card.style.display = matchesRole && matchesQuery ? '' : 'none';
    });
  };

  roleFilterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      roleFilterBtns.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      filterPeople();
    });
  });

  if (peopleSearchInput) {
    peopleSearchInput.addEventListener('input', filterPeople);
  }

  // 6. Global Command-K Search Dialog
  const searchDialog = document.getElementById('search-dialog');
  const searchOpenBtn = document.getElementById('search-open-btn');
  const searchInput = document.getElementById('global-search-input');
  const searchItems = document.querySelectorAll('[data-search-item]');

  if (searchOpenBtn && searchDialog) {
    searchOpenBtn.addEventListener('click', () => {
      if (typeof searchDialog.showModal === 'function') {
        searchDialog.showModal();
        if (searchInput) searchInput.focus();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      if (searchDialog && typeof searchDialog.showModal === 'function') {
        e.preventDefault();
        if (searchDialog.open) {
          searchDialog.close();
        } else {
          searchDialog.showModal();
          if (searchInput) searchInput.focus();
        }
      }
    }
  });

  if (searchInput && searchItems.length) {
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.trim().toLowerCase();
      searchItems.forEach((item) => {
        const text = (item.textContent || '').toLowerCase();
        item.style.display = !q || text.includes(q) ? '' : 'none';
      });
    });
  }
});
