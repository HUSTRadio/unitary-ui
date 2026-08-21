import { describe, expect, test } from "vitest";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relativePath: string) => readFile(path.join(root, relativePath), "utf8");

const pagePath = "docs/geist/src/components/docs-components-page.tsx";

describe("docs Show code footer", () => {
  test("has a functional ShowCodeFooter with onClick toggle", async () => {
    const src = await read(pagePath);
    expect(src).toMatch(/function ShowCodeFooter/);
    expect(src).toMatch(/setShowCode/);
    expect(src).toMatch(/onClick=\{\s*\(\) => setShowCode/);
    // expanded state rotates the chevron 90deg (official behavior), not -90deg
    expect(src).toMatch(/transition-transform\$\{showCode \? " rotate-90" : ""\}/);
  });

  test("no demo keeps a dead footerBar (data-state=closed + empty hidden div)", async () => {
    const src = await read(pagePath);
    expect(src).not.toMatch(/<div data-state="closed" hidden \/>/);
    expect(src).not.toMatch(/const footerBar = \(/);
    expect(src).not.toMatch(/\{footerBar\}/);
  });

  test("every demo renders ShowCodeFooter with per-block DEMO_CODE source", async () => {
    const src = await read(pagePath);
    const demos = [
      "ButtonDemo",
      "InputDemo",
      "ModalDemo",
      "SwitchDemo",
      "SelectDemo",
      "SeparatorDemo",
      "TextareaDemo",
      "ToggleDemo",
      "DrawerDemo",
      "SheetDemo",
      "CommandMenuDemo",
      "ContextMenuDemo",
      "DotsMenuDemo",
      "ComboboxDemo",
      "LabelDemo",
      "RadioDemo",
    ];
    for (const demo of demos) {
      expect(src).toMatch(new RegExp(`function ${demo}\\(\\)`));
      expect(src).toMatch(new RegExp(`return <${demo} />;`));
    }
    expect(src).toMatch(/function renderDemo\(name: string\)/);
    expect(src.match(/renderDemo\(name\)/g)).toHaveLength(1);
    // 每个 demo 函数用 demoCode 查 DEMO_CODE（区块独立源码），不再统一传 meta.code
    expect(
      src.match(/const demoCode = \(id: string\) => DEMO_CODE/g)?.length,
    ).toBeGreaterThanOrEqual(16);
    expect(src.match(/<ShowCodeFooter code=\{code \?\? ""\} \/>/g)).toBeNull();
  });

  test("ModalDemo return container has vertical gap (space-y-6)", async () => {
    const src = await read(pagePath);
    expect(src).toMatch(/<div className="w-full max-w-\[862px\] space-y-6">/);
  });
});
