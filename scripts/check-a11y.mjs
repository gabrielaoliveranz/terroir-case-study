// Runs axe-core against a local static server, then shuts the server
// down cleanly. Runs http-server in-process via its own API instead of
// spawning it as a subprocess: spawning + killing a subprocess tree on
// Windows needs either wmic.exe (removed from current Windows builds,
// which is what start-server-and-test/tree-kill depend on) or taskkill
// /T — running in-process sidesteps needing either.
//
// axe is pointed at an explicit Chrome + ChromeDriver pair installed by
// browser-driver-manager, rather than the npm chromedriver package plus
// whatever Chrome happens to be preinstalled: those two drift out of sync
// independently (npm resolves chromedriver's own latest version; CI images
// bump their preinstalled Chrome on their own schedule), which is exactly
// what broke this check in CI (chromedriver 151 vs. runner Chrome 150).
// browser-driver-manager downloads a matched Chrome-for-Testing +
// ChromeDriver pair and caches it, so the two versions can't disagree.

import { createServer } from "http-server";
import { spawn, spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const PORT = 8080;
const BASE = `http://localhost:${PORT}`;
const ENV_PATH = join(homedir(), ".browser-driver-manager", ".env");

function installMatchedChrome() {
  const result = spawnSync("npx browser-driver-manager install chrome", {
    stdio: "inherit",
    shell: true,
  });
  if (result.status !== 0) {
    throw new Error("browser-driver-manager failed to install a matched Chrome/ChromeDriver pair");
  }
}

function readDriverPaths() {
  const env = readFileSync(ENV_PATH, "utf8");
  const get = (key) => {
    const match = env.match(new RegExp(`^${key}="(.+)"$`, "m"));
    if (!match) throw new Error(`${key} not found in ${ENV_PATH}`);
    return match[1];
  };
  return {
    chromePath: get("CHROME_TEST_PATH"),
    chromedriverPath: get("CHROMEDRIVER_TEST_PATH"),
  };
}

function waitForServer(url, timeoutMs = 15000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const attempt = () => {
      fetch(url)
        .then(() => resolve())
        .catch((err) => {
          if (Date.now() - start > timeoutMs) {
            reject(new Error(`Server didn't respond within ${timeoutMs}ms: ${err.message}`));
          } else {
            setTimeout(attempt, 200);
          }
        });
    };
    attempt();
  });
}

installMatchedChrome();
const { chromePath, chromedriverPath } = readDriverPaths();

const server = createServer({ root: ".", cache: -1 });
server.listen(PORT);

let exitCode = 1;
try {
  await waitForServer(`${BASE}/index.html`);
  exitCode = await new Promise((resolve) => {
    // Force prefers-reduced-motion so the reveal-on-scroll opacity/transform
    // rules in styles.css (scoped to html.motion-ready) never apply: without
    // it, axe scans a single unscrolled viewport, so every [data-reveal]
    // section below the fold is still sitting at opacity:0 (text blended to
    // the exact background colour, i.e. a 1:1 contrast ratio) and every real
    // colour pairing gets buried under false color-contrast failures. This
    // makes axe see the same fully-visible DOM state a reduced-motion or
    // no-JS visitor gets, which is the only state a non-scrolling scan can
    // meaningfully audit.
    const axe = spawn(
      `npx axe ${BASE}/index.html ${BASE}/404.html --exit --chrome-path "${chromePath}" --chromedriver-path "${chromedriverPath}" --chrome-options force-prefers-reduced-motion`,
      { stdio: "inherit", shell: true }
    );
    axe.on("close", (code) => resolve(code ?? 1));
  });
} finally {
  server.close();
}

process.exit(exitCode);
