import fs from "node:fs/promises";
import path from "node:path";

const CDP_HTTP = process.env.CDP_HTTP ?? "http://127.0.0.1:9223";
const DOCS_URL = process.env.DOCS_URL ?? "http://localhost:5201/";
const OUT = process.env.VISUAL_OUT ?? "C:/Users/Leon/geist-acceptance/final-shots";
const STATE = process.env.VISUAL_STATE ?? "default";

const GROUPS = [
  ["avatar", "badge", "banner", "book", "breadcrumbs", "browser"],
  ["button", "calendar", "checkbox", "choicebox", "clearable-input", "code"],
  ["code-block", "collapse", "combobox", "command-menu", "context-card", "context-menu"],
  ["copy-button", "description", "destructive-action-modal", "dots-menu", "drawer", "empty-state"],
  ["entity", "error", "error-card", "feedback", "fieldset", "file-tree"],
  ["gauge", "grid", "input", "json-view", "keyboard-input", "label"],
  ["load-more-button", "loading-dots", "menu", "middle-truncate", "modal", "multi-select"],
  ["note", "pagination", "phone", "pill", "progress", "project-banner"],
  ["radio", "relative-time-card", "scroller", "search-input", "select", "separator"],
  ["sheet", "show-more", "skeleton", "slider", "snippet", "spinner"],
  ["split-button", "status-dot", "switch", "table", "tabs", "text-with-copy-button"],
  ["textarea", "theme-switcher", "toast", "toggle", "tooltip", "video"],
];

const VIEWPORTS = [
  { name: "375", width: 375, height: 812, mobile: true },
  { name: "768", width: 768, height: 1024, mobile: false },
  { name: "1440", width: 1440, height: 900, mobile: false },
  { name: "1920", width: 1920, height: 1080, mobile: false },
];
const THEMES = ["light", "dark"];
const requestedSlugs = new Set(
  (process.env.VISUAL_SLUGS ?? "")
    .split(",")
    .map((slug) => slug.trim())
    .filter(Boolean),
);
const SLUGS = GROUPS.flat().filter((slug) => requestedSlugs.size === 0 || requestedSlugs.has(slug));

if (SLUGS.length === 0) throw new Error("VISUAL_SLUGS did not match a component slug");
if (!new Set(["default", "hover"]).has(STATE)) {
  throw new Error(`Unsupported VISUAL_STATE: ${STATE}`);
}
if (STATE === "hover" && SLUGS.some((slug) => slug !== "book")) {
  throw new Error("VISUAL_STATE=hover currently supports the Book route only");
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const liveHeadingPredicate = `(node) => ["Live Demo", "实时示例"].includes(node.textContent?.trim())`;

async function openTarget() {
  const target = await (
    await fetch(`${CDP_HTTP}/json/new?${encodeURIComponent("about:blank")}`, { method: "PUT" })
  ).json();
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.addEventListener("open", resolve, { once: true });
    ws.addEventListener("error", reject, { once: true });
  });

  let id = 0;
  const pending = new Map();
  ws.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (!message.id || !pending.has(message.id)) return;
    const { resolve, reject, timer } = pending.get(message.id);
    pending.delete(message.id);
    clearTimeout(timer);
    if (message.error)
      reject(new Error(`${message.error.message}: ${JSON.stringify(message.error.data)}`));
    else resolve(message.result);
  });

  const send = (method, params = {}, timeout = 15_000) =>
    new Promise((resolve, reject) => {
      const messageId = ++id;
      const timer = setTimeout(() => {
        pending.delete(messageId);
        reject(new Error(`CDP timeout: ${method}`));
      }, timeout);
      pending.set(messageId, { resolve, reject, timer });
      ws.send(JSON.stringify({ id: messageId, method, params }));
    });

  return { ws, send, targetId: target.id };
}

async function evaluate(send, expression) {
  const result = await send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.exception?.description ?? "Runtime.evaluate failed");
  }
  return result.result.value;
}

async function waitForDemo(send, slug) {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    const state = await evaluate(
      send,
      `(() => {
        const heading = document.querySelector("main h1")?.textContent?.trim() ?? "";
        const liveHeading = [...document.querySelectorAll("main h2")]
          .find(${liveHeadingPredicate});
        const demo = liveHeading?.nextElementSibling;
        return {
          hash: location.hash,
          heading,
          ready: Boolean(demo && demo.children.length > 0),
        };
      })()`,
    );
    if (state.hash === `#/components/${slug}` && state.heading && state.ready) return;
    await sleep(50);
  }
  throw new Error(`Timed out waiting for Live Demo: ${slug}`);
}

async function main() {
  await fs.mkdir(OUT, { recursive: true });
  const { ws, send, targetId } = await openTarget();
  await send("Page.enable");
  await send("Runtime.enable");

  const manifest = [];
  try {
    for (const viewport of VIEWPORTS) {
      await send("Emulation.setDeviceMetricsOverride", {
        width: viewport.width,
        height: viewport.height,
        deviceScaleFactor: 1,
        mobile: viewport.mobile,
      });

      for (const slug of SLUGS) {
        const url = `${DOCS_URL.replace(/\/$/, "")}/#/components/${slug}`;
        await send("Page.navigate", { url });
        await waitForDemo(send, slug);

        for (const theme of THEMES) {
          await evaluate(
            send,
            `(() => {
              const dark = ${JSON.stringify(theme)} === "dark";
              document.documentElement.classList.toggle("dark", dark);
              document.documentElement.dataset.theme = dark ? "dark" : "light";
              document.documentElement.style.colorScheme = dark ? "dark" : "light";
              return document.documentElement.className;
            })()`,
          );
          // Controls transition theme-sensitive colors for up to 150ms.
          // Capture only after the computed styles have reached steady state.
          await sleep(250);

          const clip = await evaluate(
            send,
            `(() => {
              const liveHeading = [...document.querySelectorAll("main h2")]
                .find(${liveHeadingPredicate});
              const demo = liveHeading?.nextElementSibling;
              if (!demo) return null;
              for (const node of document.body.querySelectorAll("*")) {
                if (demo.contains(node) || node.contains(demo)) continue;
                const position = getComputedStyle(node).position;
                if (position === "fixed" || position === "sticky") {
                  node.style.setProperty("visibility", "hidden", "important");
                }
              }
              demo.scrollIntoView({ block: "start" });
              const rect = demo.getBoundingClientRect();
              return {
                x: Math.max(0, Math.floor(window.scrollX + rect.x)),
                y: Math.max(0, Math.floor(window.scrollY + rect.y)),
                width: Math.max(1, Math.ceil(rect.width)),
                height: Math.max(1, Math.ceil(rect.height)),
                scale: 1,
              };
            })()`,
          );
          if (!clip) throw new Error(`Missing demo clip: ${slug}`);

          if (STATE === "hover") {
            const point = await evaluate(
              send,
              `(() => {
                const book = document.querySelector('[data-slot="book"]');
                if (!book) return null;
                const rect = book.getBoundingClientRect();
                return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
              })()`,
            );
            if (!point) throw new Error(`Missing hover target: ${slug}`);
            await send("Input.dispatchMouseEvent", { type: "mouseMoved", ...point });
            await sleep(300);
          }

          const screenshot = await send(
            "Page.captureScreenshot",
            { format: "png", captureBeyondViewport: true, fromSurface: true, clip },
            30_000,
          );
          const stateSuffix = STATE === "default" ? "" : `-${STATE}`;
          const filename = `${slug}-${viewport.name}-${theme}${stateSuffix}.png`;
          await fs.writeFile(path.join(OUT, filename), Buffer.from(screenshot.data, "base64"));
          manifest.push({ slug, viewport: viewport.name, theme, state: STATE, filename, clip });
        }
      }
      console.log(`captured viewport ${viewport.name}: ${SLUGS.length * THEMES.length} images`);
    }
  } finally {
    await fs.writeFile(
      path.join(OUT, "manifest.json"),
      JSON.stringify({ groups: GROUPS, manifest }, null, 2),
    );
    ws.close();
    await fetch(`${CDP_HTTP}/json/close/${targetId}`, { method: "PUT" }).catch(() => undefined);
  }
  console.log(JSON.stringify({ images: manifest.length, out: OUT }));
}

main().catch((error) => {
  console.error(error.stack ?? error);
  process.exitCode = 1;
});
