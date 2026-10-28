const fs = require('node:fs');
const path = require('node:path');
const CleanCSS = require('clean-css');
const { minify } = require('terser');

async function build() {
  const root = path.resolve(__dirname, '..');
  const css = new CleanCSS({
    rebase: false,
    level: 2
  }).minify(fs.readFileSync(path.join(root, 'src/styles.css'), 'utf8'));
  if (css.errors.length) throw new Error(css.errors.join('\n'));
  const js = await minify(fs.readFileSync(path.join(root, 'src/script.js'), 'utf8'), {
    compress: { passes: 2 },
    mangle: true,
    format: { comments: false }
  });
  if (!js.code) throw new Error('JavaScript build produced no output.');
  fs.writeFileSync(path.join(root, 'dist/styles.css'), css.styles + '\n');
  fs.writeFileSync(path.join(root, 'dist/script.js'), js.code + '\n');
  console.log(`Built styles.css (${Buffer.byteLength(css.styles)} bytes) and script.js (${Buffer.byteLength(js.code)} bytes).`);
}

build().catch(error => { console.error(error.message); process.exitCode = 1; });
