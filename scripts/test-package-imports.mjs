import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import test from "node:test";

// Run from the repository after build:lib, or from an unpacked-package consumer.
// No bundler, DOM shim, custom loader, or require.extensions hook in the child.
const consumerRoot = process.env.UNITARY_PACKAGE_CONSUMER_ROOT ?? process.cwd();
const requireFromConsumer = createRequire(path.join(consumerRoot, "package.json"));
const packageName = "@hustradio/unitary-ui";
function consume(mode) {
  const load = mode === "module"
    ? `const api = await import('${packageName}');`
    : `const api = require('${packageName}');`;
  const result = spawnSync(process.execPath, [`--input-type=${mode}`, "-e", `
    ${mode === "module" ? 'import { createRequire } from "node:module"; const require = createRequire(process.cwd() + "/package.json");' : ""}
    const assert = require('node:assert/strict');
    const { createElement: h, useEffect } = require('react');
    const { renderToStaticMarkup: render } = require('react-dom/server');
    ${load}
    assert.equal(typeof window, 'undefined');
    assert.equal(typeof document, 'undefined');
    for (const name of ['NumberedPagination', 'Carousel', 'FullPageScroller', 'LazyLoad', 'Prefetch', 'createPrefetch', 'usePrefetchState']) {
      assert.equal(typeof api[name], 'function', name);
    }
    for (const name of ['getToken', 'getTokens', 'setToken', 'setTokens', 'resetToken', 'resetTokens', 'subscribeTokens', 'useTokens']) {
      assert.equal(typeof api[name], 'function', name);
    }
    for (const name of ['Flex', 'Layer', 'LayerScope', 'LayerPortal', 'useLayerStyle']) {
      assert.equal(typeof api[name], 'function', name);
    }
    assert.equal(Object.hasOwn(api, 'Stack'), false);
    assert.equal(typeof api.ThemeProvider, 'function');
    assert.equal(typeof api.useTheme, 'function');
    for (const name of ['MotionProvider', 'AnimatePresence', 'useMotionTransition', 'HituBox', 'HituFile']) {
      assert.equal(typeof api[name], 'function', name);
    }
    assert.ok(api.motion.div, 'slim motion components are available from the package root');
    assert.ok(api.HituPlayer, 'HituPlayer is available from the package root');
    assert.equal(api.HituBox.width, 1024);
    assert.equal(api.HituBox.height, 1024);
    assert.equal(api.HituFile.width, 1024);
    assert.equal(api.HituFile.height, 1024);
    const ServerTransition = () => {
      const transition = api.useMotionTransition('state');
      assert.equal(transition.duration, 0, 'SSR does not invent token values');
      return h('output', null, transition.duration);
    };
    assert.equal(render(h(api.MotionProvider, null, h(ServerTransition))), '<output>0</output>');
    assert.match(render(h(api.MotionProvider, null,
      h(api.AnimatePresence, null, h(api.motion.div, {initial: false, animate: {opacity: 1}}, 'Motion SSR')))), /Motion SSR/);
    const Shape = Object.assign(() => h('rect', {width: 10, height: 10, fill: 'currentColor'}), {width: 10, height: 10});
    const scene = {width: 100, height: 100, frames: 120, defaultPlay: true, defaultFrame: 12,
      shapes: [{source: Shape, frames: [{frame: 0, x: 0}, {frame: 119, x: 60}]}]};
    const hituHtml = render(h(api.HituPlayer, scene));
    assert.equal(render(h(api.HituPlayer, scene)), hituHtml, 'Hitu SSR markup is deterministic');
    assert.match(hituHtml, /data-slot="hitu-player"/);
    assert.match(hituHtml, /data-frame="12"/);
    assert.match(hituHtml, /data-playing="false"/);
    assert.match(hituHtml, /aria-hidden="true"/);
    assert.match(hituHtml, /<rect/);
    const namedHitu = render(h(api.HituPlayer, {...scene, 'aria-label': 'Illustrated file'}));
    assert.match(namedHitu, /aria-label="Illustrated file"/);
    assert.doesNotMatch(namedHitu, /aria-hidden="true"/);
    assert.match(render(h(api.HituPlayer, {width: 128, height: 128,
      shapes: [{source: api.HituBox}, {source: api.HituFile}]})), /<path/);
    const HydrationTree = () => {
      useEffect(() => {}, []);
      return h(api.MotionProvider, null,
        h(api.motion.div, {initial: false, animate: {opacity: 1}},
          h(api.HituPlayer, {width: 128, height: 128, frames: 120, defaultFrame: 12,
            shapes: [{source: api.HituBox, x: 64, y: 64, scaleX: 0.1, scaleY: 0.1}]})));
    };
    const hydrationHtml = render(h(HydrationTree));
    const TextureState = () => {
      const {texture, resolvedTexture, setTexture} = api.useTheme();
      assert.equal(typeof setTexture, 'function');
      return h('output', null, texture + '/' + resolvedTexture);
    };
    assert.equal(render(h(api.ThemeProvider, null, h(TextureState))), '<output>solid/solid</output>');
    assert.equal(render(h(api.ThemeProvider, {defaultTexture: 'glass'}, h(TextureState))), '<output>glass/solid</output>');
    assert.equal(render(h(api.ThemeProvider, {texture: 'glass'},
      h(api.ThemeProvider, {texture: 'hybrid'}, h(TextureState)))), '<output>glass/solid</output>');
    assert.match(render(h(api.Flex, {direction: 'row'}, 'Flex content')), /data-slot="flex"/);
    assert.match(render(h(api.LayerScope, {levels: {popover: 71}}, h(api.Layer, {level: 'popover'}))), /--uni-z-popover:71/);
    assert.equal(render(h(api.LayerPortal, null, 'Client portal')), '');
    assert.equal(api.getToken('--radius'), '');
    assert.deepEqual(api.getTokens(['--radius']), {'--radius': ''});
    assert.equal(api.setToken('--radius', '8px'), false);
    assert.equal(api.resetTokens(), false);
    api.subscribeTokens(() => {})();
    for (const name of ['getColorScheme', 'getCodeTheme', 'resolveCodeTheme', 'getInlineCodeColors', 'createColorSchemeCSS', 'applyColorScheme', 'applyCodeTheme']) {
      assert.equal(typeof api[name], 'function', name);
    }
    assert.equal(api.COLOR_SCHEMES.length, 4);
    assert.equal(api.CODE_THEMES.length, 6);
    assert.equal(api.getColorScheme('unitary-blue').ui.dark['--primary'], '#0d47a1');
    const monokai = api.resolveCodeTheme(api.getCodeTheme('monokai'), api.getColorScheme('green'), 'light');
    assert.equal(monokai.mode, 'dark');
    assert.equal(monokai.colors.number, '#ae81ff');
    assert.match(api.createColorSchemeCSS({scheme: 'green', blockTheme: 'monokai'}), /--scheme-code-number: #ae81ff/);
    api.applyColorScheme(null, {mode: 'light'})();
    api.applyCodeTheme(null, {mode: 'dark'})();
    assert.equal(api.GLOBAL_TOKENS['--radius'].kind, 'runtime');
    assert.ok(api.RUNTIME_TOKEN_NAMES.includes('--radius'));
    assert.ok(api.TOKEN_NAMES.includes('--radius-lg'));
    assert.equal(api.GLOBAL_TOKENS['--breakpoint-grid-md'].kind, 'mapping');
    assert.ok(!api.RUNTIME_TOKEN_NAMES.includes('--breakpoint-grid-md'));
    assert.throws(() => api.setToken('--breakpoint-grid-md', '100rem'), /Build-time mapping/);
    assert.equal(api.GLOBAL_TOKENS['--radius-circle'].status, 'deprecated');
    assert.equal(api.GLOBAL_TOKENS['--radius-circle'].replacement, '--radius-circular');
    assert.equal(render(h(() => h('output', null, api.useTokens(['--radius'])['--radius']))), '<output></output>');
    assert.match(render(h(api.NumberedPagination, {totalPages: 5})), /aria-current="page"/);
    assert.match(render(h(api.FullPageScroller, {index: 1}, h('div', null, 'First'), h('div', null, 'Second'))), /data-index="1"/);
    assert.match(render(h(api.LazyLoad, {disabled: true}, 'Eager server content')), /Eager server content/);
    let prefetchCalls = 0;
    const resource = api.createPrefetch(() => { prefetchCalls++; return 'value'; });
    assert.match(render(h(api.Prefetch, {resource, trigger: 'idle'}, 'Prepared later')), /data-state="idle"/);
    assert.equal(prefetchCalls, 0);
    assert.equal(render(h(() => h('output', null, api.usePrefetchState(resource).status))), '<output>idle</output>');
    assert.match(render(h(api.Button, null, 'Node button')), /Node button/);
    assert.match(render(h(api.ContinuousSurface, {radius: 12}, 'Surface')), /border-radius:12px/);
    assert.deepEqual(api.cornerCurvePoints(24, 100, 24).at(-1), [24, 0]);
    const samples = {
      markup: '<div>Hello</div>', javascript: 'const answer = 42;',
      jsx: 'const element = <div />;', typescript: 'const answer: number = 42;',
      tsx: 'const element: JSX.Element = <div />;', json: '{"answer":42}',
      bash: 'echo "$HOME"'
    };
    const highlightedToken = /class="token (?!plain")/;
    // Unknown languages render token plain; they must not count as highlighting.
    assert.doesNotMatch(render(h(api.CodeBlock, {language: 'not-registered'}, 'const x = 1;')), highlightedToken);
    for (const [language, code] of Object.entries(samples)) {
      assert.match(render(h(api.CodeBlock, {language}, code)), highlightedToken, language);
    }
    const devices = ['iphone-17', 'pixel-10', 'galaxy-s25', 'ipad-pro'];
    const html = devices.map(model => render(h(api.Device, {model, autoFit: false},
      h(api.DeviceScreen, null, 'Node device')))).join('');
    const gridHtml = [false, true].map(container => render(h('div',
      {'data-grid-probe': container ? 'container' : 'viewport'},
      h(api.GridSystem, {unstable_useContainer: container},
        h(api.Grid, {columns: {xs:1,sm:2,smd:3,md:4,lg:5}, rows:1},
          h(api.GridCell, null, 'Grid probe')))))).join('');
    assert.match(html, /mockframe/);
    process.stdout.write(JSON.stringify({exports: Object.keys(api).sort(), html, gridHtml, hydrationHtml}));
  `], { cwd: consumerRoot, encoding: "utf8", timeout: 30_000 });
  const error = (result.stderr ?? "").split("\n").filter(line => line.length < 1000).join("\n");
  assert.equal(result.status, 0, `${mode}: ${result.error ?? error}`);
  return JSON.parse(result.stdout);
}

let esm;
test("native ESM package import supports SSR and all registered Prism grammars", () => {
  esm = consume("module");
});

test("published output excludes the prefetch demo response", () => {
  const dist = path.dirname(requireFromConsumer.resolve(packageName));
  assert.equal(existsSync(path.join(dist, "prefetch-preview.json")), false);
});

test("published package preserves Hitu attribution and its pinned upstream license", () => {
  const packageRoot = path.dirname(requireFromConsumer.resolve(`${packageName}/package.json`));
  for (const file of ['THIRD_PARTY_NOTICES.md', 'THIRD_PARTY_NOTICES.en.md']) {
    const notices = readFileSync(path.join(packageRoot, file), 'utf8');
    assert.match(notices, /HiTu/i, file);
    assert.match(notices, /92119663fb5e551ccab5d0b46532c0a3317e0cc8/, file);
    assert.match(notices, /Permission is hereby granted, free of charge/, file);
  }
});

test("package-root Motion and Hitu SSR hydrate without recoverable errors", async () => {
  const { chromium } = await import("@playwright/test");
  const { build } = await import("vite");
  const { hydrationHtml } = esm ?? consume("module");
  const scratch = path.join(consumerRoot, ".scratch/package-hydration");
  mkdirSync(scratch, { recursive: true });
  const entry = path.join(scratch, "consumer.js");
  writeFileSync(entry, `
import {createElement as h, useEffect} from 'react';
import {hydrateRoot} from 'react-dom/client';
import {MotionProvider, motion, HituPlayer, HituBox} from '${packageName}';
window.packageHydrationErrors = [];
function HydrationTree() {
  useEffect(() => { window.packageHydrated = true; }, []);
  return h(MotionProvider, null,
    h(motion.div, {initial: false, animate: {opacity: 1}},
      h(HituPlayer, {width: 128, height: 128, frames: 120, defaultFrame: 12,
        shapes: [{source: HituBox, x: 64, y: 64, scaleX: 0.1, scaleY: 0.1}]})));
}
hydrateRoot(document.getElementById('root'), h(HydrationTree), {
  onRecoverableError(error) { window.packageHydrationErrors.push(error.message); }
});
`);
  // Build the public package entry rather than the source entry or an alias.
  const bundle = await build({
    configFile: false,
    logLevel: "warn",
    define: { "process.env.NODE_ENV": JSON.stringify("production") },
    build: { write: false, minify: true, lib: { entry, name: "PackageHydration", formats: ["iife"] } },
  });
  const outputs = (Array.isArray(bundle) ? bundle : [bundle]).flatMap(result => result.output);
  const code = outputs.find(output => output.type === "chunk")?.code;
  assert.ok(code, "Hydration consumer emitted JavaScript");
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
    await page.setContent(`<!doctype html><div id="root">${hydrationHtml}</div>`);
    await page.addScriptTag({ content: code });
    try {
      await page.waitForFunction(() => window.packageHydrated === true, null, { timeout: 10_000 });
    } catch (error) {
      const recoverable = await page.evaluate(() => window.packageHydrationErrors ?? []);
      assert.fail(`Package hydration did not complete: ${error.message}; browser errors: ${JSON.stringify(errors)}; recoverable errors: ${JSON.stringify(recoverable)}`);
    }
    assert.deepEqual(await page.evaluate(() => window.packageHydrationErrors), []);
    assert.deepEqual(errors, []);
    assert.equal(await page.locator('[data-slot="hitu-player"]').getAttribute("data-frame"), "12");
    assert.equal(await page.locator('[data-slot="hitu-player"]').getAttribute("data-playing"), "false");
  } finally {
    await browser.close();
  }
});

test("published radius utilities have real geometry and preserve runtime/build boundaries", async () => {
  const { chromium } = await import("@playwright/test");
  const css = readFileSync(requireFromConsumer.resolve(`${packageName}/styles.css`), "utf8");
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    const classes = ["rounded-circular", "rounded-capsule", "rounded-continuous", "rounded-md", "rounded-lg"];
    await page.setContent(`<!doctype html><style>${css}</style>${classes.map(name =>
      `<div class="${name}" style="width:100px;height:100px"></div>`).join("")}`);
    for (const theme of ["light", "dark"]) {
      await page.evaluate(theme => {
        document.documentElement.classList.toggle("dark", theme === "dark");
        document.documentElement.style.removeProperty("--radius");
      }, theme);
      const read = () => page.locator("body > div").evaluateAll(elements =>
        elements.map(element => getComputedStyle(element).borderRadius));
      assert.deepEqual(await read(), ["50%", "9999px", "6px", "6px", "8px"], theme);
      await page.evaluate(() => {
        document.documentElement.style.setProperty("--radius", "10px");
        document.documentElement.style.setProperty("--radius-circular", "25%");
        document.documentElement.style.setProperty("--radius-capsule", "12px");
      });
      assert.deepEqual(await read(), ["50%", "9999px", "10px", "10px", "8px"], theme);
    }
  } finally {
    await browser.close();
  }
});

test("published Grid CSS preserves viewport and container tier boundaries in both themes", async () => {
  const { chromium } = await import("@playwright/test");
  const { gridHtml } = esm ?? consume("module");
  const css = readFileSync(requireFromConsumer.resolve(`${packageName}/styles.css`), "utf8");
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.setContent(`<!doctype html><style>${css}</style>${gridHtml}`);
    const viewportGrid = page.locator('[data-grid-probe="viewport"] [data-slot="grid"]');
    const containerGrid = page.locator('[data-grid-probe="container"] [data-slot="grid"]');
    const wrapper = page.locator('[data-slot="grid-system-wrapper"]');
    const boundaries = [[400,1],[401,2],[600,2],[601,3],[768,3],[769,4],[960,4],[961,5],[1280,5]];
    const columns = locator => locator.evaluate(element =>
      getComputedStyle(element).gridTemplateColumns.split(" ").length);
    for (const theme of ["light", "dark"]) {
      await page.evaluate(theme => document.documentElement.classList.toggle("dark", theme === "dark"), theme);
      for (const [width, expected] of boundaries) {
        await page.setViewportSize({width, height:900});
        assert.equal(await columns(viewportGrid), expected, `${theme} viewport ${width}`);
      }
      await page.setViewportSize({width:1440, height:900});
      for (const [width, expected] of boundaries) {
        await wrapper.evaluate((element, width) => { element.style.width = `${width}px`; }, width);
        assert.equal(await columns(containerGrid), expected, `${theme} container ${width}`);
      }
    }
  } finally {
    await browser.close();
  }
});

test("native CJS package require supports SSR with the same exports", () => {
  const cjs = consume("commonjs");
  assert.deepEqual(cjs.exports, (esm ?? consume("module")).exports);
});

test("published stylesheet contains all four device CSS bundles", () => {
  const css = readFileSync(requireFromConsumer.resolve(`${packageName}/styles.css`), "utf8");
  for (const device of ["iphone17", "pixel10", "ipad-pro", "macbook-pro"]) {
    assert.ok(css.includes(`.mockframe.${device}`), `Missing device CSS: ${device}`);
  }
});

test("published CSS styles SSR devices in Chromium without dependency CSS imports", async () => {
  const { chromium } = await import("@playwright/test");
  const { html } = esm ?? consume("module");
  const css = readFileSync(requireFromConsumer.resolve(`${packageName}/styles.css`), "utf8");
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1000, height: 1000 } });
    await page.setContent(`<!doctype html><style>${css}</style>${html}`);
    const geometry = await page.locator('[data-slot="device"]').evaluateAll(devices => devices.map(device => {
      const frame = device.querySelector('.mockframe');
      const style = getComputedStyle(frame);
      return { model: device.getAttribute('data-model'), width: frame.getBoundingClientRect().width,
        padding: parseFloat(style.paddingLeft), boxSizing: style.boxSizing };
    }));
    assert.deepEqual(geometry, [
      { model: "iphone-17", width: 417, padding: 12, boxSizing: "content-box" },
      { model: "pixel-10", width: 436, padding: 12, boxSizing: "content-box" },
      { model: "galaxy-s25", width: 432, padding: 10, boxSizing: "content-box" },
      { model: "ipad-pro", width: 548, padding: 18, boxSizing: "content-box" },
    ]);
  } finally {
    await browser.close();
  }
});
