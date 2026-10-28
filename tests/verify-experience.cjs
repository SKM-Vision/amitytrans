const { JSDOM } = require('jsdom');
const { readFileSync } = require('node:fs');
const assert = require('node:assert/strict');
const html = readFileSync('dist/index.html', 'utf8');

function launch({ reduced = false, hash = '', observer = true, width = 1440 } = {}) {
  const dom = new JSDOM(html, { url: `http://localhost:4173/${hash}`, runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  const timers = new Map(), frames = new Map(), observers = [];
  let id = 0;
  const media = new w.EventTarget();
  media.matches = reduced;
  const queries = new Map();
  const matchesWidth = query => {
    const min = query.match(/min-width:\s*(\d+)px/);
    const max = query.match(/max-width:\s*(\d+)px/);
    return (!min || width >= Number(min[1])) && (!max || width <= Number(max[1]));
  };
  w.innerWidth = width;
  w.matchMedia = query => {
    if (query.includes('reduced-motion')) return media;
    if (!queries.has(query)) queries.set(query, Object.assign(new w.EventTarget(), { matches: matchesWidth(query) }));
    return queries.get(query);
  };
  const resize = nextWidth => {
    width = nextWidth; w.innerWidth = width;
    queries.forEach((query, text) => {
      const matches = matchesWidth(text);
      if (matches === query.matches) return;
      query.matches = matches;
      query.dispatchEvent(Object.assign(new w.Event('change'), { matches }));
    });
    w.dispatchEvent(new w.Event('resize'));
  };
  w.scrollTo = options => { w.scrollY = options.top; w.lastScroll = options; };
  w.setTimeout = (fn, delay) => { timers.set(++id, { fn, delay }); return id; };
  w.clearTimeout = key => timers.delete(key);
  w.requestAnimationFrame = fn => { frames.set(++id, fn); return id; };
  w.cancelAnimationFrame = key => frames.delete(key);
  const tops = { top: 0, about: 1400, products: 2500, expo: 4200, clients: 5400, quality: 5900, blog: 6500, faq: 7500, enquiry: 8500 };
  w.HTMLElement.prototype.getBoundingClientRect = function () {
    const section = this.closest('section');
    const top = (tops[this.id] ?? tops[section?.id] ?? 1800) - w.scrollY;
    return { top, bottom: top + 600, left: 0, right: 1200, width: 1200, height: 600 };
  };
  w.HTMLElement.prototype.scrollIntoView = function (options) { this.lastScroll = options; };
  w.HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  w.HTMLDialogElement.prototype.close = function () { this.open = false; this.dispatchEvent(new w.Event('close')); };
  if (observer) {
    w.IntersectionObserver = class {
      constructor(callback) { this.callback = callback; this.targets = new Set(); observers.push(this); }
      observe(target) { this.targets.add(target); }
      unobserve(target) { this.targets.delete(target); }
      disconnect() { this.targets.clear(); }
    };
  }
  const flush = timestamp => {
    const pending = [...frames.values()]; frames.clear(); pending.forEach(fn => fn(timestamp));
  };
  w.eval(readFileSync('dist/script.js', 'utf8'));
  flush(0);
  return { dom, w, d: w.document, media, timers, frames, observers, flush, resize };
}

const { w, d, media, timers, observers, flush } = launch();
const visiblePanels = () => [...d.querySelectorAll('[data-product-panel]')].filter(panel => !panel.hidden).map(panel => panel.dataset.productPanel);
assert.deepEqual(visiblePanels(), ['ct']);
assert.equal(d.querySelector('.product-tabs').getAttribute('role'), 'tablist');
assert.equal(d.querySelector('#panel-ct').getAttribute('role'), 'tabpanel');
assert.equal(d.querySelector('#tab-ct').getAttribute('aria-selected'), 'true');
const key = (target, key) => target.dispatchEvent(new w.KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
const ct = d.querySelector('#tab-ct'), pt = d.querySelector('#tab-pt'), metering = d.querySelector('#tab-metering');
ct.focus(); key(ct, 'ArrowRight');
assert.equal(d.activeElement, pt);
assert.deepEqual(visiblePanels(), ['ct']);
pt.click(); assert.deepEqual(visiblePanels(), ['pt']);
key(pt, 'End'); assert.equal(d.activeElement, metering);
metering.click(); assert.deepEqual(visiblePanels(), ['metering']);
key(metering, 'Home'); assert.equal(d.activeElement, ct);
assert.equal(metering.tabIndex, 0); assert.equal(ct.tabIndex, -1);

// Search stays on this site, opens the matching category and closes its modal.
d.querySelector('[data-open-search]').click();
assert(d.querySelector('#search-dialog').open);
const search = d.querySelector('#product-search');
search.value = 'voltage'; search.dispatchEvent(new w.Event('input'));
const result = d.querySelector('.search-results a');
assert.equal(result.getAttribute('href'), '#panel-pt');
assert.equal(result.target, '');
result.click();
assert.equal(d.querySelector('#search-dialog').open, false);
assert.deepEqual(visiblePanels(), ['pt']);
search.value = 'no matching equipment'; search.dispatchEvent(new w.Event('input'));
assert(d.querySelector('.empty-result'));

const contact = d.querySelector('#contact-dialog');
d.querySelector('#panel-pt [data-product-enquiry]').click();
assert(contact.open);
assert.match(contact.querySelector('h2').textContent, /potential transformers/);
assert.match(contact.querySelector('a[href^="mailto:"]').getAttribute('href'), /Enquiry%3A%20Potential/);
assert(d.querySelector('.hero').classList.contains('is-paused'));
contact.close();
assert.equal(contact.querySelector('h2').textContent, 'Power your next project.');
assert.equal(contact.querySelector('a[href^="mailto:"]').getAttribute('href'), 'mailto:info@amitytrans.com');

// Slideshow pause persists through manual slide changes, then resumes at 6 seconds.
const playback = d.querySelector('.hero-playback');
playback.click(); assert.equal(playback.getAttribute('aria-pressed'), 'true'); assert.equal(timers.size, 0);
d.querySelector('.slide-next').click(); assert.equal(timers.size, 0);
assert.equal(d.querySelector('.slide.is-active').id, 'slide-2');
playback.click(); assert.equal(playback.getAttribute('aria-label'), 'Pause slideshow');
assert.equal([...timers.values()][0].delay, 6000);
assert.equal(d.querySelector('.slide:not(.is-active)').inert, true);

// Section tracking follows document order rather than the order of menu links.
w.scrollY = 4600; w.dispatchEvent(new w.Event('scroll')); flush(100);
assert.equal(d.querySelector('.nav-link[aria-current]').getAttribute('href'), '#expo');
w.scrollY = 6800; w.dispatchEvent(new w.Event('scroll')); flush(200);
assert.equal(d.querySelector('.nav-link[aria-current]').getAttribute('href'), '#blog');

const counters = [...d.querySelectorAll('[data-count-to]')];
assert(counters.every(counter => counter.textContent === '0'));
const countObserver = observers.find(o => o.targets.has(d.querySelector('.capabilities')));
countObserver.callback([{ target: d.querySelector('.capabilities'), isIntersecting: true }]);
flush(1000); flush(1900); flush(2800);
assert(counters.every(counter => counter.textContent === counter.dataset.countTo));
assert.equal(countObserver.targets.size, 0);
const pending = d.querySelector('[data-reveal].is-pending');
assert(pending);
const revealObserver = observers.find(o => o.targets.has(pending));
revealObserver.callback([{ target: pending, isIntersecting: true }]);
assert(!pending.classList.contains('is-pending'));
media.matches = true; media.dispatchEvent(Object.assign(new w.Event('change'), { matches: true }));
assert.equal(d.querySelectorAll('.is-pending').length, 0);
assert.equal(timers.size, 0);

const deep = launch({ hash: '#panel-metering' });
assert.equal(deep.d.querySelector('#panel-metering').hidden, false);
assert.equal(deep.d.querySelector('#panel-ct').hidden, true);
const reduced = launch({ reduced: true });
assert.equal(reduced.timers.size, 0);
assert.equal(reduced.d.querySelectorAll('.is-pending').length, 0);
assert([...reduced.d.querySelectorAll('[data-count-to]')].every(counter => counter.textContent === counter.dataset.countTo));
const fallback = launch({ observer: false });
assert.equal(fallback.d.querySelectorAll('.is-pending').length, 0);
const noJs = new JSDOM(html).window.document;
assert.equal(noJs.querySelector('.product-tabs').hidden, true);
assert([...noJs.querySelectorAll('[data-product-panel]')].every(panel => !panel.hidden));

// Mobile: lock and restore the current page position, contain focus, and recover on resize.
const mobile = launch({ width: 375 });
const md = mobile.d, mw = mobile.w;
const menu = md.querySelector('.menu-toggle'), nav = md.querySelector('.nav-links');
assert.equal(nav.inert, true);
mw.scrollY = 680;
menu.click();
assert.equal(menu.getAttribute('aria-expanded'), 'true');
assert(md.body.classList.contains('has-mobile-menu'));
assert.equal(md.body.style.getPropertyValue('--menu-scroll-top'), '-680px');
assert.equal(nav.inert, false);
assert.equal(md.querySelector('main').inert, true);
assert.equal(md.querySelector('.site-footer').inert, true);
assert.equal(md.querySelector('.mobile-menu-backdrop').hidden, false);
assert.equal(mobile.timers.size, 0);
menu.focus();
md.dispatchEvent(new mw.KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }));
assert.equal(md.activeElement, md.querySelector('.brand'));
md.dispatchEvent(new mw.KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true, cancelable: true }));
assert.equal(md.activeElement, menu);
md.dispatchEvent(new mw.KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
assert.equal(menu.getAttribute('aria-expanded'), 'false');
assert.equal(md.activeElement, menu);
assert(!md.body.classList.contains('has-mobile-menu'));
assert.equal(md.querySelector('main').inert, false);
assert.equal(md.querySelector('.site-footer').inert, false);
assert.equal(mw.lastScroll.top, 680);
menu.click(); md.querySelector('.mobile-menu-backdrop').click();
assert.equal(menu.getAttribute('aria-expanded'), 'false');
menu.click(); md.querySelector('.nav-link[href="#products"]').click();
assert.equal(menu.getAttribute('aria-expanded'), 'false');
menu.click(); mobile.resize(1200);
assert.equal(nav.inert, false);
assert(!md.body.classList.contains('has-mobile-menu'));
assert.equal(menu.getAttribute('aria-expanded'), 'false');

// Mobile disclosures collapse initially, expand on activation and reset for desktop.
mobile.resize(375);
const quick = md.querySelector('[aria-controls="footer-quick-links"]');
assert.equal(quick.disabled, false);
assert.equal(quick.getAttribute('aria-expanded'), 'false');
assert.equal(md.querySelector('#footer-quick-links').hidden, true);
quick.click();
assert.equal(quick.getAttribute('aria-expanded'), 'true');
assert.equal(md.querySelector('#footer-quick-links').hidden, false);
quick.click(); assert.equal(md.querySelector('#footer-quick-links').hidden, true);
mobile.resize(1200);
assert.equal(quick.disabled, true);
assert.equal(md.querySelector('#footer-quick-links').hidden, false);
mobile.resize(375);
assert.equal(md.querySelector('.product-tabs').getAttribute('aria-orientation'), 'vertical');
const mobileCT = md.querySelector('#tab-ct');
mobileCT.focus(); mobileCT.dispatchEvent(new mw.KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
assert.equal(md.activeElement, md.querySelector('#tab-pt'));
[w, deep.w, reduced.w, fallback.w, mw].forEach(window => window.close());
console.log('PASS: product browsing/search/enquiries, slideshow, counters, reveals, reduced motion and fallbacks; mobile menu scroll lock/restore, blur backdrop state, focus trap, Escape/backdrop/link closing, desktop resize recovery, footer disclosures and vertical product keyboard navigation.');
