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

## Contrast must hold in every interactive state, not just at rest

Ported from the portfolio repo's CLAUDE.md after the same bug shape was
found live here on 2026-08-15, not just theorised: the global
`a:hover { color: var(--accent); }` rule (`assets/styles.css`) has
higher specificity than `.button--primary`'s own colour rule, so on
hover — and on `:active`, since a real click always co-occurs with
hover — `.button--primary`'s text colour silently flipped to
`var(--accent)`, which is *also* its background colour. Measured
directly in a live headless Chrome, not eyeballed: default state is a
clean 5.49:1; hovered or active, the computed foreground/background
pair is identical, 1.00:1 — the "View live dashboard" button's label
disappears completely for any mouse user who hovers or clicks it.
`check:a11y` never caught this because axe-core only audits the DOM's
resting state; no check here ever drove real `:hover`/`:active` and
re-measured.

**Whenever button, link or control styling changes, check contrast in
every state — default, `:hover`, `:focus-visible`, `:active` — by
measurement, not by eye.** The portfolio repo's
`scripts/check-contrast-states.mjs` does this for its own interactive
elements by real mouse-hover and keyboard-focus in a live browser; this
repo has no equivalent yet, so until one exists here, re-verify by hand
(a real WebDriver `actions().move({origin: el}).perform()`, not a
static CSS read) after any change that touches `.button--primary`,
`.button--secondary`, `.site-header__back`, `.site-header__nav a`, or
any future interactive element — a generic `a:hover`/`a:focus-visible`
rule sitting above more specific component rules is exactly the shape
that hides this class of bug from a static review.

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

## A skip list is a coverage hole — every entry needs a stated reason and the narrowest possible pattern

Ported from the portfolio repo's CLAUDE.md, which documented the first
instance of this bug shape (an unanchored `gabrielaoliveranz\.github\.io`
`check:links` skip that silently swallowed a real cross-repo link). This
repo has now hit the same shape twice on its own:

1. When `check:links` was first added here, its self-reference skip was
   the same unanchored `gabrielaoliveranz\.github\.io` pattern — matching
   the *entire* domain, not just this repo's own canonical/OG paths on it.
2. When the canonical URL moved to `gabrielaolivera.nz` (commit `0e2ca2c`),
   that commit's own message says it "narrows check:links' self-reference
   --skip pattern to match" — but the pattern was only swapped to
   `gabrielaolivera\.nz`, still unanchored, still matching the entire
   domain, not actually narrowed at all. It went uncaught because nothing
   in this repo linked *out* to that domain yet, so there was nothing for
   the too-wide pattern to hide.
3. On 2026-08-15, adding this page's own "back to portfolio" link
   (`https://gabrielaolivera.nz/`) gave the pattern something real to
   hide — and it would have: that new outbound link matched the same
   unanchored `gabrielaolivera\.nz` skip and would have gone unchecked by
   default. Caught only by deliberately re-running `check:links` and
   reading its actual output line-by-line instead of trusting a green
   `npm run check`. Fixed by anchoring the pattern to
   `gabrielaolivera\.nz/terroir-case-study` — the only paths this repo
   actually self-references (its own canonical, og:image, twitter:image,
   and 404.html canonical) — so a future outbound link to the bare domain,
   or to any other path on it, is checked like any other link.

**Every `--skip` entry needs its own stated reason, and a pattern no
wider than that reason requires.** When a URL or domain is skipped
because *this repo* self-references it, anchor the pattern to the exact
self-referencing path(s) — never the bare domain — so an unrelated
outbound link to the same domain can't ride along unchecked.

## Line endings are the repo's problem, not core.autocrlf's

Not yet an incident here, but the same latent risk the portfolio repo
found and hardened against applies unchanged: every committed text file
is LF, but on Windows Git only converts that to CRLF-on-checkout /
LF-on-commit if `core.autocrlf` is set — and that setting lives in the
machine's git config, not the repo. Checked directly on 2026-08-15, not
assumed: this machine has `core.autocrlf=true` globally, and every
tracked text file in this working tree (`assets/styles.css`, `index.html`,
etc.) is CRLF on disk — which has worked cleanly so far only because this
machine's config happens to convert it back to LF on commit. This repo
has no `.gitattributes`, unlike the portfolio repo's `* text=auto eol=lf`
(with true binaries — `.woff2`, `.webp`, `.ico` — marked `binary`
explicitly). Clone this repo somewhere with a different `core.autocrlf`
— a teammate's default, a different tool, a CI image — and nothing here
would stop a CRLF checkout from turning into a same-content,
every-line-"modified" diff on the next edit, destroying `git blame` on
that file if committed.

**If this repo ever gets a `.gitattributes` added, verify it's a pure
hardening change before trusting it**: `git add --renormalize .`
immediately after adding the file should stage zero content changes if
every already-committed blob already matches what the new rules would
produce — confirm that, don't assume it.
