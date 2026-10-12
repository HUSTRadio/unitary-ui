// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { ComponentApiReference } from "../docs/site/src/components/docs-api-reference";
import { ApiOverviewPage } from "../docs/site/src/pages/api-overview";
import { LanguageProvider, type DocsLanguage } from "../docs/site/src/i18n/language";

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
  localStorage.clear();
  window.history.replaceState(null, "", "/");
});

async function render(componentName: string, language: DocsLanguage) {
  window.history.replaceState(null, "", `/?lang=${language}`);
  await act(async () => {
    root.render(
      <LanguageProvider>
        <ComponentApiReference componentName={componentName} />
      </LanguageProvider>,
    );
  });
}

describe("API reference explanations", () => {
  for (const language of ["zh-CN", "en-US"] as const) {
    for (const component of ["button", "sidebar-nav", "hamburger-menu"]) {
      it(`uses public imports for ${component} in ${language}`, async () => {
        await render(component, language);
        const code = container.querySelector("pre code")?.textContent;
        expect(code).toContain('from "@hustradio/unitary-ui"');
        if (component !== "button") {
          expect(code).toContain("NAV_CONTENT_INSET");
          expect(container.textContent).toContain("24px");
          expect(container.textContent).toContain("16px");
        }
      });
    }
    it(`documents scroll lifecycle and navigation spacing in ${language}`, async () => {
      await act(async () => root.render(<HashRouter><ApiOverviewPage language={language} /></HashRouter>));
      const section = container.querySelector("#scrolling")!;
      for (const name of ["scrollIntoViewWithMotion", "ScrollAnimation", "cancel()", "refresh()", "NAV_CONTENT_INSET", "--uni-motion-state", "--ease-in-out", "24px", "16px"]) {
        expect(section.textContent).toContain(name);
      }
      expect(section.textContent).toContain(language === "zh-CN" ? "组件卸载时取消" : "Cancel on component unmount");
      expect(section.querySelector("pre code")?.textContent).toContain('from "@hustradio/unitary-ui"');
    });
    for (const component of ["prefetch", "carousel"]) {
      it(`explains uniform extension provenance once for ${component} in ${language}`, async () => {
        await render(component, language);
        const explanation = container.querySelector('[data-api-origin="extension"]')!;
        expect(explanation.textContent).toContain(language === "zh-CN" ? "本表 API 均为 Unitary 扩展" : "All APIs in this table are Unitary extensions");
        expect(container.querySelectorAll('[data-slot="docs-api-extension-badge"]')).toHaveLength(0);
        expect(container.querySelectorAll("tbody tr").length).toBeGreaterThan(0);
        expect(explanation.compareDocumentPosition(container.querySelector("table")!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
      });
    }
    it(`keeps row-level provenance for mixed official and extension APIs in ${language}`, async () => {
      await render("checkbox", language);
      expect(container.querySelector('[data-api-origin="extension"]')).toBeNull();
      const markedNames = [...container.querySelectorAll("tbody tr")]
        .filter((row) => row.querySelector('[data-slot="docs-api-extension-badge"]'))
        .map((row) => row.querySelector("td code")?.textContent);
      expect(markedNames).toEqual(["defaultChecked", "size"]);
    });
    it(`adds no extension note or tags for official-only APIs in ${language}`, async () => {
      await render("button", language);
      expect(container.querySelector('[data-api-origin="extension"]')).toBeNull();
      expect(container.querySelectorAll('[data-slot="docs-api-extension-badge"]')).toHaveLength(0);
    });
    it(`imports the Prefetch component and resource API from the actual package root in ${language}`, async () => {
      await render("prefetch", language);
      expect(container.querySelector("pre code")?.textContent).toContain(
        'import { Prefetch, createPrefetch, usePrefetchState } from "@hustradio/unitary-ui"',
      );
    });
    it(`explains required markers before the props table in ${language}`, async () => {
      await render("carousel", language);

      const explanation = container.querySelector("#api-reference p")!;
      const imagesRow = [...container.querySelectorAll("tbody tr")].find(
        (row) => row.querySelector("td code")?.textContent === "images",
      )!;
      expect(imagesRow.querySelector("td")?.textContent).toContain("*");
      expect(explanation.textContent).toContain(
        language === "zh-CN" ? "* 表示必填属性" : "* marks a required prop",
      );
      expect(
        explanation.compareDocumentPosition(imagesRow) & Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy();
    });

    for (const [component, inheritedType] of [
      ["input", "InputHTMLAttributes<HTMLInputElement>"],
      ["select", "React.ComponentProps<typeof SelectPrimitive.Root>"],
    ]) {
      it(`explains the inherited type for ${component} in ${language}`, async () => {
        await render(component, language);

        const paragraph = [...container.querySelectorAll("p")].find(
          (element) => element.querySelector("code")?.textContent === inheritedType,
        )!;
        expect(paragraph.textContent).toContain(
          language === "zh-CN" ? "还支持以下类型中定义的属性" : "Also accepts props defined by",
        );
        expect(paragraph.textContent).toContain(inheritedType);
      });
    }
  }
});
