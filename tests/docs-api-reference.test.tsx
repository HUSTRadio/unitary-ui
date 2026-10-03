// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { ComponentApiReference } from "../docs/site/src/components/docs-api-reference";
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
