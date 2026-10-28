// Check actual stylesheet cascading at representative viewport widths.
// jsdom does not lay out pixels; browser screenshot verification remains separate.
const { JSDOM, VirtualConsole } = require('jsdom');
const { readFileSync } = require('node:fs');
const assert = require('node:assert/strict');
const files = ['styles.css'];
const source = new JSDOM('<!doctype html><head></head><body></body>', { virtualConsole: new VirtualConsole() });
files.forEach(file => {
  const style = source.window.document.createElement('style');
  style.textContent = readFileSync(`dist/${file}`, 'utf8');
  source.window.document.head.append(style);
  assert(style.sheet, `${file} parses`);
});
function matches(query, width) {
  if (query.includes('prefers-reduced-motion: reduce')) return false;
  const min = query.match(/min-width:\s*(\d+)px/), max = query.match(/max-width:\s*(\d+)px/);
  return (!min || width >= Number(min[1])) && (!max || width <= Number(max[1]));
}
function rulesFor(rules, width) {
  return [...rules].flatMap(rule => rule.type === 4 ? (matches(rule.conditionText, width) ? rulesFor(rule.cssRules, width) : []) : [rule.cssText]).join('\n');
}
for (const width of [320, 375, 390, 430, 700, 768, 1024, 1440]) {
  const dom = new JSDOM(readFileSync('dist/index.html', 'utf8'), { virtualConsole: new VirtualConsole() });
  const d = dom.window.document;
  const style = d.createElement('style');
  style.textContent = [...source.window.document.styleSheets].map(sheet => rulesFor(sheet.cssRules, width)).join('\n');
  d.head.append(style);
  const css = selector => dom.window.getComputedStyle(d.querySelector(selector));
  assert.equal(css('.hero-playback').display, width <= 700 ? 'none' : 'inline-grid');
  assert.equal(css('.closing-cta').display, width <= 700 ? 'none' : 'block');
  assert.equal(css('.footer-grid').display, width <= 700 ? 'flex' : 'grid');
  assert.equal(css('.footer-company-card').display, width <= 700 ? 'flex' : 'none');
  if (width <= 700) {
    assert.equal(css('.hero').height, '70svh');
    assert.equal(css('.hero').minHeight, '511px');
    assert.equal(css('.footer-contact').order, '1');
    assert.equal(css('.footer-wordmark').transform, 'none');
    assert.equal(css('.footer-back-label').display, 'inline');
    if (width <= 360) assert.equal(css('.slide-arrow').display, 'none');
  }
  if (width <= 1000) {
    assert.equal(css('.nav-links').position, 'fixed');
    assert.equal(css('.nav-links').height, '50svh');
    assert.equal(css('.nav-links').visibility, 'hidden');
    d.querySelector('.nav-links').classList.add('is-open');
    d.querySelector('.mobile-menu-backdrop').hidden = false;
    d.body.classList.add('has-mobile-menu');
    assert.equal(css('.nav-links').visibility, 'visible');
    assert.equal(css('.nav-links').transform, 'translateY(0)');
    assert.equal(css('.mobile-menu-backdrop').display, 'block');
    assert.equal(css('body').position, 'fixed');
    assert.equal(css('body').overflow, 'hidden');
  }
  dom.window.close();
}
source.window.close();
console.log('PASS: CSS parses and cascades at 320/375/390/430/700/768/1024/1440px: mobile hero sizing, CTA visibility, 50svh menu, blur backdrop, scroll lock and footer layout; desktop retained.');
