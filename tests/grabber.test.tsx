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
    expect(markup).toContain('aria-label="调整高度"');
    expect(markup).toContain('aria-valuemin="0"');
    expect(markup).toContain('aria-valuemax="2"');
    expect(markup).toContain('aria-valuenow="1"');
    // 视觉条：官方 h-1 w-9 rounded-full bg-gray-alpha-500
    expect(markup).toContain("h-1 w-9 rounded-full bg-gray-alpha-500");
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
