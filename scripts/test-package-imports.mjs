import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import test from "node:test";

// Run from the repository after build:lib, or from an unpacked-package consumer.
// No bundler, DOM shim, custom loader, or require.extensions hook in the child.
const requireFromConsumer = createRequire(path.resolve("package.json"));
const packageName = "@hustradio/unitary-ui";
function consume(mode) {
  const load = mode === "module"
    ? `const api = await import('${packageName}');`
    : `const api = require('${packageName}');`;
  const result = spawnSync(process.execPath, [`--input-type=${mode}`, "-e", `
    ${mode === "module" ? 'import { createRequire } from "node:module"; const require = createRequire(process.cwd() + "/package.json");' : ""}
    const assert = require('node:assert/strict');
    const { createElement: h } = require('react');
    const { renderToStaticMarkup: render } = require('react-dom/server');
    ${load}
    assert.equal(typeof window, 'undefined');
    assert.equal(typeof document, 'undefined');
    for (const name of ['NumberedPagination', 'Carousel', 'FullPageScroller', 'LazyLoad']) {
      assert.equal(typeof api[name], 'function', name);
    }
    for (const name of ['getToken', 'getTokens', 'setToken', 'setTokens', 'resetToken', 'resetTokens', 'subscribeTokens', 'useTokens']) {
      assert.equal(typeof api[name], 'function', name);
    }
    assert.equal(api.getToken('--radius'), '');
    assert.deepEqual(api.getTokens(['--radius']), {'--radius': ''});
    assert.equal(api.setToken('--radius', '8px'), false);
    assert.equal(api.resetTokens(), false);
    api.subscribeTokens(() => {})();
    assert.equal(api.GLOBAL_TOKENS['--radius'].kind, 'runtime');
    assert.ok(api.RUNTIME_TOKEN_NAMES.includes('--radius'));
    assert.ok(api.TOKEN_NAMES.includes('--radius-lg'));
    assert.equal(render(h(() => h('output', null, api.useTokens(['--radius'])['--radius']))), '<output></output>');
    assert.match(render(h(api.NumberedPagination, {totalPages: 5})), /aria-current="page"/);
    assert.match(render(h(api.FullPageScroller, {index: 1}, h('div', null, 'First'), h('div', null, 'Second'))), /data-index="1"/);
    assert.match(render(h(api.LazyLoad, {disabled: true}, 'Eager server content')), /Eager server content/);
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
    assert.match(html, /mockframe/);
    process.stdout.write(JSON.stringify({exports: Object.keys(api).sort(), html}));
  `], { encoding: "utf8", timeout: 30_000 });
  const error = (result.stderr ?? "").split("\n").filter(line => line.length < 1000).join("\n");
  assert.equal(result.status, 0, `${mode}: ${result.error ?? error}`);
  return JSON.parse(result.stdout);
}

let esm;
test("native ESM package import supports SSR and all registered Prism grammars", () => {
  esm = consume("module");
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
