import { describe, expect, test } from "vitest";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relativePath: string) => readFile(path.join(root, relativePath), "utf8");

describe("TextWithCopyButton official API contract (G11-RETRY audit fixes)", () => {
  test("G11-TWCB-01: text element has NO flex-grow, icon stays adjacent to text", async () => {
    const src = await read("src/components/ui/text-with-copy-button.tsx");
    // flex-1 / min-w-0 removed from the text element
    expect(src).not.toMatch(/min-w-0 flex-1/);
    expect(src).not.toMatch(/\bflex-1\b/);
    // Text element keeps the official base classes
    expect(src).toMatch(/text-inherit whitespace-nowrap/);
    // Ellipsis truncation via truncate (official geist-ellipsis semantics)
    expect(src).toMatch(/ellipsis && "truncate"/);
    // Text element renders before the icon container
    const textPos = src.indexOf("text-inherit whitespace-nowrap");
    const iconPos = src.indexOf("relative flex size-4");
    expect(textPos).toBeGreaterThan(-1);
    expect(iconPos).toBeGreaterThan(textPos);
  });

  test("G11-TWCB-02: revert timer is 1000ms (not 1500ms)", async () => {
    const src = await read("src/components/ui/text-with-copy-button.tsx");
    expect(src).toMatch(/setTimeout\(\(\) => setCopied\(false\), 1000\)/);
    expect(src).not.toMatch(/setTimeout\(\(\) => setCopied\(false\), 1500\)/);
    expect(src).not.toMatch(/, 1500\)/);
  });

  test("G11-TWCB-03: feedback via toast (message on success, error on failure), no title/sr-only/execCommand", async () => {
    const src = await read("src/components/ui/text-with-copy-button.tsx");
    // Toast integration
    expect(src).toMatch(/toast\.message\(\{ text: resolvedSuccessMessage \}\)/);
    expect(src).toMatch(/toast\.error\(t\("Failed to copy to clipboard"\)\)/);
    // Success icon shows immediately on click (before the promise settles)
    const setCopiedPos = src.indexOf("setCopied(true)");
    const writeTextPos = src.indexOf("writeText(textToCopy)");
    expect(setCopiedPos).toBeGreaterThan(-1);
    expect(writeTextPos).toBeGreaterThan(setCopiedPos);
    // No title attribute, no sr-only element, no execCommand fallback
    expect(src).not.toMatch(/title=\{copied/);
    expect(src).not.toMatch(/className="sr-only"/);
    expect(src).not.toMatch(/document\.execCommand/);
  });

  test("G11-TWCB-04: showTooltip (default false) + as/style passthrough props", async () => {
    const src = await read("src/components/ui/text-with-copy-button.tsx");
    // showTooltip prop, default false；为 true 时按钮外包 Tooltip(text=textToCopy)，
    // 为 false 时直接返回 button（不再依赖 Tooltip.disableTriggers 兼容开关）
    expect(src).toMatch(/showTooltip\??:/);
    expect(src).toMatch(/showTooltip = false/);
    expect(src).toMatch(/if \(!showTooltip\) return button;/);
    expect(src).toMatch(/<Tooltip text=\{textToCopy\}>\{button\}<\/Tooltip>/);
    // as prop: text element tag, default "p"
    expect(src).toMatch(/as\?: React\.ElementType/);
    expect(src).toMatch(/as: Tag = "p"/);
    // style prop: applied to the text element
    expect(src).toMatch(/style\?: React\.CSSProperties/);
    const tagOpen = src.indexOf("<Tag");
    const styleProp = src.indexOf("style={style}");
    expect(tagOpen).toBeGreaterThan(-1);
    expect(styleProp).toBeGreaterThan(tagOpen);
    // Renders null when textToCopy is falsy
    expect(src).toMatch(/if \(!textToCopy\) return null/);
  });
});
