#!/usr/bin/env node
// Verifies the packed @hustradio/unitary-ui tarball inside a real Next.js App
// Router application: server-component import, client hydration/interaction,
// route error boundary, and absence of hydration mismatches.
//
// The application itself lives in tests/fixtures/next-app-router and is copied
// into an OS temp directory, so no node_modules or .next output enters the repo.

import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { cpSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, realpathSync, rmSync, writeFileSync } from "node:fs";
import { createServer } from "node:net";
import os from "node:os";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";

import { pnpmCommand, runConsumerCommand } from "./lib/docs-package-consumer.mjs";

const root = path.resolve(import.meta.dirname, "..");
const manifest = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));
const fixture = path.join(root, "tests/fixtures/next-app-router");
const output = path.join(root, ".scratch/next-app-router");
mkdirSync(output, { recursive: true });

const versionOf = (name) =>
  JSON.parse(readFileSync(path.join(root, "node_modules", name, "package.json"), "utf8")).version;

const freePort = () =>
  new Promise((resolve, reject) => {
    const server = createServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
  });

function start(command, args, cwd, environment = {}) {
  const child = spawn(command, args, {
    cwd,
    env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1", NODE_ENV: "production", ...environment },
    stdio: ["ignore", "pipe", "pipe"],
    detached: process.platform !== "win32",
  });
  let log = "";
  const collect = (data) => {
    log += data;
    if (log.length > 8 * 1024 * 1024) log = log.slice(-4 * 1024 * 1024);
  };
  child.stdout.on("data", collect);
  child.stderr.on("data", collect);
  const exited = new Promise((resolve) => child.once("close", (code, signal) => resolve(code ?? signal)));
  const stop = () => {
    if (child.exitCode !== null || child.signalCode !== null) return;
    try {
      if (process.platform === "win32") child.kill();
      else process.kill(-child.pid, "SIGTERM");
    } catch (error) {
      if (error.code !== "ESRCH") throw error;
    }
  };
  return { child, exited, stop, log: () => log };
}

async function waitForServer(url, instance, timeoutMs = 90_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (instance.child.exitCode !== null) break;
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(5_000) });
      if (response.ok) return;
    } catch {
      // Server is still booting.
    }
    await delay(300);
  }
  throw new Error(`Next server did not become ready: ${url}\n${instance.log()}`);
}

const pnpm = pnpmCommand();
const tempParent = realpathSync(os.tmpdir());
const consumer = mkdtempSync(path.join(tempParent, "unitary-next-app-router-"));
let server;
let browser;
try {
  const filename = `hustradio-unitary-ui-${manifest.version}.tgz`;
  const tarball = path.join(output, filename);
  console.log("Packing the library artifact...");
  await runConsumerCommand(
    pnpm[0],
    [...pnpm.slice(1), "--config.ignore-scripts=true", "pack", "--json", "--out", tarball],
    root,
  );

  console.log(`Staging the fixture in ${consumer}...`);
  cpSync(fixture, consumer, { recursive: true });
  writeFileSync(
    path.join(consumer, "package.json"),
    `${JSON.stringify(
      {
        name: "@hustradio/unitary-ui-next-app-router-fixture",
        version: "0.0.0",
        private: true,
        type: "module",
        scripts: { build: "next build", start: "next start" },
        dependencies: {
          [manifest.name]: `file:${tarball.replaceAll("\\", "/")}`,
          next: versionOf("next"),
          react: versionOf("react"),
          "react-dom": versionOf("react-dom"),
        },
        devDependencies: {
          typescript: versionOf("typescript"),
          // Next 15 在 "Checking validity of types" 阶段要求 @types/node；缺它会直接
          // 以 "you do not have the required package(s) installed" 中止构建。
          "@types/node": versionOf("@types/node"),
          "@types/react": versionOf("@types/react"),
          "@types/react-dom": versionOf("@types/react-dom"),
        },
      },
      null,
      2,
    )}\n`,
  );

  console.log("Installing the tarball into the Next application...");
  await runConsumerCommand(
    pnpm[0],
    [
      ...pnpm.slice(1),
      "install",
      "--ignore-workspace",
      "--ignore-scripts",
      "--prefer-offline",
      "--config.manage-package-manager-versions=false",
    ],
    consumer,
  );
  const installed = JSON.parse(
    readFileSync(path.join(consumer, "node_modules", manifest.name, "package.json"), "utf8"),
  );
  assert.equal(installed.version, manifest.version, "Next fixture installed a different package version");

  const nextBin = path.join(consumer, "node_modules/next/dist/bin/next");
  // Windows: Next's build-trace stream can abort the build with EPERM (see the guard).
  const guard = path.join(root, "scripts/lib/next-build-trace-guard.cjs").replaceAll("\\", "/");
  const nodeOptions = [process.env.NODE_OPTIONS, `--require "${guard}"`].filter(Boolean).join(" ");
  console.log("Running next build...");
  const buildLog = await runConsumerCommand(process.execPath, [nextBin, "build"], consumer, {
    NEXT_TELEMETRY_DISABLED: "1",
    NODE_OPTIONS: nodeOptions,
  });
  console.log(buildLog.trim().split("\n").slice(-12).join("\n"));
  const appChunks = readdirSync(path.join(consumer, ".next/static/chunks/app"));
  for (const boundary of ["error", "global-error"])
    assert.ok(
      appChunks.some((name) => name.startsWith(`${boundary}-`) && name.endsWith(".js")),
      `next build did not emit the ${boundary} boundary chunk`,
    );

  const port = await freePort();
  const base = `http://127.0.0.1:${port}`;
  console.log(`Running next start on ${base}...`);
  server = start(process.execPath, [nextBin, "start", "-H", "127.0.0.1", "-p", String(port)], consumer, {
    NODE_OPTIONS: nodeOptions,
  });
  await waitForServer(base, server);

  // 1. Server HTML: the server component imports the package root entry and the
  //    client component is pre-rendered with its initial state.
  const home = await fetch(base);
  assert.equal(home.status, 200, "The App Router page did not respond with 200");
  const html = await home.text();
  for (const expected of [
    "Unitary Next.js App Router fixture",
    "server-badge",
    "This empty state is rendered by a server component.",
    'data-testid="next-client-count">0<',
    'data-testid="next-client-button"',
  ])
    assert.ok(html.includes(expected), `Server HTML is missing: ${expected}`);
  assert.ok(!/Hydration|did not match/i.test(html), "Server HTML contains a hydration diagnostic");
  console.log(`Server HTML assertions passed (${html.length} bytes).`);

  // 2. Browser: hydration without mismatch and a working client boundary.
  const { chromium } = await import("@playwright/test");
  browser = await chromium.launch();
  const page = await browser.newPage();
  const problems = [];
  page.on("console", (message) => {
    if (message.type() === "error" || message.type() === "warning") problems.push(`${message.type()}: ${message.text()}`);
  });
  page.on("pageerror", (error) => problems.push(`pageerror: ${error.message}`));
  await page.goto(base, { waitUntil: "networkidle" });
  const count = page.getByTestId("next-client-count");
  assert.equal((await count.textContent())?.trim(), "0", "Initial client count was not server-rendered as 0");
  await page.getByTestId("next-client-button").click();
  await page.waitForFunction(
    () => document.querySelector('[data-testid="next-client-count"]')?.textContent?.trim() === "1",
    undefined,
    { timeout: 10_000 },
  );
  const hydration = problems.filter((problem) => /hydrat|did not match|server rendered/i.test(problem));
  assert.deepEqual(hydration, [], `Hydration diagnostics were reported:\n${hydration.join("\n")}`);
  assert.deepEqual(
    problems.filter((problem) => problem.startsWith("pageerror:")),
    [],
    `Uncaught page errors were reported:\n${problems.join("\n")}`,
  );
  console.log("Hydration and client interaction assertions passed (count 0 -> 1).");

  // The layout imports @hustradio/unitary-ui/styles.css from the tarball.
  const styleSheets = await page.evaluate(() => document.styleSheets.length);
  assert.ok(styleSheets > 0, "The package stylesheet was not applied");
  console.log(`Package stylesheet assertions passed (${styleSheets} style sheets).`);

  // 3. Route error boundary: /broken throws during render; app/error.tsx renders ErrorCard.
  //    React error boundaries never run during SSR, so the fallback is verified in the browser.
  const broken = await fetch(`${base}/broken`);
  const brokenHtml = await broken.text();
  assert.ok(broken.status >= 500, `A failing server render must not answer 200 (got ${broken.status})`);
  assert.ok(
    !brokenHtml.includes("next-error-card"),
    "The App Router error boundary must not be server-rendered into the HTML",
  );
  console.log(`GET /broken -> ${broken.status}, ${brokenHtml.length} bytes, fallback rendered on the client.`);
  const page2 = await browser.newPage();
  await page2.goto(`${base}/broken`, { waitUntil: "networkidle" });
  const errorCard = page2.getByTestId("next-error-card");
  await errorCard.waitFor({ state: "visible", timeout: 20_000 });
  assert.match(await errorCard.textContent(), /Something went wrong/, "The route error boundary did not render ErrorCard");
  await page2.getByTestId("next-error-reset").waitFor({ state: "visible" });
  console.log("Error boundary assertions passed (app/error.tsx rendered ErrorCard in the browser).");

  console.log("Next App Router verification passed.");
} finally {
  if (browser) await browser.close().catch(() => {});
  if (server) {
    server.stop();
    await Promise.race([server.exited, delay(10_000)]).catch(() => {});
  }
  assert.equal(path.dirname(consumer), tempParent);
  assert.ok(path.basename(consumer).startsWith("unitary-next-app-router-"));
  rmSync(consumer, { recursive: true, force: true });
}
