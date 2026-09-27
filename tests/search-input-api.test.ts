import { describe, expect, test } from "vitest";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { EXAMPLE_SOURCE } from "../docs/site/src/examples/registry";

import { SearchInput } from "../src/components/ui/search-input";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relativePath: string) => readFile(path.join(root, relativePath), "utf8");

const renderSearchInput = (props: Record<string, unknown>) =>
  renderToStaticMarkup(createElement(SearchInput, props));

describe("SearchInput official API contract (G09 audit fixes)", () => {
  test("matches the live five-demo inventory and keeps the input wrapper contract", async () => {
    const manifest = await read("tests/audit/geist-audit-manifest.json");
    const searchInputSource = EXAMPLE_SOURCE["search-input"];
    expect(searchInputSource).toBeDefined();

    for (const id of ["default", "with-cmdk", "disabled", "loading", "custom-prefix"]) {
      expect(searchInputSource[id]).toBeDefined();
      expect(searchInputSource[id]).toContain("export function");
      expect(manifest).toContain(`"id": "${id}"`);
    }
  });

  test("renders the official prefix/input/suffix slot order", () => {
    const markup = renderSearchInput({ "aria-label": "Search", placeholder: "Enter some text..." });

    expect(markup).toContain('data-slot="search-input"');
    expect(markup).toContain('data-slot="input-prefix"');
    expect(markup).toContain('data-slot="input"');
    expect(markup.indexOf('data-slot="input-prefix"')).toBeLessThan(
      markup.indexOf('data-slot="input"'),
    );
    expect(markup).not.toContain('data-slot="input-suffix"');
  });

  test("cmdk renders two compact keys in the suffix", () => {
    const markup = renderSearchInput({ "aria-label": "Search", cmdk: true });

    expect(markup).toContain('data-slot="input-suffix"');
    expect(markup.match(/data-slot="kbd"/g)).toHaveLength(2);
    expect(markup).toContain("⌘");
    expect(markup).toContain(">K<");
  });

  test("loading replaces the search prefix and keeps an Esc clear action for a value", () => {
    const markup = renderSearchInput({
      "aria-label": "Search",
      defaultValue: "Project A",
      loading: true,
    });

    expect(markup).toContain('data-slot="spinner"');
    expect(markup).toContain('aria-label="Clear search"');
    expect(markup).toContain(">Esc<");
    expect(markup.indexOf('data-slot="spinner"')).toBeLessThan(markup.indexOf('data-slot="input"'));
  });

  test("disabled and custom prefix flow through the shared input slots", () => {
    const disabled = renderSearchInput({ "aria-label": "Search", cmdk: true, disabled: true });
    const custom = renderSearchInput({
      "aria-label": "Search",
      prefix: createElement("span", { "data-testid": "sparkles" }, "sparkles"),
    });

    expect(disabled).toContain("disabled");
    expect(disabled).toContain('data-slot="input-prefix"');
    expect(disabled).toContain('data-slot="input-suffix"');
    expect(custom).toContain('data-testid="sparkles"');
  });

  test("G09-SI-01: underlying input is type=search (native Escape clears the value)", async () => {
    const src = await read("src/components/ui/search-input.tsx");
    // The Input element must render type="search" — not plain text
    expect(src).toMatch(/type="search"/);
    expect(src).toContain("[&_[data-uni-input-wrapper]]:text-label-14");
    expect(src).toContain("[animation-duration:150ms]");
    expect(src).toContain("[&:has(input:disabled)_input::placeholder]:!text-gray-500");
    // type="search" must be enforced after the props spread so callers cannot
    // downgrade it back to type="text" and lose the native Escape-to-clear contract
    expect(src).toMatch(/\{\.\.\.props\}\s*\n\s*type="search"/);
  });

  test("G09-SI-01: rendered markup carries type=search on the input element", () => {
    const markup = renderSearchInput({
      "aria-label": "Search",
      value: "hello geist",
      onChange: () => {},
    });
    expect(markup).toContain('type="search"');
    expect(markup).toContain('value="hello geist"');
    expect(markup).not.toContain('type="text"');
  });

  test("G09-SI-01: native WebKit search cancel button is hidden (custom X is the only clear affordance)", async () => {
    const src = await read("src/components/ui/search-input.tsx");
    expect(src).toMatch(/\[&::-webkit-search-cancel-button\]:hidden/);
  });

  test("G09-SI-01: no manual Escape key handler is required (native behavior via type=search)", async () => {
    const src = await read("src/components/ui/search-input.tsx");
    // The component must not rely on onKeyDown to implement clearing
    expect(src).not.toMatch(/onKeyDown/);
  });

  test("G09-SI-01: controlled and uncontrolled values both flow through the search input", () => {
    // Uncontrolled: defaultValue renders into the search input
    const uncontrolled = renderSearchInput({ defaultValue: "Project A" });
    expect(uncontrolled).toContain('type="search"');
    expect(uncontrolled).toContain('value="Project A"');
    // Controlled: value prop renders into the search input
    const controlled = renderSearchInput({
      "aria-label": "Search",
      value: "hello geist",
      onChange: () => {},
    });
    expect(controlled).toContain('type="search"');
    expect(controlled).toContain('value="hello geist"');
  });

  test("G09-SI-01: clear button still renders with a non-empty value and type=search is kept", () => {
    const markup = renderSearchInput({
      "aria-label": "Search",
      value: "hello geist",
      onChange: () => {},
    });
    expect(markup).toContain('aria-label="Clear search"');
    expect(markup).toContain('type="search"');
  });

  test("G09-SI-02 (out of scope): cmdk/loading/prefix API remains intact", async () => {
    const src = await read("src/components/ui/search-input.tsx");
    expect(src).toMatch(/cmdk\??:/);
    expect(src).toMatch(/loading\??:/);
    expect(src).toMatch(/prefix\??:/);
  });
});
