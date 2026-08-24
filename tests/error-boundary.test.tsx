// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeAll, describe, expect, test, vi } from "vitest";

import { ErrorBoundary } from "@/components/ui/error-boundary";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root;

beforeAll(() => {
  // 屏蔽 React 渲染错误噪音，让测试输出干净
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  if (root) act(() => root.unmount());
  container?.remove();
  document.body.innerHTML = "";
});

function mount(element: React.ReactElement) {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  act(() => root.render(element));
  return container;
}

/** 抛错组件 */
function Boom({ message }: { message: string }) {
  throw new Error(message);
}

describe("ErrorBoundary (工程审查 P1: 双层边界)", () => {
  test("渲染期抛错被捕获，显示内置兜底 UI（含错误信息 + 重试按钮）", () => {
    const c = mount(
      <ErrorBoundary name="测试区">
        <Boom message="kaboom" />
      </ErrorBoundary>,
    );
    expect(c.querySelector('[role="alert"]')).toBeTruthy();
    expect(c.textContent).toContain("「测试区」渲染失败");
    expect(c.textContent).toContain("kaboom");
    const retry = [...c.querySelectorAll("button")].find((b) => b.textContent === "重试");
    expect(retry).toBeTruthy();
  });

  test("自定义 fallback 优先于内置兜底", () => {
    const c = mount(
      <ErrorBoundary fallback={<div data-testid="custom">custom fallback</div>}>
        <Boom message="x" />
      </ErrorBoundary>,
    );
    expect(c.querySelector('[data-testid="custom"]')?.textContent).toBe("custom fallback");
    // 内置兜底不出现
    expect(c.querySelector('[role="alert"]')).toBeNull();
  });

  test("重试按钮清除错误态并重新渲染子树（子组件恢复后正常显示）", () => {
    let shouldThrow = true;
    function Flaky() {
      if (shouldThrow) throw new Error("flaky");
      return <div data-testid="ok">recovered</div>;
    }
    const c = mount(
      <ErrorBoundary>
        <Flaky />
      </ErrorBoundary>,
    );
    expect(c.querySelector('[role="alert"]')).toBeTruthy();

    shouldThrow = false;
    const retry = [...c.querySelectorAll("button")].find((b) => b.textContent === "重试")!;
    act(() => retry.click());
    expect(c.querySelector('[data-testid="ok"]')?.textContent).toBe("recovered");
  });

  test("resetKeys 变化自动清除错误态重新渲染", () => {
    function PageA() {
      return <div data-testid="a">page-a</div>;
    }
    function PageB() {
      throw new Error("page-b boom");
    }
    const c = mount(
      <ErrorBoundary resetKeys={["a"]}>
        <PageA />
      </ErrorBoundary>,
    );
    expect(c.querySelector('[data-testid="a"]')).toBeTruthy();

    // 切换到会崩的页面
    act(() => {
      root.render(
        <ErrorBoundary resetKeys={["b"]}>
          <PageB />
        </ErrorBoundary>,
      );
    });
    expect(c.querySelector('[role="alert"]')).toBeTruthy();

    // 切回正常页面：resetKeys 变化 → 错误态自动重置
    act(() => {
      root.render(
        <ErrorBoundary resetKeys={["a"]}>
          <PageA />
        </ErrorBoundary>,
      );
    });
    expect(c.querySelector('[data-testid="a"]')).toBeTruthy();
    expect(c.querySelector('[role="alert"]')).toBeNull();
  });

  test("onError 回调收到 error 与 info", () => {
    const onError = vi.fn();
    mount(
      <ErrorBoundary onError={onError} name="cb">
        <Boom message="reported" />
      </ErrorBoundary>,
    );
    expect(onError).toHaveBeenCalledTimes(1);
    const [error] = onError.mock.calls[0];
    expect(error.message).toBe("reported");
  });

  test("正常子树不受边界影响（无错误时原样渲染）", () => {
    const c = mount(
      <ErrorBoundary name="fine">
        <div data-testid="content">normal</div>
      </ErrorBoundary>,
    );
    expect(c.querySelector('[data-testid="content"]')?.textContent).toBe("normal");
    expect(c.querySelector('[role="alert"]')).toBeNull();
  });

  test("error-boundary 从 lib/index.ts 导出（双层边界的库入口）", async () => {
    const { readFile } = await import("node:fs/promises");
    const path = await import("node:path");
    const src = await readFile(
      path.resolve(import.meta.dirname ?? ".", "../src/lib/index.ts"),
      "utf8",
    );
    expect(src).toContain('export { ErrorBoundary } from "@/components/ui/error-boundary"');
  });
});
