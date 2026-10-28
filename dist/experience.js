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
