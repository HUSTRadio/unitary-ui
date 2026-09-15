// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { readFile } from "node:fs/promises";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { ColorsPage, GridPage } from "../docs/geist/src/components/docs-pages";
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
    expect(container.querySelector('[role="status"]')?.textContent).toMatch(/已复制/);
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
    expect(container.textContent).toContain("组件背景");
    expect(container.textContent).toContain("文本与图标");
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

    expect(container.querySelector('[role="status"]')?.textContent).toMatch(/无法复制/);
  });

  test("removes raw color tables and unsupported P3 claims from the Colors page source", async () => {
    const source = await readFile("docs/geist/src/components/docs-pages.tsx", "utf8");
    const colorsPageSource = source.slice(source.indexOf("/* ================= Colors ================= */"), source.indexOf("/* ================= Typography ================= */"));

    expect(colorsPageSource).not.toMatch(/\b(?:COLOR_SCALES|GRAY_DARK|SEMANTIC_TOKENS)\b/);
    expect(colorsPageSource).not.toMatch(/\b(?:Display )?P3\b|wide gamut/i);
  });
});

/* ------------------------------------------------------------------ */
/* Grid docs parity                                                    */
/* ------------------------------------------------------------------ */

const GRID_DEMO_SECTIONS = [
  "empty-guides",
  "auto-flow",
  "solid-cells",
  "responsive-breakpoints",
  "responsive-clipping",
  "hide-row-guides",
  "hide-column-guides",
  "overlaying-cells",
  "specific-clipping",
  "cross",
  "dashed-cross",
  "dashed-page",
] as const;

async function renderGridPage() {
  await act(async () => {
    root.render(
      <LanguageProvider>
        <GridPage />
      </LanguageProvider>,
    );
  });
}

describe("Grid docs parity", () => {
  test("renders every documented example on top of the real Grid primitives", async () => {
    await renderGridPage();

    for (const demo of GRID_DEMO_SECTIONS) {
      expect(container.querySelector(`[data-grid-demo="${demo}"]`)).not.toBeNull();
    }

    // The page renders the real primitives directly (not a Tailwind imitation).
    expect(container.querySelectorAll("section[data-grid]").length).toBeGreaterThanOrEqual(10);
    expect(container.querySelector('[data-slot="grid-system"]')).not.toBeNull();
    expect(container.querySelector('[data-slot="grid-page"]')).not.toBeNull();
    expect(container.querySelectorAll("[data-grid-cell]").length).toBeGreaterThanOrEqual(20);
    expect(container.querySelectorAll("[data-grid-cross]").length).toBeGreaterThanOrEqual(3);

    // Three-breakpoint responsive rows/columns.
    const html = container.innerHTML;
    expect(html).toContain("--sm-grid-columns");
    expect(html).toContain("--md-grid-columns");
    expect(html).toContain("--lg-grid-columns");
    expect(html).toContain("--sm-grid-rows");
    expect(html).toContain("--md-grid-rows");
    expect(html).toContain("--lg-grid-rows");

    // hideGuides variants strip exactly one axis of guide borders.
    const rowSection = container.querySelector('[data-grid-demo="hide-row-guides"]')!;
    for (const line of rowSection.querySelectorAll('[data-grid-guides="true"] > *')) {
      expect((line as HTMLElement).style.borderBottomStyle).toBe("none");
    }
    const columnSection = container.querySelector('[data-grid-demo="hide-column-guides"]')!;
    for (const line of columnSection.querySelectorAll('[data-grid-guides="true"] > *')) {
      expect((line as HTMLElement).style.borderRightStyle).toBe("none");
    }

    // Solid cells occlude strictly-overlapped guides in the specific clipping demo.
    const clippingSection = container.querySelector('[data-grid-demo="specific-clipping"]')!;
    const clippedLines = [
      ...clippingSection.querySelectorAll<HTMLElement>('[data-grid-guides="true"] > *'),
    ].filter((line) => line.style.borderRightStyle === "none" || line.style.borderBottomStyle === "none");
    expect(clippedLines.length).toBeGreaterThan(0);

    // Dashed variants run inside a dashed GridSystem.
    for (const demo of ["dashed-cross", "dashed-page"]) {
      const section = container.querySelector(`[data-grid-demo="${demo}"]`)!;
      const systemClass = section.querySelector('[data-slot="grid-system"]')?.className ?? "";
      expect(systemClass).toMatch(/Dashed/);
    }
  });

  test("keeps cell semantics and DOM reading order while guides stay decorative", async () => {
    await renderGridPage();

    // Reading order of auto-flowed cell content matches DOM/JSX order.
    const autoFlow = container.querySelector('[data-grid-demo="auto-flow"]')!;
    const cells = [...autoFlow.querySelectorAll("[data-grid-cell]")];
    expect(cells.map((cell) => cell.textContent)).toEqual(["1", "2", "3", "4", "5", "6"]);

    // Guides remain hidden from assistive technology, at root and per line.
    const guidesRoot = container.querySelector('[data-grid-guides="true"]');
    expect(guidesRoot?.getAttribute("aria-hidden")).toBe("true");
    const guideLines = [...(guidesRoot?.children ?? [])];
    expect(guideLines.length).toBeGreaterThan(0);
    for (const line of guideLines) {
      expect(line.getAttribute("aria-hidden")).toBe("true");
    }

    // GridCross decorative root is explicitly aria-hidden.
    for (const cross of container.querySelectorAll("[data-grid-cross]")) {
      expect(cross.getAttribute("aria-hidden")).toBe("true");
    }
  });

  test("does not claim configurable gap or Tailwind xl/2xl breakpoints", async () => {
    const source = await readFile("docs/geist/src/components/docs-grid-page.tsx", "utf8");

    expect(source).not.toMatch(/configurable gap/i);
    // No Tailwind breakpoint presets (xl/2xl) claimed as Grid API.
    expect(source).not.toContain("2xl");
    expect(source).not.toMatch(/sm, md, lg, xl/);
    expect(source).not.toMatch(/<Grid[^>]*\sgap\s*=/);
  });

  test("docs-pages only re-exports GridPage from the dedicated grid docs module", async () => {
    const source = await readFile("docs/geist/src/components/docs-pages.tsx", "utf8");

    expect(source).toContain('export { GridPage } from "./docs-grid-page";');
    expect(source).not.toMatch(/function GridPage/);
  });
});
