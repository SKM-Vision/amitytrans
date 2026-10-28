# Asset sources

- `dist/assets/atipl-logo.jpg`: official company logo downloaded from https://amitytrans.com/images/newlogo.jpg on 18 October 2026. Preserved as supplied.
- `dist/assets/atipl-catalogue.pdf`: unchanged copy of `../ATIPL Catlauge.pdf`, supplied by the user.
- `dist/assets/hero-power.webp` and `hero-power-mobile.webp`: illustrative hero artwork generated with the built-in ImageGen tool, then encoded to WebP with Pillow. Not a photograph of an ATIPL site.
- `dist/assets/hero-green.webp` and `hero-green-mobile.webp`: conceptual sustainability artwork generated with the built-in ImageGen tool, then encoded to WebP with Pillow. It is a visual concept, not proof of product environmental performance.
- `dist/assets/hero-generation.webp` and `hero-generation-mobile.webp`: close-up substation transformer artwork generated with the built-in ImageGen tool, then encoded to WebP with Pillow. Used for the first slide; not a photograph of an ATIPL facility or a documented ATIPL product.

The mobile variants are smaller versions of the same artwork; responsive CSS controls composition. Artwork contains no embedded headings, third-party trademarks or approval badges. All typography and controls are HTML/CSS.

## Final generation prompts

### Power generation (opening slide)

Use case: ads-marketing. Asset type: full-bleed website hero background for an Indian instrument transformer manufacturer. Create an ultra-wide 16:9 cinematic photorealistic photograph inspired by close-up electrical substation transformer equipment: a sharply focused large dark brown ribbed porcelain bushing and robust gray-blue metal instrument transformer housing in the RIGHT half, with more porcelain bushings and instrument transformer units receding into beautiful shallow depth-of-field in an outdoor substation. Cool deep blue/teal industrial color grading, a warm orange sunset rim light and softly glowing amber bokeh between the equipment. Premium engineering advertising photography, believable hardware, elegant strong silhouettes, crisp ceramic texture and realistic metal fasteners. Leave the entire LEFT half relatively uncluttered, darker and softly defocused to support a white and orange HTML heading. Keep main equipment on right but inset enough for mobile cropping. This is illustrative industrial brand artwork, not an actual factory or an identified company product. Image only: absolutely no text, no lettering, no logos, no watermarks, no UI or badges. Do not reproduce the reference site's branding.

### Power

Create a cinematic photorealistic background photograph for an electrical transformer manufacturer's website hero, ultra-wide 16:9 landscape. Power transmission pylons and a modern electrical substation above a distant illuminated Indian city at blue hour; dramatic deep navy sky, cool blue light trails conveying energy, restrained warm orange-red light accents. Tall lattice transmission tower prominently on right half, smaller towers receding into distance; keep center-left relatively uncluttered and dark for large white heading overlay. Premium industrial advertising photography, believable cables and electrical infrastructure, crisp sophisticated atmospheric depth, no people. Image only: absolutely no text, no logos, no watermarks, no UI, no certification badges. This is illustrative brand imagery, not a photograph of any actual manufacturer's facility.

### Greener future

Create a premium photorealistic conceptual energy photograph for a transformer manufacturer's website hero, ultra-wide 16:9 landscape. A realistic clear glass incandescent lightbulb standing upright in rich soil on the right half of frame, inside the bulb a small healthy bright green seedling with two to four leaves. Beautiful soft sunlight grazing the glass, distant forest/garden with subtle green bokeh, deep dark teal/navy shadows, restrained warm amber highlights. Strong cinematic atmosphere and realistic glass refraction, sharp focus on bulb and plant, gorgeous organic soil texture. Leave the entire left half darker and relatively empty for large white heading overlay. Refined sustainability advertising photograph. Absolutely no text, no logos, no watermarks, no UI, no extra objects, no badges.

## Certifications section (22 October 2026)

- `dist/assets/iso-9001.svg`, `iso-14001.svg` and `iso-45001.svg`: locally authored matching blue ISO standard markers, following the supplied layout reference. These are generic visual markers, not seals of an identified accreditation or certification body. Standard labels follow the company website and the user's supplied reference.
- `dist/assets/msedcl-approved.png`: extracted losslessly from the JPEG image strips embedded on page 1 of the user-supplied ATIPL catalogue, preserving the supplied badge artwork.
- The company website's three certificate PDF URLs returned HTTP 404 on 22 October 2026. The section presents the requested badges without broken certificate-download links.

## Certification refinements (22 October 2026)

- ISO markers: widened the white ring and converted CERTIFIED/COMPANY lettering to vector outlines from Arial Bold, keeping all letters clear of the blue centre and independent of browser font/text-path rendering.
- `dist/assets/msedcl-logo.png`: original, unchanged transparent MSEDCL/Mahavitaran logo downloaded from https://pro.mahadiscom.in/ConsumerContact/images/mahavitaran_logo_transparent.png on the official MSEDCL consumer contact portal. This replaces the catalogue approval-stamp photo in the section.

## About Us section (22 October 2026)

Company copy is adapted from https://amitytrans.com/about.php and the supplied catalogue. The establishment date belongs to the company; the 25+ years of experience is attributed to the team. Captions describe the selected photographs rather than claiming the gallery contains a test lab or coil-winding area.

The three photographs were downloaded from the official company gallery at https://www.amitytrans.com/gallery.php and enhanced separately with the built-in ChatGPT ImageGen tool. They are AI-retouched versions of company photographs, with improved lighting, white balance and clarity; they are not untouched documentary originals. Original downloaded JPEGs are retained in `source-images/`.

| Final website asset | Original company photo | Retained original |
| --- | --- | --- |
| `dist/assets/about-outdoor.webp` | https://www.amitytrans.com/gallery%20photo/16.jpeg | `source-images/about-outdoor-original.jpeg` |
| `dist/assets/about-resin.webp` | https://www.amitytrans.com/gallery%20photo/5.jpeg | `source-images/about-resin-original.jpeg` |
| `dist/assets/about-facility.webp` | https://www.amitytrans.com/gallery%20photo/12.jpeg | `source-images/about-facility-original.jpeg` |

The enhanced outputs are encoded as local WebP assets for the website. HTML reserves image space and loads the photographs lazily.

### Final prompt: outdoor instrument transformer

Use case: lighting-weather. Asset type: portrait photograph for the About Us section of the actual Amitytrans Techno instrument transformer company. Input image 1 is the edit target, an existing real company gallery photograph. Enhance this same photograph with natural professional industrial editorial photo retouching: improve underexposed detail, balanced neutral white balance, cleaner tonal contrast, gentle clarity and sharpness, reduce JPEG noise, keep the brown porcelain and blue-grey painted metal accurate. Preserve the exact same transformer identity, shape, number of porcelain ribs, mechanical connections, terminals, nameplate, timber base and the actual warehouse background. Maintain the full portrait composition with the entire transformer visible and headroom around its top and base. Keep a believable naturally lit factory photograph. Do not invent or alter technical markings, do not add equipment, do not turn the warehouse into a different building, no new logos or lettering, no render or illustration, no heavy cinematic grade. Output one enhanced portrait photograph only.

### Final prompt: resin cast transformer lineup

Use case: lighting-weather. Asset type: landscape photograph for the About Us section of actual manufacturer Amitytrans Techno. Input image 1 is the edit target: the real factory gallery photograph of rows of reddish brown resin cast instrument transformers. Enhance this same photograph with professional natural industrial editorial retouching. Improve exposure uniformity and neutral white balance, recover highlight detail, increase modest sharpness and reduce compression artifacts. Preserve the same product geometry, actual rows and product count, brass terminals, nameplates and the same real factory floor and background. Keep the reddish brown resin realistic. Maintain this wide diagonal view of the product lineup, suitable for a landscape website image. No added equipment, no changes to specifications or labels, no fabricated facility or certification marks, no added text or logos, no illustration. Output one enhanced landscape photograph only.

### Final prompt: manufacturing facility

Use case: lighting-weather. Asset type: landscape company-facility photograph for Amitytrans Techno About Us website section. Input image 1 is the edit target: the real gallery photograph of rows of pale grey electrical cabinets on the factory floor. Enhance the same real photograph with natural professional industrial photo retouching: correct the slight camera tilt, improve exposure and balance bright highlights with interior shadows, neutral white balance, gently improve sharpness and detail and reduce JPEG noise. Preserve the exact same real building, roof structure, arrangement and number of cabinets, vents, doors, labels and all real equipment. Preserve the pallet truck and foreground materials rather than inventing a different facility. Keep a realistic clean photographic look, not a glossy CGI render. Landscape composition suitable for an image card. Do not invent technical labels, new machinery, people, logos or textual overlays. Output one enhanced landscape photograph only.

## Product Range section (22 October 2026)

The section presents CTs, PTs and metering cubicles, following the user-supplied three-card layout. Copy follows the official product categories and the supplied ATIPL catalogue, retaining the distinction between transformer HSV and metering-cubicle system voltage. It does not copy competitor voltage ranges or type-test claims.

Product photographs are original transparent company PNGs, encoded to WebP with transparency preserved. They have not been AI-redrawn. Indoor/outdoor image assignments were checked against the corresponding official category pages, all retrieved successfully on 22 October 2026.

| Website asset | Original photo | Category source / card destination |
| --- | --- | --- |
| `dist/assets/product-ct-indoor.webp` | https://amitytrans.com/images/3.png | https://amitytrans.com/ctindoor.php |
| `dist/assets/product-ct-outdoor.webp` | https://amitytrans.com/images/9.png | https://amitytrans.com/ctoutdoor.php |
| `dist/assets/product-pt-indoor.webp` | https://amitytrans.com/images/4.png | https://amitytrans.com/ptindoor.php |
| `dist/assets/product-pt-outdoor.webp` | https://amitytrans.com/images/10.png | https://amitytrans.com/ptoutdoor.php |
| `dist/assets/product-metering-cubicle.webp` | https://amitytrans.com/images/18.png | https://amitytrans.com/meteringindoor.php |

Card exploration links open the category's indoor page, whose navigation also exposes the outdoor range. Explore All Products opens https://amitytrans.com/products.php. Our Products in the demo navbar scrolls to the new local section.

## Custom-transformer banner and figures (22 October 2026)

The reference layout is adapted with the existing navy/orange brand palette, a CSS vertical-line background, two working CTA controls and a four-column capability strip (two columns on mobile). No new images or generated assets are needed.

- Custom CT/PT capabilities: https://amitytrans.com/about.php describes special CTs/PTs on demand. Know More opens that page. Request Custom Design opens the existing phone/email contact dialog; no enquiry is sent automatically.
- 145 kV maximum oil cooled range and 36 kV maximum dry type range: supplied ATIPL catalogue, pages 2?3, stated as HSV rather than system voltage.
- 25+ years: experience attributed to the team on the official About page, not the company's manufacturing age.
- Established 2016: company About page and catalogue cover.

The four figures use ATIPL source data. Facility size, HV test-lab capacity and the competitor's ratings from the supplied layout reference are not asserted for ATIPL.

## Industries & Applications (22 October 2026)

The section appears after the capability figures and covers power utilities/electricity boards, switchgear manufacturers and industrial customers. Customer categories follow the official company About page (https://amitytrans.com/about.php), which identifies utilities, electricity boards, private customers and switchgear manufacturers. Application notes describe general uses of the documented CT/PT and metering products rather than named customer projects or sector-specific approvals.

Three line icons are authored as SVG symbols in `dist/index.html`, using the site's existing stroke-icon style. No external imagery or AI-generated assets are used. Relevant-product links target the existing local CT, PT and metering-cubicle cards. Discuss Your Application opens the existing contact dialog without sending any message.

## Quality & Commitment (22 October 2026)

- `dist/assets/quality-workshop.webp`: original company photograph from https://www.amitytrans.com/gallery%20photo/2.jpeg, also listed on https://www.amitytrans.com/gallery.php. It shows staff working on instrument transformers in the actual company workshop. Downloaded original retained as `source-images/quality-workshop-original.jpeg`. The photograph is encoded to WebP without AI alteration. CSS supplies the dark background overlay and circular inset crop; both use the same asset.
- Copy and the Quality, Customer and Improve principle cards follow the quality policy and objectives on https://amitytrans.com/about.php: consistent product quality, customer requirements and continual improvement.
- The IS / IEC card refers to the standards listed in the supplied product catalogue. It does not assert a specific test-lab capacity, universal product certification or independently verified compliance percentage.
- Four white line icons are authored as SVG symbols in the existing icon library. The layout adapts the user-supplied sustainability reference to ATIPL's industrial context, navy/orange brand and documented quality commitments.
- View Our Quality Policy opens the company's About page, which contains its Quality Policy and Quality Objective sections.

## Our Clients (22 October 2026)

Fourteen logo files are downloaded from the company's official client gallery at https://amitytrans.com/clients.php and encoded as WebP under `dist/assets/clients/`, preserving the original company-supplied artwork and backgrounds. The source page was retrieved successfully on 22 October 2026. These are company-listed client references; the section does not assert current contracts, project totals or independent endorsements. No logos are AI-generated or redrawn.

| Website asset | Official company source |
| --- | --- |
| `dist/assets/clients/bhel.webp` | https://amitytrans.com/logos/BHEL.JPG |
| `dist/assets/clients/nhpc.webp` | https://amitytrans.com/logos/NHPC.JPG |
| `dist/assets/clients/nalco.webp` | https://amitytrans.com/logos/NALCO.JPG |
| `dist/assets/clients/bses.webp` | https://amitytrans.com/logos/BSES.JPG |
| `dist/assets/clients/kseb.webp` | https://amitytrans.com/logos/KSEB.JPG |
| `dist/assets/clients/wesco.webp` | https://amitytrans.com/logos/WESCO.JPG |
| `dist/assets/clients/ncl.webp` | https://amitytrans.com/logos/NCL.JPG |
| `dist/assets/clients/apdcl.webp` | https://amitytrans.com/logos/AASAM%20POWER.JPG |
| `dist/assets/clients/jkpdc.webp` | https://amitytrans.com/logos/JKPDC.JPG |
| `dist/assets/clients/pspcl.webp` | https://amitytrans.com/logos/PSPCL.JPG |
| `dist/assets/clients/mpmkvvcl.webp` | https://amitytrans.com/logos/MPMKVVCL.JPG |
| `dist/assets/clients/tpwodl.webp` | https://amitytrans.com/logos/TPOWDL.JPG |
| `dist/assets/clients/msrtc.webp` | https://amitytrans.com/logos/MSRTC.JPG |
| `dist/assets/clients/coal-india.webp` | https://amitytrans.com/logos/SouthernCOAL.JPG |

The first row moves left and the second right. Each seven-logo group has a decorative duplicate for the seamless loop, hidden from assistive technology. Logos are displayed in two spacious, full-width rows without tile borders or separate captions. Original logo colours are preserved in the assets; CSS displays them in grayscale and restores colour on logo hover. Both rows pause only while an actual logo image is hovered; blank space and section headings do not pause scrolling. Keyboard focus pauses the focused row. There is no pause button. Reduced-motion preferences show non-animated, horizontally scrollable rows with duplicates removed. Quality & Commitment follows the client section.

## Our expo journey (27 October 2026)

Four user-supplied exhibition photos selected from `source-images/` for varied people, team and booth scenes. Original content preserved; EXIF orientation applied and images resized to WebP (quality 86). No AI alteration. Event names and years are not asserted because they are not established by the supplied files.

| Website asset | Original source photo |
| --- | --- |
| `dist/assets/expo-connections.webp` | `source-images/WhatsApp Image 2026-10-24 at 11.32.06 AM.jpeg` |
| `dist/assets/expo-team.webp` | `source-images/WhatsApp Image 2026-10-24 at 11.33.17 AM.jpeg` |
| `dist/assets/expo-presentation.webp` | `source-images/WhatsApp Image 2026-10-24 at 11.33.15 AM.jpeg` |
| `dist/assets/expo-conversations.webp` | `source-images/WhatsApp Image 2026-10-24 at 11.33.24 AM.jpeg` |

## Blog & Insights (27 October 2026)

Three original editorial articles follow Quality & Commitment. The cards link to complete pages in `dist/blog/`, with source references and related reading. Technical background was checked against ABB's indoor/outdoor instrument-transformer pages and current/voltage transformer guide, Schneider Electric FAQ FA335683, and ATIPL's published product categories. The enquiry outline is an editorial planning aid, not installation guidance or model-specific ratings.

Images were created with the built-in ImageGen tool and encoded as 1200 x 800 WebP (quality 85). They are illustrative AI images, not actual ATIPL products or facilities; article captions disclose this. Generated original PNG files remain in their original tool-managed location.

| Website image | Article page |
| --- | --- |
| `dist/assets/blog-ct-vs-pt.webp` | `dist/blog/ct-vs-pt.html` |
| `dist/assets/blog-indoor-outdoor.webp` | `dist/blog/indoor-outdoor.html` |
| `dist/assets/blog-specification-guide.webp` | `dist/blog/specification-guide.html` |

### Image generation prompts

**ct-vs-pt**

Use case: photorealistic-natural. Asset type: wide 3:2 editorial blog cover for an Indian instrument-transformer manufacturer's navy, blue and orange website. Premium industrial editorial photograph, realistic equipment, soft neutral daylight with subtle warm accents, restrained colour, crisp detail and clean composition. Landscape 1536x1024. No text, labels, logos, watermarks, people, diagrams or graphic overlays. Illustrative scene, not a branded product claim. Subject: two distinct compact reddish-brown epoxy resin cast medium-voltage instrument transformers on a clean pale grey workshop bench; one block-shaped current transformer with a primary conductor opening, the other a voltage transformer with insulated primary terminal posts. Three-quarter view, tactile cast resin and metal fittings, softly blurred blue-grey electrical cabinet background. Both devices fully within frame, no cross-section, no circuit connections.

**indoor-outdoor**

Use case: photorealistic-natural. Asset type: wide 3:2 editorial blog cover for an Indian instrument-transformer manufacturer's navy, blue and orange website. Premium industrial editorial photograph, realistic equipment, soft neutral daylight with subtle warm accents, restrained colour, crisp detail and clean composition. Landscape 1536x1024. No text, labels, logos, watermarks, people, diagrams or graphic overlays. Illustrative scene, not a branded product claim. Subject: orderly outdoor medium-voltage electrical substation with brown ribbed porcelain instrument-transformer bushings and grey metal mounting bases, steel gantry structures receding in perspective, overcast bright sky. Eye-level architectural photograph with one bushing prominent in foreground and others behind. Authentic industrial scale, calm spacious scene, no dramatic lightning or glowing electricity.

**specification-guide**

Use case: photorealistic-natural. Asset type: wide 3:2 editorial blog cover for an Indian instrument-transformer manufacturer's navy, blue and orange website. Premium industrial editorial photograph, realistic equipment, soft neutral daylight with subtle warm accents, restrained colour, crisp detail and clean composition. Landscape 1536x1024. No text, labels, logos, watermarks, people, diagrams or graphic overlays. Illustrative scene, not a branded product claim. Subject: close editorial still life on a clean electrical engineering desk: a compact brown resin cast current transformer beside blank technical sheets with fine unlabelled engineering linework, a metal vernier caliper and a closed dark-blue notebook. Industrial workshop background softly out of focus, warm natural sidelight, three-quarter close-up with device sharply focused. No legible lettering, no hands, no energised wires, no invented displays.

## FAQ (27 October 2026)

Six questions cover product categories, CT/PT differences, indoor/outdoor options, custom requirements, enquiry information and the catalogue. Answers reuse the established company/product content and the technical references recorded for the blog. No new certification, price, lead-time or product-rating claims are introduced. Native details/summary elements provide disclosure controls without new JavaScript; the team CTA reuses the existing contact dialog. No new image assets are required.

### Engineering background linework

`dist/assets/engineering-lines.svg` is an original code-drawn decorative vector created for this design update. It combines circuit paths, measurement rings and a stylized transformer outline. It is decorative, contains no technical specifications, and uses no third-party imagery.
