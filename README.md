# ATIPL navbar and hero demo

Plain HTML, CSS and JavaScript, with no build step or framework.

Open `dist/index.html` directly, or serve the `dist` directory:

```powershell
python -m http.server 4173 --directory dist
```

Then visit http://localhost:4173.

## Included

- Floating white pill navigation using the official company logo and catalogue-inspired orange/blue palette, smoothly expanding into a fixed full-width header after scrolling.
- Three hero slides in order: "Transformers For Power Generation," "Transformers For Power Protection" and "Transformers For Greener Future."
- Previous/next controls, slide selection, 2.5-second autoplay, swipe and arrow-key navigation.
- Autoplay continues on mouse hover and clicks. It pauses for visible keyboard focus, an open dialog, or a hidden tab. Reduced-motion preferences start the slideshow paused.
- Responsive mobile navigation, product search and a contact dialog with phone/email links.
- Local, optimized WebP hero assets and the supplied catalogue PDF.
- White certifications section with ISO 9001:2015, ISO 14001:2015, ISO 45001:2018 and the original MSEDCL/Mahavitaran logo; four columns on desktop and two on mobile. ISO ring lettering uses vector outlines for reliable rendering.
- No pause button or hero team-contact block.
- Reduced-motion preferences disable autoplay and minimize transition effects.

The navbar, hero and certifications section are implemented. About, products and gallery open the existing official website in a new tab; catalogue links open the supplied PDF. Contact channels are provisional details recorded in the research brief. No enquiry form/backend is included.

All site assets are in `dist/assets`. See `ASSET_SOURCES.md` for image provenance and generation prompts. Review `../AMITY_TRANSCO_WEBSITE_REFERENCE.md` for the source facts and unresolved company details.
