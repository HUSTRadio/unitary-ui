// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ComponentApiReference } from "../docs/site/src/components/docs-api-reference";
import { IntroductionPage } from "../docs/site/src/components/docs-pages";
import { getComponentGuide } from "../docs/site/src/content/component-guides";
import { getComponentApi } from "../docs/site/src/data/component-api";
import { getDocsRoute } from "../docs/site/src/data/docs-routes";
import HituExample from "../docs/site/src/examples/hitu-player/default.example";
import MotionExample from "../docs/site/src/examples/motion/default.example";
import { LanguageProvider, type DocsLanguage } from "../docs/site/src/i18n/language";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root;
let reveal: IntersectionObserverCallback;
let observers: { callback: IntersectionObserverCallback; target?: Element; options?: IntersectionObserverInit }[];

beforeEach(() => {
  observers = [];
  vi.stubGlobal("matchMedia", vi.fn((media: string) => ({
    matches: true, media, addEventListener() {}, removeEventListener() {},
    addListener() {}, removeListener() {},
  })));
  vi.stubGlobal("IntersectionObserver", class {
    record: typeof observers[number];
    constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
      this.record = { callback, options };
      observers.push(this.record);
      reveal = callback;
    }
    observe(target: Element) { this.record.target = target; }
    unobserve() {}
    disconnect() {}
  });
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  localStorage.clear();
  window.history.replaceState(null, "", "/");
  vi.unstubAllGlobals();
});

async function render(children: React.ReactNode, language: DocsLanguage = "en-US") {
  window.history.replaceState(null, "", `/?lang=${language}`);
  await act(async () => root.render(<LanguageProvider>{children}</LanguageProvider>));
}

describe("Motion and Hitu documentation contracts", () => {
  for (const language of ["zh-CN", "en-US"] as const) {
    it(`registers a real API, guide and component route in ${language}`, async () => {
      for (const slug of ["motion", "hitu-player"]) {
        expect(getDocsRoute(`/components/${slug}`)?.renderer).toEqual({
          kind: "component-detail", componentName: slug,
        });
        expect(getComponentGuide(slug, language)?.examples.map(({ demoKey }) => demoKey)).toEqual(["default"]);
        expect(getComponentApi(slug)?.importPath).toBe("@hustradio/unitary-ui");
      }
      await render(<><ComponentApiReference componentName="motion" /><ComponentApiReference componentName="hitu-player" /></>, language);
      const imports = [...container.querySelectorAll("pre code")].map((node) => node.textContent);
      expect(imports.join(" ")).toContain("MotionProvider, motion, AnimatePresence, useMotionTransition");
      expect(imports.join(" ")).toContain("HituPlayer, HituBox, HituFile");
      expect(container.textContent).toContain(language === "zh-CN" ? "不会自动恢复" : "prevents automatic resumption");
    });

    it(`renders translated controls and a decorative Hitu scene in ${language}`, async () => {
      await render(<HituExample />, language);
      const player = container.querySelector('[data-slot="hitu-player"]')!;
      expect(player.getAttribute("aria-hidden")).toBe("true");
      expect(player.querySelectorAll("[data-hitu-layer]")).toHaveLength(2);
      expect(container.querySelector("[data-motion-play]")?.textContent).toBe(language === "zh-CN" ? "播放" : "Play");
      expect(container.querySelector("[data-motion-pause]")?.textContent).toBe(language === "zh-CN" ? "暂停" : "Pause");
      expect(container.querySelector("[data-motion-replay]")?.textContent).toBe(language === "zh-CN" ? "重播" : "Replay");
      expect(player.closest('[data-slot="empty-state"]')).not.toBeNull();
      const loop = container.querySelector<HTMLInputElement>("[data-motion-loop]")!;
      expect(loop.checked).toBe(false);
      act(() => loop.click());
      expect(loop.checked).toBe(true);
    });

    it(`completes reduced-motion UI state changes in ${language}`, async () => {
      await render(<MotionExample />, language);
      expect(container.querySelector("[data-motion-content]")).not.toBeNull();
      const toggle = container.querySelector<HTMLButtonElement>("[data-motion-toggle]")!;
      expect(toggle.textContent).toBe(language === "zh-CN" ? "切换内容" : "Toggle Content");
      await act(async () => toggle.click());
      expect(container.querySelector("[data-motion-content]")).toBeNull();
      await act(async () => toggle.click());
      expect(container.querySelector("[data-motion-content]")).not.toBeNull();
    });
  }

  it("keeps the introduction title and cards rendered while the independent illustration waits for the viewport", async () => {
    await render(<IntroductionPage />);
    expect(container.querySelector("h1")?.textContent).toBe("Unitary");
    expect(container.querySelectorAll('[data-slot="docs-card"]')).toHaveLength(5);
    expect(container.querySelector("[data-motion-intro]")).not.toBeNull();
    expect(container.querySelector('[data-slot="hitu-player"]')).toBeNull();
    expect(observers[0].options?.rootMargin).toBe("0px");
    await act(async () => reveal([{ isIntersecting: true, intersectionRatio: 1 } as IntersectionObserverEntry], {} as IntersectionObserver));
    await vi.waitFor(async () => {
      await act(async () => {});
      expect(container.querySelector('[data-slot="hitu-player"]')).not.toBeNull();
    });
    expect(container.querySelector('[data-slot="hitu-player"]')?.getAttribute("data-playing")).toBe("false");
    expect(container.querySelectorAll('[data-slot="docs-card"]')).toHaveLength(5);
  });
});
