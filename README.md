# Terroir — Case Study

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
├── CLAUDE.md              # working conventions for this repo
└── LICENSE.md
```

## Local preview

No build step — open `index.html` directly in a browser, or serve the 
folder with any static file server (e.g. `python -m http.server`).

## Live

**Case study:** https://gabrielaoliveranz.github.io/terroir-case-study/  
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