(() => {
  'use strict';

  const hero = document.querySelector('.hero');
  const slides = [...document.querySelectorAll('.slide')];
  const selectors = [...document.querySelectorAll('.slide-selector')];
  const announcement = document.querySelector('.slide-announcement');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const capabilities = document.querySelector('.capabilities');
  const counters = [...document.querySelectorAll('[data-count-to]')];
  if (capabilities && counters.length && !reducedMotion.matches && 'IntersectionObserver' in window) {
    let countFrame;
    const finishCount = () => {
      cancelAnimationFrame(countFrame);
      counters.forEach(counter => { counter.textContent = counter.dataset.countTo; });
      countObserver.disconnect();
    };
    const countObserver = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      countObserver.disconnect();
      let start;
      const tick = timestamp => {
        if (start === undefined) start = timestamp;
        const progress = Math.min((timestamp - start) / 1800, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        counters.forEach(counter => {
          counter.textContent = String(Math.floor(Number(counter.dataset.countTo) * eased));
        });
        if (progress < 1) countFrame = requestAnimationFrame(tick);
      };
      countFrame = requestAnimationFrame(tick);
    }, { threshold: 0.2 });
    counters.forEach(counter => { counter.textContent = '0'; });
    countObserver.observe(capabilities);
    reducedMotion.addEventListener('change', event => {
      if (event.matches) finishCount();
    });
  }
  const interval = 6000;
  let currentSlide = 0;
  let timer;
  let remaining = interval;
  let startedAt = 0;
  let focusInside = false;
  let dialogOpen = false;
  let menuOpen = false;
  let userPaused = false;
  const playbackButton = document.querySelector(".hero-playback");
  playbackButton.addEventListener("click", () => {
    userPaused = !userPaused;
    playbackButton.setAttribute("aria-pressed", String(userPaused));
    playbackButton.setAttribute("aria-label", userPaused ? "Play slideshow" : "Pause slideshow");
    syncPlayback();
  });

  function isPaused() {
    return userPaused || reducedMotion.matches || focusInside || dialogOpen || menuOpen || document.hidden;
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
  hero.addEventListener('pointerdown', () => {
    focusInside = false;
    syncPlayback();
  });
  hero.addEventListener('focusin', event => {
    // Pause for keyboard navigation while letting mouse interaction keep playing.
    focusInside = event.target.matches(':focus-visible');
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
  const menuBackdrop = document.querySelector('.mobile-menu-backdrop');
  const mobileMenu = window.matchMedia('(max-width: 1000px)');
  const menuBackground = [document.querySelector('main'), document.querySelector('.site-footer')];
  let savedMenuScroll = 0;
  let backgroundInert = [];
  function closeMenu(returnFocus = false) {
    const wasOpen = menuOpen;
    menuOpen = false;
    navigation.classList.remove('is-open');
    navigation.inert = mobileMenu.matches;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
    menuBackdrop.hidden = true;
    if (wasOpen) {
      document.body.classList.remove('has-mobile-menu');
      document.body.style.removeProperty('--menu-scroll-top');
      menuBackground.forEach((element, index) => { element.inert = backgroundInert[index]; });
      window.scrollTo({ top: savedMenuScroll, behavior: 'instant' });
      syncPlayback();
    }
    if (returnFocus) menuButton.focus();
  }
  function openMenu() {
    if (!mobileMenu.matches || menuOpen) return;
    savedMenuScroll = window.scrollY;
    backgroundInert = menuBackground.map(element => Boolean(element.inert));
    menuOpen = true;
    navigation.inert = false;
    navigation.classList.add('is-open');
    menuButton.setAttribute('aria-expanded', 'true');
    menuButton.setAttribute('aria-label', 'Close navigation');
    document.body.style.setProperty('--menu-scroll-top', `${-savedMenuScroll}px`);
    document.body.classList.add('has-mobile-menu');
    menuBackdrop.hidden = false;
    menuBackground.forEach(element => { element.inert = true; });
    syncPlayback();
  }
  navigation.inert = mobileMenu.matches;
  menuButton.addEventListener('click', () => {
    if (menuOpen) closeMenu();
    else openMenu();
  });
  menuBackdrop.addEventListener('click', () => closeMenu(true));
  document.addEventListener('click', event => {
    if (!event.target.closest('.navbar')) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (!menuOpen) return;
    if (event.key === 'Escape') { event.preventDefault(); closeMenu(true); }
    if (event.key === 'Tab') {
      const focusable = [...header.querySelectorAll('a[href], button:not([disabled])')].filter(element => {
        const style = window.getComputedStyle(element);
        return style.display !== 'none' && style.visibility !== 'hidden';
      });
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  navigation.addEventListener('click', event => {
    if (event.target.closest('a')) closeMenu();
  });
  mobileMenu.addEventListener('change', () => closeMenu());

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
  document.querySelectorAll('[data-open-contact]').forEach(button => {
    button.addEventListener('click', () => openDialog(document.querySelector('#contact-dialog')));
  });

  const expoDialog = document.querySelector('#expo-dialog');
  const expoCards = [...document.querySelectorAll('[data-expo-index]')];
  let expoIndex = 0;
  function showExpoPhoto(index) {
    expoIndex = (index + expoCards.length) % expoCards.length;
    const card = expoCards[expoIndex];
    const source = card.querySelector('img');
    const photo = expoDialog.querySelector('.expo-dialog-photo');
    photo.src = source.src;
    photo.alt = source.alt;
    expoDialog.querySelector('#expo-dialog-title').textContent = card.querySelector('.expo-card-caption').textContent.trim();
    expoDialog.querySelector('.expo-photo-count').textContent = `Photo ${expoIndex + 1} of ${expoCards.length}`;
  }
  function openExpo(index) {
    showExpoPhoto(index);
    openDialog(expoDialog);
  }
  expoCards.forEach((card, index) => card.addEventListener('click', () => openExpo(index)));
  document.querySelector('[data-open-expo]').addEventListener('click', () => openExpo(0));
  document.querySelector('[data-expo-previous]').addEventListener('click', () => showExpoPhoto(expoIndex - 1));
  document.querySelector('[data-expo-next]').addEventListener('click', () => showExpoPhoto(expoIndex + 1));
  expoDialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      showExpoPhoto(expoIndex + (event.key === 'ArrowLeft' ? -1 : 1));
    }
  });

  const productSearch = document.querySelector('#product-search');
  const resultList = document.querySelector('.search-results');
  const products = [
    { name: 'Current Transformers', detail: 'Indoor, outdoor dry type and oil cooled CTs', keywords: 'ct current resin oil dry indoor outdoor', url: '#panel-ct' },
    { name: 'Voltage Transformers', detail: 'Indoor and outdoor potential transformers', keywords: 'pt vt potential voltage resin oil dry indoor outdoor', url: '#panel-pt' },
    { name: 'Metering Solutions', detail: 'CT/PT combined units and metering cubicles', keywords: 'metering cubicle combined ct pt', url: '#panel-metering' },
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
      const external = !product.url.startsWith('#');
      if (external) {
        link.target = '_blank';
        link.rel = 'noopener';
      } else {
        link.addEventListener('click', () => document.querySelector('#search-dialog').close());
      }
      const text = document.createElement('span');
      text.textContent = product.name;
      const detail = document.createElement('small');
      detail.textContent = product.detail;
      text.append(detail);
      const hint = document.createElement('span');
      hint.textContent = external ? '↗' : '→';
      hint.setAttribute('aria-hidden', 'true');
      const accessibleHint = document.createElement('span');
      accessibleHint.className = 'sr-only';
      accessibleHint.textContent = external ? ' (opens in a new tab)' : '';
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


(() => {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const header = document.querySelector('.site-header');
  const navLinks = [...document.querySelectorAll('.nav-link[href^="#"]')];
  const sectionLinks = navLinks.map(link => ({ link, section: document.querySelector(link.hash) }));

  // Read geometry once per frame. Normal browser scrolling and URL history remain intact.
  let scrollFrame = 0;
  function updateNavigation() {
    scrollFrame = 0;
    const activationLine = Math.min(window.innerHeight * .32, 260);
    const positions = sectionLinks.filter(item => item.section).map(item => ({ ...item, top: item.section.getBoundingClientRect().top }));
    // Gallery sits before Blogs in the document, regardless of their menu order.
    const current = positions.filter(item => item.top <= activationLine).sort((a, b) => b.top - a.top)[0] || sectionLinks[0];
    navLinks.forEach(link => {
      const active = link === current?.link;
      link.classList.toggle('is-current', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    header.style.setProperty('--page-progress', String(scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0));
  }
  function scheduleNavigation() {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateNavigation);
  }
  window.addEventListener('scroll', scheduleNavigation, { passive: true });
  window.addEventListener('resize', scheduleNavigation, { passive: true });
  window.addEventListener('pageshow', scheduleNavigation);
  updateNavigation();

  // Tabs use manual keyboard activation, so arrow-key exploration never moves page focus.
  const tabList = document.querySelector('.product-tabs');
  const tabs = [...document.querySelectorAll('[data-product-tab]')];
  const panels = [...document.querySelectorAll('[data-product-panel]')];
  const panelAliases = { '#ct-title': 'ct', '#pt-title': 'pt', '#metering-title': 'metering' };
  function selectProduct(key, animate = true) {
    if (!panels.some(panel => panel.dataset.productPanel === key)) return;
    tabs.forEach(tab => {
      const active = tab.dataset.productTab === key;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    panels.forEach(panel => {
      const active = panel.dataset.productPanel === key;
      panel.hidden = !active;
      panel.classList.remove('is-entering');
      if (active && animate && !reducedMotion.matches) {
        void panel.offsetWidth;
        panel.classList.add('is-entering');
      }
    });
  }
  if (tabList && tabs.length && panels.length) {
    tabList.hidden = false;
    tabList.setAttribute('role', 'tablist');
    const stackedTabs = window.matchMedia('(max-width: 700px)');
    const updateOrientation = () => tabList.setAttribute('aria-orientation', stackedTabs.matches ? 'vertical' : 'horizontal');
    stackedTabs.addEventListener('change', updateOrientation);
    updateOrientation();
    document.querySelector('.product-grid').classList.add('is-interactive');
    tabs.forEach((tab, index) => {
      tab.setAttribute('role', 'tab');
      tab.addEventListener('click', () => selectProduct(tab.dataset.productTab));
      tab.addEventListener('keydown', event => {
        let next;
        if (event.key === (stackedTabs.matches ? 'ArrowDown' : 'ArrowRight')) next = (index + 1) % tabs.length;
        if (event.key === (stackedTabs.matches ? 'ArrowUp' : 'ArrowLeft')) next = (index - 1 + tabs.length) % tabs.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = tabs.length - 1;
        if (next !== undefined) { event.preventDefault(); tabs[next].focus(); }
      });
    });
    panels.forEach(panel => {
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', `tab-${panel.dataset.productPanel}`);
      panel.tabIndex = 0;
    });
    selectProduct('ct', false);
  }
  function productKeyForHash(hash) {
    return panelAliases[hash] || panels.find(panel => `#${panel.id}` === hash)?.dataset.productPanel;
  }
  function syncProductHash() {
    const key = productKeyForHash(window.location.hash);
    if (!key) return;
    selectProduct(key, false);
    document.querySelector(`#panel-${key}`).scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'start' });
  }
  document.addEventListener('click', event => {
    const anchor = event.target.closest('a[href^="#"]');
    const key = anchor && productKeyForHash(anchor.hash);
    if (key) selectProduct(key);
  });
  window.addEventListener('hashchange', syncProductHash);
  if (productKeyForHash(window.location.hash)) requestAnimationFrame(syncProductHash);

  // Keep a product enquiry's context in the existing contact dialog.
  const contactDialog = document.querySelector('#contact-dialog');
  const contactTitle = contactDialog.querySelector('h2');
  const contactIntro = contactDialog.querySelector('h2 + p');
  const email = contactDialog.querySelector('a[href^="mailto:"]');
  const defaults = { title: contactTitle.textContent, intro: contactIntro.textContent, email: email.getAttribute('href') };
  document.querySelectorAll('[data-product-enquiry]').forEach(button => {
    button.addEventListener('click', () => {
      const product = button.dataset.productEnquiry;
      contactTitle.textContent = `Let’s discuss ${product.toLowerCase()}.`;
      contactIntro.textContent = 'Share your ratings, application, quantity and project timeline with the ATIPL team.';
      email.href = `mailto:info@amitytrans.com?subject=${encodeURIComponent(`Enquiry: ${product}`)}`;
    });
  });
  contactDialog.addEventListener('close', () => {
    contactTitle.textContent = defaults.title;
    contactIntro.textContent = defaults.intro;
    email.setAttribute('href', defaults.email);
  });

  // Mobile footer disclosures; desktop navigation stays expanded and readable.
  const mobileFooter = window.matchMedia('(max-width: 700px)');
  const footerToggles = [...document.querySelectorAll('.footer-accordion-toggle')];
  function updateFooterLayout() {
    footerToggles.forEach(button => {
      const links = document.getElementById(button.getAttribute('aria-controls'));
      button.disabled = !mobileFooter.matches;
      button.setAttribute('aria-expanded', String(!mobileFooter.matches));
      links.hidden = mobileFooter.matches;
    });
  }
  footerToggles.forEach(button => {
    button.addEventListener('click', () => {
      if (!mobileFooter.matches) return;
      const open = button.getAttribute('aria-expanded') !== 'true';
      button.setAttribute('aria-expanded', String(open));
      document.getElementById(button.getAttribute('aria-controls')).hidden = !open;
    });
  });
  mobileFooter.addEventListener('change', updateFooterLayout);
  updateFooterLayout();

  // Reveal a small group at a time, once. No observer or reduced motion means visible content.
  const revealSelectors = '.about-copy, .about-gallery, .product-range-heading, .capability-grid, .expo-copy, .expo-photos, .quality-copy, .quality-visual, .clients-heading, .blog-heading, .blog-card, .faq-intro, .faq-list, .closing-cta-copy';
  const revealElements = [...document.querySelectorAll(revealSelectors)];
  let revealObserver;
  function showAll() {
    revealObserver?.disconnect();
    revealElements.forEach(element => element.classList.remove('is-pending'));
  }
  if (!reducedMotion.matches && 'IntersectionObserver' in window) {
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.remove('is-pending');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: .08, rootMargin: '0px 0px -24px 0px' });
    revealElements.forEach((element, index) => {
      // Do not fade out content already visible on load or browser scroll restoration.
      if (element.getBoundingClientRect().top < window.innerHeight) return;
      element.dataset.reveal = '';
      element.style.setProperty('--reveal-delay', `${(index % 2) * 70}ms`);
      element.classList.add('is-pending');
      revealObserver.observe(element);
    });
    reducedMotion.addEventListener('change', event => { if (event.matches) showAll(); });
    window.addEventListener('beforeprint', showAll);
  }
})();
