const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const root = path.resolve(__dirname, '../dist');
const documents = new Map();
const usedAssets = new Set();
function filesIn(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const filename = path.join(directory, entry.name);
    return entry.isDirectory() ? filesIn(filename) : [filename];
  });
}
function readDocument(filename) {
  if (!documents.has(filename)) {
    const dom = new JSDOM(fs.readFileSync(filename, 'utf8'));
    const ids = [...dom.window.document.querySelectorAll('[id]')].map(element => element.id);
    assert.equal(ids.length, new Set(ids).size, `Duplicate ID in ${filename}`);
    documents.set(filename, dom);
  }
  return documents.get(filename).window.document;
}
function checkReference(reference, from) {
  if (!reference || /^(?:https?:|mailto:|tel:|data:|\/\/)/i.test(reference)) return;
  const url = new URL(reference, `https://local.invalid/${path.relative(root, from).split(path.sep).join('/')}`);
  let target = path.resolve(root, '.' + decodeURIComponent(url.pathname));
  assert(target.startsWith(root + path.sep) || target === root, `Reference leaves website: ${reference}`);
  if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
  assert(fs.existsSync(target), `Missing ${reference} from ${path.relative(root, from)}`);
  if (target.startsWith(path.join(root, 'assets') + path.sep)) usedAssets.add(target);
  if (url.hash && path.extname(target) === '.html') {
    assert(readDocument(target).getElementById(decodeURIComponent(url.hash.slice(1))), `Missing anchor ${reference}`);
  }
}
const files = filesIn(root);
for (const filename of files.filter(file => file.endsWith('.html'))) {
  const document = readDocument(filename);
  for (const element of document.querySelectorAll('[src], [href], [srcset]')) {
    for (const attribute of ['src', 'href']) checkReference(element.getAttribute(attribute), filename);
    for (const candidate of (element.getAttribute('srcset') || '').split(',')) {
      checkReference(candidate.trim().split(/\s+/)[0], filename);
    }
  }
}
for (const filename of files.filter(file => /\.(?:css|js)$/.test(file))) {
  const contents = fs.readFileSync(filename, 'utf8');
  for (const match of contents.matchAll(/url\(\s*['"]?([^'"\s)]+)['"]?\s*\)/g)) {
    if (!match[1].startsWith('#')) checkReference(match[1], filename);
  }
  for (const match of contents.matchAll(/["'](assets\/[^"']+)["']/g)) checkReference(match[1], filename);
}
const unused = files.filter(file => file.startsWith(path.join(root, 'assets') + path.sep) && !usedAssets.has(file));
assert.deepEqual(unused.map(file => path.relative(root, file)), [], 'Unused production assets');
for (const dom of documents.values()) dom.window.close();
console.log(`PASS: ${documents.size} HTML pages, local references, unique IDs and all ${usedAssets.size} production assets are valid and used.`);
