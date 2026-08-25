// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { readFile } from "node:fs/promises";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { ColorsPage } from "../docs/geist/src/components/docs-pages";
import { LanguageProvider } from "../docs/geist/src/i18n/language";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root;
let writeText: ReturnType<typeof vi.fn>;
let colorValue = "#light-value";

beforeEach(() => {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  writeText = vi.fn().mockResolvedValue(undefined);
  colorValue = "#light-value";
  document.documentElement.className = "";

  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText },
  });
  vi.spyOn(window, "getComputedStyle").mockImplementation(
    () =>
      ({
        getPropertyValue: () => colorValue,
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
  test("mounts keyboard-accessible token swatches that show and copy the live computed value", async () => {
    await renderColors();

    const swatch = blueSwatch();
    expect(swatch).toBeInstanceOf(HTMLButtonElement);
    expect(swatch.type).toBe("button");
    expect(swatch.dataset.colorToken).toBe("--color-blue-700");
    expect(swatch.textContent).toContain("#light-value");

    await act(async () => {
      swatch.click();
      await Promise.resolve();
    });

    expect(writeText).toHaveBeenCalledWith("#light-value");
    expect(container.querySelector('[role="status"]')?.textContent).toMatch(/copied/i);
  });

  test("recomputes displayed values when the html theme class changes", async () => {
    await renderColors();
    expect(blueSwatch().textContent).toContain("#light-value");

    colorValue = "#dark-value";
    await act(async () => {
      document.documentElement.classList.add("dark");
      await Promise.resolve();
    });

    expect(blueSwatch().textContent).toContain("#dark-value");
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
