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
    // Skeleton 外层负责 reduced-motion 归零：`!` 是为了压过可能的调用方覆盖。
    expect(skeleton.classList.contains("motion-reduce:!animate-none")).toBe(true);
  });
});
