# Terroir — Case Study

[![Checks](https://github.com/gabrielaoliveranz/terroir-case-study/actions/workflows/checks.yml/badge.svg)](https://github.com/gabrielaoliveranz/terroir-case-study/actions/workflows/checks.yml)

Narrated case study for [Terroir](https://terroir.streamlit.app), a 
geospatial land-suitability analysis for Bay of Plenty kiwifruit 
horticulture.

## What this is

A single-page HTML case study covering the full project arc: business 
questions, methodology, key findings, data-quality issues found and fixed 
in the open, and known limitations. Hand-written semantic HTML, CSS, and 
a small vanilla-JS progressive enhancement — no build step, no framework, 
no bundled export.

## Structure

```
terroir-case-study/
├── index.html            # the case study
├── 404.html               # matches the main page's design
├── assets/
│   ├── styles.css
│   ├── script.js          # count-up + back-to-top only — not required for content
│   ├── favicon.svg
│   ├── fonts/              # self-hosted Archivo + Source Sans 3 (latin + latin-ext only)
│   └── images/             # dashboard screenshot, Open Graph card
├── scripts/
│   ├── check-a11y.mjs           # runs axe-core against a local static server
│   ├── check-overflow.mjs       # no horizontal overflow at 320/390/768px
│   ├── check-canonical-urls.mjs # canonical/og/twitter URLs agree
│   └── lib/                     # shared local-server + matched-Chrome setup
├── package.json            # dev-only tooling — see "Running the checks" below
├── .htmlvalidate.json
├── CLAUDE.md              # working conventions for this repo
└── LICENSE.md
```

## Local preview

No build step — open `index.html` directly in a browser, or serve the 
folder with any static file server (e.g. `python -m http.server`).

## Running the checks

A static page has no test suite, but it has checkable properties. 
Requires [Node](https://nodejs.org/):

```bash
npm install
npm run check            # all five, in order
npm run check:html       # HTML validity (html-validate) — no unclosed tags, no duplicate IDs
npm run check:links      # every internal + external link resolves (linkinator)
npm run check:a11y       # axe-core against a local static server, 0 violations required
npm run check:overflow   # no horizontal overflow at 320/390/768px
npm run check:canonical  # canonical, og:url, og:image, twitter:image and 404's canonical all agree
```

`check:links` skips `linkedin.com` (blocks automated crawlers 
regardless of headers — verified reachable by hand), 
`terroir.streamlit.app` (a free-tier Streamlit app that can take too 
long to cold-start for a link checker's timeout — same, verified by 
hand), and this repo's own `gabrielaolivera.nz/terroir-case-study` URLs 
(the canonical/OG-image/404 absolute links only resolve once this is 
actually deployed, not from a local checkout) — anchored to that path 
specifically, not the bare domain, so an outbound link to
`gabrielaolivera.nz` itself (e.g. the header/footer links back to the
portfolio) still gets checked like any other link. See CLAUDE.md, "A
skip list is a coverage hole", for why that distinction matters.

Runs automatically on every push and pull request via 
`.github/workflows/checks.yml` (see the badge above).

`no-inline-style` is turned off in `.htmlvalidate.json` — the page 
uses `style=""` for genuinely data-driven values (chart bar widths 
computed from real percentages), not layout that belongs in the 
stylesheet.

## Live

**Case study:** https://gabrielaolivera.nz/terroir-case-study/  
**Live dashboard:** https://terroir.streamlit.app  
**Source repo:** https://github.com/gabrielaoliveranz/horticultural-land-suitability-nz

## Sister project

[Apophenia](https://apophenia-nz.vercel.app) — kiwifruit export risk 
simulator. Together, the two projects cover both operational risk and 
land-level suitability for Bay of Plenty horticulture.

## Author

Gabriela Olivera · [LinkedIn](https://www.linkedin.com/in/gabriela-olivera-nz/) · 
[GitHub](https://github.com/gabrielaoliveranz)

## Licence

[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) — see 
[LICENSE.md](LICENSE.md) for the reasoning and for what it doesn't 
cover (the self-hosted Google Fonts, and the dashboard screenshot's 
underlying government data).