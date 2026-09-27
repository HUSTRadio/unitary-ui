// @vitest-environment jsdom

import { act, type ComponentType } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

import { ProjectBannerDefault21B111CBExample } from "../docs/site/src/examples/project-banner/default-21b111cb.example";
import { ProjectBannerError54A0E8C1Example } from "../docs/site/src/examples/project-banner/error-54a0e8c1.example";
import { ProjectBannerSuccessC88A0B90Example } from "../docs/site/src/examples/project-banner/success-c88a0b90.example";
import { ProjectBannerWarningE981DDAEExample } from "../docs/site/src/examples/project-banner/warning-e981ddae.example";

describe("ProjectBanner example actions", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    globalThis.IS_REACT_ACT_ENVIRONMENT = false;
  });

  function renderExample(Example: ComponentType) {
    act(() => root.render(<Example />));
  }

  test.each([
    ["default", ProjectBannerDefault21B111CBExample],
    ["success", ProjectBannerSuccessC88A0B90Example],
  ])("%s Disable action updates the state and removes the completed action", (_name, Example) => {
    renderExample(Example);
    expect(container.textContent).toContain("enabled");
    const action = [...container.querySelectorAll("button")].find((node) => node.textContent?.includes("Disable"));
    expect(action).toBeTruthy();
    act(() => action!.click());
    expect(container.textContent).toContain("disabled");
    expect(container.textContent).not.toContain("Disable");
  });

  test("error action exposes a concrete update-requested result", () => {
    renderExample(ProjectBannerError54A0E8C1Example);
    const action = [...container.querySelectorAll("button")].find((node) => node.textContent?.includes("Update Payment Method"));
    expect(action).toBeTruthy();
    act(() => action!.click());
    expect(container.textContent).toContain("Payment method update requested");
    expect(container.textContent).not.toContain("Update Payment Method");
  });

  test("warning action performs and reports the rollback restoration", () => {
    renderExample(ProjectBannerWarningE981DDAEExample);
    const action = [...container.querySelectorAll("button")].find((node) => node.textContent?.includes("Undo Rollback"));
    expect(action).toBeTruthy();
    act(() => action!.click());
    expect(container.textContent).toContain("Rollback restored");
    expect(container.textContent).not.toContain("Undo Rollback");
  });
});
