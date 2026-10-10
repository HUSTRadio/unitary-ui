// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { SiteNavigation } from "@/components/ui/site-navigation";
import { BackToTop } from "@/components/ui/back-to-top";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

let container: HTMLDivElement;
let root: Root;
let callbacks: FrameRequestCallback[];
let mediaListeners: Array<() => void>;
let desktop: boolean;
let reduced: boolean;
function scroll(position: number) {
  Object.defineProperty(window, "scrollY", { value: position, configurable: true });
  act(() => window.dispatchEvent(new Event("scroll")));
  act(() => {
    const pending = callbacks.splice(0);
    pending.forEach((callback) => callback(0));
  });
}
beforeEach(() => {
  desktop = true;
  reduced = false;
  callbacks = [];
  mediaListeners = [];
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  Object.defineProperty(window, "scrollY", { value: 0, configurable: true });
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    callbacks.push(callback);
    return callbacks.length;
  });
  vi.stubGlobal("cancelAnimationFrame", vi.fn());
  vi.stubGlobal("matchMedia", (query: string) => ({
    get matches() {
      return query.includes("min-width")
        ? desktop
        : query.includes("reduced-motion")
          ? reduced
          : false;
    },
    addEventListener: (_type: string, callback: () => void) => mediaListeners.push(callback),
    removeEventListener: vi.fn(),
  }));
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
  vi.unstubAllGlobals();
});

describe("website behavior contracts", () => {
  it("keeps a scrolled transparent header filled on upward scroll and handles restored positions", () => {
    Object.defineProperty(window, "scrollY", { value: 500, configurable: true });
    act(() =>
      root.render(<Navbar variant="transparent" solidOnScroll scrollBehavior="auto-hide" />),
    );
    const header = container.querySelector("header")!;
    expect(header.className).toContain("bg-background-100");
    scroll(700);
    expect(header.className).toContain("-translate-y-full");
    scroll(550);
    expect(header.className).not.toContain("-translate-y-full");
    expect(header.className).toContain("bg-background-100");
    scroll(0);
    expect(header.className).not.toContain("bg-background-100");
    expect(header.className).not.toContain("-translate-y-full");
  });
  it("holds an open navigation header visible", () => {
    act(() => root.render(<Navbar scrollBehavior="auto-hide" forceVisible />));
    scroll(300);
    expect(container.querySelector("header")!.className).not.toContain("-translate-y-full");
  });
  it("discloses website links, restores Escape focus, and dismisses outside activation", () => {
    act(() =>
      root.render(
        <SiteNavigation
          items={[
            {
              id: "research",
              label: "Research",
              groups: [{ title: "Explore", links: [{ label: "Overview", href: "/overview" }] }],
            },
          ]}
        />,
      ),
    );
    const trigger = container.querySelector<HTMLButtonElement>(
      "[data-slot=site-navigation-top-item]",
    )!;
    act(() => trigger.click());
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(
      container.querySelector("[data-slot=site-navigation-panel] a")?.getAttribute("href"),
    ).toBe("/overview");
    act(() =>
      container
        .querySelector("[data-slot=site-navigation-panel]")!
        .dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })),
    );
    expect(document.activeElement).toBe(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    act(() => trigger.click());
    act(() => document.body.dispatchEvent(new Event("pointerdown", { bubbles: true })));
    expect(container.querySelector("[data-slot=site-navigation-panel]")).toBeNull();
  });
  it("shows desktop footer links, permits mobile disclosure, and secures external links", () => {
    act(() =>
      root.render(
        <Footer
          collapseOnMobile
          columns={[
            {
              title: "Resources",
              links: [{ label: "Docs", href: "https://example.com", target: "_blank" }],
            },
          ]}
          slotBottom="Legal details"
        />,
      ),
    );
    const collapse = container.querySelector("[data-slot=collapse]")!;
    expect(collapse.getAttribute("data-state")).toBe("open");
    expect(container.querySelector("a")!.rel).toBe("noopener noreferrer");
    expect(container.querySelector("[data-slot=footer-bottom]")!.textContent).toBe("Legal details");
    desktop = false;
    act(() => mediaListeners.forEach((callback) => callback()));
    expect(collapse.getAttribute("data-state")).toBe("closed");
    act(() => container.querySelector<HTMLButtonElement>("button")!.click());
    expect(collapse.getAttribute("data-state")).toBe("open");
  });
  it("returns an explicit scroll owner with reduced motion and focus, without scrolling the document", () => {
    reduced = true;
    const target = document.createElement("div");
    target.scrollTop = 300;
    target.scrollTo = vi.fn();
    const heading = document.createElement("h2");
    heading.tabIndex = -1;
    document.body.append(heading);
    act(() =>
      root.render(
        <BackToTop target={target} focusTarget={heading} threshold={100}>
          Top
        </BackToTop>,
      ),
    );
    const button = container.querySelector("button")!;
    expect(button.hidden).toBe(false);
    act(() => button.click());
    act(() => callbacks.splice(0).forEach((callback) => callback(0)));
    expect(target.scrollTop).toBe(0);
    expect(document.activeElement).toBe(heading);
    expect(window.scrollY).toBe(0);
    heading.remove();
  });
  it("reveals pending content when its replacement root already contains it", () => {
    const disconnect = vi.fn();
    vi.stubGlobal("IntersectionObserver", class {
      observe = vi.fn();
      disconnect = disconnect;
    });
    const first = document.createElement("div");
    const second = document.createElement("div");
    vi.spyOn(first, "getBoundingClientRect").mockReturnValue({ bottom: -10 } as DOMRect);
    vi.spyOn(second, "getBoundingClientRect").mockReturnValue({ bottom: 100 } as DOMRect);
    act(() => root.render(<ScrollReveal root={first}>Content</ScrollReveal>));
    expect(container.querySelector("[data-pending]")).not.toBeNull();
    act(() => root.render(<ScrollReveal root={second}>Content</ScrollReveal>));
    expect(container.querySelector("[data-pending]")).toBeNull();
    expect(disconnect).toHaveBeenCalled();
  });
  it("renders reveal content when IntersectionObserver is unavailable", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    act(() => root.render(<ScrollReveal>Visible content</ScrollReveal>));
    expect(container.textContent).toBe("Visible content");
    expect(container.querySelector("[data-pending]")).toBeNull();
  });
});
