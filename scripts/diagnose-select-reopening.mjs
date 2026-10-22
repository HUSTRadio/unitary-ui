import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { SourceMap } from "node:module";
import { pathToFileURL, fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import { startDocsPreview } from "./lib/docs-preview.mjs";
import { installSelectReopeningProbe, attributeReopeningTasks } from "./lib/select-reopening.mjs";
import { withPackageLock } from "./lib/package-script-lock.mjs";

export function mappedCpuFrames(profile, maps) {
  const durations = new Map();
  for (const [index, sample] of (profile.samples ?? []).entries()) durations.set(sample, (durations.get(sample) ?? 0) + (profile.timeDeltas?.[index] ?? 0));
  return profile.nodes.map(node => {
    const frame = node.callFrame, original = maps.get(frame.url)?.findEntry(frame.lineNumber, frame.columnNumber);
    return { function: frame.functionName, url: frame.url, line: frame.lineNumber, column: frame.columnNumber,
      original, selfMs: (durations.get(node.id) ?? 0) / 1000 };
  }).filter(frame => frame.selfMs > 0).sort((a, b) => b.selfMs - a.selfMs);
}

export async function diagnoseSelect({ artifact, output = ".scratch/select-reopening", textures = ["solid", "aero", "glass"], cycles = 12 }) {
  if (!Number.isInteger(cycles) || cycles < 2 || !textures.length || new Set(textures).size !== textures.length
    || textures.some(value => !["solid", "aero", "glass"].includes(value))) throw Error("Invalid diagnostic conditions");
  const run = path.resolve(output, `${new Date().toISOString().replaceAll(/[:.]/g, "-")}-${crypto.randomBytes(3).toString("hex")}`);
  await fs.mkdir(run, { recursive: true });
  const preview = await startDocsPreview(path.resolve(artifact)), results = [];
  const hashes = {};
  async function hashDirectory(relative = "") {
    for (const entry of await fs.readdir(path.join(artifact, relative), { withFileTypes: true })) {
      const name = path.join(relative, entry.name);
      if (entry.isDirectory()) await hashDirectory(name);
      else hashes[name.replaceAll("\\", "/")] = crypto.createHash("sha256").update(await fs.readFile(path.join(artifact, name))).digest("hex");
    }
  }
  try {
    await hashDirectory();
    await fs.writeFile(path.join(run, "manifest.json"), JSON.stringify({ diagnosticOnly: true, budgetApplied: false,
      instrumentation: "CDP CPU sampling, timeline stacks, React commit hook and style-call stacks; never budget evidence",
      artifact: path.resolve(artifact), hashes, textures, cycles, viewport: { width: 1280, height: 900 }, dpr: 2 }, null, 2));
    for (const texture of textures) {
      const browser = await chromium.launch({ channel: "chromium" });
      try {
        const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2 });
        await context.addInitScript(installSelectReopeningProbe, { diagnostic: true });
        await context.addInitScript(() => {
          window.__selectTasks = [];
          new PerformanceObserver(list => window.__selectTasks.push(...list.getEntries().map(entry => ({ startTime: entry.startTime, duration: entry.duration })))).observe({ type: "longtask" });
          localStorage.setItem("unitary-theme-preference", "dark");
        });
        const page = await context.newPage(), session = await context.newCDPSession(page), scripts = [], timeline = [];
        session.on("Debugger.scriptParsed", script => { if (script.url.startsWith(preview.url)) scripts.push(script); });
        session.on("Tracing.dataCollected", ({ value }) => timeline.push(...value));
        await session.send("Debugger.enable");
        await page.goto(`${preview.url}/site/build/glass-regression.html?usage=dense`);
        await page.waitForFunction(() => document.documentElement.dataset.glassFixtureReady === "true");
        await page.evaluate(async () => {
          await document.fonts.ready;
          const image = new Image(); image.src = getComputedStyle(document.querySelector(".glass-fixture-landscape")).backgroundImage.match(/url\("?([^")]+)"?\)/)[1]; await image.decode();
        });
        await page.evaluate(texture => window.__glassFixture.activate(texture), texture);
        const trigger = page.locator('[data-slot="select-trigger"]'), content = page.locator('[data-slot="select-content"]');
        await session.send("Profiler.enable");
        await session.send("Profiler.setSamplingInterval", { interval: 1000 });
        await session.send("Profiler.start");
        await session.send("Tracing.start", { categories: "toplevel,devtools.timeline,v8.execute,blink.user_timing,disabled-by-default-devtools.timeline.stack", options: "record-as-much-as-possible" });
        const startedAt = await page.evaluate(() => { performance.mark("select-reopening-start"); return performance.now(); });
        for (let cycle = 0; cycle < cycles; cycle++) {
          await trigger.click(); await content.waitFor({ state: "visible" });
          await page.keyboard.press("Home");
          await page.waitForFunction(() => document.activeElement?.textContent?.includes("Project file 00"));
          if (cycle % 2) {
            await page.keyboard.press("ArrowDown");
            await page.waitForFunction(() => document.activeElement?.textContent?.includes("Project file 01"));
          }
          await page.keyboard.press("Enter"); await content.waitFor({ state: "hidden" });
        }
        const endedAt = await page.evaluate(() => { performance.mark("select-reopening-end"); return performance.now(); });
        const { profile } = await session.send("Profiler.stop");
        const complete = new Promise(resolve => session.once("Tracing.tracingComplete", resolve));
        await session.send("Tracing.end"); await complete;
        const raw = await page.evaluate(() => ({ ...window.__selectReopening.finish(), tasks: window.__selectTasks }));
        const maps = new Map();
        for (const script of scripts) if (script.sourceMapURL) {
          const url = new URL(script.sourceMapURL, script.url);
          if (url.origin !== new URL(preview.url).origin) continue;
          const response = await fetch(url); if (!response.ok) continue;
          const payload = await response.json(); maps.set(script.url, new SourceMap(payload));
          await fs.writeFile(path.join(run, `${texture}-${crypto.createHash("sha256").update(script.url).digest("hex").slice(0, 12)}.map`), JSON.stringify(payload));
        }
        const tasks = raw.tasks.filter(task => task.startTime >= startedAt && task.startTime < endedAt);
        const result = { texture, diagnosticOnly: true, budgetApplied: false, browser: browser.version(), cycles, startedAt, endedAt,
          sourceMaps: maps.size, renderers: raw.renderers, attribution: attributeReopeningTasks(tasks, raw.events),
          commits: raw.events.filter(event => event.kind === "react-commit").length,
          attachments: raw.events.filter(event => event.kind === "attached").length,
          topCpuFrames: mappedCpuFrames(profile, maps).slice(0, 60) };
        result.failures = [maps.size ? null : "source-maps:missing", raw.renderers.length ? null : "react-commits:missing", result.attachments >= cycles ? null : "portal-cycles:incomplete"].filter(Boolean);
        await fs.writeFile(path.join(run, `${texture}.cpuprofile`), JSON.stringify(profile));
        await fs.writeFile(path.join(run, `${texture}-trace.json`), JSON.stringify({ traceEvents: timeline }));
        await fs.writeFile(path.join(run, `${texture}-events.json`), JSON.stringify(raw, null, 2));
        await fs.writeFile(path.join(run, `${texture}-summary.json`), JSON.stringify(result, null, 2));
        results.push(result); console.log(JSON.stringify({ run, texture, sourceMaps: maps.size, commits: result.commits, attachments: result.attachments, longTasks: tasks }));
      } finally { await browser.close(); }
    }
  } finally { await preview.close(); }
  await fs.writeFile(path.join(run, "summary.json"), JSON.stringify(results, null, 2));
  return { run, results };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const args = {};
  for (let index = 2; index < process.argv.length; index += 2) {
    const key = process.argv[index]?.replace(/^--/, "");
    if (!["artifact", "output", "textures", "cycles"].includes(key) || !process.argv[index + 1]) throw Error("Expected known --key and value");
    args[key] = process.argv[index + 1];
  }
  if (!args.artifact) throw Error("--artifact must name a production fixture build with source maps");
  const summary = await withPackageLock(path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".."), "workspace-checks",
    () => diagnoseSelect({ artifact: args.artifact, output: args.output, textures: args.textures?.split(","), cycles: args.cycles ? Number(args.cycles) : 12 }));
  process.exitCode = summary.results.every(result => !result.failures.length) ? 0 : 1;
}
