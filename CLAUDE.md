# Terroir Case Study — working conventions

This repo is the narrated case study for Terroir. The analysis itself
lives in `horticultural-land-suitability-nz`; this repo presents it.

## This page is served under the portfolio's custom domain, not its own

This is a GitHub Pages *project* site (`gabrielaoliveranz.github.io/terroir-case-study/`),
not a user/root site — it has no CNAME of its own. When the portfolio
repo (`gabrielaoliveranz.github.io`, the user/root page) configured its
own custom domain (`gabrielaolivera.nz`), GitHub Pages started
redirecting the **entire `gabrielaoliveranz.github.io` hostname** —
including this project's path — to the equivalent path under that
custom domain. That's not a per-repo setting; it's how GitHub Pages
handles a custom domain on the user/root site, and it applies whether
or not this repo does anything about it.

Verified 2026-08-13: `https://gabrielaoliveranz.github.io/terroir-case-study/`
now 301s to `https://gabrielaolivera.nz/terroir-case-study/`, which
serves this page's real content. Because a canonical URL that points at
a redirect tells search engines the authoritative copy lives at the far
end of that redirect — which then bounces right back — `index.html`'s
canonical, `og:url`, `og:image` and `twitter:image`, and `404.html`'s
canonical were all migrated to `https://gabrielaolivera.nz/terroir-case-study/`
in the same change. **If the portfolio's custom domain ever changes
again, or moves off GitHub Pages, this repo's five copies need to move
with it** — nothing here will fail loudly if they don't; the page just
quietly starts pointing at a version of itself that redirects.

**This is enforced, not just documented:** `npm run check:canonical`
(`scripts/check-canonical-urls.mjs`, wired into `npm run check` and CI
— ported from the portfolio repo's own script of the same name, adapted
here since this repo has no `sitemap.xml` or `robots.txt`) treats
`index.html`'s `<link rel="canonical">` as the source of truth and
fails naming the exact file and tag if any of the other four disagree.
Verified against a real mismatch before being trusted: temporarily
pointing `404.html`'s canonical at the wrong path made it fail with the
exact file, the expected value and the actual value named, then it was
reverted clean.

## Figures are quoted, not owned

Every number on this page — 22,834 parcels, 21,491 scored, 76.4%
Excellent, and any figure added later — is copied from Terroir's
pipeline output. This repo is downstream: it can go stale silently when
the upstream analysis changes, and no rule in the Terroir repo reaches
across to catch it.

So: whenever a figure here is added or edited, name its source in an
HTML comment beside it — the table or script in Terroir it came from.
And whenever Terroir's reported figures change, re-check every number
on this page in the same session, before considering that change done.

## Hand-written, semantic HTML — never a bundled export

This page was originally a single 666KB export from a visual design
tool: content injected at runtime by JavaScript, `<title>Bundled
Page</title>`, no `lang` attribute, no meta description, 151 `<div>`s
and zero semantic elements. That made the case study invisible to search
engines, gave every shared link an empty preview, and left screen-reader
users with no landmarks to navigate by.

Content belongs in the HTML source, not injected by script. Use real
semantic elements (`<main>`, `<header>`, `<section>`, `<article>`,
`<footer>`), keep the heading hierarchy unbroken, and never re-introduce
a bundled export.

## Accessibility is claimed, so it must hold

Terroir's README states that a WCAG contrast audit and a
deuteranopia/protanopia simulation were run on the dashboard. A case
study that fails basic accessibility while advertising that work
undermines the claim.

Required on every change: `lang="en-NZ"` on `<html>`, an `alt` on every
image (empty `alt=""` only for genuinely decorative ones), visible focus
states on links, and text contrast meeting WCAG AA.

No horizontal overflow at any viewport width from 320px up — verified by
measurement (`document.documentElement.scrollWidth` against `clientWidth`
at 320/390/768px, `npm run check:overflow`), never by eye. A flex or grid
item's default `min-width: auto` refuses to shrink below its own content's
min-content width, so a row can overflow a narrow viewport with nothing in
the CSS looking obviously wrong; `min-width: 0` / `minmax(0, 1fr)` on any
new flex/grid column that holds text or a percentage-style label, and
`overflow-wrap` on any new heading/paragraph inside one, is the standing
default — not something to add only after a check fails.

## Head and link previews

`<title>`, `<meta name="description">` and Open Graph / Twitter card
tags are part of the deliverable, not an afterthought — this page exists
to be shared with recruiters and collaborators. After any change to the
page's framing or headline claims, confirm the title and description
still describe it accurately.

## Checks run automatically

A static page has no pytest suite, but it has checkable properties:
valid HTML, working links, and passing accessibility audits. These run
in CI on every push. A dead link on a portfolio page is its most visible
failure mode — never let the checks go red.

## Spelling convention (en-NZ)

en-NZ spelling throughout, matching the Terroir repo: colour, behaviour,
organise, analyse, centre, licence as a noun, catalogue, modelling.
Before marking any copy change done, grep for the common US patterns
(`-ize`, `-or`, `-er`, `-yze`) and fix what you find.
