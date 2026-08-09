#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";

const STYLE_FIELDS = [
  "display",
  "position",
  "boxSizing",
  "width",
  "height",
  "minWidth",
  "minHeight",
  "maxWidth",
  "maxHeight",
  "paddingTop",
  "paddingRight",
  "paddingBottom",
  "paddingLeft",
  "marginTop",
  "marginRight",
  "marginBottom",
  "marginLeft",
  "gap",
  "color",
  "backgroundColor",
  "backgroundImage",
  "borderTopWidth",
  "borderRightWidth",
  "borderBottomWidth",
  "borderLeftWidth",
  "borderTopColor",
  "borderRightColor",
  "borderBottomColor",
  "borderLeftColor",
  "borderRadius",
  "boxShadow",
  "opacity",
  "fontFamily",
  "fontSize",
  "fontWeight",
  "lineHeight",
  "letterSpacing",
  "textAlign",
  "transform",
  "transformOrigin",
  "transition",
  "animation",
  "overflow",
  "overflowX",
  "overflowY",
  "zIndex",
];

function parseArgs(argv) {
  const args = { dryRun: false };
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--dry-run") {
      args.dryRun = true;
      continue;
    }
    if (!token.startsWith("--")) throw new Error(`Unexpected argument: ${token}`);
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) throw new Error(`Missing value for ${token}`);
    args[token.slice(2).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())] = value;
    index += 1;
  }
  return args;
}

function required(args, key) {
  if (!args[key])
    throw new Error(
      `Missing required argument --${key.replace(/[A-Z]/g, (x) => `-${x.toLowerCase()}`)}`,
    );
  return args[key];
}

function makeConfig(args) {
  const source = required(args, "source");
  const slug = required(args, "slug");
  const variant = required(args, "variant");
  const state = required(args, "state");
  const theme = required(args, "theme");
  const viewportText = required(args, "viewport");
  const selector = required(args, "selector");
  const url = required(args, "url");
  const out = required(args, "out");
  if (!new Set(["official", "local"]).has(source)) throw new Error(`Invalid source: ${source}`);
  if (!new Set(["light", "dark"]).has(theme)) throw new Error(`Invalid theme: ${theme}`);
  const match = /^(\d+)x(\d+)$/.exec(viewportText);
  if (!match) throw new Error(`Invalid viewport: ${viewportText}; expected WIDTHxHEIGHT`);
  const viewport = { width: Number(match[1]), height: Number(match[2]) };
  if (viewport.width < 1 || viewport.height < 1)
    throw new Error(`Invalid viewport: ${viewportText}`);
  return {
    source,
    slug,
    variant,
    state,
    theme,
    viewport,
    viewportText,
    selector,
    url,
    out: path.resolve(out),
    cdpHttp: args.cdpHttp ?? process.env.CDP_HTTP ?? "http://127.0.0.1:9223",
    runId: args.runId ?? `${Date.now()}-${process.pid}`,
    cellKey: `${source}/${slug}/${variant}/${state}/${theme}/${viewportText}`,
    outputPolicy: "isolated-run-directory",
  };
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function atomicWrite(filename, value) {
  const temporary = `${filename}.${process.pid}.tmp`;
  await fs.writeFile(temporary, value);
  await fs.rename(temporary, filename);
}

async function openTarget(cdpHttp) {
  const response = await fetch(`${cdpHttp}/json/new?${encodeURIComponent("about:blank")}`, {
    method: "PUT",
  });
  if (!response.ok) throw new Error(`CDP target creation failed: ${response.status}`);
  const target = await response.json();
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.addEventListener("open", resolve, { once: true });
    ws.addEventListener("error", reject, { once: true });
  });
  let nextId = 0;
  const pending = new Map();
  ws.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (!message.id || !pending.has(message.id)) return;
    const item = pending.get(message.id);
    pending.delete(message.id);
    clearTimeout(item.timer);
    if (message.error)
      item.reject(new Error(`${message.error.message}: ${JSON.stringify(message.error.data)}`));
    else item.resolve(message.result);
  });
  const send = (method, params = {}, timeout = 20_000) =>
    new Promise((resolve, reject) => {
      const id = ++nextId;
      const timer = setTimeout(() => {
        pending.delete(id);
        reject(new Error(`CDP timeout: ${method}`));
      }, timeout);
      pending.set(id, { resolve, reject, timer });
      ws.send(JSON.stringify({ id, method, params }));
    });
  return { send, ws, targetId: target.id };
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

async function waitFor(send, expression, label, attempts = 100) {
  let value;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    value = await evaluate(send, expression);
    if (value) return value;
    await sleep(100);
  }
  throw new Error(`Timed out waiting for ${label}: ${JSON.stringify(value)}`);
}

async function applyTheme(send, theme) {
  const point = await evaluate(
    send,
    `(() => {
      const desired = ${JSON.stringify(theme)};
      const title = desired[0].toUpperCase() + desired.slice(1);
      const candidates = [...document.querySelectorAll('button,[role="radio"],label')];
      const element = candidates.find((node) =>
        node.getAttribute('aria-label')?.toLowerCase() === desired ||
        node.textContent?.trim().toLowerCase() === desired ||
        node.textContent?.trim() === title
      );
      if (!element) return null;
      const target = element.closest('label') ?? element;
      const rect = target.getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    })()`,
  );
  if (!point) throw new Error(`Theme control not found: ${theme}`);
  await send("Input.dispatchMouseEvent", { type: "mouseMoved", ...point });
  await send("Input.dispatchMouseEvent", {
    type: "mousePressed",
    ...point,
    button: "left",
    buttons: 1,
    clickCount: 1,
  });
  await send("Input.dispatchMouseEvent", {
    type: "mouseReleased",
    ...point,
    button: "left",
    buttons: 0,
    clickCount: 1,
  });
  await sleep(250);
  const observed = await evaluate(
    send,
    `(() => ({
      htmlClass: document.documentElement.className,
      dataTheme: document.documentElement.dataset.theme ?? null,
      colorScheme: getComputedStyle(document.documentElement).colorScheme,
      bodyBackground: getComputedStyle(document.body).backgroundColor,
    }))()`,
  );
  const marker =
    `${observed.htmlClass} ${observed.dataTheme ?? ""} ${observed.colorScheme}`.toLowerCase();
  if (!marker.includes(theme)) {
    throw new Error(`Theme mismatch: requested=${theme}, observed=${JSON.stringify(observed)}`);
  }
  return observed;
}

function metricsExpression(selector) {
  return `(() => {
    const selector = ${JSON.stringify(selector)};
    const root = document.querySelector(selector);
    if (!root) return null;
    const fields = ${JSON.stringify(STYLE_FIELDS)};
    const rectValue = (element) => {
      const rect = element.getBoundingClientRect();
      return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
    };
    const styleValue = (element, pseudo = null) => {
      const style = getComputedStyle(element, pseudo);
      const result = Object.fromEntries(fields.map((field) => [field, style[field]]));
      result.pseudoContent = style.content;
      result.cssVariables = Object.fromEntries(
        [...style].filter((name) => name.startsWith('--')).map((name) => [name, style.getPropertyValue(name)])
      );
      return result;
    };
    const pathFor = (element) => {
      const parts = [];
      let current = element;
      while (current && current !== root) {
        const parent = current.parentElement;
        if (!parent) break;
        parts.unshift([...parent.children].indexOf(current));
        current = parent;
      }
      return parts.length ? parts.join('.') : 'root';
    };
    const elements = [root, ...root.querySelectorAll('*')];
    return {
      root: rectValue(root),
      nodes: elements.map((element) => ({
        path: pathFor(element),
        tag: element.tagName.toLowerCase(),
        rect: rectValue(element),
        styles: styleValue(element),
        before: styleValue(element, '::before'),
        after: styleValue(element, '::after'),
      })),
      document: {
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      },
    };
  })()`;
}

async function collect(config, runDir) {
  const { send, ws, targetId } = await openTarget(config.cdpHttp);
  try {
    await send("Page.enable");
    await send("Runtime.enable");
    await send("Emulation.setDeviceMetricsOverride", {
      ...config.viewport,
      deviceScaleFactor: 1,
      mobile: config.viewport.width <= 480,
    });
    await send("Page.navigate", { url: config.url });
    await waitFor(
      send,
      `document.readyState === 'complete' || document.readyState === 'interactive'`,
      "document readiness",
    );
    await waitFor(
      send,
      `Boolean(document.querySelector(${JSON.stringify(config.selector)}))`,
      config.selector,
    );
    const observedTheme = await applyTheme(send, config.theme);
    const metrics = await evaluate(send, metricsExpression(config.selector));
    if (!metrics) throw new Error(`Selector disappeared: ${config.selector}`);
    const clip = metrics.root;
    if (clip.width <= 0 || clip.height <= 0)
      throw new Error(`Invalid root rect: ${JSON.stringify(clip)}`);
    const screenshot = await send(
      "Page.captureScreenshot",
      {
        format: "png",
        captureBeyondViewport: true,
        fromSurface: true,
        clip: {
          x: Math.max(0, Math.floor(clip.x + (await evaluate(send, "window.scrollX")))),
          y: Math.max(0, Math.floor(clip.y + (await evaluate(send, "window.scrollY")))),
          width: Math.ceil(clip.width),
          height: Math.ceil(clip.height),
          scale: 1,
        },
      },
      30_000,
    );
    await fs.writeFile(path.join(runDir, "screenshot.png"), Buffer.from(screenshot.data, "base64"));
    await atomicWrite(path.join(runDir, "metrics.json"), `${JSON.stringify(metrics, null, 2)}\n`);
    const cell = {
      schemaVersion: 1,
      ...config,
      observedTheme,
      screenshot: "screenshot.png",
      metrics: "metrics.json",
      status: "captured",
    };
    await atomicWrite(path.join(runDir, "cell.json"), `${JSON.stringify(cell, null, 2)}\n`);
    return cell;
  } finally {
    ws.close();
    await fetch(`${config.cdpHttp}/json/close/${targetId}`, { method: "PUT" }).catch(
      () => undefined,
    );
  }
}

async function main() {
  const config = makeConfig(parseArgs(process.argv.slice(2)));
  if (parseArgs(process.argv.slice(2)).dryRun) {
    console.log(JSON.stringify(config));
    return;
  }
  const runDir = path.join(config.out, "runs", config.runId);
  await fs.mkdir(runDir, { recursive: true });
  const statusFile = path.join(runDir, "producer-status.json");
  await atomicWrite(
    statusFile,
    `${JSON.stringify({ status: "running", cellKey: config.cellKey })}\n`,
  );
  try {
    const cell = await collect(config, runDir);
    await atomicWrite(
      statusFile,
      `${JSON.stringify({ status: "succeeded", producerExit: 0, cellKey: config.cellKey })}\n`,
    );
    console.log(JSON.stringify({ runDir, cell }));
  } catch (error) {
    const message = error?.stack ?? String(error);
    await fs.writeFile(path.join(runDir, "fatal.log"), `${message}\n`);
    await atomicWrite(
      statusFile,
      `${JSON.stringify({ status: "failed", producerExit: 1, cellKey: config.cellKey, error: error.message })}\n`,
    );
    throw error;
  }
}

main().catch((error) => {
  console.error(error?.stack ?? error);
  process.exitCode = 1;
});
