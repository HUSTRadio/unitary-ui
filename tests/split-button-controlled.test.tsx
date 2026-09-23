// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { describe, expect, it } from "vitest";

import { SplitButton, SplitButtonMenuItem } from "../src/components/ui/split-button";

// React 19 requires the act environment flag inside jsdom
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

async function renderIntoDocument(node: React.ReactNode): Promise<void> {
  // fresh DOM per render (portals land in document.body, so clear leftovers)
  document.body.innerHTML = "";
  const host = document.createElement("div");
  document.body.appendChild(host);
  const root = createRoot(host);
  await act(async () => {
    root.render(node);
  });
}

const menuButton = () =>
  document.querySelector<HTMLButtonElement>('[data-slot="split-button-menu"]')!;
const mainButton = () =>
  document.querySelector<HTMLButtonElement>('[data-slot="split-button-main"]')!;

/**
 * HIG-AUD-018：`menuButtonDisabled` 让「主操作可用、菜单不可用」成为可表达状态。
 */
describe("SplitButton controlled props", () => {
  it("menuButtonDisabled only disables the menu trigger", async () => {
    await renderIntoDocument(
      <SplitButton
        menuItems={<SplitButtonMenuItem>Duplicate</SplitButtonMenuItem>}
        menuButtonDisabled
      >
        Deploy
      </SplitButton>,
    );

    expect(menuButton().disabled).toBe(true);
    expect(mainButton().disabled).toBe(false);
  });

  it("buttonProps.disabled still only affects the primary action", async () => {
    await renderIntoDocument(
      <SplitButton
        buttonProps={{ typeName: "button", disabled: true }}
        menuItems={<SplitButtonMenuItem>Duplicate</SplitButtonMenuItem>}
      >
        Deploy
      </SplitButton>,
    );

    expect(mainButton().disabled).toBe(true);
    expect(menuButton().disabled).toBe(false);
  });
});
