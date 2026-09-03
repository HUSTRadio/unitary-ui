import { describe, expect, test, vi } from "vitest";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { EXAMPLE_SOURCE } from "../docs/geist/src/examples/registry";

import { MultiSelectRow } from "../src/components/ui/multi-select";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relativePath: string) => readFile(path.join(root, relativePath), "utf8");

function renderRow(checked: boolean) {
  return renderToStaticMarkup(
    createElement(MultiSelectRow, {
      name: "Design System",
      checked,
      selectedCount: checked ? 2 : 1,
      totalCount: 3,
      onChange: vi.fn(),
      onSelectOnly: vi.fn(),
      onSelectAll: vi.fn(),
    }),
  );
}

describe("Multi Select live Geist contract", () => {
  test("documents all three live demos", async () => {
      const [manifestSource] = await Promise.all([
        read("tests/audit/geist-audit-manifest.json"),
      ]);
      const manifest = JSON.parse(manifestSource) as {
        components: Array<{
          slug: string;
          inventoryStatus?: string;
          demos?: Array<{ id: string }>;
        }>;
      };
      const component = manifest.components.find(({ slug }) => slug === "multi-select");
      const demoIds = ["select-actions", "keyboard-navigation", "controlled-state"];

      expect(component?.inventoryStatus).toBe("live_enumeration_complete");
      expect(component?.demos?.map(({ id }) => id)).toEqual(demoIds);
      const multiSelectSource = EXAMPLE_SOURCE["multi-select"];
      expect(multiSelectSource).toBeDefined();
      for (const id of demoIds) {
        expect(multiSelectSource[id]).toBeDefined();
        expect(multiSelectSource[id]).toContain("export function");
      }
    });

  test("uses the live trigger and menu material geometry", async () => {
    const source = await read("src/components/ui/multi-select.tsx");

    expect(source).toContain('data-slot="multi-select-root"');
    expect(source).toContain('data-slot="multi-select-trigger"');
    expect(source).toContain('data-slot="multi-select-content"');
    expect(source).toContain("w-fit max-w-full");
    expect(source).toContain("h-9");
    expect(source).toContain("multi-select-trigger");
    expect(source).toContain("relative flex h-9 w-full max-w-full");
    expect(source).toContain("shadow-[0_0_0_1px_var(--gray-400)]");
    expect(source).toContain("size-[14px]");
    expect(source).toContain("px-[6px]");
    expect(source).toContain("material-menu");
    expect(source).toContain("multi-select-content");
    expect(source).toContain("--radix-popover-content-available-height");
    expect(source).toContain("overflow-y-scroll");
    expect(source).toContain("p-2");
    expect(source).toContain("sideOffset = 8");
    expect(source).not.toContain("shadow-md");
    expect(source).toContain("zoom-in-95");
  });

  test("renders the live 28px row hierarchy and action geometry", async () => {
    const source = await read("src/components/ui/multi-select.tsx");
    const markup = renderRow(true);

    expect(markup).toContain('data-slot="multi-select-row"');
    expect(markup).toContain('data-slot="multi-select-checkbox-target"');
    expect(markup).toContain('data-slot="multi-select-action"');
    expect(source).toContain("h-7");
    expect(source).toContain("size-7");
    expect(source).toContain("w-16");
    expect(source).toContain("text-label-14");
    expect(source).toContain("text-button-12");
    expect(source).toContain("rounded-[4px]");
    expect(source).not.toContain("px-2 py-1.5");
  });

  test("maps checked rows to Check All and unchecked rows to Only", () => {
    const checked = renderRow(true);
    const unchecked = renderRow(false);

    expect(checked).toContain('aria-label="Design System. Uncheck"');
    expect(checked).toContain('aria-label="Design System. Check All"');
    expect(checked).toContain("Check All");
    expect(unchecked).toContain('aria-label="Design System. Check"');
    expect(unchecked).toContain('aria-label="Design System. Only"');
    expect(unchecked).toContain(">Only<");
    expect(unchecked).not.toContain("Toggle");
  });

  test("keeps composite focus inside the dialog and supports the live arrow model", async () => {
    const source = await read("src/components/ui/multi-select.tsx");

    expect(source).toContain('role="dialog"');
    expect(source).toContain("onOpenAutoFocus");
    expect(source).toContain('event.key === "Tab"');
    expect(source).toContain('event.key === "ArrowDown"');
    expect(source).toContain('event.key === "ArrowUp"');
    expect(source).toContain('event.key === "ArrowLeft"');
    expect(source).toContain('event.key === "ArrowRight"');
    expect(source).toContain("data-multi-select-action");
    expect(source).toContain("data-multi-select-checkbox");
    expect(source).toContain("tabIndex={-1}");
  });

  test("promotes closed and open audit contracts for every live demo", async () => {
    const manifest = JSON.parse(await read("tests/audit/geist-audit-manifest.json")) as {
      components: Array<{
        slug: string;
        acceptanceContracts?: Array<{ demoId: string; state: string }>;
      }>;
    };
    const component = manifest.components.find(({ slug }) => slug === "multi-select");
    const contracts = component?.acceptanceContracts ?? [];

    for (const demoId of ["select-actions", "keyboard-navigation", "controlled-state"]) {
      expect(contracts).toContainEqual(expect.objectContaining({ demoId, state: "closed" }));
      expect(contracts).toContainEqual(expect.objectContaining({ demoId, state: "open" }));
    }
  });
});
