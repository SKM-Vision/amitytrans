(() => {
  'use strict';

  const hero = document.querySelector('.hero');
  const slides = [...document.querySelectorAll('.slide')];
  const selectors = [...document.querySelectorAll('.slide-selector')];
  const announcement = document.querySelector('.slide-announcement');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const interval = 2000;
  let currentSlide = 0;
  let timer;
  let remaining = interval;
  let startedAt = 0;
  let pointerOver = false;
  let focusInside = false;
  let dialogOpen = false;

  function isPaused() {
    return reducedMotion.matches || pointerOver || focusInside || dialogOpen || document.hidden;
  }

  function syncPlayback() {
    if (timer) {
      clearTimeout(timer);
      timer = undefined;
      remaining = Math.max(0, remaining - (performance.now() - startedAt));
    }
    const paused = isPaused();
    hero.classList.toggle('is-paused', paused);
    if (!paused) {
      startedAt = performance.now();
      timer = setTimeout(() => showSlide(currentSlide + 1), remaining);
    }
  }

  function showSlide(index, announce = false) {
    clearTimeout(timer);
    timer = undefined;
    currentSlide = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      const active = i === currentSlide;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', String(!active));
      slide.inert = !active;
    });
    selectors.forEach((selector, i) => {
      selector.classList.remove('is-active');
      selector.removeAttribute('aria-current');
      if (i === currentSlide) {
        // Restart the progress bar when this slide is selected again.
        void selector.offsetWidth;
        selector.classList.add('is-active');
        selector.setAttribute('aria-current', 'true');
      }
    });
    remaining = interval;
    if (announce) announcement.textContent = slides[currentSlide].getAttribute('aria-label');
    syncPlayback();
  }

  document.querySelector('.slide-previous').addEventListener('click', () => showSlide(currentSlide - 1, true));
  document.querySelector('.slide-next').addEventListener('click', () => showSlide(currentSlide + 1, true));
  selectors.forEach(button => button.addEventListener('click', () => showSlide(Number(button.dataset.slide), true)));
  hero.addEventListener('pointerenter', event => {
    if (event.pointerType !== 'mouse') return;
    pointerOver = true;
    syncPlayback();
  });
  hero.addEventListener('pointerleave', () => {
    pointerOver = false;
    syncPlayback();
  });
  hero.addEventListener('focusin', () => {
    focusInside = true;
    syncPlayback();
  });
  hero.addEventListener('focusout', event => {
    if (!hero.contains(event.relatedTarget)) {
      focusInside = false;
      syncPlayback();
    }
  });
  document.addEventListener('visibilitychange', syncPlayback);
  reducedMotion.addEventListener('change', syncPlayback);
  hero.addEventListener('keydown', event => {
    if (event.target.closest('a, button, input')) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      showSlide(currentSlide + (event.key === 'ArrowRight' ? 1 : -1), true);
    }
  });
  let touchStart;
  hero.addEventListener('touchstart', event => {
    if (event.target.closest('a, button')) return;
    touchStart = { x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY };
  }, { passive: true });
  hero.addEventListener('touchend', event => {
    if (!touchStart) return;
    const dx = event.changedTouches[0].clientX - touchStart.x;
    const dy = event.changedTouches[0].clientY - touchStart.y;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) showSlide(currentSlide + (dx < 0 ? 1 : -1), true);
    touchStart = undefined;
  }, { passive: true });
  hero.addEventListener('touchcancel', () => { touchStart = undefined; });

  const header = document.querySelector('.site-header');
  let headerScrolled = false;
  let scrollQueued = false;
  function updateHeader() {
    // Separate enter/exit thresholds prevent flickering near the transition.
    headerScrolled = window.scrollY > (headerScrolled ? 40 : 96);
    header.classList.toggle('is-scrolled', headerScrolled);
    scrollQueued = false;
  }
  window.addEventListener('scroll', () => {
    if (scrollQueued) return;
    scrollQueued = true;
    requestAnimationFrame(updateHeader);
  }, { passive: true });
  window.addEventListener('pageshow', updateHeader);
  updateHeader();

  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.nav-links');
  function closeMenu(returnFocus = false) {
    navigation.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
    if (returnFocus) menuButton.focus();
  }
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    navigation.classList.toggle('is-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.navbar')) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') closeMenu(true);
  });
  navigation.addEventListener('click', event => {
    if (event.target.closest('a')) closeMenu();
  });
  window.matchMedia('(min-width: 1001px)').addEventListener('change', () => closeMenu());

  function openDialog(dialog) {
    closeMenu();
    dialog.showModal();
    dialogOpen = true;
    document.body.classList.add('has-dialog');
    syncPlayback();
  }
  document.querySelectorAll('.site-dialog').forEach(dialog => {
    dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        dialog.close();
      }
    });
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const box = dialog.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => {
      dialogOpen = false;
      document.body.classList.remove('has-dialog');
      syncPlayback();
    });
  });
  document.querySelector('[data-open-contact]').addEventListener('click', () => openDialog(document.querySelector('#contact-dialog')));

  const productSearch = document.querySelector('#product-search');
  const resultList = document.querySelector('.search-results');
  const products = [
    { name: 'Current Transformers', detail: 'Indoor, outdoor dry type and oil cooled CTs', keywords: 'ct current resin oil dry indoor outdoor', url: 'https://amitytrans.com/products.php' },
    { name: 'Voltage Transformers', detail: 'Indoor and outdoor potential transformers', keywords: 'pt vt potential voltage resin oil dry indoor outdoor', url: 'https://amitytrans.com/products.php' },
    { name: 'Metering Solutions', detail: 'CT/PT combined units and metering cubicles', keywords: 'metering cubicle combined ct pt', url: 'https://amitytrans.com/products.php' },
    { name: 'Product Catalogue', detail: 'Download the full ATIPL catalogue (PDF)', keywords: 'catalogue brochure pdf lt control panel busduct residual', url: 'assets/atipl-catalogue.pdf' }
  ];
  function renderResults() {
    const query = productSearch.value.toLowerCase().trim();
    const matches = products.filter(product => (product.name + ' ' + product.keywords).toLowerCase().includes(query));
    resultList.replaceChildren();
    matches.forEach(product => {
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = product.url;
      link.target = '_blank';
      link.rel = 'noopener';
      const text = document.createElement('span');
      text.textContent = product.name;
      const detail = document.createElement('small');
      detail.textContent = product.detail;
      text.append(detail);
      const hint = document.createElement('span');
      hint.textContent = '↗';
      hint.setAttribute('aria-hidden', 'true');
      const accessibleHint = document.createElement('span');
      accessibleHint.className = 'sr-only';
      accessibleHint.textContent = ' (opens in a new tab)';
      link.append(text, hint, accessibleHint);
      item.append(link);
      resultList.append(item);
    });
    if (!matches.length) {
      const item = document.createElement('li');
      item.className = 'empty-result';
      item.textContent = 'No matching products. Try current, voltage or metering, or contact our team.';
      resultList.append(item);
    }
    document.querySelector('.search-status').textContent = `${matches.length} results found.`;
  }
  productSearch.addEventListener('input', renderResults);
  document.querySelector('[data-open-search]').addEventListener('click', () => {
    renderResults();
    openDialog(document.querySelector('#search-dialog'));
    productSearch.focus();
  });
  syncPlayback();
})();
