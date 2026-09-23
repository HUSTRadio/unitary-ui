// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Grabber } from "../src/components/ui/grabber";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;

beforeEach(() => {
  container = document.createElement("div");
  document.body.append(container);
});

afterEach(() => {
  container.remove();
});

describe("Grabber", () => {
  it("renders slider role + aria 三件套 + 官方视觉类", () => {
    const markup = renderToStaticMarkup(
      <Grabber detentCount={3} currentDetent={1} />,
    );

    // slider role + aria 三件套
    expect(markup).toContain('role="slider"');
    // HIG-AUD-008：key 由中文改为英文写法后，默认（无 Provider 回退 en）取值应为英文；
    // 中文站取值见 tests/framework-i18n.test.tsx
    expect(markup).toContain('aria-label="Resize height"');
    expect(markup).toContain('aria-valuemin="0"');
    expect(markup).toContain('aria-valuemax="2"');
    expect(markup).toContain('aria-valuenow="1"');
    // 视觉条：h-1 w-9 rounded-full；颜色 gray-700/dark:gray-600（WCAG ≥3:1 实测达标）
    expect(markup).toContain("h-1 w-9 rounded-full bg-gray-700 dark:bg-gray-600");
    // 命中区扩展
    expect(markup).toContain("py-5 px-6 -my-5 -mx-6");
  });

  it("click 调用 onCycleDetent", async () => {
    const onCycleDetent = vi.fn();
    const root = createRoot(container);
    await act(async () => {
      root.render(
        <Grabber detentCount={3} currentDetent={0} onCycleDetent={onCycleDetent} />,
      );
    });
    const button = container.querySelector("button")!;
    await act(async () => {
      button.click();
    });
    expect(onCycleDetent).toHaveBeenCalledTimes(1);
    await act(async () => {
      root.unmount();
    });
  });
});
