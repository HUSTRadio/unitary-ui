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
  test("the default pulse animation has an explicit reduced-motion override", () => {
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
    act(() => root.render(<Skeleton width={120} />));
    const skeleton = container.querySelector('[data-slot="skeleton"]')!;
    expect(skeleton.classList.contains("animate-pulse")).toBe(true);
    expect(skeleton.classList.contains("motion-reduce:animate-none")).toBe(true);
  });
});
