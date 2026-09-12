import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vitest";

/**
 * 回归契约：被裁切表面的投影必须来自外层包装的 `drop-shadow`，而不是 `box-shadow`。
 *
 * 已确认缺陷（continuous-surface / superellipse 示例）：把 `shadow-*`（box-shadow）
 * 放到外层包装上时，画出来的是**包装自己的圆角矩形盒**，与被 `clip-path` 裁切的子元素
 * 形状无关；两者半径接近时看不出来，形状一旦不同（超椭圆）阴影就与本体解耦，露出一层
 * 矩形底片。`surface-shadow` 用 `filter: drop-shadow()` 由子元素渲染后的实际 alpha
 * 生成阴影，因此天然贴合裁切形状。
 *
 * 同时锁定 `drop-shadow()` 的语法陷阱：它只接受 `<length>{2,3}`（x / y / blur），
 * **没有 spread**。照抄 box-shadow 的 `0 8px 16px -4px` 会让整条 filter 声明被浏览器
 * 解析器丢弃、阴影完全不显示，而构建工具（lightningcss）不报错。
 */
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const readCss = () => readFile(path.join(root, "src/styles/index.css"), "utf8");

function utilityBody(css: string, name: string): string {
  const match = css.match(new RegExp(`@utility ${name} \\{([\\s\\S]*?)\\n\\}`));
  expect(match, `@utility ${name} must exist`).not.toBeNull();
  return match![1];
}

/** 收集 source 中所有 `fn(...)` 的实参文本，按括号配对切分。 */
function callArgs(source: string, fn: string): string[] {
  const needle = `${fn}(`;
  const args: string[] = [];
  for (let start = source.indexOf(needle); start !== -1; start = source.indexOf(needle, start + 1)) {
    let depth = 0;
    let end = start + needle.length - 1;
    for (; end < source.length; end += 1) {
      if (source[end] === "(") depth += 1;
      else if (source[end] === ")") {
        depth -= 1;
        if (depth === 0) break;
      }
    }
    if (depth === 0) args.push(source.slice(start + needle.length, end));
  }
  return args;
}

describe("surface-shadow contract (clipped surfaces)", () => {
  test("is a filter-based drop-shadow so the shadow follows the clipped alpha silhouette", async () => {
    const body = utilityBody(await readCss(), "surface-shadow");
    // box-shadow 画包装自己的矩形盒，正是本缺陷的根因。
    expect(body).not.toContain("box-shadow");
    expect(body).toMatch(/filter:\s*drop-shadow\(/);
  });

  test("every drop-shadow() layer passes 2-3 lengths and never a spread", async () => {
    const body = utilityBody(await readCss(), "surface-shadow");
    const filter = body.match(/filter:\s*([^;]+);/)?.[1] ?? "";
    const shadows = callArgs(filter, "drop-shadow");
    expect(shadows.length, "surface-shadow declares at least one layer").toBeGreaterThan(0);
    for (const shadow of shadows) {
      // 颜色函数里的数字（如 rgb(0 0 0 / 0.16)）不是长度，先剔除再计数。
      const withoutColor = shadow.replace(/(?:rgba?|hsla?|oklch|color)\([^()]*\)/g, " ");
      const lengths = withoutColor.match(/-?\d*\.?\d+(?:px|rem|em|%)/g) ?? [];
      expect(lengths.length, `drop-shadow(${shadow.trim()}) needs x and y`).toBeGreaterThanOrEqual(2);
      expect(
        lengths.length,
        `drop-shadow(${shadow.trim()}) must not pass a spread; the browser drops the whole declaration`,
      ).toBeLessThanOrEqual(3);
    }
  });
});
