// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { HamburgerMenu } from "../src/components/ui/hamburger-menu";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;
let host: HTMLDivElement;
let root: Root;
beforeEach(() => {
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
});
afterEach(() => {
  act(() => root.unmount());
  host.remove();
  vi.useRealTimers();
});
function render(node: React.ReactNode) {
  act(() => root.render(node));
}
function click(selector: string) {
  act(() => (document.querySelector(selector) as HTMLElement).click());
}

describe("HamburgerMenu interrupted transitions", () => {
  it("runs item entrances on first open but does not replay them during a reversal", () => {
    vi.useFakeTimers();
    render(<HamburgerMenu anchor="topbar" staggerIn items={[{ label: "Home", to: "/" }]} />);
    click('[data-slot="hamburger-trigger"]');
    expect(document.querySelectorAll("[data-staggered]")).toHaveLength(1);
    act(() => vi.advanceTimersByTime(40));
    click('[data-slot="hamburger-trigger"]');
    click('[data-slot="hamburger-trigger"]');
    expect(document.querySelectorAll("[data-staggered]")).toHaveLength(0);
    click('[data-slot="hamburger-trigger"]');
    act(() => vi.advanceTimersByTime(600));
    click('[data-slot="hamburger-trigger"]');
    expect(document.querySelectorAll("[data-staggered]")).toHaveLength(1);
  });
  it("reuses an exiting panel, cancels its stale unmount, then removes it after closing", () => {
    vi.useFakeTimers();
    render(<HamburgerMenu anchor="topbar" belowTopbar items={[{ label: "Home", to: "/" }]} />);
    click('[data-slot="hamburger-trigger"]');
    const panel = document.querySelector('[data-slot="expand-panel"]')!;
    act(() => vi.advanceTimersByTime(40));
    click('[data-slot="hamburger-trigger"]');
    expect(panel.hasAttribute("inert")).toBe(true);
    click('[data-slot="hamburger-trigger"]');
    act(() => vi.advanceTimersByTime(600));
    expect(document.querySelector('[data-slot="expand-panel"]')).toBe(panel);
    expect(panel.getAttribute("data-state")).toBe("open");
    expect(panel.hasAttribute("inert")).toBe(false);
    click('[data-slot="hamburger-trigger"]');
    act(() => vi.advanceTimersByTime(600));
    expect(document.querySelector('[data-slot="expand-panel"]')).toBeNull();
    expect(document.body.classList.contains("expand-panel-below-topbar")).toBe(false);
  });
});
