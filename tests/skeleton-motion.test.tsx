// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, test } from "vitest";
import { Skeleton } from "@/components/ui/skeleton";

let root: Root;
let container: HTMLDivElement;
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
afterEach(() => { if (root) act(() => root.unmount()); container?.remove(); });

describe("Skeleton motion preference", () => {
  test("the default shimmer animation has an explicit reduced-motion override", () => {
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
    act(() => root.render(<Skeleton width={120} />));
    const skeleton = container.querySelector('[data-slot="skeleton"]')!;
    const shimmer = container.querySelector('[data-slot="skeleton-shimmer"]')!;
    // 动画挂在装饰子层上（Tailwind 的 motion-reduce 变体需要与动画 utility 同元素）。
    expect(shimmer.classList.contains("animate-(--animate-skeleton-shimmer)")).toBe(true);
    // Skeleton 外层负责 reduced-motion 归零。important 是必需的，
    // 否则压不过变体动画类：`data-[state=*]:animate-*` 的 specificity 是 0,2,0，
    // 高于单类名 reduce 工具类（实测 plain 形式 reduce 下仍是 animation-name "enter"）。
    // 写法取 Tailwind v4 规范的末尾 `!`，与全库浮层统一（HIG-AUD-019）。
    expect(skeleton.classList.contains("motion-reduce:animate-none!")).toBe(true);
  });
});
