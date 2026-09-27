// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, expectTypeOf, test } from "vitest";

import { useRadio } from "@/components/ui/radio";
import { useToasts, type UseToastsReturn } from "@/components/ui/toast";

/**
 * 特化 hooks 形状契约（D4）：
 * - useToasts 返回操作集合，键为 message/success/warning/error/dismiss；
 * - useRadio 返回 { component } 由调用方自行排版。
 * 改动返回形状会在测试层面被锁定。
 */

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
});

describe("specialized hooks contract", () => {
  test("useToasts returns action-object with known keys", async () => {
    let toasts: ReturnType<typeof useToasts> | null = null;
    function Probe() {
      toasts = useToasts();
      return null;
    }
    await act(async () => {
      root.render(React.createElement(Probe));
    });

    expect(toasts).not.toBeNull();
    expect(Object.keys(toasts!).sort()).toEqual(["dismiss", "error", "message", "success", "warning"]);
    expect(typeof toasts!.message).toBe("function");
    expect(typeof toasts!.dismiss).toBe("function");
  });

  test("useRadio returns { component } shape with a single key", () => {
    const result = useRadio({ value: "a" });
    expect(Object.keys(result)).toEqual(["component"]);
    expect(React.isValidElement(result.component)).toBe(true);
  });

  test("useToasts return type matches UseToastsReturn contract", () => {
    expectTypeOf<ReturnType<typeof useToasts>>().toEqualTypeOf<UseToastsReturn>();
  });

  test("useRadio return type is exactly { component: ReactElement }", () => {
    expectTypeOf<ReturnType<typeof useRadio>>().toEqualTypeOf<{
      component: React.ReactElement;
    }>();
  });
});
