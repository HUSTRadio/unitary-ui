import { tsImport } from "tsx/esm/api";
const { getComponentDocsPath } = await tsImport("../docs/site/src/data/docs-routes.ts", { parentURL: import.meta.url });
const CDP_HTTP = process.env.CDP_HTTP ?? "http://127.0.0.1:9223";
const DOCS_URL = process.env.DOCS_URL ?? "http://localhost:5201/";
const requestedSlugs = new Set(
  (process.env.RUNTIME_SLUGS ?? "")
    .split(",")
    .map((slug) => slug.trim())
    .filter(Boolean),
);

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

const demoExpression = `(() => {
  const heading = [...document.querySelectorAll("main h2")]
    .find((node) => ["Live Demo", "实时示例"].includes(node.textContent?.trim()));
  return heading?.nextElementSibling ?? null;
})()`;

async function goto(send, slug) {
  await send("Page.navigate", { url: `${DOCS_URL.replace(/\/$/, "")}/#${getComponentDocsPath(slug)}` });
  for (let attempt = 0; attempt < 80; attempt += 1) {
    const ready = await evaluate(
      send,
      `(() => {
        const demo = ${demoExpression};
        return location.hash === ${JSON.stringify(`#${getComponentDocsPath(slug)}`)} && Boolean(demo?.children.length);
      })()`,
    );
    if (ready) return;
    await sleep(50);
  }
  throw new Error(`route timeout: ${slug}`);
}

async function point(send, expression) {
  const value = await evaluate(
    send,
    `(() => {
      const demo = ${demoExpression};
      const element = ${expression};
      if (!element) return null;
      element.scrollIntoView({ block: "center", inline: "center" });
      const rect = element.getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    })()`,
  );
  if (!value) throw new Error(`element not found: ${expression}`);
  return value;
}

async function click(send, expression, button = "left") {
  const { x, y } = await point(send, expression);
  await send("Input.dispatchMouseEvent", { type: "mouseMoved", x, y });
  await send("Input.dispatchMouseEvent", {
    type: "mousePressed",
    x,
    y,
    button,
    buttons: button === "right" ? 2 : 1,
    clickCount: 1,
  });
  await send("Input.dispatchMouseEvent", {
    type: "mouseReleased",
    x,
    y,
    button,
    buttons: 0,
    clickCount: 1,
  });
  await sleep(100);
}

async function hover(send, expression) {
  const { x, y } = await point(send, expression);
  await send("Input.dispatchMouseEvent", { type: "mouseMoved", x, y });
  await sleep(250);
}

async function key(send, value) {
  const keyCodes = {
    Escape: 27,
    Enter: 13,
    Space: 32,
    ArrowRight: 39,
    ArrowDown: 40,
    End: 35,
  };
  const code = value === "Space" ? "Space" : value;
  const keyValue = value === "Space" ? " " : value;
  await send("Input.dispatchKeyEvent", {
    type: "keyDown",
    key: keyValue,
    code,
    windowsVirtualKeyCode: keyCodes[value],
  });
  await send("Input.dispatchKeyEvent", {
    type: "keyUp",
    key: keyValue,
    code,
    windowsVirtualKeyCode: keyCodes[value],
  });
  await sleep(100);
}

async function focus(send, expression) {
  const found = await evaluate(
    send,
    `(() => {
      const demo = ${demoExpression};
      const element = ${expression};
      element?.focus();
      return Boolean(element && document.activeElement === element);
    })()`,
  );
  if (!found) throw new Error(`unable to focus: ${expression}`);
}

async function insertText(send, text) {
  await send("Input.insertText", { text });
  await sleep(100);
}

async function expectValue(send, label, expression, predicate = Boolean) {
  let value;
  for (let attempt = 0; attempt < 30; attempt += 1) {
    value = await evaluate(send, expression);
    if (predicate(value)) return value;
    await sleep(50);
  }
  throw new Error(`${label}: ${JSON.stringify(value)}`);
}

async function main() {
  const { ws, send, targetId } = await openTarget();
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });

  const tests = [];
  const test = (slug, name, run) => tests.push({ slug, name, run });
  const q = (selector) => `(${demoExpression})?.querySelector(${JSON.stringify(selector)})`;
  const textButton = (text) =>
    `[...(${demoExpression})?.querySelectorAll("button") ?? []].find((node) => node.textContent?.trim() === ${JSON.stringify(text)})`;

  test("book", "trusted hover reveals the three-dimensional page stack", async () => {
    const book = q('[data-slot="book"]');
    const rotate = q('[data-slot="book-rotate"]');
    const before = await evaluate(send, `getComputedStyle(${rotate}).transform`);

    await hover(send, book);

    await expectValue(
      send,
      "book hover did not apply its 3D transform",
      `(() => {
        const root = ${book};
        const rotate = ${rotate};
        return {
          hovered: root?.matches(":hover") ?? false,
          transform: rotate ? getComputedStyle(rotate).transform : "none",
          transition: rotate ? getComputedStyle(rotate).transition : "none",
          pages: Boolean(root?.querySelector('[data-slot="book-pages"]')),
          back: Boolean(root?.querySelector('[data-slot="book-back"]')),
        };
      })()`,
      (value) =>
        value?.hovered &&
        value.transform !== "none" &&
        value.transform !== before &&
        value.transition.includes("0.25s") &&
        value.pages &&
        value.back,
    );
  });

  test("calendar", "ArrowRight moves day focus", async () => {
    const selector = "td button";
    await focus(send, q(selector));
    const before = await evaluate(send, `document.activeElement?.textContent?.trim()`);
    await key(send, "ArrowRight");
    await expectValue(
      send,
      "calendar focus did not move",
      `document.activeElement?.textContent?.trim()`,
      (v) => v && v !== before,
    );
  });

  test("checkbox", "trusted click toggles aria-checked", async () => {
    const selector = '[role="checkbox"][aria-label="写入权限"]';
    const before = await evaluate(send, `(${q(selector)})?.getAttribute("aria-checked")`);
    await click(send, q(selector));
    await expectValue(
      send,
      "checkbox did not toggle",
      `(${q(selector)})?.getAttribute("aria-checked")`,
      (v) => v && v !== before,
    );
  });

  test("checkbox", "unchecked hover reaches the steady gray-200 fill", async () => {
    const selector = '[role="checkbox"][aria-label="写入权限"]';
    const state = await evaluate(send, `(${q(selector)})?.getAttribute("data-state")`);
    if (state !== "unchecked") await click(send, q(selector));
    await hover(send, q(selector));
    await expectValue(
      send,
      "checkbox hover fill did not reach gray-200",
      `(() => {
        const box = ${q(selector)};
        const probe = document.createElement("span");
        probe.style.backgroundColor = "var(--gray-200)";
        document.body.append(probe);
        const expected = getComputedStyle(probe).backgroundColor;
        probe.remove();
        return {
          state: box?.getAttribute("data-state"),
          hovered: box?.matches(":hover") ?? false,
          background: box ? getComputedStyle(box).backgroundColor : null,
          expected,
        };
      })()`,
      (value) =>
        value?.state === "unchecked" && value.hovered && value.background === value.expected,
    );
  });

  test("choicebox", "radio choice changes selection", async () => {
    await click(send, q('input[type="radio"][value="trial"]'));
    await expectValue(
      send,
      "choicebox trial not selected",
      `(${q('input[type="radio"][value="trial"]')})?.checked`,
      (v) => v === true,
    );
  });

  test("clearable-input", "Escape clears value", async () => {
    await focus(send, q("input"));
    await key(send, "Escape");
    await expectValue(
      send,
      "clearable input not cleared",
      `(${q("input")})?.value`,
      (v) => v === "",
    );
  });

  test("collapse", "trigger opens and closes content", async () => {
    await click(send, textButton("What is Unitary?"));
    await expectValue(
      send,
      "collapse did not open",
      `(${textButton("What is Unitary?")})?.getAttribute("aria-expanded")`,
      (v) => v === "true",
    );
    await click(send, textButton("What is Unitary?"));
    await expectValue(
      send,
      "collapse did not close",
      `(${textButton("What is Unitary?")})?.getAttribute("aria-expanded")`,
      (v) => v === "false",
    );
  });

  test("combobox", "opens listbox and Escape closes", async () => {
    await click(send, q("button[aria-expanded]"));
    await expectValue(
      send,
      "combobox listbox missing",
      `Boolean(document.querySelector('[role="listbox"]'))`,
    );
    await key(send, "Escape");
    await expectValue(
      send,
      "combobox did not close",
      `!document.querySelector('[role="listbox"]')`,
    );
  });

  test("command-menu", "dialog Escape closes and returns focus to body", async () => {
    const trigger = q("button");
    await click(send, trigger);
    await expectValue(
      send,
      "command dialog missing",
      `Boolean(document.querySelector('[role="dialog"]'))`,
    );
    await key(send, "Escape");
    await expectValue(
      send,
      "command dialog did not close",
      `!document.querySelector('[role="dialog"]')`,
    );
    await expectValue(
      send,
      "command focus did not return to body",
      `document.activeElement === document.body`,
    );
  });

  test("context-menu", "right click opens menu and Escape closes", async () => {
    await click(send, q("button"), "right");
    await expectValue(
      send,
      "context menu missing",
      `Boolean(document.querySelector('[role="menu"]'))`,
    );
    await expectValue(
      send,
      "context menu item cursor is not pointer",
      `getComputedStyle(document.querySelector('[role="menuitem"]')).cursor`,
      (value) => value === "pointer",
    );
    await key(send, "Escape");
    await expectValue(
      send,
      "context menu did not close",
      `!document.querySelector('[role="menu"]')`,
    );
  });

  test("destructive-action-modal", "verification gate and Escape focus restore", async () => {
    await click(send, textButton("Delete Project"));
    await expectValue(
      send,
      "destructive dialog missing",
      `Boolean(document.querySelector('[role="dialog"]'))`,
    );
    const disabled = await evaluate(
      send,
      `document.querySelector('[role="dialog"] button[type="submit"]')?.disabled`,
    );
    if (!disabled) throw new Error("confirm button should start disabled");
    await focus(send, `document.querySelector('[role="dialog"] input')`);
    await insertText(send, "next-year-boilerplate");
    await expectValue(
      send,
      "confirm button stayed disabled",
      `!document.querySelector('[role="dialog"] button[type="submit"]')?.disabled`,
    );
    await key(send, "Escape");
    await expectValue(
      send,
      "destructive dialog did not close",
      `!document.querySelector('[role="dialog"]')`,
    );
    await expectValue(
      send,
      "destructive focus not restored",
      `document.activeElement?.textContent?.trim()`,
      (v) => v === "Delete Project",
    );
  });

  test("dots-menu", "menu Escape closes and restores focus", async () => {
    await click(send, q("button"));
    await expectValue(
      send,
      "dots menu missing",
      `Boolean(document.querySelector('[role="menu"]'))`,
    );
    await key(send, "Escape");
    await expectValue(send, "dots menu did not close", `!document.querySelector('[role="menu"]')`);
    await expectValue(
      send,
      "dots focus not restored",
      `document.activeElement === (${q("button")})`,
    );
  });

  test("dots-menu", "disabled trigger uses the gray-100 tile", async () => {
    await expectValue(
      send,
      "disabled dots trigger surface mismatch",
      `(() => {
        const button = (${demoExpression})?.querySelector("button[disabled]");
        const probe = document.createElement("span");
        probe.style.backgroundColor = "var(--gray-100)";
        document.body.append(probe);
        const expected = getComputedStyle(probe).backgroundColor;
        probe.remove();
        const style = button ? getComputedStyle(button) : null;
        return { background: style?.backgroundColor, opacity: style?.opacity, expected };
      })()`,
      (value) => value?.background === value.expected && value.opacity === "0.5",
    );
  });

  test("description", "definition list is unframed with compact typography", async () => {
    await expectValue(
      send,
      "description structure or typography mismatch",
      `(() => {
        const root = ${q('[data-slot="description"]')};
        const title = root?.querySelector("dt");
        const content = root?.querySelector("dd");
        const rs = root ? getComputedStyle(root) : null;
        const ts = title ? getComputedStyle(title) : null;
        const cs = content ? getComputedStyle(content) : null;
        return {
          borderWidth: rs?.borderTopWidth,
          radius: rs?.borderRadius,
          padding: rs?.padding,
          background: rs?.backgroundColor,
          title: ts ? [ts.fontSize, ts.lineHeight, ts.fontWeight] : null,
          content: cs ? [cs.fontSize, cs.lineHeight, cs.fontWeight] : null,
        };
      })()`,
      (value) =>
        value?.borderWidth === "0px" &&
        value.radius === "0px" &&
        value.padding === "0px" &&
        value.background === "rgba(0, 0, 0, 0)" &&
        JSON.stringify(value.title) === JSON.stringify(["14px", "14px", "400"]) &&
        JSON.stringify(value.content) === JSON.stringify(["14px", "16px", "500"]),
    );
  });

  test("drawer", "dialog Escape closes and restores focus", async () => {
    const trigger = q("button");
    await click(send, trigger);
    await expectValue(
      send,
      "drawer dialog missing",
      `Boolean(document.querySelector('[role="dialog"]'))`,
    );
    await key(send, "Escape");
    await expectValue(send, "drawer did not close", `!document.querySelector('[role="dialog"]')`);
    await expectValue(send, "drawer focus not restored", `document.activeElement === (${trigger})`);
  });

  test("json-view", "tree item expands and collapses", async () => {
    const selector = '[role="treeitem"][aria-expanded]';
    const before = await evaluate(send, `(${q(selector)})?.getAttribute("aria-expanded")`);
    await click(send, q(selector));
    await expectValue(
      send,
      "json tree did not toggle",
      `(${q(selector)})?.getAttribute("aria-expanded")`,
      (v) => v && v !== before,
    );
  });

  test("menu", "menu keyboard navigation and Escape focus restore", async () => {
    await click(send, textButton("Actions"));
    await expectValue(send, "menu missing", `Boolean(document.querySelector('[role="menu"]'))`);
    await key(send, "ArrowDown");
    await expectValue(
      send,
      "menu item did not receive focus",
      `document.activeElement?.getAttribute("role")`,
      (v) => v === "menuitem",
    );
    await key(send, "Escape");
    await expectValue(send, "menu did not close", `!document.querySelector('[role="menu"]')`);
    await expectValue(
      send,
      "menu focus not restored",
      `document.activeElement?.textContent?.trim()`,
      (v) => v === "Actions",
    );
  });

  test("modal", "Escape closes and restores outer trigger focus", async () => {
    await click(send, textButton("Open Modal"));
    await expectValue(
      send,
      "modal missing",
      `Boolean(document.querySelector('[role="dialog"][aria-modal="true"]'))`,
    );
    await key(send, "Escape");
    await expectValue(send, "modal did not close", `!document.querySelector('[role="dialog"]')`);
    await expectValue(
      send,
      "modal focus not restored",
      `document.activeElement?.textContent?.trim()`,
      (v) => v === "Open Modal",
    );
  });

  test("multi-select", "opens options and selects item", async () => {
    await click(send, q("button[aria-expanded]"));
    await expectValue(
      send,
      "multi-select rows missing",
      `Boolean(document.querySelector('[data-multi-select-row]'))`,
    );
    await click(
      send,
      `document.querySelector('[data-multi-select-checkbox][aria-label="Select Next.js"]')`,
    );
    await key(send, "Escape");
    await expectValue(
      send,
      "multi-select count did not update",
      `(${q("button[aria-expanded]")})?.textContent`,
      (v) => v?.includes("2 selected"),
    );
  });

  test("radio", "ArrowRight changes selected radio", async () => {
    const checked = 'input[type="radio"]:checked';
    await focus(send, q(checked));
    const before = await evaluate(send, `(${q(checked)})?.value`);
    await key(send, "ArrowRight");
    await expectValue(
      send,
      "radio selection did not move",
      `(${q(checked)})?.value`,
      (v) => v && v !== before,
    );
  });

  test("search-input", "clear button empties input", async () => {
    await focus(send, q("input"));
    await insertText(send, "project");
    await click(send, q('button[aria-label*="Clear" i]'));
    await expectValue(send, "search input not cleared", `(${q("input")})?.value`, (v) => v === "");
  });

  test("select", "native ArrowDown changes value", async () => {
    await focus(send, q("select"));
    const before = await evaluate(send, `(${q("select")})?.value`);
    await key(send, "ArrowDown");
    await expectValue(
      send,
      "native select did not change",
      `(${q("select")})?.value`,
      (v) => v && v !== before,
    );
  });

  test("sheet", "Escape closes and restores focus", async () => {
    await click(send, textButton("Open Sheet"));
    await expectValue(
      send,
      "sheet dialog missing",
      `Boolean(document.querySelector('[role="dialog"]'))`,
    );
    await key(send, "Escape");
    await expectValue(send, "sheet did not close", `!document.querySelector('[role="dialog"]')`);
    await expectValue(
      send,
      "sheet focus not restored",
      `document.activeElement?.textContent?.trim()`,
      (v) => v === "Open Sheet",
    );
  });

  test("show-more", "aria-expanded and content change", async () => {
    const selector = 'button[aria-expanded="false"]';
    const before = await evaluate(send, `(${q("p")})?.textContent?.length`);
    await click(send, q(selector));
    await expectValue(
      send,
      "show-more not expanded",
      `(${q('button[aria-controls="show-more-content"]')})?.getAttribute("aria-expanded")`,
      (v) => v === "true",
    );
    await expectValue(
      send,
      "show-more content did not grow",
      `(${q("p")})?.textContent?.length`,
      (v) => v > before,
    );
  });

  test("slider", "End sets aria-valuenow to max", async () => {
    await focus(send, q('[role="slider"]'));
    await key(send, "End");
    await expectValue(
      send,
      "slider did not reach max",
      `(${q('[role="slider"]')})?.getAttribute("aria-valuenow")`,
      (v) => v === "100",
    );
  });

  test("split-button", "menu opens and Escape restores menu trigger", async () => {
    const trigger = 'button[aria-label="More deployment actions"]';
    await click(send, q(trigger));
    await expectValue(
      send,
      "split menu missing",
      `Boolean(document.querySelector('[role="menu"]'))`,
    );
    await key(send, "Escape");
    await expectValue(send, "split menu did not close", `!document.querySelector('[role="menu"]')`);
    await expectValue(
      send,
      "split focus not restored",
      `document.activeElement === (${q(trigger)})`,
    );
  });

  test("switch", "trusted click changes selected view", async () => {
    await click(send, q('[role="radio"][value="code"]'));
    await expectValue(
      send,
      "switch code option not selected",
      `(${q('[role="radio"][value="code"]')})?.getAttribute("aria-checked")`,
      (v) => v === "true",
    );
  });

  test("tabs", "manual keyboard activation", async () => {
    await focus(send, q('[role="tab"][data-state="active"]'));
    await key(send, "ArrowRight");
    await expectValue(
      send,
      "tab focus did not move",
      `document.activeElement?.getAttribute("role")`,
      (v) => v === "tab",
    );
    const focusedText = await evaluate(send, `document.activeElement?.textContent?.trim()`);
    if (focusedText !== "Usage") throw new Error(`unexpected focused tab: ${focusedText}`);
    const selectedBeforeEnter = await evaluate(
      send,
      `document.activeElement?.getAttribute("aria-selected")`,
    );
    if (selectedBeforeEnter !== "false") throw new Error("tabs should use manual activation");
    await key(send, "Enter");
    await expectValue(
      send,
      "tab did not activate on Enter",
      `document.activeElement?.getAttribute("aria-selected")`,
      (v) => v === "true",
    );
  });

  test("toast", "trusted click opens status and close dismisses", async () => {
    await click(send, textButton("Show Toast"));
    await expectValue(
      send,
      "toast status missing",
      `Boolean(document.querySelector('[role="status"]'))`,
    );
    await click(send, `document.querySelector('[data-slot="toast-close"]')`);
    await expectValue(send, "toast did not close", `!document.querySelector('[role="status"]')`);
  });

  test("toggle", "trusted click toggles checked state", async () => {
    const selector = '[role="switch"]';
    const before = await evaluate(send, `(${q(selector)})?.getAttribute("aria-checked")`);
    await click(send, q(selector));
    await expectValue(
      send,
      "toggle did not change",
      `(${q(selector)})?.getAttribute("aria-checked")`,
      (v) => v && v !== before,
    );
  });

  test("tooltip", "trusted hover opens tooltip", async () => {
    await hover(send, textButton("Hover me"));
    await expectValue(
      send,
      "tooltip missing",
      `Boolean(document.querySelector('[role="tooltip"]'))`,
    );
  });

  test("theme-switcher", "radio changes document theme", async () => {
    await click(send, q('button[role="radio"][aria-label="Dark"]'));
    await expectValue(
      send,
      "theme did not become dark",
      `document.documentElement.classList.contains("dark") && document.documentElement.dataset.theme === "dark"`,
    );
  });

  test("load-more-button", "loading state is announced", async () => {
    await click(send, q("button"));
    await expectValue(
      send,
      "load-more aria-busy missing",
      `(${q("button")})?.getAttribute("aria-busy")`,
      (v) => v === "true",
    );
    await expectValue(
      send,
      "load-more never completed",
      `(${q("button")})?.getAttribute("aria-busy")`,
      (v) => v !== "true",
    );
  });

  const failures = [];
  const passes = [];
  const selectedTests = tests.filter(
    (entry) => requestedSlugs.size === 0 || requestedSlugs.has(entry.slug),
  );
  if (selectedTests.length === 0)
    throw new Error("RUNTIME_SLUGS did not match an interaction check");
  try {
    for (const entry of selectedTests) {
      try {
        await goto(send, entry.slug);
        await entry.run();
        passes.push(`${entry.slug}: ${entry.name}`);
      } catch (error) {
        failures.push({ slug: entry.slug, name: entry.name, error: error.message });
      }
    }
  } finally {
    ws.close();
    await fetch(`${CDP_HTTP}/json/close/${targetId}`, { method: "PUT" }).catch(() => undefined);
  }

  console.log(
    JSON.stringify({ checks: selectedTests.length, passes: passes.length, failures }, null, 2),
  );
  if (failures.length) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error.stack ?? error);
  process.exitCode = 1;
});
