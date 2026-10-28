# Storage optimization

- Deployment: 5,271,839 bytes -> 3,703,297 bytes (29.8% smaller).
- Production CSS/JavaScript: five requests -> two; editable code retained in `src/`.
- Removed four unreferenced runtime images and replaced oversized JPG/PNG logos with WebP.
- Resized About Us and product images to match their display needs; kept alpha transparency. Recompression was accepted only when saving at least 15%.
- Kept the catalogue PDF, source facts, supplied original photographs, image provenance and generation prompts.
- Removed preview screenshots, obsolete deployment archives, duplicate generated PNG copies and temporary extraction/build environments.
- Git history is preserved.

## Validation

`npm test` verifies all local references, unique IDs and production asset usage; product search/tabs/enquiries; slideshow, counters and reduced motion; menu scroll locking and keyboard focus; and CSS cascading at 320, 375, 390, 430, 700, 768, 1024 and 1440 pixels. Image spot checks covered the resized logo and About Us photo. These checks do not replace rendered browser QA.

Local temporary tooling/cache removed: 280534437 bytes across 6203 files.
