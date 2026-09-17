// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, test, vi } from "vitest";

import { Kbd, KeyboardInput } from "@/components/ui/keyboard-input";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root;

afterEach(() => {
  if (root) act(() => root.unmount());
  container?.remove();
  document.body.innerHTML = "";
});

function mount(node: React.ReactNode) {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  act(() => root.render(node));
}

function queryKbd(): HTMLElement {
  return container.querySelector('[data-slot="kbd"]')!;
}
function queryKeys(): HTMLElement[] {
  return [...container.querySelectorAll<HTMLElement>('[data-slot="kbd-key"]')];
}

/**
 * Apple HIG 键帽排版固化（所有者指示的 Apple 化基线，偏离 Geist 单 pill）：
 * 每个键位 = 独立键帽（高 24 / small 20，字符同行等高），组合 = 方块邻接（4px）；
 * 字符 wrapper 经 inline-grid auto-cols-[1fr] 等宽（= 最宽 icon 动态宽度，
 * 零硬编码）；字体继承文档主字体（非等宽字体）。
 */
describe("keyboard-input Apple 键帽排版", () => {
  test("单字符键帽：h-6 锁高 + 等宽网格列（无 min-w 硬编码），16px 符号 flex 居中", () => {
    mount(<Kbd>K</Kbd>);
    const kbd = queryKbd();
    const keys = queryKeys();
    expect(keys).toHaveLength(1);
    // 高度锁定保证同行等高
    expect(keys[0].className).toContain("h-6");
    expect(keys[0].className).not.toContain("min-h-6");
    // wrapper 宽度由根网格 1fr 动态给出（= 最宽 icon 内容宽），min-w 硬编码废除
    expect(kbd.className).toContain("inline-grid");
    expect(kbd.className).toContain("grid-flow-col");
    expect(kbd.className).toContain("auto-cols-[1fr]");
    expect(keys[0].className).not.toContain("min-w-6");
    expect(keys[0].className).toContain("px-1");
    // 主字体继承（Apple 菜单用系统主字体，非等宽字体）
    expect(kbd.className).not.toContain("font-mono");
    // 符号放大（Apple 键帽观感）
    expect(keys[0].className).toContain("text-base");
    expect(keys[0].className).toContain("items-center");
    expect(keys[0].className).toContain("justify-center");
    expect(keys[0].textContent).toBe("K");
    // 旧 pill 时代的行高 hack 与内容加宽 padding 不得回归
    expect(kbd.className).not.toContain("leading-");
    expect(kbd.className).not.toContain("px-1.5");
    // 字形垂直光学校准：键名 glyph 上移 0.0625em 修字体 metrics 的 ink 偏下
    // （OPPO Sans fontAsc 17/desc 4 不对称 → 行框内偏下 1px），em 相对随字号自适应
    const glyph = keys[0].querySelector('[data-slot="kbd-glyph"]');
    expect(glyph?.className).toContain("-translate-y-[0.0625em]");
  });

  test("修饰符+键名渲染为邻接方块组（<Kbd meta>K</Kbd> → ⌘图标 + K 两个方块）", () => {
    mount(<Kbd meta>K</Kbd>);
    const keys = queryKeys();
    expect(keys).toHaveLength(2);
    // 修饰符字形 = Material Symbols Rounded codepoint（keyboard_command_key）
    expect(keys[0].textContent).toBe("\uEAE7");
    expect(keys[0].className).toContain("msr-keycap");
    // PUA 字形对读屏不可读，必须 aria-hidden
    expect(keys[0].getAttribute("aria-hidden")).toBe("true");
    expect(keys[1].textContent).toBe("K");
    expect(keys[1].className).not.toContain("msr-keycap");
    expect(keys[1].getAttribute("aria-hidden")).toBeNull();
    // Material Symbols 图标 metrics 对称（ink 已居中于行框），图标 glyph 免校准
    const iconGlyph = keys[0].querySelector('[data-slot="kbd-glyph"]');
    expect(iconGlyph?.className).not.toContain("translate-y");
    // 邻接：容器 gap 4px（Apple 菜单 ≈0.25em 字间间隙）
    expect(queryKbd().className).toContain("gap-[4px]");
    // 图标与键名同字号（Material Symbols 撑满 em，无需补偿）
    expect(keys[0].className).toContain("text-base");
    expect(keys[1].className).toContain("text-base");
  });

  test("多修饰符 <Kbd meta shift /> 渲染两个键帽图标方块", () => {
    mount(<Kbd meta shift />);
    const keys = queryKeys();
    expect(keys).toHaveLength(2);
    expect(keys[0].textContent).toBe("\uEAE7"); // keyboard_command_key
    expect(keys[1].textContent).toBe("\uE5F2"); // shift
    for (const key of keys) {
      expect(key.className).toContain("msr-keycap");
      expect(key.getAttribute("aria-hidden")).toBe("true");
    }
  });

  test("plain 形态：字形流排（无键帽几何、无表面，Apple 菜单风纯文本）", () => {
    mount(<Kbd plain meta>K</Kbd>);
    const keys = queryKeys();
    expect(keys).toHaveLength(2);
    for (const key of keys) {
      expect(key.className).toContain("bg-transparent");
      expect(key.className).not.toContain("bg-background-100");
      expect(key.className).toContain("shadow-none");
      // 无方块几何：键帽内部空白会主导视觉间距（容器 gap 再小也无效），
      // plain 必须是字形流排（Apple 菜单式字贴字）
      expect(key.className).not.toContain("min-w-6");
      expect(key.className).not.toContain("h-6");
      expect(key.className).not.toContain("px-1");
    }
    // plain 无行内 ml（Geist plain 惯例保留）
    expect(queryKbd().className).not.toContain("ml-1");
    // 纯文本槽位间距：字形流排 + 1px 微缝（有框仍 4px 方块邻接）
    expect(queryKbd().className).toContain("gap-[1px]");
    expect(queryKbd().className).not.toContain("gap-[2px]");
    expect(queryKbd().className).not.toContain("gap-[4px]");
  });

  test("small 形态：h-5 锁高 + 12px 字号（宽度同由网格列动态给出）", () => {
    mount(<Kbd small>/</Kbd>);
    const key = queryKeys()[0];
    expect(key.className).toContain("h-5");
    expect(key.className).toContain("text-xs");
    // min-w 硬编码废除：宽度交给根网格 auto-cols-[1fr] 动态解析
    expect(key.className).not.toContain("min-w-5");
  });

  test("多字符键名经等宽网格列自然撑宽不裁切（无固定 w）", () => {
    mount(<Kbd>Enter</Kbd>);
    const key = queryKeys()[0];
    expect(queryKbd().className).toContain("auto-cols-[1fr]");
    // 槽位不得有固定宽度 token，宽度交给网格列自适应（token 级判断避免子串误匹配）
    expect(key.className.split(/\s+/)).not.toContain("w-6");
    expect(key.textContent).toBe("Enter");
  });

  test("KeyboardInput 组合容器：子 kbd 邻接（gap 2px、行内 ml 取消）", () => {
    mount(
      <KeyboardInput>
        <Kbd meta />
        <Kbd shift />
      </KeyboardInput>,
    );
    const box = container.querySelector<HTMLElement>('[data-slot="keyboard-input"]')!;
    expect(box.className).toContain("gap-[4px]");
    expect(box.className).toContain("[&>kbd]:ml-0");
    expect(box.querySelectorAll('[data-slot="kbd"]')).toHaveLength(2);
  });
});
