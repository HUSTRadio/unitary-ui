// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { ComponentGuideSections } from "../docs/geist/src/components/component-guide-sections";
import type { ComponentGuide } from "../docs/geist/src/content/component-guide-schema";

let container: HTMLDivElement;
let root: Root;

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const baseGuide: Omit<ComponentGuide, "locale"> = {
  slug: "slider",
  summary: "Choose a value from a range.",
  whenToUse: ["Use for bounded numeric input."],
  whenNotToUse: ["Do not use for free-form numbers."],
  examples: [
    {
      id: "minimal",
      kind: "minimal",
      title: "Basic slider",
      description: "A bounded single-value slider.",
      demoKey: "default",
    },
  ],
  accessibility: { status: "covered", content: ["Expose the current value."] },
  controlledBehavior: { status: "covered", content: ["Pair value with onValueChange."] },
  responsiveBehavior: { status: "not-applicable", reason: "The control keeps the same behavior." },
  themeBehavior: { status: "covered", content: ["Use semantic color tokens."] },
};

beforeEach(() => {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

async function renderGuide(locale: ComponentGuide["locale"]) {
  await act(async () => {
    root.render(<ComponentGuideSections guide={{ ...baseGuide, locale }} />);
  });
}

describe("ComponentGuideSections", () => {
  it("renders the Chinese-primary guidance, examples, and explicit non-applicable reason", async () => {
    await renderGuide("zh-CN");

    expect(container.querySelector("#guide-when-to-use")?.textContent).toBe("何时使用");
    expect(container.querySelector("#guide-when-not-to-use")?.textContent).toBe("何时不应使用");
    expect(container.querySelector('[data-guide-example="minimal"]')?.textContent).toContain(
      "Basic slider",
    );
    expect(container.querySelector('[data-guide-demo-key="default"]')).not.toBeNull();
    expect(container.querySelector("#guide-responsive")?.parentElement?.textContent).toContain(
      "The control keeps the same behavior.",
    );
  });

  it("keeps stable section IDs while switching to the English alternative", async () => {
    await renderGuide("en-US");

    expect(container.querySelector("#guide-when-to-use")?.textContent).toBe("When to use");
    expect(container.querySelector("#guide-accessibility")?.textContent).toBe("Accessibility");
    expect([...container.querySelectorAll("section[id]")].map((section) => section.id)).toEqual([
      "guide-when-to-use-section",
      "guide-when-not-to-use-section",
      "guide-examples-section",
      "guide-accessibility-section",
      "guide-controlled-section",
      "guide-responsive-section",
      "guide-theme-section",
    ]);
  });
});
