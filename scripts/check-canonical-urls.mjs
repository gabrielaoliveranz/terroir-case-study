// Fails if the page's canonical URL has drifted between any of the places
// it's repeated: index.html's own <link rel="canonical">, its og:url,
// og:image and twitter:image tags, and 404.html's <link rel="canonical">.
// There's no build step tying these together, so each is a hand-maintained
// copy of the same fact — exactly the kind of thing that goes stale
// silently. Ported from the portfolio repo's scripts/check-canonical-urls.mjs
// (same idea, adapted here: this repo has no sitemap.xml or robots.txt, so
// five copies instead of seven).
//
// index.html's <link rel="canonical"> is treated as the one source of
// truth; every other value is checked against what it implies. On a
// mismatch, the failure names the exact file and tag involved, and shows
// both the expected and actual value — not just that something disagrees.

import { readFileSync } from "node:fs";

function extract(source, label, re) {
  const match = source.match(re);
  if (!match) throw new Error(`Could not find ${label}`);
  return match[1];
}

function main() {
  const indexHtml = readFileSync("index.html", "utf8");
  const notFoundHtml = readFileSync("404.html", "utf8");

  // Source of truth.
  const origin = extract(indexHtml, "index.html <link rel=\"canonical\">", /<link rel="canonical" href="([^"]+)">/);

  const actual = {
    'index.html <link rel="canonical">': origin, // trivially itself; parsed above to prove it exists
    'index.html <meta property="og:url">': extract(indexHtml, 'index.html og:url', /<meta property="og:url" content="([^"]+)">/),
    'index.html <meta property="og:image">': extract(indexHtml, 'index.html og:image', /<meta property="og:image" content="([^"]+)">/),
    'index.html <meta name="twitter:image">': extract(indexHtml, 'index.html twitter:image', /<meta name="twitter:image" content="([^"]+)">/),
    '404.html <link rel="canonical">': extract(notFoundHtml, '404.html canonical', /<link rel="canonical" href="([^"]+)">/),
  };

  const expected = {
    'index.html <link rel="canonical">': origin,
    'index.html <meta property="og:url">': origin,
    'index.html <meta property="og:image">': `${origin}assets/images/og-card.png`,
    'index.html <meta name="twitter:image">': `${origin}assets/images/og-card.png`,
    '404.html <link rel="canonical">': `${origin}404.html`,
  };

  let failed = false;
  for (const key of Object.keys(expected)) {
    if (actual[key] === expected[key]) {
      console.log(`OK    ${key}: ${actual[key]}`);
    } else {
      failed = true;
      console.error(`FAIL  ${key}`);
      console.error(`      expected: ${expected[key]}`);
      console.error(`      actual:   ${actual[key]}`);
    }
  }

  if (failed) {
    console.error(
      "\nOne or more URLs have drifted from index.html's <link rel=\"canonical\">. " +
        "If this is an intentional domain move, update all five together."
    );
  }

  process.exit(failed ? 1 : 0);
}

main();
