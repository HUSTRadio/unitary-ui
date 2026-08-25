import fs from "node:fs/promises";
import path from "node:path";

const CDP_HTTP = process.env.CDP_HTTP ?? "http://127.0.0.1:9223";
const APP_URL = process.env.APP_URL ?? "http://localhost:5202/";
const OUT = process.env.README_SHOTS_OUT ?? "images";
const WIDTH = 1440;
const HEIGHT = 900;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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
    if (message.error) reject(new Error(message.error.message));
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

async function waitFor(send, expression, label) {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    if (await evaluate(send, expression)) return;
    await sleep(50);
  }
  throw new Error(`Timed out waiting for ${label}`);
}

async function setTheme(send, theme) {
  await evaluate(
    send,
    `(() => {
      const button = document.querySelector('header [role="radio"][aria-label=${JSON.stringify(theme === "dark" ? "Dark" : "Light")}]');
      button?.click();
      return Boolean(button);
    })()`,
  );
  await waitFor(
    send,
    theme === "dark"
      ? `document.documentElement.classList.contains("dark")`
      : `!document.documentElement.classList.contains("dark")`,
    `${theme} theme`,
  );
  await sleep(100);
}

async function selectPage(send, label) {
  const found = await evaluate(
    send,
    `(() => {
      const button = [...document.querySelectorAll("header nav button")]
        .find((node) => node.textContent?.trim() === ${JSON.stringify(label)});
      button?.click();
      return Boolean(button);
    })()`,
  );
  if (!found) throw new Error(`Navigation button not found: ${label}`);
  await waitFor(
    send,
    `[...document.querySelectorAll("header nav button")].some((node) => node.textContent?.trim() === ${JSON.stringify(label)} && node.classList.contains("bg-selected"))`,
    `page ${label}`,
  );
  await evaluate(send, `scrollTo(0, 0)`);
  await sleep(100);
}

async function screenshot(send, filename) {
  await evaluate(send, `scrollTo(0, 0)`);
  await sleep(80);
  const result = await send("Page.captureScreenshot", {
    format: "png",
    fromSurface: true,
    captureBeyondViewport: false,
    clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT, scale: 1 },
  });
  await fs.writeFile(path.join(OUT, filename), Buffer.from(result.data, "base64"));
}

async function main() {
  await fs.mkdir(OUT, { recursive: true });
  const { ws, send, targetId } = await openTarget();
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride", {
    width: WIDTH,
    height: HEIGHT,
    deviceScaleFactor: 1,
    mobile: false,
  });

  try {
    await send("Page.navigate", { url: APP_URL });
    await waitFor(
      send,
      `Boolean(document.querySelector("header nav") && document.querySelector("main"))`,
      "styleguide",
    );

    await setTheme(send, "light");
    await selectPage(send, "组件总览");
    await screenshot(send, "components-light.png");

    await selectPage(send, "表单示例");
    await screenshot(send, "form-example.png");
    await setTheme(send, "dark");
    await screenshot(send, "form-dark.png");

    await setTheme(send, "light");
    await selectPage(send, "数据表格");
    await screenshot(send, "data-table.png");
    const selected = await evaluate(
      send,
      `(() => {
        const checkbox = document.querySelector('[role="checkbox"][aria-label^="选择 "]');
        checkbox?.click();
        return Boolean(checkbox);
      })()`,
    );
    if (!selected) throw new Error("Data table row checkbox not found");
    await sleep(100);
    await screenshot(send, "data-table-selected.png");
    await evaluate(
      send,
      `document.querySelector('[role="checkbox"][aria-label^="选择 "]')?.click()`,
    );
    await setTheme(send, "dark");
    await screenshot(send, "data-table-dark.png");

    await setTheme(send, "light");
    await selectPage(send, "审批流程");
    await screenshot(send, "workflow.png");

    await selectPage(send, "设置面板");
    await screenshot(send, "settings.png");
  } finally {
    ws.close();
    await fetch(`${CDP_HTTP}/json/close/${targetId}`, { method: "PUT" }).catch(() => undefined);
  }

  console.log(JSON.stringify({ screenshots: 8, viewport: `${WIDTH}x${HEIGHT}`, out: OUT }));
}

main().catch((error) => {
  console.error(error.stack ?? error);
  process.exitCode = 1;
});
