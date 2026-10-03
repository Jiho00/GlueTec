# GlueTec

GlueTec's public company website. A static, responsive site for molecular glue discovery, DNA-encoded library screening, and LAB OS research software.

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
- `script.js`: science stages, accessible LAB OS tabs, motion preference, and chapter navigation.
- `assets/`: original deck logo source, generated hero artwork, and favicon.

All asset URLs are relative, so the site also works under a GitHub Pages repository path.

## Content and design

Company information comes from the user-supplied May 2026 GlueTec ideation deck. This website uses the scientific direction and listed team without reproducing internal financial, competitor, funding, or spin-off discussions. Scientific reading links are the DOI references supplied in the deck. References are supporting research, not a claim of GlueTec ownership or product approval.

LAB OS is presented as in development. Its product concept reflects the existing research workspace: linked projects, molecules, experiments, and datasets. The walkthrough is an interactive marketing illustration, not the LAB OS application. Software subscriptions describe an intended business model, not currently available paid plans. There is no checkout, account system, or signup form.

The contact link points to Jiho Lee's GitHub profile until a public company email or product URL is supplied. Replace it in the `connect` section when ready.

The visual direction takes inspiration from [The Shape of Intelligence](https://shapeofintelligence.com/): oversized editorial typography, a conceptual sculpture, chapter navigation, and restrained motion. No code, text, or artwork has been copied from that website.

## Artwork

`assets/brand-source.png` is the original logo asset extracted without modification from the supplied deck. The header displays its black logo variant using a CSS crop.

`assets/molecular-connection.png` is original artwork generated with the built-in imagegen tool. Prompt: “Abstract premium 3D molecular glue sculpture: two matte ivory folded protein forms joined by a luminous acid-chartreuse connector, soft studio lighting, charcoal accents, centered horizontal 3:2 composition, transparent background, no text or logos.” It is conceptual artwork and does not depict a specific experimentally determined protein complex.

## Verification

Check JavaScript syntax with `node --check script.js`. Verify desktop and mobile layouts, the science stage controls, LAB OS mouse and keyboard tab navigation, reading disclosure, chapter menu, and reduced-motion behavior before publishing edits.
