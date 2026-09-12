// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

import { Mask } from "@/components/ui/mask";
import { Skeleton } from "@/components/ui/skeleton";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  document.body.innerHTML = "";
});

function render(element: React.ReactElement) {
  act(() => root.render(element));
}

const mask = () => container.querySelector<HTMLElement>('[data-slot="mask"]')!;
const maskContent = () => container.querySelector<HTMLElement>('[data-slot="mask-content"]')!;
const overlay = () => container.querySelector<HTMLElement>('[data-slot="mask-overlay"]');

describe("Mask skeleton overlay", () => {
  test("masked renders the skeleton overlay and hides the real content from AT and focus", () => {
    render(
      <Mask label="Loading profile" masked skeleton={<Skeleton width={120} />}>
        <button type="button">Real action</button>
      </Mask>,
    );

    expect(mask().getAttribute("data-state")).toBe("masked");
    expect(mask().getAttribute("aria-busy")).toBe("true");
    expect(mask().getAttribute("aria-label")).toBe("Loading profile");
    expect(overlay()).not.toBeNull();
    expect(overlay()?.querySelector('[data-slot="skeleton"]')).not.toBeNull();

    // 真实内容保留盒子但不进无障碍树、不可聚焦、不可点击。
    expect(maskContent().hasAttribute("inert")).toBe(true);
    expect(maskContent().getAttribute("aria-hidden")).toBe("true");
    expect(maskContent().querySelector<HTMLElement>('[data-slot="mask-placeholder"]')?.className).toContain(
      "invisible",
    );
    expect(container.querySelector("button")).not.toBeNull();
  });

  test("unmasking drops the overlay, restores interactivity and clears aria-busy", () => {
    const view = (masked: boolean) => (
      <Mask label="Loading profile" masked={masked} skeleton={<Skeleton width={120} />}>
        <button type="button">Real action</button>
      </Mask>
    );

    render(view(true));
    render(view(false));

    expect(mask().getAttribute("data-state")).toBe("unmasked");
    expect(mask().getAttribute("aria-busy")).toBeNull();
    expect(mask().getAttribute("aria-label")).toBeNull();
    expect(overlay()).toBeNull();
    expect(maskContent().hasAttribute("inert")).toBe(false);
    expect(maskContent().getAttribute("aria-hidden")).toBeNull();
    expect(maskContent().querySelector<HTMLElement>('[data-slot="mask-placeholder"]')?.className).not.toContain(
      "invisible",
    );
  });

  test("keeps the real content mounted across the swap so its box never remounts", () => {
    render(
      <Mask masked skeleton={<Skeleton width={120} />}>
        <p data-testid="real">Real content</p>
      </Mask>,
    );
    const before = container.querySelector<HTMLElement>('[data-testid="real"]')!;
    render(
      <Mask masked={false} skeleton={<Skeleton width={120} />}>
        <p data-testid="real">Real content</p>
      </Mask>,
    );
    const after = container.querySelector<HTMLElement>('[data-testid="real"]')!;
    // 同一个 DOM 节点：说明切换走的是可见性而不是条件渲染（否则会重建子树并丢失内部状态）。
    expect(after).toBe(before);
  });

  test("liveRegion announces completion only after unmasking", () => {
    render(
      <Mask liveRegion masked skeleton={<Skeleton width={120} />}>
        <p>Real content</p>
      </Mask>,
    );
    expect(mask().getAttribute("aria-live")).toBeNull();

    render(
      <Mask liveRegion masked={false} skeleton={<Skeleton width={120} />}>
        <p>Real content</p>
      </Mask>,
    );
    expect(mask().getAttribute("aria-live")).toBe("polite");
  });

  test("defaultMasked drives the initial state without a controlled prop", () => {
    render(
      <Mask defaultMasked skeleton={<Skeleton width={120} />}>
        <p>Real content</p>
      </Mask>,
    );
    expect(mask().getAttribute("data-state")).toBe("masked");
    expect(overlay()).not.toBeNull();
  });

  test("overlay replaces the skeleton template when a bespoke layer is needed", () => {
    render(
      <Mask masked overlay={<span data-testid="bespoke">Bespoke</span>} skeleton={<Skeleton width={120} />}>
        <p>Real content</p>
      </Mask>,
    );
    expect(overlay()?.querySelector('[data-testid="bespoke"]')).not.toBeNull();
    expect(overlay()?.querySelector('[data-slot="skeleton"]')).toBeNull();
  });
});

describe("Skeleton shimmer animation", () => {
  test("renders a decorative shimmer layer while animated and shown", () => {
    render(<Skeleton width={160} />);
    const shimmer = container.querySelector<HTMLElement>('[data-slot="skeleton-shimmer"]')!;
    expect(shimmer).not.toBeNull();
    // 装饰层不进无障碍树。
    expect(shimmer.getAttribute("aria-hidden")).toBe("true");
    // 1.4s 流光带：与同一族的 LoadingDots blink 同周期，比 Tailwind 默认 2s pulse 更快可辨。
    expect(shimmer.className).toContain("animate-(--animate-skeleton-shimmer)");
    expect(shimmer.className).toContain("will-change-transform");
    expect(container.querySelector('[data-slot="skeleton"]')?.className).toContain("overflow-hidden");
  });

  test("drops the shimmer layer when animated is false but keeps the static surface", () => {
    render(<Skeleton animated={false} width={160} />);
    expect(container.querySelector('[data-slot="skeleton-shimmer"]')).toBeNull();
    expect(container.querySelector('[data-slot="skeleton"]')?.className).toContain("bg-gray-alpha-200");
  });

  test("drops the shimmer layer while hidden by show=false", () => {
    render(
      <Skeleton show={false} width={160}>
        <span>Real</span>
      </Skeleton>,
    );
    expect(container.querySelector('[data-slot="skeleton-shimmer"]')).toBeNull();
    expect(container.querySelector("span")?.className).not.toContain("invisible");
  });
});
