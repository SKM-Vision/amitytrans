# Amitytrans Techno

Responsive static website for Amitytrans Techno (I) Pvt. Ltd., with CT/PT product exploration, a hero slideshow, certifications, company and expo photography, client logos, articles, FAQs and contact dialogs.

## Preview

The committed `dist/` folder is ready to serve; no Node.js dependencies run in the browser.

```powershell
python -m http.server 4173 --directory dist
```

Open http://localhost:4173. A static host should publish `dist/`. Existing Sites configuration is retained in `.openai/hosting.json`.

## Vercel deployment

Import the repository with its root directory left at the repository root. `vercel.json` selects the Other framework preset, runs `npm run build`, and publishes `dist/`. Node.js is pinned to 24.x. A push to the connected production branch starts a new deployment.

## Edit and verify

Use Node.js 24.x:

```powershell
npm ci
npm run build
npm test
```

- Edit styles and interactions in `src/styles.css` and `src/script.js`.
- Edit page content in `dist/index.html` and `dist/blog/`.
- The build generates minified `dist/styles.css` and `dist/script.js`. Commit those outputs with source edits.
- `tests/` checks asset references, interactions, keyboard behaviour and responsive CSS.
- Dependencies are development-only; `node_modules/`, caches, previews and deployment archives are ignored.

## Mobile behaviour

Below 701px, dedicated portrait hero artwork is used, the hero is 30% shorter, the pause control and closing CTA are hidden, and the navy footer has stacked contact details and collapsible links. The hamburger menu slides down over the top half of the screen, blurs and locks the background, contains keyboard focus and restores the prior scroll position on close.

Product categories support keyboard navigation and deep links. Search opens matching categories locally. Product enquiries retain their category in the contact dialog and email subject. Reduced-motion preferences disable autoplay and scroll reveals. Gallery photos open in the built-in viewer.

## Assets and content

See [ASSET_SOURCES.md](ASSET_SOURCES.md) for provenance and prompts, [mobile artwork notes](source-images/mobile-hero/README.md), and [OPTIMIZATION.md](OPTIMIZATION.md) for storage savings. Supplied original photos are retained in `source-images/`; duplicate generated PNGs are removed.

The catalogue PDF is included unchanged. Contact actions use phone and email links; there is no enquiry backend or form submission service.
