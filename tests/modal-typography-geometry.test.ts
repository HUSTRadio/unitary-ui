import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, test } from "vitest";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = async (relative: string) =>
  (await readFile(path.join(root, relative), "utf8")).replace(/\r\n/g, "\n");

/** 带 sticky footer 的 4 个 modal 示例（2026-09-15 排版修复对象）。 */
const STICKY_FOOTER_EXAMPLES = [
  "docs/geist/src/examples/modal/default-37a8eec1.example.tsx",
  "docs/geist/src/examples/modal/sticky-964a9431.example.tsx",
  "docs/geist/src/examples/modal/single-button-15781da6.example.tsx",
  "docs/geist/src/examples/modal/inset-2f0c8478.example.tsx",
];

describe("modal 排版几何（2026-09-15 固化）", () => {
  test("sticky footer：与面板同色 + hairline 顶边（禁止独立底色的「贴片」块）", async () => {
    for (const file of STICKY_FOOTER_EXAMPLES) {
      const src = await read(file);
      expect(src, file).toContain("border-t border-gray-alpha-400 bg-background-100");
      // 防回退：historically footer 曾是 bg-background-200（亮 #fafafa / 暗 #000 色阶倒挂）
      expect(src, file).not.toContain("bg-background-200 p-3");
      // 无效负 margin（sticky 元素不生效）不得回潮
      expect(src, file).not.toContain("-mb-5");
    }
  });

  test("sticky footer：左右对齐正文 px-5、上下留白对称 py-4", async () => {
    for (const file of STICKY_FOOTER_EXAMPLES) {
      const src = await read(file);
      expect(src, file).toContain("px-5 py-4");
      expect(src, file).toContain("items-center justify-between");
    }
  });

  test("body 下 padding 已消除（footer 自带底部留白）", async () => {
    for (const file of STICKY_FOOTER_EXAMPLES) {
      const src = await read(file);
      expect(src, file).toMatch(/bodyClassName="[^"]*pb-0"/);
    }
  });

  test("compact 示例保持 p-4 紧凑体系（独立间距节奏，勿套用标准档）", async () => {
    const src = await read("docs/geist/src/examples/modal/compact-c4e1a90b.example.tsx");
    expect(src).toContain("bodyClassName=\"p-4 pb-0\"");
    expect(src).toContain("-mx-4 mt-3");
    expect(src).toContain("px-4 py-3");
  });

  test("无 h-px 空占位残留（间距由 footer 提供，而非无样式占位 div）", async () => {
    for (const file of STICKY_FOOTER_EXAMPLES) {
      const src = await read(file);
      expect(src, file).not.toContain('className="h-px w-full"');
    }
  });

  test("ModalFooter 组件间距与 body 节奏一致（mt-5 对应 p-5）", async () => {
    const modal = await read("src/components/ui/modal.tsx");
    expect(modal).toMatch(/ModalFooter[\s\S]{0,200}mt-5/);
    expect(modal).toContain('"overflow-y-auto p-5"');
  });

  test("scrim 双主题保持官方实测值", async () => {
    const modal = await read("src/components/ui/modal.tsx");
    expect(modal).toContain("bg-[#f2f2f2]/80 dark:bg-black/80");
  });
});
