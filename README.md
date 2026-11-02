# GlueTec

GlueTec's public company website. A static, responsive site for molecular glue discovery, DNA-encoded library screening, and knoted research software.

## Preview locally

No installation or build is required.

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Open http://127.0.0.1:4173.

## Publishing

GitHub Pages serves the root of the `main` branch. The intended public URL is https://jiho00.github.io/GlueTec/. Push changes to `main` to trigger deployment. `.nojekyll` keeps the static files intact.

## Edit the site

- `index.html`: company copy, sections, team, scientific reading, and contact links.
- `styles.css`: visual theme, desktop and mobile layouts, and animation.
- `script.js`: science stages, accessible knoted tabs, motion preference, and chapter navigation.
- `assets/`: original deck logo source, generated hero artwork, and favicon.

All asset URLs are relative, so the site also works under a GitHub Pages repository path.

## Content and design

Company information comes from the user-supplied May 2026 GlueTec ideation deck. This website uses the scientific direction and listed team without reproducing internal financial, competitor, funding, or spin-off discussions. Scientific reading links are the DOI references supplied in the deck. References are supporting research, not a claim of GlueTec ownership or product approval.

LAB OS has been renamed knoted. The product name, original connected wordmark, product copy and external link are verified against the existing knoted app source and its live public entry at https://gluetec-lab.jacob10040.workers.dev/. The walkthrough here remains an illustrative introduction, separate from the live application. Software subscriptions describe an intended business model, not currently available paid plans. There is no checkout, account system, or signup form.

The contact link points to Jiho Lee's GitHub profile until a public company email or product URL is supplied. Replace it in the `connect` section when ready.

The visual direction takes inspiration from [The Shape of Intelligence](https://shapeofintelligence.com/): oversized editorial typography, a conceptual sculpture, chapter navigation, and restrained motion. No code, text, or artwork has been copied from that website.

## Artwork

`assets/brand-source.png` is the original logo asset extracted without modification from the supplied deck. The header displays its black logo variant using a CSS crop.

`assets/molecular-connection.png` is original artwork generated with the built-in imagegen tool. Prompt: “Abstract premium 3D molecular glue sculpture: two matte ivory folded protein forms joined by a luminous acid-chartreuse connector, soft studio lighting, charcoal accents, centered horizontal 3:2 composition, transparent background, no text or logos.” It is conceptual artwork and does not depict a specific experimentally determined protein complex.

## Verification

Check JavaScript syntax with `node --check script.js`. Verify desktop and mobile layouts, the hero Identify / Connect / Tag / Degrade controls, knoted mouse and keyboard tab navigation, reading disclosure, chapter menu, and reduced-motion behavior before publishing edits.


## Impeccable polish

The editorial composition, original logo, scientific copy, and knoted product positioning are preserved. The polish pass improves headline tracking and artwork placement, restores all mobile navigation links through an accessible menu, increases control touch targets to at least 44px, matches tab keyboard navigation to its layout, restores focus after closing menus, and remembers the visitor's motion preference. JavaScript-free visitors can read all product panels and use navigation.

Display headings use a self-hosted Latin subset of Inter Tight from Google Fonts. The font's SIL Open Font License is included in `assets/fonts/OFL.txt`. Body text retains the existing sans-serif family. Deliberately oversized headings and chapter metadata follow the user's supplied editorial reference.

Validation includes wide desktop, intermediate, mobile, and 320px layouts; hero states; product tabs; navigation menu and Escape behavior; motion persistence; text contrast; focus and touch targets; local assets; and browser console errors.


## Website policies

`terms.html` and `privacy.html` are linked from every page’s footer. They cover the current public informational site, its illustrative knoted demo, GitHub Pages hosting, and the optional `gluetec-motion` local storage preference. No analytics, tracking cookies, forms, payment collection, or consent banner have been added. Hosting disclosures link to GitHub’s official documentation and Privacy Statement.

The current contact route remains Jiho Lee’s GitHub profile because no official public company email has been supplied. Add a private company contact channel when available, and keep policy wording synchronized with actual data handling. Confirm the legal operator’s identity and any applicable jurisdiction-specific requirements before expanding to forms or commercial services. Future knoted pilot and subscription terms must separately cover the actual product, research data, pricing, cancellation, and confidentiality.


## Molecular glue hero — 2 November 2026

The user asked to retain the original ivory sculptural protein aesthetic and apply knoted’s lime green. The hero uses three transparent cutouts edited from the original artwork using imagegen: `protein-target.webp`, `protein-effector.webp`, and `molecular-glue.webp`. WebP conversion preserves transparency and reduces the three images to about 624 KiB combined. The original artwork remains the non-JavaScript/loading fallback.

`hero-scene.js` uses self-hosted Motion 12.23.24 and Canvas 2D. The 18-second, single-play story shows DNA-tagged library candidates, removes their tags as the scene changes to molecular glue action, connects the proteins, then shows E3-mediated ubiquitin tagging, proteasome recognition, deubiquitination, unfolding/translocation and short peptide release while the E3 ligase remains. It is conceptual artwork, not a compound structure, experimentally established complex, atomistic simulation, or efficacy claim. DNA tags belong to the discovery-library scene, not the final degrading complex.

Identify / Connect / Tag / Degrade provide keyboard-accessible state selection. Playback can pause, resume and replay. The OS reduced-motion preference always stops spatial autoplay; the site's existing Motion off setting also stops playback. With motion off, users can select still states. Animation pauses when offscreen or the page is hidden and does not run an idle render loop. Failed image/module loading leaves the original artwork and site content readable.

The runtime is bundled locally in `assets/vendor/motion.js`; no CDN, tracking, or new browser storage is used. Vendor MIT license notices are supplied beside it. Build source for the bundle is `scripts/motion-entry.js`; an ordinary static server still previews the site without installing anything.


## Ubiquitin–proteasome refinement

The user rejected square image-tile fragmentation. That renderer and its tile grid are removed. The target now receives a conceptual ubiquitin chain; the chain is released for recycling as the target unfolds into a continuous polypeptide, enters a proteasome, and emerges as short peptide curves. `assets/proteasome.webp` is an original imagegen sculpture matching the approved ivory material. DNA remains attached only to discovery-library small molecules. E1/E2 transfer chemistry and ATP-driven conformational steps are simplified; the artwork is explanatory, not a structural model. The supporting primary reference is Dong et al., Nature (2019), DOI 10.1038/s41586-018-0736-4, https://pmc.ncbi.nlm.nih.gov/articles/PMC6370054/.

The old circular target/effector widget, its stage handlers and unused styles are removed from the science section. The discovery platform workflow and scientific reading remain.


## Link sharing

`assets/gluetec-share-20261102.png` is the 1200 × 630 opaque PNG preview for company links. It uses the original GlueTec logo, self-hosted Inter Tight, the approved ivory proteins, lime molecular glue and knoted wordmark. `assets/share-card-source.html` is the fixed-size, noindex composition used to render it. The PNG is encoded as PNG, rather than merely having a PNG filename. The homepage and both policy pages have absolute Open Graph image URLs, dimensions, alt text, canonical URLs and Twitter/X large-image card metadata. Social platform cache refreshes are controlled by those platforms.
