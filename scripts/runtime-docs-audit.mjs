import { readdir } from "node:fs/promises";

const cdpPort = Number(process.env.CDP_PORT ?? 9223);
const baseUrl = process.env.DOCS_URL ?? "http://localhost:5200/";
const viewportWidths = [375, 768, 1440, 1920];
const themes = ["light", "dark"];

class CdpClient {
  #id = 0;
  #pending = new Map();

  constructor(webSocketUrl) {
    this.socket = new WebSocket(webSocketUrl);
  }

  async connect() {
    await new Promise((resolve, reject) => {
      this.socket.addEventListener("open", resolve, { once: true });
      this.socket.addEventListener("error", reject, { once: true });
    });
    this.socket.addEventListener("message", ({ data }) => {
      const message = JSON.parse(data);
      if (!message.id) return;
      const pending = this.#pending.get(message.id);
      if (!pending) return;
      this.#pending.delete(message.id);
      if (message.error) pending.reject(new Error(JSON.stringify(message.error)));
      else pending.resolve(message.result);
    });
  }

  send(method, params = {}) {
    const id = ++this.#id;
    return new Promise((resolve, reject) => {
      this.#pending.set(id, { resolve, reject });
      this.socket.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    this.socket.close();
  }
}

async function evaluate(client, expression) {
  const result = await client.send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.exception?.description ?? "Runtime evaluation failed");
  }
  return result.result.value;
}

async function waitFor(client, predicate, timeout = 3000) {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    if (await evaluate(client, predicate)) return;
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
  throw new Error(`Timed out waiting for: ${predicate}`);
}

const referenceDir = new URL("../docs/geist-markdown-refs/components/", import.meta.url);
const slugs = (await readdir(referenceDir))
  .filter((file) => file.endsWith(".md"))
  .map((file) => file.slice(0, -3))
  .sort();

const targets = await (await fetch(`http://127.0.0.1:${cdpPort}/json/list`)).json();
const page = targets.find((target) => target.type === "page");
if (!page) throw new Error("No CDP page target found");

const client = new CdpClient(page.webSocketDebuggerUrl);
await client.connect();
await client.send("Page.enable");
await client.send("Runtime.enable");
await client.send("Page.navigate", { url: baseUrl });
await waitFor(client, "document.readyState === 'complete' && !!document.querySelector('main')");

const failures = [];
for (const theme of themes) {
  await evaluate(
    client,
    `(()=>{localStorage.setItem('unitary-theme-preference', ${JSON.stringify(theme)});document.documentElement.classList.toggle('dark', ${theme === "dark"});document.documentElement.dataset.theme=${JSON.stringify(theme)};return true})()`,
  );

  for (const width of viewportWidths) {
    const height = width <= 375 ? 900 : width <= 768 ? 1024 : 900;
    await client.send("Emulation.setDeviceMetricsOverride", {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: width <= 768,
      screenWidth: width,
      screenHeight: height,
    });

    for (const slug of slugs) {
      const previousHeading = await evaluate(
        client,
        "document.querySelector('main h1')?.textContent?.trim() ?? ''",
      );
      await evaluate(client, `location.hash=${JSON.stringify(`/components/${slug}`)}`);
      const expectedHash = `#/components/${slug}`;
      const readyPredicate =
        `location.hash === ${JSON.stringify(expectedHash)} && ` +
        `document.querySelector('main h1')?.textContent?.trim() && ` +
        `document.querySelector('main h1')?.textContent?.trim() !== ${JSON.stringify(previousHeading)} && ` +
        `Array.from(document.querySelectorAll('main h2')).some((heading) => heading.textContent?.trim() === 'Live Demo')`;
      try {
        await waitFor(client, readyPredicate, 3000);
      } catch {
        await client.send("Page.navigate", { url: `${baseUrl}#/components/${slug}` });
        await waitFor(
          client,
          `location.hash === ${JSON.stringify(expectedHash)} && ` +
            `document.querySelector('main h1')?.textContent?.trim() && ` +
            `Array.from(document.querySelectorAll('main h2')).some((heading) => heading.textContent?.trim() === 'Live Demo')`,
          8000,
        );
      }
      const result = await evaluate(
        client,
        `(()=>{const main=document.querySelector('main');const h1=main?.querySelector('h1')?.textContent?.trim()||'';const liveHeading=Array.from(main?.querySelectorAll('h2')||[]).find((node)=>node.textContent?.trim()==='Live Demo');const live=liveHeading?.parentElement;const liveText=(live?.textContent||'').replace('Live Demo','').trim();const liveNodes=live?.querySelectorAll('button,input,textarea,select,a,[role],svg,video,pre,code,[data-slot]').length||0;const root=document.documentElement;return{h1,missing:document.body.textContent.includes('组件不存在'),emptyLive:!liveHeading||(!liveText&&!liveNodes),horizontalOverflow:root.scrollWidth>root.clientWidth+1,scrollWidth:root.scrollWidth,clientWidth:root.clientWidth,dark:root.classList.contains('dark')}})()`,
      );
      if (
        result.missing ||
        result.emptyLive ||
        result.horizontalOverflow ||
        result.dark !== (theme === "dark")
      ) {
        failures.push({ slug, theme, width, ...result });
      }
    }
  }
}

client.close();
const summary = {
  routes: slugs.length,
  themes: themes.length,
  viewports: viewportWidths.length,
  checks: slugs.length * themes.length * viewportWidths.length,
  failures,
};
console.log(JSON.stringify(summary, null, 2));
if (failures.length) process.exitCode = 1;
