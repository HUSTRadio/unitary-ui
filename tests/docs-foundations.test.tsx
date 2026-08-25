// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { readFile } from "node:fs/promises";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { ColorsPage } from "../docs/geist/src/components/docs-pages";
import {
  FOUNDATION_COLOR_SCALES,
  SEMANTIC_COLOR_TOKENS,
} from "../docs/geist/src/data/foundation-colors";
import { LanguageProvider } from "../docs/geist/src/i18n/language";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root;
let writeText: ReturnType<typeof vi.fn>;
let getPropertyValue: ReturnType<typeof vi.fn>;

const colorValues = Object.fromEntries([
  ...FOUNDATION_COLOR_SCALES.flatMap((scale) =>
    scale.steps.map((color) => [
      color.token,
      {
        light: `#light-${color.token.slice("--color-".length)}`,
        dark: `#dark-${color.token.slice("--color-".length)}`,
      },
    ]),
  ),
  ...SEMANTIC_COLOR_TOKENS.map((semantic) => [
    semantic.token,
    {
      light: `#light-${semantic.token.slice(2)}`,
      dark: `#dark-${semantic.token.slice(2)}`,
    },
  ]),
]);

beforeEach(() => {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  writeText = vi.fn().mockResolvedValue(undefined);
  document.documentElement.className = "";
  getPropertyValue = vi.fn((token: string) => {
    const value = colorValues[token];
    if (!value) return "";
    return document.documentElement.classList.contains("dark") ? value.dark : value.light;
  });

  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText },
  });
  vi.spyOn(window, "getComputedStyle").mockImplementation(
    () =>
      ({
        getPropertyValue,
      }) as CSSStyleDeclaration,
  );
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  document.documentElement.className = "";
  vi.restoreAllMocks();
});

async function renderColors() {
  await act(async () => {
    root.render(
      <LanguageProvider>
        <ColorsPage />
      </LanguageProvider>,
    );
  });
}

function blueSwatch() {
  return container.querySelector<HTMLButtonElement>('button[data-color-token="--color-blue-700"]')!;
}

describe("Colors foundation docs", () => {
  test("mounts keyboard-accessible token swatches that show and copy the requested live value", async () => {
    await renderColors();

    const swatch = blueSwatch();
    expect(swatch).toBeInstanceOf(HTMLButtonElement);
    expect(swatch.type).toBe("button");
    expect(swatch.dataset.colorToken).toBe("--color-blue-700");
    expect(getPropertyValue).toHaveBeenCalledWith("--color-blue-700");
    expect(swatch.textContent).toContain("#light-blue-700");

    await act(async () => {
      swatch.click();
      await Promise.resolve();
    });

    expect(writeText).toHaveBeenCalledWith("#light-blue-700");
    expect(container.querySelector('[role="status"]')?.textContent).toMatch(/copied/i);
  });

  test("recomputes the requested token when the html theme class changes", async () => {
    await renderColors();
    expect(blueSwatch().textContent).toContain("#light-blue-700");

    await act(async () => {
      document.documentElement.classList.add("dark");
      await Promise.resolve();
    });

    expect(blueSwatch().textContent).toContain("#dark-blue-700");
  });

  test("renders role guidance and semantic rows from current runtime token values", async () => {
    await renderColors();

    // Default language is zh-CN; the page maps these headings through demoText.
    expect(container.textContent).toContain("色彩 1–10");
    expect(container.textContent).toContain("Component backgrounds");
    expect(container.textContent).toContain("Text and icons");
    expect(container.textContent).toContain("语义 Token");

    const roleSwatch = container.querySelector<HTMLElement>('[data-role-color-token="--color-gray-100"]');
    expect(roleSwatch?.textContent).toContain("#light-gray-100");
    expect(roleSwatch?.querySelector<HTMLElement>("[aria-hidden]")?.style.backgroundColor).toBe(
      "var(--color-gray-100)",
    );

    const semanticRow = container.querySelector<HTMLTableRowElement>('[data-semantic-token="--background"]');
    expect(semanticRow?.textContent).toContain("#light-background");
    expect(semanticRow?.querySelector<HTMLElement>("[aria-hidden]")?.style.backgroundColor).toBe(
      "var(--background)",
    );
  });

  test("recomputes semantic table values when the html theme class changes", async () => {
    await renderColors();
    const semanticRow = () => container.querySelector<HTMLTableRowElement>('[data-semantic-token="--background"]')!;
    expect(semanticRow().textContent).toContain("#light-background");

    await act(async () => {
      document.documentElement.classList.add("dark");
      await Promise.resolve();
    });

    expect(semanticRow().textContent).toContain("#dark-background");
  });

  test("does not treat an unknown token as a valid computed color", () => {
    expect(getComputedStyle(document.documentElement).getPropertyValue("--color-unknown-700")).toBe("");
    expect(getComputedStyle(document.documentElement).getPropertyValue("--unknown-semantic")).toBe("");
  });

  test("handles clipboard rejection with accessible status feedback", async () => {
    writeText.mockRejectedValueOnce(new Error("clipboard denied"));
    await renderColors();

    await act(async () => {
      blueSwatch().click();
      await Promise.resolve();
    });

    expect(container.querySelector('[role="status"]')?.textContent).toMatch(/unable to copy/i);
  });

  test("removes raw color tables and unsupported P3 claims from the Colors page source", async () => {
    const source = await readFile("docs/geist/src/components/docs-pages.tsx", "utf8");
    const colorsPageSource = source.slice(source.indexOf("/* ================= Colors ================= */"), source.indexOf("/* ================= Typography ================= */"));

    expect(colorsPageSource).not.toMatch(/\b(?:COLOR_SCALES|GRAY_DARK|SEMANTIC_TOKENS)\b/);
    expect(colorsPageSource).not.toMatch(/\b(?:Display )?P3\b|wide gamut/i);
  });
});
