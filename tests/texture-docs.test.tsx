// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { MaterialsPage } from "../docs/site/src/components/docs-pages";
import { LanguageProvider, type DocsLanguage } from "../docs/site/src/i18n/language";
import { ApiOverviewPage } from "../docs/site/src/pages/api-overview";
import { ThemeProvider } from "../src/lib/theme";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root;
let blurSupported: boolean;

beforeEach(() => {
  localStorage.clear();
  document.documentElement.className = "";
  delete document.documentElement.dataset.texture;
  delete document.documentElement.dataset.texturePreference;
  blurSupported = true;
  vi.stubGlobal("CSS", { supports: () => blurSupported });
  vi.stubGlobal("matchMedia", (media: string) => ({
    matches: false, media, onchange: null,
    addEventListener: vi.fn(), removeEventListener: vi.fn(),
    addListener: vi.fn(), removeListener: vi.fn(), dispatchEvent: () => false,
  }));
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  document.body.innerHTML = "";
  localStorage.clear();
  vi.unstubAllGlobals();
});

async function renderPage(language: DocsLanguage = "en-US") {
  window.history.replaceState(null, "", `/?lang=${language}`);
  await act(async () => {
    root.render(<ThemeProvider><LanguageProvider><MaterialsPage /></LanguageProvider></ThemeProvider>);
  });
}

function textureOption(scope: ParentNode, value: string) {
  return scope.querySelector<HTMLInputElement>(`input[data-texture-option="${value}"]`)!;
}

describe("global texture documentation", () => {
  test.each(["en-US", "zh-CN"] as const)("documents CSS Glass, purpose presets and the removed-token migration in %s", async (language) => {
    await renderPage(language);
    const contract = container.querySelector('[data-glass-lighting-contract]')!;
    expect(contract.textContent).toContain("CSS backdrop-filter");
    expect(contract.textContent).toContain(language === "zh-CN" ? "前景文字不参与滤镜" : "leaving foreground text unfiltered");
    expect(contract.textContent).toContain(language === "zh-CN" ? "不改变基材 alpha" : "without changing body alpha");
    expect(contract.textContent).not.toMatch(/Snell|GGX|Smith|Schlick/);
    const chrome = container.querySelector("[data-glass-chrome-contract]")!;
    expect(chrome.textContent).toContain("--material-texture-glass-overlay-blur");
    expect(chrome.textContent).toContain("24px");
    expect(chrome.textContent).toContain("20px");
    const feedback = container.querySelector("[data-glass-feedback-contract]")!;
    expect(feedback.textContent).toContain(language === "zh-CN" ? "指针追光" : "pointer glints");
    expect(feedback.textContent).toContain(language === "zh-CN" ? "不位移" : "stay in place");
    const variants = container.querySelector('[data-glass-variants-contract]')!;
    for (const variant of ["clear", "regular", "dense"]) expect(variants.textContent).toContain(`material-glass-${variant}`);
    for (const value of ["28% / 36%", "56% / 76%", "80% / 86%", "8px", "10px", "20px", "160%", "150%"])
      expect(variants.textContent).toContain(value);
    expect(container.querySelectorAll('[data-glass-variant-example]')).toHaveLength(3);
    expect(container.textContent).toContain("prefers-contrast: more");
    const summary = [...container.querySelectorAll('[data-texture-summary] li')];
    expect(summary).toHaveLength(4);
    expect(summary.map(item => item.textContent?.split(" ")[0])).toEqual(["Solid", "Acrylic", "Aero", "Glass"]);
    expect(summary[3].textContent).toContain(language === "zh-CN" ? "CSS 模糊" : "CSS blur");
    const migration = container.querySelector('[data-glass-token-migration]')!;
    for (const suffix of ["ior", "roughness", "thickness", "absorption", "light-azimuth", "light-intensity", "ambient-color", "ambient-intensity", "refraction", "edge-width"])
      expect(migration.textContent).toContain(suffix);
    for (const name of ["setTokens", "resetTokens", "RuntimeTokenName", "blur", "overlay-blur", "opacity"])
      expect(migration.textContent).toContain(name);
    expect(container.querySelector('a[href="https://www.whu.sb/"]')).not.toBeNull();
    const card = container.querySelector('[data-slot="glass-surface-opt-in-example"] .material-medium')!;
    expect(card.classList.contains("material-glass-regular")).toBe(true);
    expect(card.hasAttribute("data-uni-glass-interaction")).toBe(false);
  });

  test.each(["en-US", "zh-CN"] as const)("renders bilingual material groups and the actual menu radius in %s", async (language) => {
    await renderPage(language);
    expect(container.querySelector('[data-slot="materials-page"]')).not.toBeNull();
    expect(container.querySelectorAll('[data-material-group="surface"] > div')).toHaveLength(4);
    expect(container.querySelectorAll('[data-material-group="floating"] > div')).toHaveLength(4);
    expect(container.querySelectorAll('[data-material-group="mask"] > div')).toHaveLength(2);
    expect(container.querySelectorAll('input[data-texture-option]')).toHaveLength(4);
    expect(textureOption(container, "solid").checked).toBe(true);
    const menuCard = [...container.querySelectorAll('[data-material-group="floating"] > div')]
      .find((card) => card.textContent?.includes("material-menu"))!;
    expect(menuCard.querySelector("dl")?.textContent).toContain("6px");
    expect(menuCard.querySelector("dl")?.textContent).not.toContain("12px");
    const tooltipCard = [...container.querySelectorAll('[data-material-group="floating"] > div')]
      .find((card) => card.textContent?.includes("material-tooltip"))!;
    expect(tooltipCard.textContent).toContain(language === "zh-CN"
      ? "最轻的阴影。圆角 6px。用于简短的上下文提示。"
      : "Lightest shadow. Corner 6px. For short contextual hints.");
    expect([...container.querySelectorAll('[data-slot="radio-item-wrapper"]')].map((item) => item.textContent)).toEqual(["Solid", "Acrylic", "Aero", "Glass"]);
    expect(textureOption(container, "glass").closest('[data-slot="radio-item-wrapper"]')?.textContent).toBe("Glass");
    expect(container.textContent).not.toContain(language === "zh-CN" ? "克制玻璃" : "Restrained glass");
    expect(container.textContent).toContain(language === "zh-CN" ? "背景弱化" : "Background emphasis");
    expect(container.querySelector('a[href="https://developer.apple.com/design/human-interface-guidelines/materials"]')).not.toBeNull();
    const compatibility = container.querySelector<HTMLElement>("#compatibility")!;
    expect(compatibility.querySelectorAll("li")).toHaveLength(3);
    expect(compatibility.textContent).toContain(language === "zh-CN" ? "全局回退为 Solid" : "fall back globally to Solid");
    expect(compatibility.textContent).toContain(language === "zh-CN" ? "Solid 始终可手动选择" : "Solid is always available manually");
    expect(compatibility.textContent).toContain("20px");
    expect(compatibility.textContent).toContain("8px");
    expect(compatibility.textContent).not.toMatch(/本机|Local Chrome|Chrome \d|Edge \d/);
    const photoCredit = container.querySelector('[data-texture-photo-credit]')!;
    expect(photoCredit.tagName).toBe("FIGCAPTION");
    expect(photoCredit.parentElement?.tagName).toBe("FIGURE");
    expect(photoCredit.previousElementSibling?.getAttribute("data-slot")).toBe("texture-interaction-demo");
    expect(photoCredit.getAttribute("data-slot")).toBe("docs-prose-caption");
    expect(photoCredit.textContent).toBe("Photograph by mirobo · Alpsee · CC0 1.0");
    expect(photoCredit.querySelector('a[href="https://creativecommons.org/publicdomain/zero/1.0/"]')?.textContent).toBe("CC0 1.0");

    const fieldset = container.querySelector('[data-slot="texture-controls"]')!;
    expect(fieldset.tagName).toBe("FIELDSET");
    expect(fieldset.parentElement?.getAttribute("data-slot")).toBe("docs-prose-block");
    const group = fieldset.querySelector('[role="radiogroup"]')!;
    expect(group.getAttribute("aria-label")).toBe(language === "zh-CN" ? "全局材质外观" : "Global texture");
    expect(group.querySelectorAll('[data-slot="radio-control"]')).toHaveLength(4);
    expect(new Set([...group.querySelectorAll("input")].map((input) => input.name)).size).toBe(1);
  });

  test("the page controls apply the preference to the document root and report the effective appearance", async () => {
    await renderPage();
    await act(async () => textureOption(container, "glass").click());
    expect(document.documentElement.dataset.texture).toBe("glass");
    expect(document.documentElement.dataset.texturePreference).toBe("glass");
    expect(container.querySelector('[data-slot="texture-status"]')?.textContent).toBe("Selected: Glass · Applied: Glass");
    expect(localStorage.getItem("unitary-texture-preference-v2")).toBe("glass");
  });

  test("a control inside the live modal updates both portal and page controls", async () => {
    await renderPage();
    await act(async () => container.querySelector<HTMLButtonElement>('[data-slot="texture-demo-modal-trigger"]')!.click());
    const modal = document.querySelector<HTMLElement>('[data-slot="texture-demo-modal"]')!;
    expect(modal.getAttribute("role")).toBe("dialog");
    expect(modal.getAttribute("aria-modal")).toBe("true");
    expect(modal.querySelector('[data-slot="texture-controls"]')).not.toBeNull();
    expect(modal.querySelector('[data-slot="texture-controls"]')?.parentElement?.getAttribute("data-slot")).not.toBe("docs-prose-block");
    await act(async () => textureOption(modal, "acrylic").click());
    expect(document.documentElement.dataset.texture).toBe("acrylic");
    expect(textureOption(container, "acrylic").checked).toBe(true);
    expect(textureOption(modal, "acrylic").checked).toBe(true);
    expect(textureOption(container, "acrylic").name).not.toBe(textureOption(modal, "acrylic").name);
  });

  test("fallback guidance distinguishes the retained selection from the effective Solid appearance", async () => {
    blurSupported = false;
    await renderPage("zh-CN");
    await act(async () => textureOption(container, "glass").click());
    expect(document.documentElement.dataset.texture).toBe("solid");
    expect(textureOption(container, "glass").checked).toBe(true);
    expect(container.querySelector('[data-slot="texture-status"]')?.textContent).toBe("选择：Glass · 实际外观：Solid");
    expect(container.querySelector('[data-slot="texture-fallback"]')?.textContent).toContain("已保留你的选择");
  });

  test("each mask shares the scene's rounded clip while its foreground stays outside the decorative mask", async () => {
    await renderPage();
    const scenes = [...container.querySelectorAll('[data-slot="texture-mask-scene"]')];
    expect(scenes).toHaveLength(2);
    for (const scene of scenes) {
      expect(scene.classList.contains("border")).toBe(false);
      expect(scene.classList.contains("border-border")).toBe(false);
      expect(scene.classList.contains("rounded-lg")).toBe(true);
      expect(scene.classList.contains("overflow-hidden")).toBe(true);
      const mask = scene.querySelector('[data-material-sample]')!;
      const foreground = scene.querySelector('[data-material="floating"]')!;
      expect(mask.getAttribute("aria-hidden")).toBe("true");
      expect(mask.classList.contains("rounded-[inherit]")).toBe(true);
      expect(mask.parentElement).toBe(scene);
      expect(foreground.parentElement).toBe(scene);
      expect(foreground.closest('[aria-hidden="true"]')).toBeNull();
    }
  });

  test.each(["en-US", "zh-CN"] as const)("documents the renamed public texture contract and examples in %s", async (language) => {
    await act(async () => {
      root.render(<MemoryRouter><ApiOverviewPage language={language} /></MemoryRouter>);
    });
    const providers = container.querySelector("#providers")!;
    expect(providers.textContent).toContain('TexturePreference = "solid" | "acrylic" | "aero" | "glass"');
    expect(providers.textContent).toContain('defaultTexture="solid"');
    expect(providers.textContent).not.toMatch(/"flat"|"blur"|flat, blur|flat、blur/);
    expect(container.querySelector('[data-api-directory="Theme & localization"]')?.textContent).toContain("Solid");
    expect(container.querySelector('[data-api-directory="Theme & localization"]')?.textContent).toContain("Acrylic");
    expect(container.querySelector('[data-api-directory="Theme & localization"]')?.textContent).toContain("Glass");
  });
});
