#!/usr/bin/env node
import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { assertEvidenceCellV2, assertManifestV2 } from "./audit-schema-validator.mjs";
import {
  buildEvidenceCellV2,
  collectMetricsContractViolations,
  computeLocalSourceState,
  resolveEvidenceContract,
} from "./evidence-v2.mjs";

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

const DEFAULT_ANCESTOR_DEPTH = 6;
const MAX_ANCESTOR_DEPTH = 6;
const RECIPE_VERBS = new Set([
  "click",
  "hover",
  "focus",
  "press",
  "wait",
  "open",
  "closed",
  "disabled",
  "drag",
]);

function parseJsonArg(text, flag, what) {
  let value;
  try {
    value = JSON.parse(text);
  } catch {
    throw new Error(`Invalid JSON for ${flag}: expected ${what}, got ${text}`);
  }
  return value;
}

function validateRecipe(recipe) {
  if (!Array.isArray(recipe) || recipe.length === 0)
    throw new Error("--state-recipe 必须是至少一个步骤的 JSON 数组");
  for (const step of recipe) {
    if (typeof step !== "string")
      throw new Error(`--state-recipe 步骤必须是 "动词:目标" 字符串: ${JSON.stringify(step)}`);
    const verb = step.split(":")[0];
    if (!RECIPE_VERBS.has(verb)) throw new Error(`--state-recipe 未知步骤动词: ${step}`);
  }
}

function parseAncestorDepth(text) {
  const value = Number(text);
  if (!Number.isInteger(value) || value < 1 || value > MAX_ANCESTOR_DEPTH)
    throw new Error(`--ancestor-depth 必须是 1..${MAX_ANCESTOR_DEPTH} 的整数: ${text}`);
  return value;
}

function resolveRootSelector({ selector, rootSelector, demoId }) {
  if (demoId != null) return rootSelector ?? `[data-demo-id="${demoId}"]`;
  return rootSelector ?? selector;
}

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

  const demoId = args.demoId ?? null;
  let stateRecipe = null;
  if (args.stateRecipe != null) {
    stateRecipe = parseJsonArg(args.stateRecipe, "--state-recipe", "步骤数组");
    validateRecipe(stateRecipe);
  }
  let roleSelectors = null;
  if (args.roleSelector != null) {
    roleSelectors = parseJsonArg(
      args.roleSelector,
      "--role-selector",
      '角色到选择器的对象，如 {"root":"...","content":"..."}',
    );
    if (!roleSelectors || typeof roleSelectors !== "object" || Array.isArray(roleSelectors))
      throw new Error(`--role-selector 必须是角色到选择器的 JSON 对象: ${args.roleSelector}`);
    for (const [role, roleSelector] of Object.entries(roleSelectors)) {
      if (typeof roleSelector !== "string" || roleSelector.length === 0)
        throw new Error(`--role-selector 的 "${role}" 必须是非空字符串选择器`);
    }
  }
  const ancestorDepth =
    args.ancestorDepth == null ? DEFAULT_ANCESTOR_DEPTH : parseAncestorDepth(args.ancestorDepth);
  const rootSelector = resolveRootSelector({
    selector,
    rootSelector: args.rootSelector ?? null,
    demoId,
  });
  // demo 维度的证据单元禁止回退到 main：找不到 demo root 宁可失败，也不能把 main 当成 acceptance evidence。
  if (demoId != null && rootSelector === "main")
    throw new Error(
      `--demo-id "${demoId}" 禁止把 root 回退到 main 选择器；请提供 --root-selector 或依赖 data-demo-id 定位`,
    );

  return {
    source,
    slug,
    variant,
    state,
    theme,
    viewport,
    viewportText,
    selector,
    rootSelector,
    demoId,
    stateRecipe,
    roleSelectors,
    ancestorDepth,
    sourceTimestamp: null,
    url,
    out: path.resolve(out),
    cdpHttp: args.cdpHttp ?? process.env.CDP_HTTP ?? "http://127.0.0.1:9223",
    runId: args.runId ?? `${Date.now()}-${process.pid}`,
    cellKey:
      demoId != null
        ? `${source}/${slug}/${variant}/${state}/${theme}/${viewportText}/demo:${demoId}`
        : `${source}/${slug}/${variant}/${state}/${theme}/${viewportText}`,
    outputPolicy: "isolated-run-directory",
    outputIsolation: "per-source-run-directory",
  };
}

async function makeV2Config(args) {
  for (const override of ["selector", "rootSelector", "roleSelector"]) {
    if (args[override] != null) {
      throw new Error(
        `--${override.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)} cannot override a manifest v2 acceptance contract`,
      );
    }
  }

  const manifestPath = path.resolve(required(args, "manifest"));
  const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
  assertManifestV2(manifest);
  const source = required(args, "source");
  const slug = required(args, "slug");
  const demoId = required(args, "demoId");
  const variant = required(args, "variant");
  const state = required(args, "state");
  const theme = required(args, "theme");
  const viewportText = required(args, "viewport");
  const auditRunId = required(args, "auditRunId");
  const out = required(args, "out");
  if (!new Set(["official", "local"]).has(source)) throw new Error(`Invalid source: ${source}`);
  if (!new Set(["light", "dark"]).has(theme)) throw new Error(`Invalid theme: ${theme}`);
  const viewportMatch = /^(\d+)x(\d+)$/.exec(viewportText);
  if (!viewportMatch) throw new Error(`Invalid viewport: ${viewportText}; expected WIDTHxHEIGHT`);
  const viewport = { width: Number(viewportMatch[1]), height: Number(viewportMatch[2]) };

  let stateRecipe = null;
  if (args.stateRecipe != null) {
    stateRecipe = parseJsonArg(args.stateRecipe, "--state-recipe", "步骤数组");
    validateRecipe(stateRecipe);
  }
  const resolved = resolveEvidenceContract(manifest, {
    source,
    slug,
    demoId,
    variant,
    state,
    theme,
    viewportText,
    auditRunId,
  });
  const repoRoot = path.resolve(args.repoRoot ?? process.cwd());
  const localSourceState =
    source === "local"
      ? computeLocalSourceState(repoRoot, manifest.acceptancePolicy.localSourceInputs)
      : {
          localRevision: null,
          worktreeClean: null,
          localSourceDigest: null,
          localSourceFiles: [],
        };
  const url = source === "official" ? resolved.url : required(args, "url");
  const ancestorDepth =
    args.ancestorDepth == null ? DEFAULT_ANCESTOR_DEPTH : parseAncestorDepth(args.ancestorDepth);

  return {
    ...resolved,
    slug,
    viewport,
    selector: resolved.rootSelector,
    stateRecipe,
    ancestorDepth,
    navigationStartedAt: null,
    stateStabilizedAt: null,
    capturedAt: null,
    sourceTimestamp: null,
    url,
    out: path.resolve(out),
    cdpHttp: args.cdpHttp ?? process.env.CDP_HTTP ?? "http://127.0.0.1:9223",
    runId: args.runId ?? `${Date.now()}-${process.pid}`,
    cellKey: `${source}/${slug}/${variant}/${state}/${theme}/${viewportText}/demo:${demoId}`,
    outputPolicy: "isolated-run-directory",
    outputIsolation: "per-source-run-directory",
    repoRoot,
    ...localSourceState,
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

async function elementPoint(send, selector) {
  return evaluate(
    send,
    `(() => {
      const el = document.querySelector(${JSON.stringify(selector)});
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    })()`,
  );
}

async function applyStateRecipe(send, config) {
  const recipe = config.stateRecipe;
  if (!Array.isArray(recipe) || recipe.length === 0) return;
  const selectorFor = (target) => {
    if (target === "root") return config.rootSelector;
    return config.roleSelectors?.[target] ?? null;
  };
  for (const step of recipe) {
    const [verb, target] = step.split(":");
    if (!target) throw new Error(`--state-recipe 步骤缺少目标: ${step}`);
    if (verb === "press") {
      const key = target;
      await send("Input.dispatchKeyEvent", {
        type: "keyDown",
        key,
        code: key === "Space" ? "Space" : key,
        windowsVirtualKeyCode: key === "Space" ? 32 : 0,
      });
      await send("Input.dispatchKeyEvent", {
        type: "keyUp",
        key,
        code: key === "Space" ? "Space" : key,
        windowsVirtualKeyCode: key === "Space" ? 32 : 0,
      });
      continue;
    }
    const selector = selectorFor(target);
    if (!selector)
      throw new Error(
        `--state-recipe 步骤 "${step}" 找不到角色选择器（root 或 roleSelectors 中的角色）`,
      );
    switch (verb) {
      case "click": {
        const point = await elementPoint(send, selector);
        if (!point) throw new Error(`--state-recipe "${step}" 目标不存在: ${selector}`);
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
        break;
      }
      case "hover": {
        const point = await elementPoint(send, selector);
        if (!point) throw new Error(`--state-recipe "${step}" 目标不存在: ${selector}`);
        await send("Input.dispatchMouseEvent", { type: "mouseMoved", ...point });
        break;
      }
      case "focus":
        await evaluate(
          send,
          `(() => { const el = document.querySelector(${JSON.stringify(selector)}); if (el) el.focus(); })()`,
        );
        break;
      case "wait": {
        if (target === "open" || target === "closed") {
          await waitFor(
            send,
            `(() => {
              const root = document.querySelector(${JSON.stringify(config.rootSelector)});
              if (!root) return false;
              const open = root.matches('[data-state="open"],[aria-expanded="true"]') ||
                Boolean(root.querySelector('[data-state="open"],[aria-expanded="true"],[role="dialog"]'));
              return ${target === "open" ? "open" : "!open"};
            })()`,
            `wait:${target}`,
          );
        } else {
          await waitFor(
            send,
            `Boolean(document.querySelector(${JSON.stringify(selector)}))`,
            `wait:${target}`,
          );
        }
        break;
      }
      case "open": {
        const point = await elementPoint(send, selector);
        if (!point) throw new Error(`--state-recipe "${step}" 目标不存在: ${selector}`);
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
        await waitFor(
          send,
          `(() => {
            const root = document.querySelector(${JSON.stringify(config.rootSelector)});
            if (!root) return false;
            return root.matches('[data-state="open"],[aria-expanded="true"]') ||
              Boolean(root.querySelector('[data-state="open"],[aria-expanded="true"],[role="dialog"]'));
          })()`,
          `open:${target}`,
        );
        break;
      }
      case "closed":
        // 已关闭状态：无需操作，证据以当前 DOM 为准
        break;
      case "disabled": {
        const disabled = await evaluate(
          send,
          `(() => {
            const el = document.querySelector(${JSON.stringify(selector)});
            if (!el) return null;
            return el.disabled === true ||
              el.getAttribute('aria-disabled') === 'true' ||
              Boolean(el.closest('[aria-disabled="true"],[disabled]'));
          })()`,
        );
        if (!disabled)
          throw new Error(`--state-recipe "${step}" 目标未处于 disabled 状态: ${selector}`);
        break;
      }
      case "drag": {
        const point = await elementPoint(send, selector);
        if (!point) throw new Error(`--state-recipe "${step}" 目标不存在: ${selector}`);
        await send("Input.dispatchMouseEvent", { type: "mouseMoved", ...point });
        await send("Input.dispatchMouseEvent", {
          type: "mousePressed",
          ...point,
          button: "left",
          buttons: 1,
          clickCount: 1,
        });
        await send("Input.dispatchMouseEvent", {
          type: "mouseMoved",
          x: point.x + 60,
          y: point.y,
          button: "left",
          buttons: 1,
        });
        await send("Input.dispatchMouseEvent", {
          type: "mouseReleased",
          x: point.x + 60,
          y: point.y,
          button: "left",
          buttons: 0,
          clickCount: 1,
        });
        break;
      }
      default:
        throw new Error(`--state-recipe 未知步骤动词: ${step}`);
    }
  }
}

function metricsExpression(selector, ancestorDepth, roleSelectors) {
  return `(() => {
    const selector = ${JSON.stringify(selector)};
    const ancestorDepth = ${JSON.stringify(ancestorDepth)};
    const roleSelectors = ${JSON.stringify(roleSelectors)};
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
    const layoutOwners = (style) => ({
      maxWidth: style.maxWidth !== 'none' ? style.maxWidth : null,
      padding: style.padding !== '0px' ? style.padding : null,
      grid: style.display.includes('grid') ? style.display : null,
      marginAuto:
        style.marginLeft === 'auto' || style.marginRight === 'auto'
          ? { left: style.marginLeft, right: style.marginRight }
          : null,
      overflow: style.overflow !== 'visible' ? style.overflow : null,
      position: style.position !== 'static' ? style.position : null,
    });
    const elements = [root, ...root.querySelectorAll('*')];
    const ancestors = [];
    {
      let current = root.parentElement;
      let depth = 0;
      while (current && depth < ancestorDepth) {
        const style = styleValue(current);
        ancestors.push({
          depth: depth + 1,
          tag: current.tagName.toLowerCase(),
          rect: rectValue(current),
          styles: style,
          layoutOwners: layoutOwners(style),
        });
        current = current.parentElement;
        depth += 1;
      }
    }
    const topLevelHost = (() => {
      let node = root;
      while (node.parentElement && node.parentElement !== document.body) node = node.parentElement;
      return node.parentElement === document.body ? node : null;
    })();
    const rootStyle = styleValue(root);
    const roles = Object.fromEntries(
      Object.entries(roleSelectors ?? {}).map(([role, roleSelector]) => {
        const element = document.querySelector(roleSelector);
        if (!element) {
          return [role, {
            selector: roleSelector,
            present: false,
            rect: { x: 0, y: 0, width: 0, height: 0 },
            styles: {},
            aria: {},
            ancestorChain: [],
          }];
        }
        const styles = styleValue(element);
        delete styles.cssVariables;
        const textSample = (element.textContent || '').trim();
        const fontShorthand = [
          styles.fontStyle || 'normal',
          styles.fontWeight || '400',
          (styles.fontSize || '16px') + '/' + (styles.lineHeight || 'normal'),
          styles.fontFamily || 'sans-serif',
        ].join(' ');
        const textRange = document.createRange();
        textRange.selectNodeContents(element);
        const ancestorChain = [];
        let current = element.parentElement;
        let depth = 0;
        while (current && depth < ancestorDepth) {
          ancestorChain.push({
            depth: depth + 1,
            tag: current.tagName.toLowerCase(),
            rect: rectValue(current),
          });
          current = current.parentElement;
          depth += 1;
        }
        return [role, {
          selector: roleSelector,
          present: true,
          rect: rectValue(element),
          styles,
          textEvidence: {
            textSample,
            fontShorthand,
            fontLoadStatus: document.fonts.check(fontShorthand, textSample || 'BESbswy'),
            clientRects: [...textRange.getClientRects()].map((rect) => ({
              x: rect.x,
              y: rect.y,
              width: rect.width,
              height: rect.height,
            })),
            clientWidth: element.clientWidth,
            scrollWidth: element.scrollWidth,
            whiteSpace: styles.whiteSpace,
            overflow: styles.overflow,
            textOverflow: styles.textOverflow,
          },
          aria: {
            role: element.getAttribute('role'),
            attributes: Object.fromEntries(
              [...element.attributes]
                .filter((attribute) => attribute.name === 'role' || attribute.name.startsWith('aria-'))
                .map((attribute) => [attribute.name, attribute.value])
            ),
          },
          ancestorChain,
        }];
      })
    );
    return {
      root: rectValue(root),
      roles,
      nodes: elements.map((element) => ({
        path: pathFor(element),
        tag: element.tagName.toLowerCase(),
        rect: rectValue(element),
        styles: styleValue(element),
        before: styleValue(element, '::before'),
        after: styleValue(element, '::after'),
      })),
      ancestors,
      aria: {
        role: root.getAttribute('role'),
        attributes: Object.fromEntries(
          [...root.attributes]
            .filter((attribute) => attribute.name === 'role' || attribute.name.startsWith('aria-'))
            .map((attribute) => [attribute.name, attribute.value])
        ),
        descendantRoles: [...new Set([...root.querySelectorAll('[role]')].map((el) => el.getAttribute('role')))],
      },
      portal: {
        isInPortal:
          Boolean(topLevelHost) &&
          topLevelHost.tagName.toLowerCase() !== 'main' &&
          topLevelHost.id !== 'root',
        topLevelHost: topLevelHost
          ? {
              tag: topLevelHost.tagName.toLowerCase(),
              id: topLevelHost.id || null,
              className: typeof topLevelHost.className === 'string' ? topLevelHost.className : null,
            }
          : null,
      },
      motion: {
        transition: rootStyle.transition,
        transitionDuration: rootStyle.transitionDuration,
        animation: rootStyle.animation,
        animationDuration: rootStyle.animationDuration,
        reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
        transitioningAncestors: ancestors.filter((ancestor) => {
          const transition = ancestor.styles.transition || '';
          const animation = ancestor.styles.animation || '';
          return (
            (transition !== 'none' && transition !== 'all 0s ease 0s') ||
            (animation !== 'none' && animation !== '')
          );
        }).length,
      },
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
    const browserVersion = (await send("Browser.getVersion")).product;
    await send("Emulation.setDeviceMetricsOverride", {
      ...config.viewport,
      deviceScaleFactor: 1,
      mobile: config.viewport.width <= 480,
    });
    const navigationStartedAt = new Date().toISOString();
    await send("Page.navigate", { url: config.url });
    await waitFor(
      send,
      `document.readyState === 'complete' || document.readyState === 'interactive'`,
      "document readiness",
    );
    await waitFor(
      send,
      `Boolean(document.querySelector(${JSON.stringify(config.rootSelector)}))`,
      config.rootSelector,
    );
    const sourceTimestamp = new Date().toISOString();
    const observedTheme = await applyTheme(send, config.theme);
    await applyStateRecipe(send, config);
    if (config.schemaVersion === 2) {
      await evaluate(
        send,
        `document.fonts.ready
          .then(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))))
          .then(() => true)`,
      );
      config.navigationStartedAt = navigationStartedAt;
      config.stateStabilizedAt = new Date().toISOString();
    }
    const metrics = await evaluate(
      send,
      metricsExpression(config.rootSelector, config.ancestorDepth, config.roleSelectors),
    );
    if (!metrics) throw new Error(`Selector disappeared: ${config.rootSelector}`);
    if (config.schemaVersion === 2) {
      const metricViolations = collectMetricsContractViolations(config, metrics);
      if (metricViolations.length) {
        throw new Error(
          `Collected metrics violate the acceptance contract: ${JSON.stringify(metricViolations)}`,
        );
      }
    }
    // observed theme marker 属于实采 metrics 的一部分，不是 CLI 假设
    metrics.themeMarker = observedTheme;
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
    await atomicWrite(path.join(runDir, "screenshot.png"), Buffer.from(screenshot.data, "base64"));
    await atomicWrite(path.join(runDir, "metrics.json"), `${JSON.stringify(metrics, null, 2)}\n`);
    const capturedAt = new Date().toISOString();
    const collectorSha256 = createHash("sha256")
      .update(await fs.readFile(fileURLToPath(import.meta.url)))
      .digest("hex");
    const cell =
      config.schemaVersion === 2
        ? buildEvidenceCellV2(config, {
            capturedAt,
            observedTheme,
            collectorSha256,
            browserVersion,
          })
        : {
            schemaVersion: 1,
            ...config,
            sourceTimestamp,
            observedTheme,
            screenshot: "screenshot.png",
            metrics: "metrics.json",
            status: "captured",
          };
    if (config.schemaVersion === 2) assertEvidenceCellV2(cell);
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
  const args = parseArgs(process.argv.slice(2));
  const config = args.manifest != null ? await makeV2Config(args) : makeConfig(args);
  if (args.dryRun) {
    console.log(JSON.stringify(config));
    return;
  }
  if (config.schemaVersion === 2 && config.source === "local" && !config.worktreeClean) {
    throw new Error("Local acceptance evidence requires a clean worktree");
  }
  // 官方与本地证据各自写入独立 run 目录，避免同一 out 根下互相覆盖
  const runDir = path.join(config.out, "runs", config.source, config.runId);
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
