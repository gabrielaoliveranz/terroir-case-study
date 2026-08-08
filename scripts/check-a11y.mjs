// Runs axe-core against a local static server, then shuts the server
// down cleanly. Runs http-server in-process via its own API instead of
// spawning it as a subprocess: spawning + killing a subprocess tree on
// Windows needs either wmic.exe (removed from current Windows builds,
// which is what start-server-and-test/tree-kill depend on) or taskkill
// /T — running in-process sidesteps needing either.

import { createServer } from "http-server";
import { spawn } from "node:child_process";

const PORT = 8080;
const BASE = `http://localhost:${PORT}`;

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

const server = createServer({ root: ".", cache: -1 });
server.listen(PORT);

let exitCode = 1;
try {
  await waitForServer(`${BASE}/index.html`);
  exitCode = await new Promise((resolve) => {
    const axe = spawn(
      `npx axe ${BASE}/index.html ${BASE}/404.html --exit`,
      { stdio: "inherit", shell: true }
    );
    axe.on("close", (code) => resolve(code ?? 1));
  });
} finally {
  server.close();
}

process.exit(exitCode);
