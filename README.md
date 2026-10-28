# ATIPL navbar and hero demo

Plain HTML, CSS and JavaScript, with no build step or framework. The current design uses `styles.css` for the base site and `experience.css` / `experience.js` for the interactive design layer.

Open `dist/index.html` directly, or serve the `dist` directory:

```powershell
python -m http.server 4173 --directory dist
```

Then visit http://localhost:4173.

## Included

- Floating white pill navigation using the official company logo and catalogue-inspired orange/blue palette, smoothly expanding into a fixed full-width header after scrolling.
- Three hero slides in order: "Transformers For Power Generation," "Transformers For Power Protection" and "Transformers For Greener Future."
- Previous/next controls, slide selection, 6-second autoplay, swipe and arrow-key navigation.
- Autoplay continues on mouse hover and clicks. It pauses for visible keyboard focus, an open dialog, or a hidden tab. Reduced-motion preferences start the slideshow paused.
- Responsive mobile navigation, product search and a contact dialog with phone/email links.
- Local, optimized WebP hero assets and the supplied catalogue PDF.
- White certifications section with ISO 9001:2015, ISO 14001:2015, ISO 45001:2018 and the original MSEDCL/Mahavitaran logo; four columns on desktop and two on mobile. ISO ring lettering uses vector outlines for reliable rendering.
- About Us section with source-based company copy, three AI-enhanced official gallery photos, a Know More link, and responsive photo cards matching the supplied reference.
- Product Range section with CT, PT and metering cubicle cards, original transparent company product photos, category links and an Explore All Products button.
- Custom-transformer CTA banner with Know More and Request Custom Design actions, followed by four source-based capability figures. The request button opens the same contact dialog as the navbar.
- Our expo journey section with four original source photos, a navy/blue background with orange accents, staggered photo cards, a keyboard-accessible photo viewer and a contact-dialog CTA.
- Quality & Commitment section with a real company workshop photo, dark navy background, circular image, four quality-principle cards and a link to the published quality policy.
- Client section with 14 original company-listed logos in two seamless rows moving in opposite directions, large grayscale logos without captions, automatic pause only while hovering an actual logo (with colour on hover), keyboard-focus pause, and static scrollable rows for reduced-motion preferences.
- Blog section after Quality & Commitment with three illustrated cards and complete static article pages covering CT/PT basics, indoor/outdoor applications and enquiry planning. Article pages include further reading and related articles.
- FAQ section after the blog with six native, keyboard-accessible expandable answers, links to products, articles and the catalogue, plus a team-contact CTA. The first answer is open initially; supported browsers keep one answer open at a time.
- Closing CTA and four-column navy footer with orange accents, local navigation, product links, catalogue download, linked email/phone, office address, back-to-top control and a large decorative AMITYTRANS wordmark. Start an enquiry opens the existing contact dialog. Tablet and mobile layouts rearrange the columns.
- A slideshow pause/play control and product/enquiry actions in the hero.
- Reduced-motion preferences disable autoplay and minimize transition effects.

The navbar, hero, certifications, About Us, Product Range, custom-design CTA, capability figures, Our expo journey, Our Clients, Quality & Commitment, blog and FAQ are implemented. About Us and Our Products in the navbar scroll to their local sections. Product categories and Gallery are explored locally. The published quality policy link opens the official company website in a new tab. Catalogue links open the supplied PDF. Contact channels are provisional details recorded in the research brief. No enquiry form/backend is included.

All site assets are in `dist/assets`. See `ASSET_SOURCES.md` for image provenance and generation prompts. Review `../AMITY_TRANSCO_WEBSITE_REFERENCE.md` for the source facts and unresolved company details.

## Interactive design update

- `dist/experience.css` adds the engineering linework, blueprint rings, dot grids, soft gradients, compact trust band and product explorer layout.
- `dist/experience.js` adds section-aware navigation, keyboard-accessible CT/PT/metering tabs, category deep links, product-specific email subjects and once-only scroll reveals.
- Product search opens local categories. Gallery navigation leads to the local expo section; original expo photos retain their full-screen viewer.
- Certification and quality details use native disclosures. Product categories stay readable if JavaScript or IntersectionObserver is unavailable.
- Existing two-paragraph About Us copy, entry-triggered counters and the reduced closing CTA spacing are retained.
- Interaction QA: `node .sites-runtime/qa/verify-experience.cjs` (requires the ignored local jsdom QA install). This checks DOM behaviour; visual browser QA is a separate step.
