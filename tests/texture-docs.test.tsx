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
  test.each(["en-US", "zh-CN"] as const)("documents optical inputs and their approximation limits in %s", async (language) => {
    await renderPage(language);
    const contract = container.querySelector('[data-glass-lighting-contract]')!;
    expect(contract.textContent).toContain("315°");
    expect(contract.textContent).toContain("Snell");
    expect(contract.textContent).toContain("GGX / Smith");
    expect(contract.textContent).toContain(language === "zh-CN" ? "默认模糊 1px" : "Blur defaults to 1px");
    expect(contract.textContent).toContain(language === "zh-CN" ? "材质本体没有位置渐变" : "The material has no positional gradient");
    expect(contract.textContent).toContain(language === "zh-CN" ? "不附加边缘权重" : "without an edge weight");
    expect(container.textContent).toContain(language === "zh-CN" ? "新 Glass 默认 1px" : "New Glass defaults to 1px");
    expect(container.textContent).toContain(language === "zh-CN" ? "新 Glass 为 1px" : "New Glass uses 1px");
    expect(contract.textContent).toContain(language === "zh-CN" ? "向内采样" : "samples inward");
    expect(contract.textContent).toContain(language === "zh-CN" ? "线性光空间" : "linear light");
    expect(contract.textContent).toContain("0.24");
    const variants=container.querySelector('[data-glass-variants-contract]')!;
    for(const variant of ['clear','regular','dense'])expect(variants.textContent).toContain('material-glass-'+variant);
    expect(container.querySelectorAll('[data-glass-variant-example]')).toHaveLength(3);
    expect(container.textContent).toContain('prefers-contrast: more');
    expect(contract.textContent).toContain(language === "zh-CN" ? "不自动读取场景环境贴图" : "without automatic environment-map capture");
    expect(contract.textContent).toContain(language === "zh-CN" ? "屏幕空间近似" : "screen-space approximation");
    const summary = [...container.querySelectorAll('[data-texture-summary] li')];
    expect(summary).toHaveLength(4);
    expect(summary.map(item => item.textContent?.split(" ")[0])).toEqual(["Solid", "Acrylic", "Aero", "Glass"]);
    expect(summary[3].textContent).toContain(language === "zh-CN" ? "背景折射" : "backdrop refraction");
    for (const suffix of ["ior", "roughness", "thickness", "absorption", "light-azimuth", "light-intensity", "ambient-color", "ambient-intensity"]) {
      expect(container.textContent).toContain(`--material-texture-glass-${suffix}`);
    }
    expect(container.querySelector('a[href="https://developer.apple.com/videos/play/wwdc2025/219/"]')).not.toBeNull();
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
